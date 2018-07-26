<template>
    <section class="contain comReal" >
        <nav @click="$router.push({name:'Index'})"><i class="iconfont icon-back" ></i>返回</nav>
        <div class="realForm">
            <form action="">
                
                <div class="nav">
                    <ul class="box">
                        <li class="active">
                            <p><span>填写企业信息</span></p>
                        </li>
                        <li >
                            <p><span>完善管理人信息</span></p>
                        </li>
                        <li>
                            <p><span>等待打款，核对金额</span></p>
                        </li>
                        <li>
                            <p><span>完成认证</span></p>
                        </li>
                    </ul>
                </div>
                <div class="tableBox" v-show="requestState">
                    <div class="table-item">
                        <p class="table-title"><b>*</b>企业名称</p>
                        <input type="text" placeholder="请填写营业执照上的名称" v-model="name">
                    </div>
                    <div class="table-item">
                        <p class="table-title"><b>*</b>营业执照注册号/统一社会信用代码</p>
                        <input type="text" placeholder="请输入15位营业执照注册号或18位统一社会信用代码" v-model="blRegNum">
                    </div>
                    <div class="table-item">
                        <p class="table-title"><b>*</b>营业执照/多合一营业执照</p>
                        <div class="fileBox">
                            <div class="fileLeft"  @click="previewHandle(2)">
                                <img v-show="!licenseSrc" src="../../../../assets/images/real/license.png" alt="" >
                                <img v-show="licenseSrc"  id="licenseSrc" :src="licenseSrc" alt="">
                                <div class="coverBox">
                                    <span class="iconfont icon-fangda"></span>
                                </div>
                            </div>
                            <div class="fileRight">
                                <h3 @click="previewHandle()">示例图</h3>
                                <p class="gray">支持 .jpg .png .jpeg 格式，大小不超过20M <br/>组织机构等非企业单位，请上传登记执照</p>
                                <a href="javascript:;" class="uploadBtn" id="licenseBtn">上传图片</a>
                                <input type="file" id="license"  style="display:none;">
                            </div>
                        </div>
                    </div>
                    <div v-if = "!isPrivate">
                        <div class="table-item">
                            <p class="table-title"><b>*</b>对公银行账号</p>
                            <input type="text" placeholder="请填写对公银行账号" v-model="bankNo">
                        </div>
                        <div class="table-item flexBox">
                            <div class="tableLeft">
                                <p class="table-title"><b>*</b>对公银行名称</p>
                                <input type="text" placeholder="如招商银行" v-model="bankName">    
                            </div>
                            <div class="tableRight">
                                <p class="table-title"><b>*</b>对公开户支行</p>
                                <input type="text" placeholder="请填写对公账户开户支行" v-model="subBankName">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btnBox" v-show="requestState">
                    <!-- <a href="javascript:;">取消</a> -->
                    <a href="javascript:;" class="btnOne" @click="realAdd">下一步</a>
                </div>
            </form>
        </div>
        <div class="previewCover" v-show="previewState" >
            <div class="preview">
                <span class="iconfont icon-close-hollow" @click="previewState = false;"></span>
                <img v-show="isDemo" src="../../../../assets/images/real/licenseBig.png" alt="">
                <img v-show="!isDemo" :src="licenseSrc" alt="">
            </div>
        </div>
        <Loading :text="loadTxt" v-show="loadingState"></Loading>
    </section>
