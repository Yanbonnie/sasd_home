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
                        <li class="active">
                            <p><span>{{qrcodeBase64 ? '微信扫码在支付':'等待审核'}}</span></p>
                        </li>
                        <li>
                            <p><span>完成认证</span></p>
                        </li>
                    </ul>
                </div> 
                <div class="ewmBox" v-show="qrcodeBase64 && !checkStatus" >
                    <p>请用微信二维码扫码支付，完成支付</p>
                    <img :src="'data:image/png;base64,'+qrcodeBase64" alt="">
                </div>
                <div class="resultBox" v-show="checkStatus">
                    <p><span class="iconfont icon-solid_check"></span>提交成功，我们将在<b>1</b>个工作日内完成审核</p>
                    <!-- <div class="tipBox">
                        <p>资料审核成功后，我们将向您的随机账户打一笔随机金额。</p>
                        <p>金额回到账后你需要<span>回到当前认证页面填写打款金额</span>金额一致即完成企业认证。</p>
                    </div> -->
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
                qrcodeBase64:'',
                checkStatus:false,
                loadingState:true, 
                Timer:null
            }
        },
        computed:{
            userState(){
                return this.$store.state.userState;
            }
        },
        methods:{
            async updatePayStep(){
                let json = await this.REQUEST('POST',this.URL['updatePayStep'],{
                    verifyId:this.verifyId,
                    orderId:this.orderId
                })
                if(json.meta.success){
                    this.checkStatus = true;
                }else{
                    this.modelCommonTip(json.meta.msg)
                }
            },
            //轮询状态
            async payStatus(){
                this.Timer = setInterval(()=>{
                    this.REQUEST('POST',this.URL['payStatus'],{
                        busId:this.verifyId
                    }).then(json=>{
                        if(json.meta.success){
                            const { status } = json.data.data;
                            if(status == 'finish'){
                                clearInterval(this.Timer)
                                // this.checkStatus = true;
                                this.updatePayStep();
                            }
                        }else{
                            this.modelCommonTip(json.meta.msg)
                        }
                    });
                    
                },1000)
                
                
            },
            //获取支付二维码
            async generalUnitWx(procId,payChannelId){
                let json = await this.REQUEST('POST',this.URL['generalUnitWx'],{
                   procId, payChannelId,busId:this.verifyId,accId:this.$store.state.curAccount.accId,ip:''
                });
                this.loadingState = false;
                if(json.meta.success){
                    let {status,id} =  json.data.data;
                    this.orderId = id;
                    if(status == 'finish'){
                        // this.checkStatus = true;
                        this.updatePayStep();
                    }else{
                        this.qrcodeBase64 = json.data.data.qrcodeBase64;
                        this.payStatus();
                    }
                    
                }else{
                    this.modelCommonTip(json.meta.msg)
                }

            },
            //获取产品信息
            async getAuthCompany(){
                let json =  await this.REQUEST('GET',this.URL['getAuthCompany'],{});
                this.loadingState = false;
                if(json.meta.success){
                    const procId = json.data.data.proc.id;
                    const payChannelId = json.data.data.payConf[0].id;
                    this.generalUnitWx(procId,payChannelId);
                }else{
                    this.modelCommonTip(json.meta.msg)
                }
                
            },
            //获取当前实名认证在哪一步
            async getStep(){
                this.loadingState = true;
                let json = await this.REQUEST('GET',this.URL['getStep'],{})                
                
                if(json.meta.success){
                     const { step,verifyId } = json.data.data;
                     this.verifyId = verifyId;
                    if(step == 'step0_start'){
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
                    }else if(step == 'step2_perfect'){   //已经完善，未支付到第三部
                        this.getAuthCompany();
                    }else if(step == 'step3_payment'){   //已支付到第三部
                     this.loadingState = false;
                        this.checkStatus = true;
                    }
                }else{
                    this.modelCommonTip(json.meta.msg)
                }
                setTimeout(()=>{
                    this.requestState = true;
                },300)
            },
        },
        mounted(){
            this.removeSData('companyRealData');
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
        },
        beforeDestroy(){
            clearInterval(this.Timer);
        }
    }
</script>
