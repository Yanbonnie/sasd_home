<template>
    <section class="login">
        <LoginHeader tip="没有账号" ></LoginHeader>
        <div class="loginBox">
            <div class="icon_right">
                <i class="iconfont icon-pc" v-show="step == 1 || step == 2" @click="accountLogin"></i>
                <i class="iconfont icon-ewm_real" v-show="step == 4" @click="scanLogin"></i>
                <i class="iconfont icon-pc" v-show="step==5" @click="accountLogin"></i>
            </div>
            <img v-if="ThemeColor == 'red'" class="logo" src="../../../assets/images/logo_header.png" alt="" width="126">
            <div v-if="ThemeColor == 'blue'" class="logo">
                电子合同系统
            </div>
            <!--扫码登录-->
            <div class="loginLoad" v-show="step != 4 && step != 5">
                
                <div class="step1" v-show="step==1">
                    <img  src="../../../assets/images/ewm_load.png"  width="231" height="231" alt="">
                    <p class="loadTxt">二维码加载中...</p>
                </div>
                <div class="step2"  v-show="step==2">
                    <img :src="'data:image/png;base64,'+ewmImg" alt="">
                    <div class="failBox" v-show="fail.state">
                        <p>{{fail.txt}}</p>
                        <a href="javascript:;" @click="cloudSignLogin">点击刷新</a>
                    </div>
                </div>

                <div class="step3" v-show="step == 3">
                    <div class="top">
                        <h3>{{scan.name}}</h3>
                        <p>{{scan.phone}}</p>
                    </div>
                    <div class="center">
                        <h3>扫码成功</h3>
                        <p>请在手机上点击确认以登录</p>
                    </div>
                    <a href="javascript:;" class="changeAccount" @click="cloudSignLogin">切换账号</a>
                </div>
            </div>            
            <p class="tipTxt" v-show="step == 1 || step == 2">使用手机真宜签扫码登录</p>
            <!--账号登录-->
            <div class="loginAccount" v-show="step == 4">
                <div class="formBox">
                    <p>
                        <input type="text" placeholder="账号" v-model.trim="account.name">
                    </p>
                    <p class="tipP" v-show="account.tipStatus">
                        {{account.tip}}
                    </p>
                    <p>
                        <input type="password" placeholder="密码" v-model.trim="account.psw" @keyup.enter="loginHandle" >
                    </p>
                    <p class="yzm box" v-show="showValidCode == 1" >
                        <input type="password" placeholder="验证码" v-model.trim="account.code" @keyup.enter="loginHandle">
                        <span><img id="v_code" @click="getCode" :src="this.apiPath+'v0/login/getValidityImage?random='+random" alt="验证码"></span>
                    </p>   
                    <p class="forget clf">
                        <a href="javascript:;" @click="UkeyLogin" >ukey登录</a>
                        <router-link :to="{path:'forget/step1'}">忘记密码?</router-link></p>                 
                    <p>
                        <a href="javascript:;" class="loginBtn" @click="loginHandle">登录</a>
                    </p>
                    
                    <p class="tip">
                        还没有账号？<router-link to="/register">立即注册</router-link>
                    </p>
                </div>
            </div>
            <div class="loginAccount" v-show="step == 5">
                <div class="formBox">
                    <p>
                        <input type="password" placeholder="ukey密码" v-model.trim="ukey.psw" v-on:input="ukey.tipStatus = false; ukey.tip='';ukey.psw = handleInput($event)" @keyup.enter="ukeyLoginHandle" >
                    </p>
                    <p class="tipP" v-show="ukey.tipStatus" style="text-align:left;">
                        {{ukey.tip}}
                    </p>   
                    <p class="forget clf">
                        <a href="javascript:;"></a>
                        <a href="javascript:;"><b @click="accountLogin" style="font-weight:normal;">账号登录</b></a>             
                    <p>               
                    <p>
                        <a href="javascript:;" class="loginBtn" @click="ukeyLoginHandle">{{this.ukey.loginTxt}}</a>
                    </p>
                    
                    <p class="tip">
                        还没有账号？<router-link to="/register">立即注册</router-link>
                    </p>
                </div>
            </div>
        </div>
        <p class="copyright">版权所有©数安时代科技股份有限公司2002-2017  保留一切权利</p>
    </section>