</template>
<script>
    import realUpload from '@/assets/js/realUploadFile.js';
    export default{
        name:'comRealStep1',
        data(){
            return{
                previewState:false,     //示例图片状态
                loadingState:false,       //下载状态
                loadTxt:'',               //加载文字提示
                name:'',                  //企业名称
                blRegNum:'',               //营业执照注册号/统一社会信用代码
                blRegImg:'',                     //营业执照/多合一营业执照
                bankNo:'',                    //对公银行账号
                bankName:'',              //对公银行名称
                subBankName:'',           //对公开户支行
                licenseSrc:null,                 //上传的执照src
                isDemo:true,                     //是否点击的是示例图
                isPrivate:false,                 //非私有版
                status:null,                     //判断有无支付
                requestState:false,
            }
        },
        computed:{
            userState(){
                return this.$store.state.userState;
            }
        },
        methods:{
            ...realUpload,
            
            beforeSubmit(){
                const { name,blRegNum,bankNo,bankName,subBankName,blRegImg} = this;
                if(this.validateQb.isEmpty(name) || this.validateQb.isEmpty(blRegNum) || this.validateQb.isEmpty(bankNo) || this.validateQb.isEmpty(bankName) || this.validateQb.isEmpty(subBankName)){
                    this.modelCommonTip("信息不完整");
                    return false;
                }
                if(this.status == -1){  //审核不通过
                    return true;
                }else{
                    if(!blRegImg && this.$route.query.from != 'step2'){
                        this.modelCommonTip("信息不完整");
                        return false;
                    }
                    return true;
                }
            },
            //填写企业信息
            async realAdd(){
                if(!this.beforeSubmit()) return;
                const { name,blRegNum,bankNo,bankName,subBankName} = this;
                let formData = new FormData(); 
                                
                if(!this.isPrivate){  //公有版
                    formData.append('bankNo', bankNo);  
                    formData.append('bankName', bankName);
                    formData.append('subBankName', subBankName);
                }
                formData.append('name', name);
                formData.append('blRegNum', blRegNum);
                formData.append('blRegImg', this.blRegImg ? this.blRegImg : {});  
                [this.loadingState,this.loadTxt] = [true,'提交中...'];
                let json = await this.REQUEST('POST',this.URL['realAdd'],formData);
                [this.loadingState,this.loadTxt] = [false,''];
                if(json.meta.success){
                    // this.setSData('companyRealData',{"name":json.data.data.name,"blRegNum":json.data.data.blRegNum,"comId":json.data.data.comId})
                    this.$router.push({
                        name:'ComRealStep2',
                        query:{
                            verifyId:json.data.data.verifyId
                        }
                    })
                }else{
                    this.modelCommonTip(json.meta.msg)
                }
            },
            //点击示例图或者点击上传图片显示大图
            previewHandle(num = 1){  //默认是点击示例图片
                if(num == 1){
                    this.isDemo = true;
                }
                if(num == 2){
                    if(this.licenseSrc){
                        this.isDemo = false;
                    }else{
                        this.isDemo = true;
                    }
                }
                this.previewState = true;
            },
            //获取第一步骤信息
            async getAuthCompany(){
                let {meta,data} = await this.REQUEST('POST',this.URL['getAuthCompanyStep'],{});
                this.loadingState = false;
                if(meta.success){
                    if(data.data != 'no'){
                        const { name,blRegNum,blRegImg,bankNo,bankName, subBankName,blImg} = data.data.authCompany;
                        this.name = name;
                        this.blRegNum  = blRegNum;
                        // this.blRegImg = blRegImg;
                        this.bankNo = bankNo;
                        this.bankName = bankName;
                        this.subBankName = subBankName;
                        this.licenseSrc = this.apiPath+this.URL['downloadImg']+'?path='+blImg

                    }
                }else{
                    this.modelCommonTip(meta.msg)
                }
            },
            init(fromWay){
                let Timer = setInterval(()=>{
                if(this.userState != null){
                        clearInterval(Timer);
                        if(this.userState ==  1){
                            this.$router.push({
                                name:'Index'
                            })
                        }else{
                            this.loadingState = true;
                            if(fromWay == 'step2'){   //从第二步回来 
                                this.REQUEST('GET',this.URL['versionClass'],{}).then(({meta,data})=>{
                                    if(meta.success){
                                        this.requestState = true;
                                        this.getAuthCompany();         
                                        if(data.data == 'common'){
                                            this.isPrivate = false;
                                        }else{
                                            this.isPrivate = true;
                                        }
                                    }
                                })
                                                        
                            }else{
                                Promise.all([
                                    this.REQUEST('GET',this.URL['versionClass'],{}),   //获取类型
                                    this.REQUEST('GET',this.URL['getStep'],{})         //获取步骤
                                ]).then(result=>{
                                    setTimeout(()=>{
                                        this.requestState = true;
                                    },300)
                                    let [ json1, json2] = result;

                                    if(json1.data.data == 'private'){
                                        this.isPrivate = true;
                                    }else{
                                        this.isPrivate = false;
                                    }
                                    if(json2.meta.success){
                                        let { step,verifyId,status } = json2.data.data;
                                        this.status = status;
                                        if(status == 1){
                                            this.$router.push({
                                                name:'ComRealStep4'
                                            })
                                        }else if(step == 'step1_add'){
                                            this.$router.push({
                                                name:'ComRealStep2',
                                                query:{
                                                    verifyId
                                                }
                                            })
                                        }else if(step == 'step2_perfect' || step == 'step3_payment'){   //已经完善，已经支付到第三部
                                            this.$router.push({
                                                name:'ComRealStep3'
                                            })
                                        }else if(step == 'step0_start'){
                                            this.getAuthCompany(); 
                                        }
                                    }else{
                                        this.modelCommonTip(json2.meta.msg)
                                    }
                                })
                            }
                        }
                    }
                },30)
                this.clickFileFn('licenseBtn','license','licenseSrc');
            }
        },
        mounted(){
            let fromWay = this.$route.query.from;
            this.init(fromWay);
        }
    }
</script>
