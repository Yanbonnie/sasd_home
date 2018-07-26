<template>
    <section class="contain comReal">
        <nav class="opacity"><i class="iconfont icon-back"></i></nav>
        <div class="realForm">
            <form action="">
                
                <div class="nav">
                    <ul class="box">
                        <li >
                            <p><span>填写企业信息</span></p>
                        </li>
                        <li class="active">
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
                        <p class="table-title">选择账号管理员身份</p>
                        <div class="flexTabBox">
                            <div class="item" :class="[isLegal ? 'active':'']" @click="isLegal= true;type=1">法定代表</div>
                            <div class="item" :class="[isLegal ? '':'active']"  @click="isLegal = false;type=0">非法定代表</div>
                        </div>
                    </div>
                    <div class="table-item">
                        <p class="table-title"><b>*</b>法定代表人姓名</p>
                        <input type="text" placeholder="请填写与执照上一致的法定代表人姓名" v-model.trim="legal.legalName">
                    </div>
                    <div class="table-item">
                        <p class="table-title"><b>*</b>法定代表人身份证号</p>
                        <input type="text" placeholder="请填写与执照上一致的法定代表人身份证号" v-model.trim="legal.legalIdcard">
                    </div>
                    <!-- 法定人信息 -->
                    <div v-show="isLegal">
                        <div class="table-item">
                            <p class="table-title"><b>*</b>法定代表人手机号</p>
                            <input type="text" placeholder="请填法定代表人手机号" v-model.trim="legal.legalPhone">
                        </div>
                        <div class="table-item yzmBox">
                            <p class="table-title"><b>*</b>短信验证码</p>
                            <div class="yzm">
                                <input type="text" placeholder="请输入6位验证码" v-model.trim="legal.lcode">
                                <a href="javascript:;" class="sendCode" @click="getCode()" :class="[sendCodeState ? '':'gray']">{{sendCodeTxt}}</a>
                            </div>
                        </div>
                    </div>
                    <div class="table-item">
                        <p class="table-title"><b>*</b>{{isLegal? '法定代表人手持身份证照':'法定代表人身份证正反面'}}</p>
                        <div class="fileBox">
                            <div class="fileLeft" v-show="isLegal">
                                <img  v-show="!legalHandCardSrc" src="../../../../assets/images/real/id_card_2.png" alt="">
                                <img  v-show="legalHandCardSrc" :src="legalHandCardSrc" alt="">
                                <div class="coverBox" @click="previewSrcHandle(legalHandCardSrc?legalHandCardSrc:StaticLegalHandCardSrc)">
                                    <span class="iconfont icon-fangda"></span>
                                </div>
                            </div>
                            <div class="fileLeftTwo" v-show="!isLegal">
                                <div class="front">
                                    <img v-show="!legalCardFrontSrc" src="../../../../assets/images/real/card_front.png" alt="">
                                    <img v-show="legalCardFrontSrc" :src="legalCardFrontSrc" alt="">
                                    <div class="coverBox" @click="previewSrcHandle(legalCardFrontSrc?legalCardFrontSrc:StaticIdCardFront)">
                                        <span class="iconfont icon-fangda"></span>
                                    </div>
                                </div>
                                <div class="back">
                                    <img v-show="!legalCardBackSrc" src="../../../../assets/images/real/card_back.png" alt="">  
                                    <img v-show="legalCardBackSrc" :src="legalCardBackSrc" alt="">  
                                    <div class="coverBox" @click="previewSrcHandle(legalCardBackSrc?legalCardBackSrc:StaticIdCardBack)">
                                        <span class="iconfont icon-fangda"></span>
                                    </div>  
                                </div>
                            </div>
                            <div class="fileRight">
                                <h3 @click="previewSrcHandle(isLegal?StaticLegalHandCardSrc:StaticIdCard)">示例图</h3>
                                <p class="gray">支持 .jpg .png .jpeg 格式，大小不超过20M <br/>图片所有信息清晰可见，内容真实有效</p>
                                <div class="fileBox" v-show="isLegal">
                                    <a href="javascript:;" class="uploadBtn" id="legalHandCard">上传图片</a>
                                    <input type="file" style="display:none" id="legalHandCardFile">
                                </div>
                                <div class="fileBox" v-show="!isLegal">
                                    <a href="javascript:;" class="uploadBtn" id="legalCardFront">上传正面</a>
                                    <input type="file" id="legalCardFrontFile" style="display:none">
                                    <a href="javascript:;" class="uploadBtn" id="legalCardBack">上传反面</a>
                                    <input type="file" id="legalCardBackFile" style="display:none;">
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 非法定人信息 -->
                    <div v-show="!isLegal">
                        <div class="table-item">
                            <p class="table-title"><b>*</b>账号管理人姓名</p>
                            <input type="text" placeholder="请填账号管理人姓名" v-model.trim="admin.adminName">
                        </div>
                        <div class="table-item">
                            <p class="table-title"><b>*</b>账号管理人身份证号</p>
                            <input type="text" placeholder="请填账号管理人身份证号" v-model.trim="admin.adminIdcard">
                        </div>
                        <div class="table-item">
                            <p class="table-title"><b>*</b>管理人身份证正反面</p>
                            <div class="fileBox">
                                <div class="fileLeftTwo" >
                                    <div class="front">
                                        <img v-show="!manageCardFrontSrc"  src="../../../../assets/images/real/card_front.png" alt="">
                                        <img v-show="manageCardFrontSrc"  :src="manageCardFrontSrc" alt="">
                                        <div class="coverBox" @click="previewSrcHandle(manageCardFrontSrc?manageCardFrontSrc:StaticIdCardFront)">
                                            <span class="iconfont icon-fangda"></span>
                                        </div>
                                    </div>
                                    <div class="back">
                                        <img v-show="!manageCardBackSrc"  src="../../../../assets/images/real/card_back.png" alt="">  
                                        <img v-show="manageCardBackSrc" :src="manageCardBackSrc" alt="">  
                                        <div class="coverBox"  @click="previewSrcHandle(manageCardBackSrc?manageCardBackSrc:StaticIdCardBack)">
                                            <span class="iconfont icon-fangda"></span>
                                        </div>  
                                    </div>
                                </div>
                                <div class="fileRight">
                                    <h3 @click="previewSrcHandle(StaticIdCard)">示例图</h3>
                                    <p class="gray">支持 .jpg .png .jpeg 格式，大小不超过20M <br/>图片所有信息清晰可见，内容真实有效</p>
                                    <div class="fileBox">
                                        <a href="javascript:;" class="uploadBtn" id="manageCardFront">上传正面</a>
                                        <input type="file" id="manageCardFrontFile" style="display:none;">
                                        <a href="javascript:;" class="uploadBtn" id="manageCardBack">上传反面</a>
                                        <input type="file" id="manageCardBackFile" style="display:none;">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="table-item">
                            <p class="table-title"><b>*</b>账号管理人手机号</p>
                            <input type="text" placeholder="请填写账号管理人手机号" v-model.trim="admin.adminPhone">
                        </div>
                        <div class="table-item yzmBox">
                            <p class="table-title"><b>*</b>短信验证码</p>
                            <div class="yzm">
                                <input type="text" placeholder="请输入6位验证码" v-model="admin.acode" />
                                <a href="javascript:;" @click="getCode(2)"  :class="[sendCodeState2 ? '':'gray']">{{sendCodeTxt2}}</a>
                            </div>
                        </div>
                    </div>
                    <!-- 申请表 -->
                    <div class="table-item">
                        <p class="table-title"><b>*</b>按要求上传申请表</p>
                        <div class="fileBox">
                            <div class="fileLeft">
                                <img v-show="!applyTableSrc" src="../../../../assets/images/real/apply.png" alt="">
                                <img v-show="applyTableSrc" :src="applyTableSrc" alt="">
                                <div class="coverBox" @click="previewSrcHandle(applyTableSrc?applyTableSrc:StaticApplyBig)">
                                    <span class="iconfont icon-fangda"></span>
                                </div>
                            </div>
                            <div class="fileRight">
                                <p class="gray">步骤一：请下载<a href="javascript:;" @click="downloadApplyTab">《企业认证申请表》</a>（填写完上述内容后自动生成）<br/>步骤二：账户管理人签字，并加盖企业公章后上传<br/>支持 .jpg .png .jpeg 格式，大小不超过20M</p>
                                <a href="javascript:;" class="uploadBtn" id="applyTable">上传图片</a>
                                <input type="file" id="applyTableFile" style="display:none;">
                            </div>
                        </div>
                        
                    </div>
                    <div class="table-item ">
                        <p class="table-title"><b class="iconfont icon-check-box"></b>对公银行账号已阅读并同意<a href="javascript:;" @click="protocolState = true">《认证协议》</a>，保证信息的真实性</p>
                    </div>
                </div>
                <div class="btnBox">
                    <a href="javascript:;" @click="$router.push({name:'ComRealStep1',query:{from:'step2'}})">上一步</a>
                    <a href="javascript:;" class="btnOne" @click="realReq">下一步</a>
                </div>
            </form>
        </div>
        <alertModel :type="2" title="确认提交" class="sureSubmitBox" v-show="sureSubmitState" @cancelHandle="sureSubmitState = false" @sureHandle="addLegalHandle">
            <div slot="alert-content">
                <div class="tipBox">
                    <p class="item">
                        <span>企业名称：</span>
                        <span>你好好好好好股份有限公司</span>
                    </p>
                    <p>
                        <span>营业执照注册号： </span>
                        <span>123123123123123123  </span>
                    </p>
                    <p>
                        <span>对公银行账号：</span>
                        <span>123123123123123123</span>
                    </p>
                    <p>
                        <span>对公银行名称：</span>
                        <span>招商银行</span>
                    </p>
                    <p>
                        <span>对公银行开户支行：</span>
                        <span>123456</span>
                    </p>
                    <p>
                        <span>法人姓名:</span>
                        <span>赵子龙</span>
                    </p>
                    <p>
                        <span>法人身份证号：</span>
                        <span>442365214585652352</span>
                    </p>
                    <p>
                        <span>账号管理人姓名：</span>
                        <span>赵云</span>
                    </p>
                    <p>
                        <span>账号管理人身份证号：</span>
                        <span>441235265854745623</span>
                    </p>
                    <p>
                        <span>账号管理人手机号：</span>
                        <span>18823526232</span>
                    </p>
                </div>
                <p class="sweet">是否确认提交的所有资料无误并提交真宜签审核？</p>
            </div>
        </alertModel>
        <!-- 认证协议弹窗 -->
        <div class="protocolCover" v-show="protocolState">
            <div class="protocol">
                <span class="iconfont icon-close" @click="protocolState = false"></span>
                <h3>真宜签用户实名认证告知书</h3>
                <p class="pt50">本网站由数安时代科技股份有限公司、广东信鉴信息科技有限公司（下称＂真宜签＂或“本网站”）负责运营。本用户实名认证告知书具有合同效力，适用于您在本网站的全部活动。请您在实名认证前务必仔细阅读告知书，若您不同意告知书的任意内容，或者无法准确理解真宜签对条款的解释，请不要进行后续操作；若您进行实名认证，则表示您对告知书的全部内容已充分阅读并认可和同意遵守。同时，承诺遵守中国法律、法规、规章及其他政府规范性文件的规定，如有违反而造成任何法律后果，您将以本人名义独立承担所有相应的法律责任。</p>

                <p class="pt50">1 、在实名认证过程中个人及企业必须根据本网站的要求提供最新、真实、有效及完整的资料。其中，根据实名认证方式的不同，个人所需提供的实名认证资料将有所差异，具体所需资料请以本网站要求为准。企业需要提供的实名认证资料包括但不限于营业执照、税务登记证，企业法定代表人姓名及其身份证信息，并且企业法定代表人需要选择 eID 认证、手持身份证照认证或企业银行基本账户认证的任意一种方式进行实名认证。</p>
                <p>2 、实名认证具体操作流程请严格按照本网站实名认证规定的流程履行，否则将影响实名审核的结果。</p>
                <p>3 、用户同意并授权真宜签审核、核对用户资料信息。真宜签将认真、全面审核用户提交的资料以确认用户真实身份，确保后续服务的合法性、有效性。所提交的用户认证信息将用于核发其专属的电子签名文件，我们将对用户的信息严格保密。</p>
                <p>4 、真宜签的用户包括企业用户和个人用户。企业用户是指通过本网站完成全部注册程序后，使用真宜签提供的服务，并且依据中华人民共和国法律在境内（香港、台湾、澳门除外）设立的，能够独立承担民事责任的法人和其他组织。个人用户是指中华人民共和国境内（香港、台湾、澳门除外）的公民，通过本网站完成全部注册程序后，使用真宜签提供的服务，并且符合中华人民共和国法律规定的具有完全民事行 为能力，能够独立承担民事责任的自然人。</p>
                <p>5 、用户应保证所提交的资料均合法、真实、有效，为本人的真实意思表示。</p>

                <p  class="pt50">若您进行实名认证，则表示您已对本告知书的全部内容已充分阅读并认可和同意遵守。</p>
                <!-- <a href="javascript:;">我知道了</a> -->
            </div>            
        </div>
        <!-- 预览弹窗 -->
        <div class="previewCover" v-show="previewState">
            <div class="preview">
                <span class="iconfont icon-close-hollow" @click="previewState = false"></span>
                <img alt="" :src="previewSrc">
            </div>
        </div>
        <Loading :text="loadTxt" v-show="loadingState"></Loading>
    </section>