</template>
<script>
    //gdca
    import '@/assets/js/GDCAPKI/jquery.jsonp.js'; 
    const Base64String = require("@/assets/js/GDCAPKI/base64.js").default;
    import '@/assets/js/GDCAPKI/gdca-pki-errcode.js'; 
    const $GDCA = require('@/assets/js/GDCAPKI/gdca-pki-lib.js').default;     
    import '@/assets/js/GDCAPKI/gdca_sof_method.js'; 
    const gMethod = require('@/assets/js/GDCAPKI/gdca_sof_method.js');


    import LoginHeader from '../../nav.vue';
    import { handleInput,randomWord }  from '@/assets/js/pageCom.js';

    export default{
        name:'login',
        data(){
            return{
                step:5,               //登陆进行到第几步  1-等待二维码  2-等待扫码 3-扫码成功 4-账号登录 5-ukey登录
                reqNum:0,             //请求二维码的次数
                ewmImg:null,          //请求二维码的连接
                claimUuid:null,       //登录状态需要传的参数
                loginTimer:null,      //请求登录状态定时器
                scan:{
                    name:null,
                    phone:null,
                },
                fail:{               //扫码失败的情况
                    state:false,
                    txt:''
                },
                random:null,
                showValidCode:null,   //是否显示二维码  为1的时候显示二维码
                account:{             //账号登录
                    name:null,
                    psw:null,
                    code:null,
                    tipStatus:false,
                    tip:''
                },
                ukey:{
                    psw:null,
                    tipStatus:false,
                    tip:'',
                    loginTxt:'登录'
                },
                ddata:null,
                random:null,
            }
        },
        components:{
            LoginHeader
        },
        methods:{
            handleInput,
            randomWord,
            //Ukey登录 
            ukeyLoginHandle(){        
                const { psw,tipStatus,tip} = this.ukey;    
                if(!psw){
                    [this.ukey.tipStatus,this.ukey.tip] = [true,'请输入Ukey密码'];
                    return;
                }
                
                this.call_gdca_sof(this.ukey.psw);
            },
            //调用证书客户端
            call_gdca_sof(pin) {
                var This = this;
                if(this.ukey.loginTxt != '登录') return;
                this.ukey.loginTxt = '登录中...';
                let sign = "",certNo = "",certData = "";
                // $("#loadingBox_h").modal("show").find(".tip-h3").text("正在加载UKEY");
                gMethod.checkReadUserList(this, function (res) {
                    This.ddata = res;
                    gMethod.checkLoginKey(this, pin, function (res) {
                        $GDCA.exportUserCert(This.ddata, function (usercert) {
                            certData = usercert;
                            $GDCA.setSignMethod(16, function (res) {
                                var baseRan = new Base64String().encode(This.random);
                                $GDCA.signData(This.ddata, baseRan, function (res) {
                                    sign = res;
                                    if (null == sign  || "" == sign || "undefine" == sign) {
                                        This.ukey.tipStatus = true;
                                        This.ukey.tip = "签名数据为空";
                                        This.ukey.loginTxt = '登录';
                                        return false;
                                    }
                                    This.ukeyLoginStep(sign,certNo,certData);
                                }, function (err) {
                                    This.ukey.tipStatus = true;
                                    This.ukey.tip = "签名数据失败";
                                    This.ukey.loginTxt = '登录';
                                });
                            }, function (err) {
                                This.ukey.tipStatus = true;
                                This.ukey.tip = "设置签名方法失败";
                                This.ukey.loginTxt = '登录';
                            });
                        }, function (err) {
                            This.ukey.tipStatus = true;
                            This.ukey.tip = "获取用户签名证书失败";
                            This.ukey.loginTxt = '登录';  
                        });
                    }, function (restTime) {
                        if(restTime > 0){
                            This.ukey.tipStatus = true;
                            This.ukey.tip = "PIN码错误，请重试(您还剩"+restTime+"次机会)";
                            This.ukey.loginTxt = '登录';  
                        }else{
                            This.ukey.tipStatus = true;
                            This.ukey.tip = '已超过最大尝试次数，请联系客户服务<br/>（020-95105813）重置密码。';
                            This.ukey.loginTxt = '登录';
                        }
                    });
                }, function (err) {
                    This.ukey.tipStatus = true;
                    This.ukey.tip = '控件初始化失败，请确认已插入UKEY及安装客户端';
                    This.ukey.loginTxt = '登录';
                    
                });
                return false;
            },
            ukeyLoginStep(sign,certNo,certData) {
                var This = this;
                this.ajaxPost(this.URL['keyLogin'],{"certNo": certNo, "sign": sign, "random": this.random, certData: certData},res=>{
                    // var res = JSON.parse(res);
                    if(res['result'] == 'success'){
                        this.setLData('accountType',0);
                        this.$router.push({
                            name:'Index'
                        })
                    }else if(res['result'] == 'unrelated'){
                        This.ukey.tipStatus = true;
                        This.ukey.tip = 'UKEY未绑定';
                        This.ukey.loginTxt = '登录';
                    }else if(res['result'] == 'notLogin'){
                        This.ukey.tipStatus = true;
                        This.ukey.tip = '该UKEY非登录证书';
                        This.ukey.loginTxt = '登录';
                    }else if(res['result'] == 'loginStatusError'){
                        This.ukey.tipStatus = true;
                        This.ukey.tip = '平台禁止用户登录';
                        This.ukey.loginTxt = '登录';
                    }else if(res['result'] == 'revocation'){
                        This.ukey.tipStatus = true;
                        This.ukey.tip = 'UKEY证书已被吊销';
                        This.ukey.loginTxt = '登录';
                    }else{
                        This.ukey.tipStatus = true;
                        This.ukey.tip = 'UKEY登录异常';
                        This.ukey.loginTxt = '登录';
                    }
                })
            },
            /*ukeyLogin-end*/
            loginHandle(){  //账号登录确定                
                this.ajaxPost(this.URL['login'],{
                    username:this.account.name,
                    password:this.account.psw,
                    validateCode:this.account.code ? this.account.code : '',
                    random:this.random,
                    showValidateCode:this.showValidCode
                },(json)=>{
                    if(json['success']){
                        this.setLData('userphone',this.account.name);
                        this.setLData('accountType',1);
                        this.$router.push({
                            name:'Index'
                        })
                    }else if(json['usernameError'] == '用户未激活'){
                        [this.account.tipStatus,this.account.tip] = [true,'用户未激活'];
                        this.getLoginErrorCount();
                    }else if(json['usernameError']){
                        [this.account.tipStatus,this.account.tip] = [true,json['usernameError']];    
                        this.getLoginErrorCount();                    
                    }else if(json['validateCodeError']){
                        [this.account.tipStatus,this.account.tip] = [true,json['validateCodeError']];
                        this.getLoginErrorCount();     
                    }else{

                    }

                })
            },
            UkeyLogin(){
                this.step = 5;
                clearInterval(this.loginTimer);
            },
            accountLogin(){  //账号登录
                this.ukey.psw = '';
                this.ukey.tipStatus = false;
                this.ukey.tip =  '';

                this.step = 4 ;
                clearInterval(this.loginTimer);
            },
            scanLogin(){     //扫码登录
                this.step = 1;
                this.cloudSignLogin();
            },
            getCode(){  //获取验证码
                this.random = this.randomWord(true,32,1000);
            },            
            cloudSignLogin(){  //请求二维码
                this.fail.state = false;
                this.step = 1;
                this.httpPost(this.URL['cloudSignLogin'],{},(json)=>{
                    if(json.meta.success){
                        this.ewmImg = json.data.qRCodeBase64;                        
                        this.claimUuid = json.data.claimUuid;
                        this.step = 2;
                        clearInterval(this.loginTimer);
                        this.loginTimer = setInterval(()=>{
                            this.cloudSignCheckLogin();
                        },1000)
                    }else{                        
                        if(this.reqNum < 3){
                            this.reqNum ++;
                            this.cloudSignLogin();                            
                        }else{
                            this.modelCommonTip('二维码获取失败,请稍后重试');
                        }
                    }
                })
            },
            cloudSignCheckLogin(){  //获取登录状态
                this.ajaxPost(this.URL['cloudSignCheckLogin'],{
                    claimUuid:this.claimUuid
                },(json)=>{
                    let msg = json.meta.message;
                    if(json.meta.success){ //成功登录跳转到首页
                        this.setLData('accountType',1);
                        clearInterval(this.loginTimer);                       
                        this.$router.push({
                            name:'Index'
                        })
                    }else{
                        if(msg == 'WAITING'){
                            //等待状态，不处理
                        }else if(msg == 'LOADING'){  //等待输入PIN码
                            this.step = 3;
                            [this.scan.name,this.scan.phone] = [json.data.name,json.data.phone]
                        }else if(msg == 'CANCEL'){   //取消登录
                            clearInterval(this.loginTimer);
                            [this.fail.state,this.fail.txt,this.step] = [true,'已取消登录',2]
                        }else if(msg == 'TIME_OUT'){
                            clearInterval(this.loginTimer);
                            [this.fail.state,this.fail.txt,this.step] = [true,'二维码已过期',2]
                        }else if(msg == 'DUNPLICATE'){
                            clearInterval(this.loginTimer);
                            [this.fail.state,this.fail.txt,this.step] = [true,'此二维码已被使用',2]
                        }else if(msg == 'ERROR'){
                            clearInterval(this.loginTimer);
                            [this.fail.state,this.fail.txt,this.step] = [true,'系统异常，请重试',2]
                        }else if(msg == 'NO_USER'){
                            clearInterval(this.loginTimer);
                            [this.fail.state,this.fail.txt,this.step] = [true,'用户不存在',2]
                        }else if(msg == 'FORBIDDEN_USER'){
                            clearInterval(this.loginTimer);
                            [this.fail.state,this.fail.txt,this.step] = [true,'当前用户已被禁用',2]
                        }else{

                        }
                    }
                    
                })
            },
            getLoginErrorCount(){   //获取登录失败次数
                this.httpGet(this.URL['getLoginErrorCount'],{},(json)=>{
                    if(json.meta.success){
                        this.showValidCode = json.data.showValidCode
                    }
                })
            },
        },        
        mounted(){
            this.account.name = this.getLData('userphone') || '' ;
            this.random = this.randomWord(true,32,1000);
            this.cloudSignLogin();
            this.getLoginErrorCount();
        },
        beforeDestroy() {
            clearInterval(this.loginTimer);
        },
    }
</script>
<style lang="scss" scoped>
    #app{
        height: 100%;
    }
</style>
