<template>
    <section class="account" >
        <!-- <script ></script> -->
        <div class="cutCover" v-show="cutStatus">
            
            <div class="avatar-modal" id="avatar-modal">
                <div class="avatar-title">
                    上传头像
                </div>
                <form class="avatar-form"> 
                    <!-- <img  v-if="headIcon&&headIcon!=1" :src="'data:image/png;base64,'+headIcon" alt="" class="headIcon"> -->
                    <div class="avatar-body"> 
                        <div class="avatar-upload"> 
                            <p>仅支持JPG、PNG、JPEG、格式，文件小于4M</p>
                            <span id="avatar-name" style="display: none"></span> 
                            <input class="avatar-input" id="avatarInput" name="avatar_file" type="file" style="display:none" />
                        </div> 
                        <div class="cutContain">
                            <div class="preview-wrapper">
                                <span class="uploadBtn" href="javascript:;" onclick="$('input[id=avatarInput]').click();">选择要上传的图片</span>
                                <div class="avatar-wrapper"></div>
                            </div>
                            <div class="preview-img">
                                <p class="title">效果预览</p>
                                <div id="imageHead" class="avatar-preview previewImg">
                                    
                                </div>
                                <p class="tip">62*62像素</p>
                            </div> 
                        </div>
                        <div class="avatar-btns">
                            <a href="javascript:;" class="inserShadow" @click="cutStatus=false">取消</a>
                            <a href="javascript:;" class="avatar-save inserShadow" >保存</a>
                            <!-- <button class="" type="button" data-dismiss="modal"> 取消</button> 
                            <button class="avatar-save" type="button" data-dismiss="modal"> 保存修改</button>  -->
                        </div> 
                    </div>  
                </form> 
                
            </div>
        </div>
        <div v-if="CURACCOUNT">
            <div class="info">
            <h3>基本信息</h3>
            <div class="form">
                <div class="pictureBox">
                    <img  v-if="headIcon&&headIcon!=1" :src="'data:image/png;base64,'+headIcon" alt="">
                    <div v-if="!headIcon && (CURACCOUNT.accStstus == 3 || USERSTATE == 0)" class="iconImg">
                        {{CURACCOUNT.displayName.substring(0,1)}}
                    </div>
                    <div  class="iconFile" @click="cutStatus = true">
                        <div class="edit">编辑</div>
                    </div>
                    <input type="file" name="icon"  id="uploadIcon">
                    <div class="txt">
                        <p>{{CURACCOUNT.displayName}}
                            <span v-if="CURACCOUNT.accStstus == 3" class="REAL"><i class="iconfont icon-solid_check"></i><b>实名用户</b></span>
                            <span v-else class="NOREAL">未实名</span>
                        </p>
                        <p class="account">账号：{{CURACCOUNT.accNo}}</p>
                    </div>
                    <!-- <img src=""  id="IMG" alt=""> -->
                </div>
                <div class="infoBox">
                    <div class="itemWrap">
                        <span>登录密码</span>
                        <span>******</span>
                        <span class="greenTxt cursor" @click="showRegister(1)"><b>去修改</b></span>
                    </div>
                    <div class="itemWrap">
                        <span>真实姓名</span>
                        <span>{{CURACCOUNT.accStstus == '3' ? card.adminName : '未认证'}}</span>
                        <span v-if="CURACCOUNT.accStstus != '3'" class="cursor greenTxt" @click="goReal"><b>去认证</b></span>
                        <span v-else><b><i class="iconfont icon-hook"></i>已认证</b></span>
                    </div>
                    <div class="itemWrap">
                        <span>身份证号</span>
                        <span>{{ CURACCOUNT.accStstus == '3' && card.idCardNo ? card.idCardNo.substring(0,4)+'*********'+card.idCardNo.substring(14) : '未认证'}}</span>
                        <span v-if="CURACCOUNT.accStstus != '3'" class="greenTxt cursor" @click="goReal"><b>去认证</b></span>
                        <span v-else><b><i class="iconfont icon-hook"></i>已认证</b></span>
                    </div>
                    <div class="itemWrap">
                        <span>手机号码</span>
                        <span>{{CURACCOUNT.mobileNo.slice(0,3)+'****'+CURACCOUNT.mobileNo.slice(7)}}</span>
                        <span><b><i class="iconfont icon-hook"></i>已认证</b></span>
                    </div>
                    <div class="itemWrap">
                        <span>电子邮箱</span>
                        <span>{{CURACCOUNT.email}}</span>
                        <span v-if="USERSTATE == 1" class="greenTxt cursor" @click="register.state = true;register.index = 4"><b>设置</b></span>
                    </div>
                    <div class="itemWrap" v-if="CURACCOUNT.depositStatus == 1 && accountType">
                        <span>签署密码</span>
                        <span>******</span>
                        <span class="greenTxt cursor">
                            <b  @click="userPinUpdate = ''; userPin = '',register.state = true; register.index = 5;register.sureBtnTxt='确定'">修改</b>
                            <b style="margin-left:20px;"  @click="userPinUpdate = ''; userPin = '',register.state = true; register.index = 6;register.sureBtnTxt='确定'">重置</b>
                        </span>
                    </div>
                    <div class="itemWrap" v-if="!ukeyCert">
                        <span>ukey登录</span>
                        <span>该账号一旦绑定ukey，可使用ukey登录系统</span>
                        <!-- <span class="greenTxt cursor" @click="register.state = true;register.index = 7"><b>绑定</b></span> -->
                        <span class="greenTxt cursor" @click="pinState = true;"><b>绑定</b></span>
                    </div>
                    <div class="itemWrap" v-if="ukeyCert">
                        <span>ukey解绑</span>
                        <span>解除绑定之后不能使用ukey登录系统</span>
                        <span class="greenTxt cursor" @click="deleteUKey(ukeyCert.certId)"><b>解绑</b></span>
                    </div>
                </div>
            </div>
        </div>
        
        <alertModel :type="2" v-show="register.state" :title="register.title[register.index]" :alelrtClassWidth="'500px'" @cancelHandle="register.state = false">
            <div slot="alert-content" class="registerBox">
                <!--修改手机-->
                <div v-if="register.index == 0">
                    <div v-if="phoneStep == 1">
                        <!-- <p>请输入{{curAccount.mobileNo.substring(0,3)+'*****'+curAccount.mobileNo.substring(7) }}收到的验证码</p> -->
                        <p>请输入{{CURACCOUNT.mobileNo.substring(0,3)+'*****'+CURACCOUNT.mobileNo.substring(7) }}收到的验证码</p>
                        <p class="yzm">
                            <input type="text" placeholder="验证码" v-model="phoneCode.step1">
                            <a href="javascript:;" class="sendCode" @click="getCode(0)" >获取验证码</a>
                        </p>
                    </div>
                    <div v-if="phoneStep == 2">
                        <p class="normal"><input type="text" placeholder="新手机号码" v-model="register.newPhone"></p>
                        <p class="inputYzm clf">
                            <input type="text" placeholder="验证码" v-model="phoneCode.step2">
                            <a href="javascript:;" class="sendCode" @click="getCode(1)">获取验证码</a>
                        </p>
                    </div>
                </div>
                <!--修改密码-->
                <div v-if="register.index == 1">
                    <p class="normal">
                        <input type="password" placeholder="旧密码" v-model="psw.old" v-show="!psw.oldEye">
                        <input type="text" placeholder="旧密码" v-model="psw.old" v-show="psw.oldEye">
                        <i class="iconfont  eye" :class="[psw.oldEye ? 'icon-eye' :'icon-close_eye']" @click="psw.oldEye = psw.oldEye ? false:true"></i>
                    </p>
                    <p class="normal">
                        <input type="password" placeholder="新密码" v-model="psw.new" v-show="!psw.newEye">
                        <input type="text" placeholder="新密码" v-model="psw.new" v-show="psw.newEye">
                        <i class="iconfont  eye" :class="[psw.newEye ? 'icon-eye' :'icon-close_eye']" @click="psw.newEye = psw.newEye ? false:true"></i>
                    </p>
                    <p class="inputYzm clf">
                        <input type="text" placeholder="验证码" v-model="psw.code">
                        <a href="javascript:;" class="sendCode" @click="getCode(2)">获取验证码</a>
                    </p>
                    <!-- <p class="tip" :class="[psw.tip?'':'opacity']" >验证码已下发至手机号{{curAccount.mobileNo.substring(0,3)+'*****'+curAccount.mobileNo.substring(7) }}</p> -->
                </div>
                <!-- 绑定邮箱 -->
                <div v-if="register.index == 2">
                    <p class="normal"><input type="text" placeholder="邮箱"></p>
                    <p class="inputYzm clf">
                        <input type="text" placeholder="验证码">
                        <a href="javascript:;">获取激活码</a>
                    </p>
                    <p class="tip">激活码已下发至邮箱，请去邮箱查看</p>
                </div>
                <!-- 更换邮箱 -->
                <div v-if="register.index == 3">
                    <div v-if="mailStep == 1">
                        <p>
                            请输入邮箱 4243815@qq.com 收到的激活码
                        </p>
                        <p class="yzm">
                            <input type="text" placeholder="激活码">
                            <a href="javascript:;">获取激活码</a>
                        </p>
                    </div>
                    <div v-if="mailStep == 2">
                        <p class="normal"><input type="text" placeholder="新邮箱"></p>
                        <p class="inputYzm clf">
                            <input type="text" placeholder="激活码">
                            <a href="javascript:;">获取激活码</a>
                        </p>
                    </div>
                </div>
                <!-- 设置邮箱 -->
                <div v-if="register.index == 4">
                    <div>
                        <p class="normal"><input type="text" v-model="setEmailNum" placeholder="请输入邮箱" @keyup.enter="sureRegister"></p>
                    </div>
                </div>
                <!-- 修改签署密码 -->
                <div v-if="register.index == 5">
                    <div>
                        <p class="normal"><input type="password" v-model="userPin" placeholder="请输入旧的签署密码"></p>
                        <p class="normal"><input type="password" v-model="userPinUpdate" placeholder="请输入新的签署密码" @keyup.enter="sureRegister" @keyup="userPinUpdate=userPinUpdate.replace(/[^\d]/g,'') "></p>
                    </div>
                </div>
                <!-- 重置签署密码 -->
                <div v-if="register.index == 6">
                    <div>
                        <p v-if="USERSTATE == 1" style="color:#ff503f;line-height:20px;"><i class="iconfont icon-warn" style="margin-right:10px;" ></i>重置签署密码之后，以前接受授权的证书<br/>需要重新联系相关人员重新授权</p>
                        <p class="normal"><input type="password" v-model="userPinUpdate" placeholder="请设置签署密码" @keyup.enter="sureRegister" @keyup="userPinUpdate=userPinUpdate.replace(/[^\d]/g,'') "></p>
                    </div>
                </div>
            </div>
            <div slot="alert-footer">
                <div>
                    <a href="javascript:;" class="cancel-btn" @click="registerCancle">取消</a>
					<a href="javascript:;" class="sure-btn" @click="sureRegister">{{register.sureBtnTxt}}</a>
                </div>
            </div>
        </alertModel>
        <bindUkey :title="'绑定ukey登录证书'"  :operIndex="1" v-show="pinState" @cancelHandle="pinState = false;getAccountCertList()"></bindUkey>
        <alertModel title="实名认证" :type = "2"  :footerStatus="false" v-show="real.state" @cancelHandle="real.state = false">
            <div slot="alert-content">
                <img src="../../../assets/images/real_ewm.png" alt="" />
                <p><br/>扫码下载真宜签app实名认证</p>
            </div>
        </alertModel> 
        <Loading text="上传中...请稍等" v-show="loadingState"></Loading>
        </div>
    </section>