</template>
<script>
    import realUpload from '@/assets/js/realUploadFile.js';
    import StaticLegalHandCardSrc from '@/assets/images/real/id_card_2Big.png';    //手持身份证大图
    import StaticIdCard from '@/assets/images/real/id_cardBig.png';                //身份证真反面大图
    import StaticIdCardFront from '@/assets/images/real/card_front_big.png';       //身份证正面大图
    import StaticIdCardBack from '@/assets/images/real/card_back_big.png';         //身份证正反面大图
    import StaticApplyBig from '@/assets/images/real/applyBig.jpg';                //申请表大图
    export default{
        name:'comRealStep1',
        data(){
            return{
                name:'',                  //企业名称
                blRegNum:'',               //营业执照注册号/统一社会信用代码
                blRegImg:'',                     //营业执照/多合一营业执照
                bankNo:'',                    //对公银行账号
                bankName:'',              //对公银行名称
                subBankName:'',           //对公开户支行

                requestState:false,    
                isLegal:true,             //是否是法定联系人
                protocolState:false,      //认证协议状态
                previewState:false,       //示例状态
                previewSrc:'',            //示例地址
                sureSubmitState:false,    //确认提交弹框状态
                loadingState:false,       //下载状态
                loadTxt:'',               //加载文字提示
                //法人
                legalHandCardSrc:'',       //法人手持身份证照
                applyTableSrc:'',          //申请表

                //非法人
                legalCardFrontSrc:'',      //法人身份证正面
                legalCardBackSrc:'',       //法人身份证反面
                manageCardFrontSrc:'',     //管理人身份证正面
                manageCardBackSrc:'',      //管理人身份证反面

                StaticLegalHandCardSrc,    //手持身份证大图
                StaticIdCard,              //身份证正反面大图
                StaticIdCardFront,   
                StaticIdCardBack,
                StaticApplyBig,

                //获取验证码
                sendCodeState:true,
                ResetCodeTime:0,
                sendCodeTxt:'获取验证码',

                sendCodeState2:true,
                ResetCodeTime2:0,
                sendCodeTxt2:'获取验证码',
                
                //提交的法人信息
                comId:'',
                verifyId:'',
                orderId:'',
                payStatus:'NO',
                status:null,                           //-1 已支付被打回  否则，未支付
                type:1,                                //类型 1-法人  0-非法人
                legal:{
                    legalName:'',
                    legalIdcard:'',
                    legalPhone:'',           //法人代表手机号
                    lcode:'',                            //法人代表code
                },
                admin:{
                    adminName:"",
                    adminIdcard:"",
                    adminPhone:'',
                    acode:""
                }

                
            }
        },
        computed:{
            userState(){
                return this.$store.state.userState;
            }
        },
        methods:{
            ...realUpload,
            downBefore(){
                const { type } = this;
                const { legalName,legalIdcard,legalPhone} = this.legal;
                if(this.validateQb.isEmpty(legalName)){
                    this.modelCommonTip("法人姓名不能为空");
                    return false;
                }
                if(this.validateQb.isEmpty(legalIdcard)){
                    this.modelCommonTip("法人身份证号码不能为空");
                    return false;
                }
                if(!this.validateQb.isCardNo(legalIdcard)){
                    this.modelCommonTip("法人身份证号码格式不正确");
                    return false;
                }
                

                if(type == 0){   //判断非法人
                    const { adminName,adminIdcard,adminPhone} = this.admin;
                    if(this.validateQb.isEmpty(adminName)){
                        this.modelCommonTip("账号管理人姓名不能为空");
                        return false;
                    }
                    if(this.validateQb.isEmpty(adminIdcard)){
                        this.modelCommonTip("账号管理人身份证号码不能为空");
                        return false;
                    }
                    if(!this.validateQb.isCardNo(adminIdcard)){
                        this.modelCommonTip("账号管理人身份证号码格式不正确");
                        return false;
                    }
                    if(this.validateQb.isEmpty(adminPhone)){
                        this.modelCommonTip("账号管理人手机号码不能为空");
                        return false;
                    }
                    if(!this.validateQb.isPhone(adminPhone)){
                        this.modelCommonTip("账号管理人手机号码格式不正确");
                        return false;
                    }
                    return true;
                }else{
                    if(this.validateQb.isEmpty(legalPhone)){
                        this.modelCommonTip("法人手机号码不能为空");
                        return false;
                    }
                    if(!this.validateQb.isPhone(legalPhone)){
                        this.modelCommonTip("法人手机号码格式不正确");
                        return false;
                    }
                    return true;
                }
            },
            //企业认证申请表数据提交给后台生成pdf
            async downloadApplyTab(){
                if(!this.downBefore()) return;
                //验证信息
                const { type,comId } = this;
                const { legalName,legalIdcard,legalPhone} = this.legal;
                const { adminName,adminIdcard,adminPhone} = this.admin;
                let adminData = '';
                if( type == 1){
                    adminData = {
                        adminName:legalName,
                        adminIdcard:legalIdcard,
                        adminPhone:legalPhone,
                    }
                }else{
                     adminData = {
                        adminName,
                        adminIdcard,
                        adminPhone,
                    }       
                }
                [this.loadingState,this.loadTxt] = [true,'请稍等...'];
                let json = await this.REQUEST('POST',this.URL['downloadApplyTab'],{
                    type,
                    comId,
                    email:this.$store.state.curAccount.accNo,
                    legalName,
                    legalIdcard,
                    legalPhone,
                    ...adminData
                })
                this.loadingState = false;
                if(json.meta.success){   //成功了就可以下载模板了

                    let downId = json.data.data;
                    window.location.href = this.apiPath+this.URL['downloadApplyPdfTab']+'?downId='+downId
                }else{
                    this.modelCommonTip(json.meta.msg)
                }
            },
            //实名认证提交管理人信息
            realReq(){
                if(!this.downBefore()) return;
                const { type ,comId,verifyId,status} = this;
                const { legalName,legalIdcard,legalPhone} = this.legal;
                const { adminName,adminIdcard,adminPhone} = this.admin;    
                const { legalHandCardSrc , legalCardFrontSrc, legalCardBackSrc, manageCardFrontSrc, manageCardBackSrc} = this;
                let legalCode = this.legal.lcode;
                let adminCode = this.admin.acode;  
                if(type == 1){  //管理人是法人
                    if(this.validateQb.isEmpty(legalCode)){
                        this.modelCommonTip("短信验证码不能为空");
                        return;
                    }
                    if(this.validateQb.isEmpty(this.legalHandCardSrc) && status != -1){
                        this.modelCommonTip("请上传法定代表人手持身份证照");
                        return;
                    }                    
                }else{
                    if(this.validateQb.isEmpty(legalCardFrontSrc) && status != -1){
                        this.modelCommonTip("请上传法人身份证正面");
                        return;
                    }
                    if(this.validateQb.isEmpty(legalCardBackSrc) && status != -1){
                        this.modelCommonTip("请上传法人身份证反面");
                        return;
                    }
                    if(this.validateQb.isEmpty(manageCardFrontSrc) && status != -1){
                        this.modelCommonTip("请上传管理人身份证正面");
                        return;
                    }
                    if(this.validateQb.isEmpty(manageCardBackSrc) && status != -1){
                        this.modelCommonTip("请上传管理人身份证反面");
                        return;
                    }
                    if(this.validateQb.isEmpty(adminCode)){
                        this.modelCommonTip("请输入短信验证码");
                        return;
                    }
                }
                if(this.validateQb.isEmpty(this.applyTableSrc) && status != -1){ 
                    this.modelCommonTip("请上传申请表");
                    return;
                }
                if(this.orderId){
                    this.payStatusHandle();
                }else{
                    this.addLegalHandle();
                }
                
            },
            //轮询状态
            async payStatusHandle(){
                let json = await this.REQUEST('POST',this.URL['payStatus'],{
                    busId:this.verifyId
                });
                if(json.meta.success){
                    const { status } = json.data.data;
                    if(status == 'finish'){
                        this.payStatus = 'YES';
                    }
                    this.addLegalHandle();
                }else{
                    this.modelCommonTip(json.meta.msg)
                }
                
            },
            addLegalHandle(){
                const { type ,comId,verifyId,payStatus,status} = this;
                const { legalName,legalIdcard,legalPhone} = this.legal;
                const { adminName,adminIdcard,adminPhone} = this.admin;    
                const { legalHandCardSrc , legalCardFrontSrc, legalCardBackSrc, manageCardFrontSrc, manageCardBackSrc} = this;
                let legalCode = this.legal.lcode;
                let adminCode = this.admin.acode;    


                this.loadingState = true;
                this.loadTxt = '实名认证提交中...';
                let legalHandCardFile = $("#legalHandCardFile")[0].files[0];
                let legalCardFrontFile = $('#legalCardFrontFile')[0].files[0];
                let legalCardBackFile = $('#legalCardBackFile')[0].files[0];
                let adminCardFrontFile = $('#manageCardFrontFile')[0].files[0];
                let adminCardBackFile = $('#manageCardBackFile')[0].files[0];
                let applyTableFile = $('#applyTableFile')[0].files[0];
                let formData = new FormData(); 
                formData.append('type', type);
                formData.append('legalName', legalName);
                formData.append('legalIdcard', legalIdcard);
                formData.append('adminName', type == 1 ? legalName : adminName);
                formData.append('adminIdcard',type == 1 ? legalIdcard : adminIdcard );
                formData.append('applyTabImg', applyTableFile);
                formData.append('comId', comId);
                formData.append('verifyId', verifyId);
                formData.append('accId', this.$store.state.curAccount.accId);
                formData.append('vCode', type == 1 ? legalCode : adminCode);
                formData.append('payStatus',payStatus)   //YES-已支付   NO -未支付   
                if(type == 1){
                    formData.append('legalPhone',legalPhone);
                    formData.append('legalHandIdcardPhoto',status == -1 ? {} : legalHandCardFile);   //手持身份证
                    this.addLegalY(formData)
                }else{
                    formData.append('legalIdcardFrontPhoto',status == -1 ? {} : legalCardFrontFile); //法定代表人身份证正面
                    formData.append('legalIdcardBackPhoto',status == -1 ? {} : legalCardBackFile);   //法定代表人身份证反面
                    formData.append('adminIdcardFrontPhoto',status == -1 ? {} : adminCardFrontFile); //管理人身份证正面
                    formData.append('adminIdcardBackPhoto',status == -1 ? {} : adminCardBackFile);   //管理人身份证反面
                    formData.append('adminPhone',adminPhone);
                    this.addLegalN(formData)
                }
            },
            async addLegalY(formData){
                let json = await this.REQUEST('POST',this.URL['addLegalY'],formData);
                this.loadingState = false;
                if(json.meta.success){
                    this.$router.push({
                        name:'ComRealStep3'
                    })
                }else{
                    this.modelCommonTip('提交失败');
                }
            },
            async addLegalN(formData){
                let json = await this.REQUEST('POST',this.URL['addLegalN'],formData);
                this.loadingState = false;
                if(json.meta.success){
                    this.$router.push({
                        name:'ComRealStep3'
                    })
                }else{
                    this.modelCommonTip('提交失败')
                }

            },
            //查看大图
            previewSrcHandle(obj){
                this.previewState = true;
                this.previewSrc = obj;
            },
            //获取验证码
            async getCode(num = 1){  //1-法人获取手机验证码  2-管理人获取手机验证码
                if(num == 1){
                    if(!this.sendCodeState) return;
                }else{
                    if(!this.sendCodeState2) return;
                }
                
                const { legalPhone } = this.legal;  
                const { adminPhone } = this.admin;
                //此处验证一下手机号 
                let json = await this.REQUEST('POST',this.URL['sendMsgVcode'],{phone:num == 1 ? legalPhone : adminPhone,accId:''})
                if(json.meta.success){
                    if(num == 1){
                        this.sendCodeState = false;
                        this.ResetCodeTime = 60;
                        this.resetCode(1);
                    }else{
                        this.sendCodeState2 = false;
                        this.ResetCodeTime2 = 60;
                        this.resetCode(2);
                    }
                }else{
                    this.modelCommonTip(json.data.msg)
                }                        
            },
            resetCode(num){                           //验证码倒计时
                if(num == 1){
                    this.ResetCodeTime -- ;
                    if(this.ResetCodeTime <= 0){
                        this.ResetCodeTime = 60;
                        [this.sendCodeTxt,this.sendCodeState] = ['获取验证码',true];
                    }else{
                        this.sendCodeTxt =`重新发送${this.ResetCodeTime}s`;
                        setTimeout(()=>{
                            this.resetCode(1);
                        },1000)
                    }  
                }else{
                    this.ResetCodeTime2 -- ;
                    if(this.ResetCodeTime2 <= 0){
                        this.ResetCodeTime2 = 60;
                        [this.sendCodeTxt2,this.sendCodeState2] = ['获取验证码',true];
                    }else{
                        this.sendCodeTxt2 =`重新发送${this.ResetCodeTime2}s`;
                        setTimeout(()=>{
                            this.resetCode(2);
                        },1000)
                    }  
                }
                              
            },
            //获取第一步骤信息
            async getAuthCompany(){
                let {meta,data} = await this.REQUEST('POST',this.URL['getAuthCompanyStep'],{});
                if(meta.success){
                    if(data.data != 'no'){
                        const { name,blRegNum,blRegImg,bankNo,bankName, subBankName} = data.data.authCompany;
                        this.name = name;
                        this.blRegNum  = blRegNum;
                        // this.blRegImg = blRegImg;
                        this.bankNo = bankNo;
                        this.bankName = bankName;
                        this.subBankName = subBankName;  
                    }
                }else{
                    this.modelCommonTip(meta.msg)
                }
            },
            async getAuthAdministran(){
                let { meta ,data } = await this.REQUEST('POST',this.URL['getAuthAdministran'],{});
                if(meta.success){
                    if(data.data != 'no'){
                        let { 
                            type,legalName,legalIdcard,legalIdcardFrontImg,legalIdcardBackImg,legalPhone,legalHandIdcardImg,
                            adminName,adminIdcard,adminIdcardFrontImg,adminIdcardBackImg,adminPhone,applyTab
                        } = data.data;
                        this.type = type;

                        this.legal={
                            legalName,
                            legalIdcard,
                            legalPhone,                       //法人代表code
                            lcode:''
                        },
                        this.admin={
                            adminName,
                            adminIdcard,
                            adminPhone,
                            acode:''
                        }
                        if(type == 0){
                            this.isLegal = false;
                            this.legalCardFrontSrc = this.apiPath+this.URL['downloadImg']+'?path='+legalIdcardFrontImg
                            this.legalCardBackSrc = this.apiPath+this.URL['downloadImg']+'?path='+legalIdcardBackImg
                            this.manageCardFrontSrc = this.apiPath+this.URL['downloadImg']+'?path='+adminIdcardFrontImg
                            this.manageCardBackSrc = this.apiPath+this.URL['downloadImg']+'?path='+adminIdcardBackImg
                        }else{
                            this.isLegal = true;
                            this.legalHandCardSrc = this.apiPath+this.URL['downloadImg']+'?path='+legalHandIdcardImg
                        }  
                        this.applyTableSrc =  this.apiPath+this.URL['downloadImg']+'?path='+applyTab
                    }
                }else{
                    this.modelCommonTip(meta.msg)
                }
            },
            //获取当前实名认证在哪一步
            async getStep(){
                let json = await this.REQUEST('GET',this.URL['getStep'],{})
                
                
                if(json.meta.success){
                    let { step,verifyId,comId,orderId,status } = json.data.data;
                    this.comId = comId;
                    this.status = status;
                    // step = 'step1_add'  //测试
                    if(step == 'step0_start'){   //第一步未提交
                        this.$router.push({
                            name:'ComRealStep1',
                            // query:{
                            //     verifyId
                            // }
                        })
                    }else if(step == 'step2_perfect' || step == 'step3_payment'){   //已经完善，已经支付到第三部
                        this.$router.push({
                            name:'ComRealStep3'
                        })
                    }else if(step == 'step1_add'){
                        this.getAuthCompany();
                        this.getAuthAdministran();
                    }
                }
                setTimeout(()=>{
                    this.requestState = true;
                },300)
            },
            init(){
                this.getStep();
                this.clickFileFn("legalHandCard","legalHandCardFile",'legalHandCardSrc');
                this.clickFileFn("applyTable","applyTableFile",'applyTableSrc');
                this.clickFileFn("legalCardFront","legalCardFrontFile",'legalCardFrontSrc');
                this.clickFileFn("legalCardBack","legalCardBackFile",'legalCardBackSrc');
                this.clickFileFn("manageCardFront","manageCardFrontFile",'manageCardFrontSrc');
                this.clickFileFn("manageCardBack","manageCardBackFile",'manageCardBackSrc');
            }
        },
        mounted(){
            this.verifyId = this.$route.query.verifyId;
            
            let Timer = setInterval(()=>{
                if(this.userState != null){
                    clearInterval(Timer);
                    if(this.userState ==  1){
                        this.$router.push({
                            name:'Index'
                        })
                    }else{
                        this.init();
                    }
                }
            },30)  
        }
    }
</script>
