<template>
    <section class="forgetStep">
        <div class="forgetBody">
            <div class="form">
                <p class="box psdItem">
                    <label for="">新密码</label>
                    <input type="password" placeholder="不少于6位的数字字母组合" v-model.trim="psw" v-show="!pswShow" id="password"> 
                    <input type="text" placeholder="不少于6位的数字字母组合" v-model.trim="psw" v-show="pswShow" id="text">                    
                    <i class="iconfont" @click="pswShowHandle" :class="[pswShow ? 'icon-eye':'icon-close_eye']"></i>
                </p>
                <p class="box psdItem">
                    <label for="">确认密码</label>
                    <input type="password" placeholder="不少于6位的数字字母组合" @keyup.enter="nextHandle" v-model.trim="psw2" v-show="!pswShow2" id="password"> 
                    <input type="text" placeholder="不少于6位的数字字母组合" @keyup.enter="nextHandle"  v-model.trim="psw2" v-show="pswShow2" id="text2">                    
                    <i class="iconfont" @click="pswShowHandle2" :class="[pswShow2 ? 'icon-eye':'icon-close_eye']"></i>
                </p>
                <p class="box tip" v-show="tipState">
                    <label for=""></label>
                    <input type="text" :value="tip">
                </p>
            </div>
        </div>
        <div class="forgetFooter">
            <a href="javascript:;" @click="nextHandle" :class="[(psw.length > 0 && psw2.length>0) ? 'active':'']">下一步</a>
        </div>
    </section>
</template>
<script>
    export default{
        name:'step1',
        data(){
            return{
                phone:'',
                psw:'',         //新密码
                psw2:'',         //确认新密码
                pswShow:false,    //密码显示隐藏  false-隐藏  true-显示  
                pswShow2:false,    //密码显示隐藏  false-隐藏  true-显示  
                tip:'密码必须是由数字和字母组合，并且不少于6位',
                tipState:false
            }
        },
        methods:{
            pswShowHandle(){
                this.pswShow = this.pswShow ? false : true;
                if(this.pswShow){
                    $("#text").focus();
                }else{
                    $("#password").focus();
                }
            },
            pswShowHandle2(){
                this.pswShow2 = this.pswShow2 ? false : true;
                if(this.pswShow2){
                    $("#text2").focus();
                }else{
                    $("#password2").focus();
                }
            },
            nextHandle(){
                if(!this.psw){
                    this.modelCommonTip('新密码不能为空',1500,'topClass');
                    return;
                }
                if(this.psw.length < 6){
                    this.modelCommonTip('密码不能低于6位',1500,'topClass');
                    return;
                }
                if(this.psw.length > 16){
                    this.modelCommonTip('密码不能大于16位',1500,'topClass');
                    return;
                }
                if(!this.psw2){
                    this.modelCommonTip('确认密码不能为空',1500,'topClass');
                    return;
                }
                if(this.psw != this.psw2){
                    this.modelCommonTip("新旧密码不一致",1500,'topClass');
                    return;
                }
                this.httpPost(this.URL['setPwdToPhone'],{
                    phone:this.phone,
                    pwd:this.psw
                },res=>{
                    if(res.meta.success){                        
                        this.$router.push({
                            name:'ForgetStep4'
                        })
                    }else{
                        this.modelCommonTip(res.meta.message,1500,'topClass')
                    }
                })
            }
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
