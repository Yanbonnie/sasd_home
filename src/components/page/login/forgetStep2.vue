<template>
    <section class="forgetStep">
        <div class="forgetBody">
            <div class="form">
                <p >
                    请输入<b>{{phone}}</b>收到的验证码
                </p>
                <p class="box">
                    <label for="">验证码</label>
                    <input type="text" placeholder="请输入验证码" v-model="code" @keyup.enter="nextHandle">
                    <span class="yzm sendCode" @click="getCode" >{{sendCodeTxt}}</span>
                </p>
                <!-- <p class="box">
                    <label for=""></label>
                    <span class="warn">{{tip}}</span>
                </p> -->
            </div>
        </div>
        <div class="forgetFooter">
            <a href="javascript:;" @click="nextHandle" :class="[code.length > 0 ? 'active':'']">下一步</a>
        </div>
    </section>
</template>
<script>
    export default{
        name:'step1',
        data(){
            return{
                phone:'',
                sendCodeState:true,
                ResetCodeTime:0,
                sendCodeTxt:'获取验证码',
                code:'',
                tip:''
            }
        },
        methods:{
            nextHandle(){
                if(this.code==''){
                    this.modelCommonTip('验证码不能为空',1500,'topClass');
                    return;
                }
                this.httpPost(this.URL['verifyModelCode'],{
                    phone:this.phone,
                    code:this.code
                },res=>{
                    if(res.meta.success){
                        this.$router.push({
                            name:'ForgetStep3'
                        })
                    }else{
                        if(res.meta.message == 'overtime'){
                            this.modelCommonTip('验证码超时',1500,'topClass');
                        }else if(res.meta.message == 'wrong'){
                            this.modelCommonTip('验证码错误',1500,'topClass');
                        }else{
                            this.modelCommonTip(res.meta.message,1500,'topClass');
                        }
                    }
                })
               
            },
            //获取验证码
            getCode(){
                if(!this.sendCodeState) return;
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
            //再次验证手机号是不是存在
            // valiIsExit() {
            //     this.httpPost(this.URL["isSysEmailOrPhone"], {
            //             emilOrPhone:this.phone
            //         },res => {
            //             const { type, isExist } = res.data;
            //             if (res.meta.success) {
            //                 if (isExist == -1 || type == '002') { //不存在或者账号是邮箱
            //                     this.$router.push({
            //                         name:'ForgetStep1'
            //                     })
            //                 }
            //             }else{
            //                 this.$router.push({
            //                     name:'ForgetStep1'
            //                 })
            //             }
            //         }
            //     );
            // }
        },
        mounted(){
            this.phone = this.getSData('phone');
            if(!this.phone){
                this.$router.push({
                    name:'ForgetStep1'
                })
            }
        }
    }
</script>