</template>
<script>
    import Vue from 'vue';
    import bindUkey  from '@/components/common/bindUkey/bindUkey.vue';
    
    //avatar
    // import '@/assets/js/avatar/jquery.min.js';
    import '@/assets/js/plugin/bootstrap.min.js';
    import '@/assets/js/avatar/cropper.js';
    import sitelogo from '@/assets/js/avatar/sitelogo.js';
    import '@/assets/js/avatar/html2canvas.min.js';
    export default{
        name:'account',
        data(){
            return {
                loadingState:false,
                cutStatus:false,
                // curAccount:1,        //用户数据
                register:{
                    state:false,
                    title:["修改手机号码","修改登录密码","绑定邮箱","更换邮箱",'设置邮箱','修改签署密码','重置签署密码','绑定ukey证书'],
                    index:0,           //0-修改手机号码，1-修改登录密码，2-绑定邮箱,3-更换邮箱，4-设置邮箱  5-修改签署密码  6-重置签署密码  7-绑定ukey证书
                    sureBtnTxt:'确定',
                    newPhone:'',
                },
                phoneStep:1,           //1-修改手机号码第一步，2-修改手机号码第二步
                phoneCode:{            //修改手机号验证码
                    step1:'',          //第一步
                    step2:''           //第二部
                },
                psw:{                  //修改密码
                    old:'',
                    new:'',
                    code:'',
                    oldEye:false,   //是否显示密码
                    newEye:false,   //是否显示密码
                    tip:false
                },
                pinState:false,
                mailStep:1,            //更换邮箱步骤 
                sendCodeState:true,    //可不可以发送验证码（true 可发送）
                ResetCodeTime:0,       //倒计时
                card:{
                    idCardNo:'',           //身份信息
                    idCardExpireTime:'',       //身份证有效期
                },
                real:{
                    state:false,
                },
                headIcon:1,
                setEmailNum:this.CURACCOUNT.email,         //设置邮箱
                userPin:'',                                //旧的签署密码
                userPinUpdate:'',                          //新的签署密码
                ukeyPsw:'',                                //ukey密码
                ddata:null,
                random:null,
                ukeyCert:'',
                ukey:{
                    tipStatus:false,
                    tip:'',
                },
            }
        }, 
        computed:{
            userState(){
                return this.$store.state.userState
            }
        },
        components:{
            bindUkey
        },
        methods:{
            //获取绑定ukey证书
            getAccountCertList(){
                this.httpGet(this.URL['getAccountCertList'],{},res=>{
                    this.ukeyCert = '';
                    this.ukeyCert = res.data[0].certId ?   res.data[0] : '';
                })
            },
            //解除绑定ukey
            deleteUKey(certId){
                let This = this;
                this.$store.commit('changeDialog',{state:true,options:{title:'解除绑定',text:`<p>确认解除ukey绑定？</p><p>一旦解除将无法使用ukey进行登录，请确认？</p>`}})
                this.dialogConfirm.confirm().then(() => {
                    this.$store.commit('changeDialog',{state:false,options:{}});
                    this.ajaxPost(this.URL['deleteUKey'],{certId},(json)=>{
                        if(json == 'success'){
                            // this.getAccountCertList();
                            if(!this.getSData('accountType')){
                                this.httpGet(this.URL['logoutWithoutPage'],{},(response)=>{});
                                this.removeSData('depositStatus');
                                setTimeout(function(){
                                    window.location.href="/login"
                                },300)
                            }else{
                                this.getAccountCertList();
                            }
                        }else{
                            this.modelCommonTip('解绑失败');
                        }
                    })
                }).catch(() => {
                    this.$store.commit('changeDialog',{state:false,options:{}})
                })
            },
            //绑定UKEYend
            goReal(){
                if(this.USERSTATE == 1){
                    this.real.state = true;
                }else{
                    this.$router.push({
                        name:'ComRealStep1'
                    })
                }
            },
            showRegister(Index){   //显示修改弹窗index(初始化数据)
                [this.register.state,this.register.index,this.register.newPhone,this.phoneStep,this.phoneCode.step1,this.phoneCode.step2,this.psw.tip,this.psw.old,this.psw.new,this.psw.code,this.psw.oldEye,this.psw.newEye] = 
                [true,Index,'',1,'','',false,'','','',false,false];
            },
            sureRegister(){        //修改弹窗确定按钮             
                if(this.register.index == 0 && this.phoneStep == 1){   //修改手机号码第一步
                    this.bindPhoneHandle(this.curAccount.mobileNo,this.phoneCode.step1,()=>{                        
                        //初始化验证码数据
                        this.ResetCodeTime = 0;
                        this.sendCodeState = true;
                        $(".sendCode").text("获取验证码");
                        $(".sendCode").css({'cursor':'pointer','background':"#000"});                        
                        this.phoneStep = 2 ;   //到修改手机号码第二步
                    });
                }
                if(this.register.index == 0 && this.phoneStep == 2){  //修改手机号码第二步
                    this.modifyPhone();
                } 
                if(this.register.index == 1){ //修改密码
                    if(this.validateQb.isEmpty(this.psw.old)){
                        this.modelCommonTip('必须输入原密码');
                        return;
                    }
                    if(this.validateQb.isEmpty(this.psw.new)){
                        this.modelCommonTip('必须输入新密码');
                        return;
                    }
                    if(this.psw.new.length < 6 ){
                        this.modelCommonTip('新密码不少于6位');
                        return;
                    }
                    if(this.psw.new.length > 16){
                        this.modelCommonTip('新密码不大于16位');
                        return;
                    }
                    if(this.validateQb.isChina(this.psw.new)){
                        this.modelCommonTip('密码不得包含中文');
                        return;
                    }
                    if(this.psw.old == this.psw.new){
                        this.modelCommonTip('新旧密码不能相同');
                        return;
                    } 
                    if(this.validateQb.isEmpty(this.psw.code)){
                        this.modelCommonTip("验证码不能为空");
                        return;
                    }
                    this.bindPhoneHandle(this.curAccount.mobileNo?this.curAccount.mobileNo:this.curAccount.accNo,this.psw.code,()=>{ 
                        this.modifyPassword();
                    });
                }
                if(this.register.index == 4){
                    if(!this.setEmailNum){
                        this.modelCommonTip("邮箱不能为空");
                        return;
                    }
                    if(!this.validateQb.isEmail(this.setEmailNum)){
                        this.modelCommonTip("邮箱格式不正确");
                        return;
                    }
                    this.REQUEST('POST',this.URL['updateCurEmail'],{
                        email:this.setEmailNum
                    }).then(res=>{
                        if(res.meta.success){
                            this.modelCommonTip("设置成功");
                            this.register.state = false;
                            this.register.index = 0;
                            this.CURACCOUNT.email = this.setEmailNum;
                            this.REQUEST('GET',this.URL['refreshLogin'],true).then(result=>{
                                this.REQUEST('GET',this.URL['getCurAccount'],{}).then(json2=>{                                    
                                    this.login(json2,this.$router,this.$store);
                                });    
                            })
                        }else{
                            this.modelCommonTip("设置失败");
                        }
                    })
                }
                if(this.register.index == 5){   //修改签署密码                    
                    this.updatePin();
                }
                if(this.register.index == 6){   //重置签署密码
                    this.resetPin();
                }
            },
            //更新签署密码
            updatePin(){
                if(this.register.sureBtnTxt !='确定') return;
                const { userPin,userPinUpdate} = this;
                if(!userPin){
                    this.modelCommonTip("旧签署密码不能为空");
                    return;
                }
                if(!userPinUpdate){
                    this.modelCommonTip("新签署密码不能为空");
                    return;
                }
                this.register.sureBtnTxt = '提交中...'
                this.REQUEST('POST',this.URL['updatePin'],{
                    userPin,userPinUpdate
                }).then(({meta,data})=>{
                    this.register.sureBtnTxt = '确定'
                    if(meta.success){
                        this.modelCommonTip("修改成功");
                        this.register.state = false;
                    }else{
                        this.modelCommonTip("修改失败");
                    }
                })
            },
            //重置签署密码
            resetPin(){
                if(this.register.sureBtnTxt !='确定') return;
                const { userPinUpdate} = this;
                if(!userPinUpdate){
                    this.modelCommonTip("签署密码不能为空");
                    return;
                }
                this.register.sureBtnTxt = '提交中...'
                this.REQUEST('POST',this.URL['resetPin'],{
                    userPin:userPinUpdate
                }).then(({meta,data})=>{
                    this.register.sureBtnTxt = '确定';
                    if(meta.success){
                        this.modelCommonTip("重置成功");
                        this.register.state = false;
                    }else{
                         this.modelCommonTip("重置失败");
                    }
                })
            },
            modifyPassword(){      //修改密码                                               
                this.httpPost(this.URL['modifyPassword'],{
                    pwdOld:this.psw.old,
                    pwdNew:this.psw.new
                },(json)=>{
                    if(json.meta.success){
                        this.modelCommonTip("修改成功");
                        this.register.state = false;
                        setTimeout(()=>{
                            this.$router.push({
                                name:'Login'
                            })
                        },1500)
                    }else{
                        //初始化验证码数据
                        this.ResetCodeTime = 0;
                        this.sendCodeState = true;
                        $(".sendCode").text("获取验证码");
                        $(".sendCode").css({'cursor':'pointer','background':"#000"}); 

                        let msg = json.meta.message;
                        if(msg == 'bad.password'){
                            this.modelCommonTip("原密码错误，请重试。");
                        }else{
                            this.modelCommonTip(msg)
                        }
                    }
                })
            },
            bindPhoneHandle(phone,code,success){   //绑定手机
                this.httpPost(this.URL['bindPhone'],{
                    phone:phone,
                    code:code
                },(json)=>{
                    if(json.meta.success){
                        success();
                    }else{
                        let msg = json.meta.message;
                        if(msg == 'overtime'){
                            this.modelCommonTip('超时！请重新获取验证码！');
                        }else if(msg == 'wrong'){
                            this.modelCommonTip("验证码错误");
                        }else if(msg == 'wrongPhone'){
                            this.modelCommonTip('手机格式错误');
                        }else{
                            this.modelCommonTip(msg);
                        }
                    }                    
                })
            },
            modifyPhone(){                         //修改手机号码
                if(this.validateQb.isEmpty(this.register.newPhone)){
                    this.modelCommonTip('请输入新手机号码');
                    return false;
                }
                if(!this.validateQb.isPhone(this.register.newPhone)){
                    this.modelCommonTip("手机号码不合法");
                    return false;
                }
                if(!this.phoneCode.step2){
                    this.modelCommonTip('请输入验证码');                    
                    return false;
                }
                this.httpPost(this.URL['modifyPhone'],{
                    phoneOld:this.curAccount.mobileNo,
                    phoneNew:this.register.newPhone,
                    code:this.phoneCode.step2
                },(json)=>{
                    if(json.meta.success){
                        //验证码初始化
                        this.ResetCodeTime = 0;
                        this.sendCodeState = true;
                        $(".sendCode").text("获取验证码");
                        $(".sendCode").css({'cursor':'pointer','background':"#000"});
                        this.modelCommonTip("手机号修改成功");
                        this.register.state = false;
                        // this.getLoginData(this.$store);
                    }else{
                        let msg = json.meta.message;
                        if(msg == 'bad.phone'){
                            this.modelCommonTip("手机号格式错误");
                        }else if(msg == 'authed'){
                            this.modelCommonTip("已实名认证无法修改手机号");
                        }else if(msg == 'overtime'){
                            this.modelCommonTip("验证码已超时");
                        }else if(msg == 'bad.code'){
                            this.modelCommonTip("验证码错误");
                        }else{
                            this.modelCommonTip(msg);
                        }
                    }
                })
            },            
            registerCancle(){                      //取消修改弹窗，还原数据
                [this.register.state,this.sendCodeState,this.ResetCodeTime]=[false,true,0];
            },
            getCode(num){                          //获取验证码   0-修改手机号第一步  1-修改手机号第二部  2-修改密码 
                let phone = null;
                if(num === 0){
                    phone = this.curAccount.mobileNo
                }else if(num == 1){
                    phone = this.register.newPhone;
                }else if(num == 2){
                    phone = this.curAccount.mobileNo ? this.curAccount.mobileNo :this.curAccount.accNo;
                }else{

                }
                if(this.validateQb.isEmpty(phone)){
                    this.modelCommonTip("手机号码不能为空");
                    return;
                }
                if(!this.validateQb.isPhone(phone)){
                    this.modelCommonTip("手机号码格式不正确");
                    return;
                }
                if(num == 2){
                    this.psw.tip = true;
                }

                if(!this.sendCodeState) return false;  
                this.httpGet(this.URL['verificationCode'],{
                    mobileNo:phone
                },(json)=>{
                    if(json == "success"){
                        this.sendCodeState = false;
                        this.ResetCodeTime = 60;
                        this.resetCode();          
                    }
                })
            },
            resetCode(){                           //验证码倒计时
                this.ResetCodeTime -- ;
                if(this.ResetCodeTime <= 0){
                    this.ResetCodeTime = 60;
                    this.sendCodeState = true;
                    $(".sendCode").text("获取验证码");
                    $(".sendCode").css({'cursor':'pointer','background':"#000"});
                }else{
                    $(".sendCode").text("重新发送("+this.ResetCodeTime+'s)');
                    $(".sendCode").css({'cursor':'not-allowed','background':'#B7B7B7'});
                    setTimeout(()=>{
                        this.resetCode();
                    },1000)
                }                
            },
            getIdCardExpire(){
                this.httpGet(this.URL['getIdCardExpire'],{},(json)=>{
                    if(json.code == 0){
                        this.card.idCardNo = json.data.idCardNo; 
                        this.card.adminName = json.data.idCardName; 
                        // this.card.idCardExpireTime = json.data.idCardExpireTime;
                    }
                })
            },
            async getAuthAdministran(){
                let {meta:success,data} = await this.REQUEST('POST',this.URL['getAuthAdministran'],{})
                if(success){
                    this.card = {
                        idCardNo:data.data.adminIdcard,           //身份信息
                        idCardExpireTime:'',       //身份证有效期
                        adminName:data.data.adminName
                    }
                }
            },
            async getHeadIcon(){
                this.headIcon = await this.REQUEST('GET',this.URL['getHeadIcon'],{})
            },
            //上传头像
            uploadIconClick(base64Url){
                let This = this;
                This.REQUEST('POST',This.URL['saveIcon'],{
                            icon:base64Url
                }).then(({meta,data})=>{
                    if(meta.success){
                        // This.queryIcon();
                    }
                })
               /* $('#uploadIcon').val('');
                $('#uploadIcon').click();                
                let This = this;
                $('#uploadIcon').unbind().change(function(){
                    let file = $(this)[0].files[0];
                    if(file.type.indexOf('image') == -1){
                        This.modelCommonTip("请上传图片");
                        return;
                    }
                    let filesize = (file.size)/1024;  
                    if(filesize > 50){
                        This.modelCommonTip("上传头像大小不得大于50k");
                        return;
                    }
                    This.loadingState = true;
                    let render = new FileReader();
                    render.readAsDataURL(file);
                    render.onload=function(e){
                        console.log(e.target.result)
                        This.REQUEST('POST',This.URL['saveIcon'],{
                            icon:this.result.split(',')[1]
                        }).then(({meta,data})=>{
                            if(meta.success){
                                This.queryIcon();
                            }
                        })
                    }
                })*/
            },
            queryIcon(){                
                this.REQUEST('GET',this.URL['queryIcon'],{}).then(({meta,data})=>{
                    this.loadingState = false;
                    if(meta.success && data.data){
                        this.headIcon = data.data.icon;
                    }else{
                        this.headIcon = 0;
                        if(this.CURACCOUNT.accStstus !=3 && this.USERSTATE == 1) {   //未实名
                            this.getHeadIcon();
                        }
                    }
                })
            },
            init(){
                let This = this;
                $('#avatarInput').on('change', function(e) {
                    var filemaxsize = 1024 * 5;//5M
                    var target = $(e.target);
                    var Size = target[0].files[0].size / 1024;
                    if(Size > filemaxsize) {
                        alert('图片过大，请重新选择!');
                        $(".avatar-wrapper").childre().remove;
                        return false;
                    }
                    if(!this.files[0].type.match(/image.*/)) {
                        alert('请选择正确的图片!')
                    } else {
                        var filename = document.querySelector("#avatar-name");
                        var texts = document.querySelector("#avatarInput").value;
                        var teststr = texts; //你这里的路径写错了
                        var testend = teststr.match(/[^\\]+\.[^\(]+/i); //直接完整文件名的
                        filename.innerHTML = testend;
                    }
                
                });
                $(".avatar-save").on("click", function() {
                    if($(".avatar-wrapper").is(":empty")) {
                        This.modelCommonTip("请选择需要裁切的图片");
                        return;
                    }                    
                    var img_lg = document.getElementById('imageHead');                    
                    // 截图小的显示框内的内容
                    html2canvas(img_lg, {
                        allowTaint: true,
                        taintTest: false,
                        onrendered: function(canvas) {
                            // $('.pictureBox').remove('.avatarCanvas');
                            let id = 'mycanvas'+Math.floor(Math.random()*100);
                            canvas.id = id;   
                            canvas.class='avatarCanvas'; 
                            $(canvas).attr('class','avatarCanvas');                  
                            $(canvas).css({width:62+'px',height:62+'px'});                  
                            // $('.pictureBox').append(canvas);
                            
                            //生成base64图片数据
                            var dataUrl = canvas.toDataURL("image/jpg");
                            // $('#IMG').attr('src',dataUrl)
                            This.headIcon = dataUrl.split(',')[1];
                            This.uploadIconClick(dataUrl.split(',')[1]);
                            This.cutStatus = false;
                        }
                    });
                })
            }
        },
        mounted(){
            this.init();
            this.curAccount = this.CURACCOUNT;
            this.queryIcon();
            this.getAccountCertList(); 
            if(this.USERSTATE == 0){
                this.getAuthAdministran();
            }else{
                this.getIdCardExpire();
            }  
            sitelogo(jQuery)
        }
    }
</script>
<style scoped lang="scss">
@import '../../../assets/js/avatar/cropper.min.css';
</style>
