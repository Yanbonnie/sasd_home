<template>
    <section class="register">
        <LoginHeader tip="已有账号" ></LoginHeader>
        <div class="registerBox">
            <div class="stepBox" v-if="regStyle == 1">
                <div class="step_item" :class="[step == 1 ? 'active':'']">
                    <span class="num">1</span>
                    <span>个人注册</span>
                </div>
                <div class="step_item"  :class="[step == 3 ? 'active':'']">
                    <span  class="num">2</span>
                    <span>完成注册</span>
                </div>
            </div>
            <div class="stepBox" v-if="regStyle == 2">
                <div class="step_item" :class="[step == 4 ? 'active':'']">
                    <span class="num">1</span>
                    <span>企业注册</span>
                </div>
                <div class="step_item" :class="[step == 5 ? 'active':'']">
                    <span  class="num">2</span>
                    <span>完善企业信息</span>
                </div>
                <div class="step_item" :class="[step == 3 ? 'active':'']">
                    <span  class="num">3</span>
                    <span>完成注册</span>
                </div>
            </div>
            <div v-if="step != 3">
                <ul class="clf">
                    <li :class="[regStyle == 1 ? 'active':'']" @click="tabChange(1)">个人注册</li>
                    <li :class="[regStyle == 2 ? 'active':'']" @click="tabChange(2)">企业注册</li>
                </ul>
                <div class="formBox" v-show="regStyle == 1">
                    
                    <p>
                        <input type="text" v-model.trim="phone" :placeholder="step == 1 ? '手机号':'邮箱'">
                    </p>
                    <p class="psdItem">
                        <input type="password" placeholder="密码由不少于6位的数字、字母组合" v-model.trim="psw" v-show="!pswShow" >
                        <input type="text" placeholder="密码由不少于6位的数字、字母组合" v-model.trim="psw" v-show="pswShow">
                        <i class="iconfont" @click="pswShow = pswShow ? false : true" :class="[pswShow ? 'icon-eye' : 'icon-close_eye']"></i>
                    </p>
                    <p class="yzm">
                        <input type="text" v-model.trim="verificationCode" :placeholder="step == 1 ? '请输入短信验证码':'请输入邮箱验证码'">
                        <a href="javascript:;" @click="getCode" class="sendCode">{{sendCodeTxt}}</a>
                    </p>
                    <p class="btn">
                        <a href="javascript:;" @click="registerHandle" :class="[this.accept ? '' :'gray']">下一步</a>
                    </p>
                    <p class="accept">
                        <i class="iconfont icon-checkbox" @click="accept = !accept" :class="[accept ? 'active':'']"></i>已阅读并同意<span>《使用协议》</span>及<span>《隐私条款》</span> <!--<a href="javascript:;" @click="step = step == 1 ? 2 : 1">{{step== 1?'切换邮箱注册':'切换手机注册'}}</a>-->
                    </p>
                </div>
                <div class="formBox" v-show="regStyle == 2">
                    <div v-show="step == 4">
                        <p>
                            <input type="text" placeholder="邮箱" v-model.trim="email">
                        </p>                        
                        <p class="yzm">
                            <input type="text" placeholder="请输入邮箱验证码" v-model.trim="emailCode">
                            <a href="javascript:;" :class="[canSubmitEmail ? '':'gray']" @click="checkEmailSendCode">{{emailTip}}</a>
                        </p>
                        <p class="btn">
                            <a href="javascript:;" @click="checkEmailSub" :class="[this.accept ? '' :'gray']">下一步</a>
                        </p>
                    </div>
                    <div v-show="step == 5">
                        <p>
                            <input type="text" placeholder="企业名称" v-model.trim="largeCompanyName">
                        </p>
                        <p>
                            <input type="text" placeholder="联系人姓名" v-model.trim="contactPerson">
                        </p>
                        <p>
                            <input type="text" placeholder="联系人手机号" v-model.trim="contactPhone">
                        </p>
                        <p class="psdItem">
                            <input type="password" placeholder="密码由不少于6位的数字、字母组合" v-model.trim="pwd" v-show="!pwdShow" >
                            <input type="text" placeholder="密码由不少于6位的数字、字母组合" v-model.trim="pwd" v-show="pwdShow">
                            <i class="iconfont" @click="pwdShow = pwdShow ? false : true" :class="[pwdShow ? 'icon-eye' : 'icon-close_eye']"></i>
                        </p>
                        <p class="psdItem">
                            <input type="password" placeholder="确认密码由不少于6位的数字、字母组合" v-model.trim="pwd2" v-show="!pwdShow" >
                            <input type="text" placeholder="确认密码由不少于6位的数字、字母组合" v-model.trim="pwd2" v-show="pwdShow">
                            <i class="iconfont" @click="pwdShow = pwdShow ? false : true" :class="[pwdShow ? 'icon-eye' : 'icon-close_eye']"></i>
                        </p>
                        <p>
                            <select id="industryType" name="industryType" class="form-control" v-model.trim="industry">
                                <option value="请选择">请选择...</option>
                                <option value="金融">金融</option>
                                <option value="消费品">消费品</option>
                                <option value="汽车/机械/制造">汽车/机械/制造</option>
                                <option value="服务/外包/中介">服务/外包/中介</option>
                                <option value="交通/贸易/物流">交通/贸易/物流</option>
                                <option value="能源/化工/环保">能源/化工/环保</option>
                                <option value="医疗">医疗</option>                                
                                <option value="政府/农林牧渔">政府/农林牧渔</option>
                                <option value="房地产/建筑/物业">房地产/建筑/物业</option>
                                <option value="广告/传媒/教育/文化">广告/传媒/教育/文化</option>
                                <option value="电子/通信/硬件">电子/通信/硬件</option>
                                <option value="其他">其他</option>
                            </select>
                        </p>
                        <p class="btn">
                            <a href="javascript:;" @click="createCompany" :class="[this.accept ? '' :'gray']">{{createComTxt}}</a>
                        </p>
                    </div>
                    <p class="accept">
                        <i class="iconfont icon-checkbox" @click="accept = !accept" :class="[accept ? 'active':'']"></i>已阅读并同意<span>《使用协议》</span>及<span>《隐私条款》</span>
                    </p>
                </div>
            </div>
            <div v-show ="step == 3" class="success">
                <i class="iconfont icon-success"></i>
                <h3>你的账户已创建</h3>
                <p>实名认证后，在{{Config.Title}}签署的合同一旦发生纠纷，<br/>可申请司法鉴定，提供仲裁等法律保障服务</p>
                <a href="javascript:;" class="shengji">即将为您跳转至登录页</a>
            </div>
        </div>
        <p class="tip">本应用支持IE11、Chrome、Firefox、360极速模式 进行浏览</p>
    </section>
