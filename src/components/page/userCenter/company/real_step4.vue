<template>
    <section class="contain comReal">
        <nav class="opacity"><i class="iconfont icon-back"></i></nav>
        <div class="realForm">
            <form action="">
                
                <div class="nav">
                    <ul class="box">
                        <li>
                            <p><span>填写企业信息</span></p>
                        </li>
                        <li >
                            <p><span>完善管理人信息</span></p>
                        </li>
                        <li>
                            <p><span>审核通过</span></p>
                        </li>
                        <li  class="active">
                            <p><span>完成认证</span></p>
                        </li>
                    </ul>
                </div>                
                <div class="resultBox">
                    <p><span class="iconfont icon-solid_check" style="font-size:50px"></span></p>
                    <p class="success">实名认证成功</p>
                    <p class="go" @click="goIndex">【前往首页】</p>
                </div>
            </form>
        </div>
        <Loading :text="'加载中...'" v-show="loadingState"></Loading>
    </section>
</template>
<script>
    export default{
        name:'comRealStep1',
        data(){
            return{
                verifyId:null,
                loadingState:true, 
            }
        },
        computed:{
            userState(){
                return this.$store.state.userState;
            }
        },
        methods:{
            //前往首页
            goIndex(){
                this.REQUEST('GET',this.URL['refreshLogin'],true).then(result=>{   //刷新登录状态
                    this.REQUEST('GET',this.URL['getCurAccount'],{}).then(json2=>{
                        this.login(json2,this.$router,this.$store);
                        this.$router.push({
                            name:'Index'
                        })
                    });                            
                })
            },
            //获取当前实名认证在哪一步
            async getStep(){
                this.loadingState = true;
                let json = await this.REQUEST('GET',this.URL['getStep'],{})                
                this.loadingState = false;
                if(json.meta.success){
                     const { step,verifyId,status } = json.data.data;
                     this.verifyId = verifyId;
                    if(status == 1){
                    }else if(step == 'step0_start'){
                        this.$router.push({
                            name:'ComRealStep1',
                            query:{
                                verifyId
                            }
                        })
                    }else if(step == 'step1_add'){
                        this.$router.push({
                            name:'ComRealStep2',
                            query:{
                                verifyId
                            }
                        })
                    }else if(step == 'step2_perfect' || step == 'step3_payment'){   //已经完善，未支付到第三部
                        this.$router.push({
                            name:'ComRealStep3',
                            query:{
                                verifyId
                            }
                        })
                    }
                }else{
                    this.modelCommonTip(json.meta.msg)
                }
            },
        },
        mounted(){
            let Timer = setInterval(()=>{
                if(this.userState != null){
                    clearInterval(Timer);
                    if(this.userState ==  1){
                        this.$router.push({
                            name:'Index'
                        })
                    }else{
                        this.getStep();
                    }
                }
            },30)
        }
    }
</script>