</template>
<script>
    import Vue from 'vue';
    import LoginHeader from '../../nav.vue';
    export default{
        name:'register',
        data(){
            return{
                regStyle:1,       //1-个人注册 2-企业注册 
                step:1,           //1-手机注册 2-邮箱注册 3-成功注册 4-企业注册第一步 5-企业注册第二步
                pswShow:false,    //个人注册密码显示隐藏  false-隐藏  true-显示
                psw:'',           //个人注册密码
                phone:'',
                verificationCode:'',       //短信验证码
                sendCodeState:true,
                ResetCodeTime:0,
                sendCodeTxt:'获取验证码',
                email:'',                  //邮箱
                emailCode:'',              //邮箱激活码
                canSubmitEmail:true,
                emailTip:'获取激活码',
                canNext:true,
                largeCompanyName:'',       //企业名称
                contactPerson:'',          //联系人
                contactPhone:'',           //联系人手机号
                pwd:'',                    //企业注册密码
                pwd2:'',                   //确认密码
                industry:'请选择',               //行业
                pwdShow:false,              //企业注册密码显示隐藏
                createComTxt:'注册',        //
                accept:true,
            }
        },
        components:{
            LoginHeader
        },
        methods:{
            tabChange(num){ //1个人注册  2，企业注册
                this.initHeight();
                if(num == 1){
                    [this.regStyle,this.step] = [1,1];
                    this.setSData('regStyle',this.regStyle)
                }else{
                    [this.regStyle,this.step,this.psw] = [2,4,''];
                    this.setSData('regStyle',this.regStyle)
                }
            },

            //企业注册
            //第二步
            // 创建企业用户
            createCompany(){
                if(!this.accept) return;
                const {largeCompanyName ,contactPerson,contactPhone,pwd,pwd2,industry,email,createComTxt} = this;
                if(this.validateQb.isEmpty(largeCompanyName)){
                    this.modelCommonTip("企业名称不能为空");
                    return;
                }
                if(this.validateQb.isEmpty(contactPerson)){
                    this.modelCommonTip('联系人姓名不能为空');
                    return;
                }
                if(this.validateQb.isEmpty(contactPhone)){
                    this.modelCommonTip("联系人手机号码不能为空");
                    return;
                }
                if(!this.validateQb.isPhone(contactPhone)){
                    this.modelCommonTip("联系人手机号码格式不正确");
                    return;
                }
                if(this.validateQb.isEmpty(pwd)){
                    this.modelCommonTip("密码不能为空");
                    return;
                }
                if(pwd.length < 6 || pwd.length > 16){
                    this.modelCommonTip('密码长度在6-16位之间');
                    return;
                }
                if(pwd != pwd2){
                    this.modelCommonTip("密码和确认密码不一致，请核对");
                    return;
                }
                if(industry == '请选择' || industry == '请选择...'){
                    this.modelCommonTip("请选择企业类型");
                    return;
                }
                if(createComTxt != '注册') return;
                this.createComTxt = '提交中...'
                this.httpPost(this.URL['createCompany'],{
                    largeCompanyName,
                    email,
                    contactPerson,
                    contactPhone,
                    pwd,
                    industry
                },res=>{
                    this.createComTxt = '注册';
                    if(res.meta.success){
                        this.step = 3;
                        setTimeout(()=>{
                            this.$router.push({
                                name:'Login'
                            })
                        },2500)
                    }else{
                        this.modelCommonTip("注册失败："+res.meta.message)
                    }
                })

            },
            //第一步（检测邮箱）
            checkEmailSub(){
                if(!this.accept) return;
                if(!this.canNext) return;
                if(!this.emailValidate()) return;
                if(this.validateQb.isEmpty(this.emailCode)){
                    this.modelCommonTip('验证码不能为空');
                    return;
                }
                this.httpPost(this.URL['checkEmailSub'],{
                    email:this.email,
                    valideCode:this.emailCode
                },res=>{
                    if(res.meta.success){
                        this.initHeight();
                        [this.canNext,this.step] = [false,5];
                        this.setSData('email',this.email);
                    }else{
                        this.modelCommonTip(res.data.msg ? res.data.msg : '验证码失效');
                    }
                })
            },
            //获取激活码
            checkEmailSendCode(){
                if(!this.canSubmitEmail){
                    this.modelCommonTip("您已发送过激活码到邮箱了，激活码两天内有效，请到邮箱查看",2000,'topClass40');
                    return;
                }
                if(!this.emailValidate()) return;
                this.httpPost(this.URL['checkEmailSendCode'],{
                    email:this.email
                },res=>{
                    if(res.meta.success){
                        [this.canSubmitEmail,this.emailTip] = [false,'发送成功，两天内有效'];  
                    }else{
                        this.modelCommonTip(res.data.msg)
                    }
                })
            },
            //邮箱验证
            emailValidate(){
                if(this.validateQb.isEmpty(this.email)){
                    this.modelCommonTip('邮箱不能为空',1500,'topClass40');
                    return false;
                }
                if(!this.validateQb.isEmail(this.email)){
                    this.modelCommonTip('邮箱格式不正确',1500,'topClass40');
                    return false;
                }
                return true;
            },
            //个人注册
            //获取验证码
            getCode(){
                if(!this.sendCodeState) return;
                if(!this.phoneValidate()) return;
                this.httpGet(this.URL['verificationCode'],{
                    mobileNo:this.phone
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
                    [this.sendCodeTxt,this.sendCodeState] = ['获取验证码',true]
                    $(".sendCode").css({'cursor':'pointer','background':"#000"});
                }else{
                    this.sendCodeTxt =    `重新发送${this.ResetCodeTime}s`
                    $(".sendCode").css({'cursor':'not-allowed','background':'#B7B7B7'});
                    setTimeout(()=>{
                        this.resetCode();
                    },1000)
                }                
            },
            //手机号码验证
            phoneValidate(){
                if(this.validateQb.isEmpty(this.phone)){
                    this.modelCommonTip('手机号码不能为空',1500,'topClass40');
                    return false;
                }
                if(!this.validateQb.isPhone(this.phone)){
                    this.modelCommonTip('手机号码格式不正确',1500,'topClass40');
                    return false;
                }
                return true;
            },
            //注册
            registerHandle(){
                if(!this.accept) return;
                if(!this.phoneValidate) return;
                if(this.validateQb.isEmpty(this.psw)){
                    this.modelCommonTip('请输入密码',1500,'topClass40');
                    return
                }
                if(this.validateQb.isEmpty(this.verificationCode)){
                    this.modelCommonTip('请输入短信验证码',1500,'topClass40');
                    return;
                }                
                this.httpPost(this.URL['createAccount'],{
                    phone:this.phone,
                    password:this.psw,
                    verificationCode:this.verificationCode
                },(json)=>{
                    if(json.meta.success){
                        // this.modelCommonTip("注册成功",1500,'topClass40');
                        this.step = 3;
                        setTimeout(()=>{
                            this.$router.push({
                                name:'Login'
                            })
                        },2500)
                    }else{
                        this.modelCommonTip(json.data.msg,1500,'topClass40')
                    }
                })
            },
            initHeight(){
                setTimeout(()=>{
                    let H = $('.register').height();
                    let BH = $('.registerBox').height();
                    if(BH > H){
                        $('.registerBox').addClass('overBox');
                    }else{
                        $('.registerBox').removeClass('overBox');
                    }
                },300)
            }
        },
        mounted(){
            $('.register').css({
                height:$(window).height()+'px',
            })            
            /*初始化数据*/
            this.email = this.getSData('email') ? this.getSData('email') : '';
            this.regStyle = this.getSData('regStyle') ? this.getSData('regStyle') : 1;
            if(this.regStyle == 2){
                this.step = 4;
            }
            this.initHeight();
        }
    }
</script>
