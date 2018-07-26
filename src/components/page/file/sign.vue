<template>
    <section class="sign contain">
        <nav @click="backHandle"><i class="iconfont icon-back"></i>返回</nav>
        <div class="signBox box">
            <div class="sideLeft" id="dragBox" v-if="prePositionList.length == 0 && this.iframeDom">
                <!-- <h3 @click="selectHandle">
                    <span class="iconfont icon-ukey"></span>
                    {{selectListIndex != null ? selectListStamp[selectListIndex].ownerInfo : '选择签章证书'}}
                    <i class="iconfont icon-down_one"></i>
                </h3> -->
                <div class="selectBox" v-show="selectState" >
                    <ul>
                        <li @click.stop="filterStamp('all',null)" class="shengl">全部</li>
                        <li @click.stop="filterStamp(item,index)" class="shengl" :title='item.ownerInfo ? item.ownerInfo : "no"+index+":证书信息有误"' v-for="(item,index) in selectListStamp" :key="index">
                            {{item.ownerInfo ? item.ownerInfo : "no"+index+":证书信息有误"}}
                        </li>
                    </ul>
                </div>
                <div class="tip">鼠标点击签章大图，把签章放到文档任意位置即可</div>
                <div class="preview" id="preview">
                    <img @click="createSeal(selectSrc,selectSrc.stampImg ? 'delegate':'nodelegate')"  v-if="selectSrc" :src="selectSrc.base64_data ? 'data:image/png;base64,'+selectSrc.base64_data : 'data:image/png;base64,'+selectSrc.stampImg" alt="">
                </div>
                <div class="sealList">
                    <ul class="clf">
                        <li v-if="accountType" v-for="(item,index) in delegateSeal" :class="[selectDelegateIndex == index ? 'active':'']" :key="index" @mouseenter="selectSealHandle(item,index,'delegate')" @click="createSeal(item,'delegate')">
                            <img :src="'data:image/png;base64,'+item.stampImg" alt="">      
                        </li>
                        <li v-if="!perPositionHasOwn && !accountType" :class="[selectIndex == index ? 'active':'']" @mouseenter="selectSealHandle(item,index)" @click="createSeal(item,'nodelegate')" v-for="(item,index) in sealListSmall" :key="index">
                            <img :src="'data:image/png;base64,'+item.base64_data" alt="">                            
                        </li>
                    </ul>
                </div>
                <!-- <div class="sealPageList sign_page_scrollBody">
                    <ul>
                        <li @click="goPage(item.pageNum)" v-for="(item,index) in sealPageList" :key="index">
                            <span><img :src="item.src" /></span>    
                            <span>第{{item.pageNum}}页</span>        
                            <i @click.stop="deleteSeal(item)" class="iconfont icon-del-solid"></i>            
                        </li>
                    </ul>
                </div> -->                
            </div>
            <div class="sideRight" id="sideRight">
                <iframe id="if"    :src='"/static/pdf/web/viewer.html?file="+apiPath+URL["viewDocument"]+"/"+docId+".pdf"' width="100%" height="800px" scrolling="no">
                    您的浏览器不支持框架
                </iframe>   
                <a href="javascript:;" v-show="signStatus" id="signBtn" @click="beforeSign">签署</a>            
            </div>
        </div>
        <div class="signGuild" v-show="guide.state" @click="guideHandle">
            <div class="contain box">
                <div class="sideLeft">
                    <div v-show="guide.num == 1"><img class="guide_1" src="../../../assets/images/sign_guild_1.png" alt=""></div>
                    <div v-show="guide.num == 2"><img class="guide_2" src="../../../assets/images/sign_guild_2.png" alt=""></div>
                </div>
                <div class="sideRight">
                    <div class="guide_2" v-show="guide.num == 2"></div>
                    <div v-show="guide.num == 3">
                        <img class="guide_3" src="../../../assets/images/sign_guild_3.png" alt="">
                    </div>
                </div>
            </div>
        </div>
        <!-- 提示框 -->
        <alertModel :type="1" :context="alertTxt" v-show="alertState" @cancelHandle="cancelHandle"></alertModel>  
        <!-- 清楚页面签章弹框 -->
        <alertModel v-show="tipState" :type="2" context="是否要清楚页面上的所有签章" @cancelHandle="tipState = false" @sureHandle="clearPageStamp"></alertModel>
        <!-- pin码弹框 -->
        <alertModel class="pinDialog" v-show="pin.state" :type="2" style="z-index:99;"  title="pin码输入框" @cancelHandle="calcelSign">
            <div slot="alert-content">
                <input type="password" v-model="pin.val" placeholder="请输入pin码" @keyup.enter="submitSign" autocomplete="off">
                <p class="warn">{{pin.tip}}</p>
            </div>
            <div slot="alert-footer">
                <a href="javascript:;" class="cancel-btn"  @click="calcelSign">取消</a>
                <a href="javascript:;" class="sure-btn" @click="submitSign" >{{pin.sureBtnTxt}}</a>
            </div>
        </alertModel>
        <!-- 真宜签二维码弹框 -->
        <alertModel class="ewmCover" v-show="ewm.state" :type="2" >
            <h3 slot="alert-header">请用真宜签app扫描二维码完成签署</h3>
            <div slot="alert-content">
                <!-- <img v-if="ewm.src" :src="'data:image/png;base64,'+ewm.src" alt=""> -->
                <div class="ewmBox">
                    <img src="../../../assets/images/erweima.png" alt="">
                    <div class="refush" v-show="ewm.refush">
                        <a href="javascript:;" class="iconfont icon-i-refresh">刷新</a>
                        <p v-html="ewm.tip"></p>
                    </div>
                </div>
            </div>
            <div slot="alert-footer">
                <a class="sweet-btn" @click="canceSign">取消</a>
            </div>
        </alertModel>
        <alertModel v-show="hasAppoint && (this.delegateSeal.length > 0 || this.sealListSmall.length > 0)" title="提示" :context="`您有${prePositionList.length}处指定位置需要签署`" :type="2" @cancelHandle="hasAppoint = false;">
            <div slot="alert-footer">
                <a class="go-btn" @click="goSign">开始签署</a>
            </div>
        </alertModel>
        <alertModel  title="请选择签章" v-show="stampListState" :footerStatus="false" :type="2" @cancelHandle="stampListState = false;currentClickSeal = ''">
            <div slot="alert-content" class="stampListBox sign_page_scroll">
                <ul v-if="accountType">
                    <li v-for="(item,index) in delegateSeal" :class="[stampListSelectIndex == index ? 'active':'']" :key="index" @click="selectSealSignHandle(item,index)" >
                        <img :src="'data:image/png;base64,'+item.stampImg" alt="">      
                    </li>
                </ul>
                <ul v-else>
                    <li v-for="(item,index) in sealListSmall" :class="[stampListSelectIndex == index ? 'active':'']" :key="index" @click="selectSealSignHandle(item,index)" >
                        <img :src="'data:image/png;base64,'+item.base64_data" alt="">      
                    </li>
                </ul>
            </div>
        </alertModel>  
        
        <pinCom style="z-index:99;" v-if="delegateSeal.length == 0"  @pinSureHandle="issueHandle" @pinCancelHandle="$router.push({name:'ManaFile'})" ></pinCom>
        <Loading v-show="loadingStatus" text="处理中，请稍后" style="z-index:100;"></Loading>
    </section>
</template>
<script>
    //seal
    const stampCert = require("@/assets/js/seal/stampCert.js").default;
    //gdca
    import '@/assets/js/GDCAPKI/jquery.jsonp.js'; 
    const Base64String = require("@/assets/js/GDCAPKI/base64.js").default;
    import '@/assets/js/GDCAPKI/gdca-pki-errcode.js'; 
    const $GDCA = require('@/assets/js/GDCAPKI/gdca-pki-lib.js').default;     
    const gMethod = require('@/assets/js/GDCAPKI/gdca_sof_method.js');
    import SIGN from '@/assets/js/sign.js';

    import pinCom from '@/components/common/setPin/setPin';
    export default{
        name:'sign',
        data(){
            return {
                
                guide:{
                    state:false,
                    num:1
                },
                ...SIGN.signData,     //pdf数据集合                    

                docId:null, 
                conLockInterval:null,          //续锁定时器
                intervalConLockDelay:30*1000,  //30秒刷一次合同锁，合同锁为2分钟
                stampType:null,                //签章类型
                keyType:null,                  //签章的keyType
                alertState:false,              //弹框状态
                alertTxt:'',
                alertGoIndex:1,                //1关闭弹框，2到达sign页面 3,未登录 4，到签章页面 5,到达详情页面
                tipState:false,
                loadingStatus:false,
                ddata:null,                    //用户证书
                pin:{                          //pin码弹框
                    state:false,
                    val:'',
                    tip:'',
                    sureBtnTxt:'确定',
                },                 
                submitData:{
                    docHash:null,
                    signedHash:null,
                    sessionId:null
                },
                ewm:{
                    state:false,
                    src:null,
                    Timer:null,
                    tip:null,
                    refush:false,
                },
                delegateSeal:[],        //托管印章
                delegateCertInfo:null,  //托管证书

                hasAppoint:false,      //有无指定位置签署弹框状态
                prePositionList:[],     //指定位置数组
                perPositionHasOwn:false,   //指定位置包不包含自己
                stampListState:false,       //印章列表弹框
                stampListSelectIndex:null,
                currentClickSeal:null,      //当前点击的签名框
                signCancle:true,            //签署文档过程中不允许取消或关闭签署弹框
                signStatus:true,           //是否可以签署
            }
        },
        components:{
            pinCom
        },
        computed:{
            userState(){
                return this.$store.state.userState;
            }
        },
        methods:{
            calcelSign(){
                if(this.signCancle){
                    this.pin.state = false,this.pin.val = '';this.loadingStatus=false;this.pin.sureBtnTxt='确定';
                }
            },
            //pdf函数集合
            ...SIGN.signMethod,
            issueHandle(){
                let Timer = setInterval(()=>{
                    this.loadingStatus = true;
                    let upLoadFileState = this.$store.state.upLoadFileState;
                    if(upLoadFileState){
                        clearInterval(Timer);
                        this.loadingStatus = false;
                        this.$store.commit('changeUpLoadFileState',0)
                        if(upLoadFileState == 1){                            
                            this.$store.commit('changePinState',false)  
                            this.getAllStamp();
                        }else if(upLoadFileState == 2){  //失败
                            this.$store.commit('changePinState',true) 
                        }
                    }
                },60)
            },
            //点击弹框开始签署
            goSign(){
                let SEALIMG = $(this.seal).find('.sealImg')[0]
                let ScrollTop = SEALIMG.offsetTop + Number($(SEALIMG).attr('pagenum')-1)*this.PDFHH-150;
                $(this.viewerContain).scrollTop(ScrollTop);  
                console.log(this.delegateSeal.length)
                let signList = this.accountType ? this.delegateSeal : this.sealListSmall;  //印章个数
                if(signList.length > 1){   //签章多个  需要判断签署域有多少个-如果是一个，弹出印章选择框选择   如果是多个，关闭提示框，用户自行选择签署
                    if(this.prePositionList.length == 1 ){   //一个位置
                        this.stampListState = true;
                        this.currentClickSeal = $(this.seal).find('.sealImg');
                    }
                    if(this.prePositionList.length > 1 && !this.accountType){
                        this.stampListState = true;
                    }

                    console.log("签章多个");
                }else{   //签章只有一个
                    Array.from($(this.seal).find('.sealImg')).forEach(item=>{
                        console.log(item)
                        $(item).click();
                    })
                }
               
                this.hasAppoint = false;
            },
            //印章弹框列表印章点击
            selectSealSignHandle(item,index){
                this.selectSrc = item;
                this.stampListSelectIndex = index;
                if(this.accountType == 1){
                    this.currentClickSeal.click();
                }else{
                    Array.from($(this.seal).find('.sealImg')).forEach(item=>{
                        $(item).click();
                    })
                }
                this.COUNT = 1;
            },
            //取消扫码签
            canceSign(){
                clearInterval(this.ewm.Timer);
                [this.ewm.state,this.ewm.refush,this.ewm.Timer,this.ewm.src,this.ewm.tip] = [false,false,null,null,null];                
            },
            //获取二维码
            encodeQrCode(){
                this.ajaxPost(this.URL['ajaxGetSignQrCode'],{docId:this.docId},json=>{
                    this.loadingStatus = false;
                    if(json.meta.success){
                        this.ewm.src = json.data.qrData;
                        this.ewm.state = true;                        
                        this.ewm.Timer = setInterval(()=>{
                            this.checkQrStatus();
                        },1000)
                    }else{
                        this.modelCommonTip(json.meta.message);
                    }
                })
            },
            //获取扫码签署状态
            checkQrStatus(){
                this.ajaxPost(this.URL['checkQrStatus'],{
                    docId:this.docId
                },json=>{
                    if(json.meta.success){
                        let {result} = json.data;
                        if(result == 'waiting'){

                        }else if(result == 'signed'){
                            this.signDoc();
                            clearInterval(this.ewm.Timer);
                            [this.ewm.refush,this.ewm.tip] = [true,'签署中...请稍后'];
                        }else if(result == 'cancel'){  //已取消签署
                            clearInterval(this.ewm.Timer);
                            [this.ewm.refush,this.ewm.tip] = [true,'已取消签署'];
                        }else if(result == 'timeout'){ //二维码已过期，请刷新重试
                            clearInterval(this.ewm.Timer);
                            [this.ewm.refush,this.ewm.tip] = [true,'二维码已过期<br/>请刷新二维码重试'];
                        }else if(result == 'error'){   //系统异常，请重试
                            clearInterval(this.ewm.Timer);
                            [this.ewm.refush,this.ewm.tip] = [true,'系统异常<br/>请刷新二维码重试'];
                        }else if(result == 'fail'){    //证书验签失败
                            clearInterval(this.ewm.Timer);
                            [this.ewm.refush,this.ewm.tip] = [true,'证书验签失败'];
                        }else{
                            clearInterval(this.ewm.Timer);
                            [this.ewm.refush,this.ewm.tip] = [true,'系统异常<br/>请刷新重试'];
                            //系统异常，请重试
                        }
                    }else{
                        this.modelCommonTip(json.meta.message);
                        clearInterval(this.ewm.Timer);
                    }
                })
            },
            //签署之前验证是否插入了UKEY证书
            beforeSign(){
                var This = this;               
                let arrEle = $(this.seal).find('.sealImg');                
                if(arrEle.length == 0){
                    this.alertState = true;
                    this.alertTxt = '请选择签章到文档任意位置签署';
                    this.alertGoIndex = 1;
                    return;
                }else{
                    if(this.prePositionList.length > 0){  //有指定位置的签署
                        let Bol = Array.from(arrEle).every(item=>{
                            return $(item).find('img').length == 1 ? true : false;
                        })
                        if(!Bol){
                            this.alertState = true;
                            this.alertTxt = '缺少指定位置签署的签章';
                            this.alertGoIndex = 1;
                            return;
                        }
                    }
                }
                // this.loadingStatus = true;
                this.keyType = this.selectSrc.keyType;
                if(this.selectSrc.TYPE == 'delegate'){  //托管证书签署
                    this.pin.state = true;
                    // this.delegateSignDoc();
                }/*else if(this.stampType == '1'){        //获取真宜签二维码
                    this.encodeQrCode();
                }*/else if(this.keyType == '002'){  //002-PFX
                    this.loadingStatus = true;
                    this.signDoc();          
                }else if(this.keyType == '003'){  //003-托管证书
                    this.loadingStatus = true;
                    this.signDoc();
                }else{                        //001-UKEY
                    this.pin.state = true;
                }
                
            },  
            //pin码弹框确定按钮签署
            submitSign(){  
                if(this.pin.sureBtnTxt != '确定') return;              
                const {signedHash,docHash,sessionId} = this.submitData;
                const {keyType,TYPE} = this.selectSrc;
                if(TYPE == 'delegate'){
                    if(this.pin.val == ''){
                        this.modelCommonTip('pin码不能为空'); 
                        return;
                    }
                        //登录UKEY                    
                    this.pin.sureBtnTxt = '提交中...';
                    this.loadingStatus = true;
                    this.delegateSignDoc();
                }else{   //非托管
                    if(this.pin.val == ''){
                        this.modelCommonTip('pin码不能为空'); 
                        return;
                    }
                    this.loadingStatus = true;
                    gMethod.checkReadUserList(this,res=>{        
                        this.ddata = res;
                        this.signDoc();                
                    }, err=> {
                        this.loadingStatus = false;
                        this.alertTxt = '获取U-KEY失败，请确认是否插入U-KEY或安装客户端';
                        this.pin.val = '';
                        this.pin.state = false;
                        this.alertState = true;
                        this.alertGoIndex = 1;                    
                    });
                    
                }
            },
            //托管签署
            async delegateSignDoc(){
                let arrEle = $(this.seal).find('.sealImg');
                let pdfSignInfoBodyList = [];
                for(let i = 0 ; i < arrEle.length ; i++){
                    let P = Number(arrEle.eq(i).attr('pagenum'));
                    let W = parseInt(arrEle.eq(i).css('width'));
                    let H = parseInt(arrEle.eq(i).css('height'));
                    let T = parseInt(arrEle.eq(i).css('top'));
                    let L = parseInt(arrEle.eq(i).css('left'));

                    pdfSignInfoBodyList.push({
                        stampId:arrEle.eq(i).attr('data-stampId'),
                        orgId:arrEle.eq(i).attr('data-orgId') == 'undefined' ? '' : arrEle.eq(i).attr('data-orgId'),
                        userId:this.$store.state.curAccount.accNo ,
                        signPin:this.pin.val,
                        type:arrEle.eq(i).attr('data-orgId') == 'undefined' ? 0 : 1,
                        signatureFieldInfoList:[{
                            "pageNum":P,
                            "x":this.allArithmetic('divi',L,this.PDFW).toFixed(4),
                            "y":this.allArithmetic('divi',T,this.PDFHH).toFixed(4),
                            "w":this.allArithmetic('divi',W,this.PDFW).toFixed(4),
                            "h":this.allArithmetic('divi',H,this.PDFHH).toFixed(4),
                            "xPadding":0,
                            "yPadding":1
                        }]
                    })
                }
                this.signCancle = false;
                let json = await this.REQUEST('POST',this.URL['delegateSignDoc'],{
                    docId:this.docId,
                    pdfSignInfoBodyList
                })
                this.pin.sureBtnTxt = "确定";
                this.signCancle = true;
                if(json.code == '001'){
                    this.pin.state = false;
                    this.$router.push({
                        name:'Detail',
                        params:{
                            docId:this.docId
                        }
                    })
                }else if(json.code == '003'){
                    this.modelCommonTip(json.msg);
                }else{                    
                    this.modelCommonTip(json.msg);
                }
            },
            //签署
            signDoc(){
                let arrEle = $(this.seal).find('.sealImg');
                let positionList = [];
                // let scale = this.allArithmetic('divi',this.PDFW,this.originW);
                for(let i = 0 ; i < arrEle.length ; i++){
                    let P = arrEle.eq(i).attr('pagenum');
                    let W = parseInt(arrEle.eq(i).css('width'));
                    let H = parseInt(arrEle.eq(i).css('height'));
                    let T = parseInt(arrEle.eq(i).css('top'));
                    let L = parseInt(arrEle.eq(i).css('left'));
                    positionList.push({
                        "pageNum":P,
                        "x":this.allArithmetic('divi',L,this.PDFW).toFixed(4),
                        "y":this.allArithmetic('divi',T,this.PDFHH).toFixed(4),
                        "w":this.allArithmetic('divi',W,this.PDFW).toFixed(4),
                        "h":this.allArithmetic('divi',H,this.PDFHH).toFixed(4),
                        "xPadding":0,
                        "yPadding":1
                    })
                }
                let signSubmitData = {
                    docId:this.docId,
                    stampImgBase64Str:this.selectSrc.base64_data ? this.selectSrc.base64_data : this.selectSrc.stampImg,
                    certId:this.selectSrc.certCode ? this.selectSrc.certCode : this.delegateCertInfo.certNo,
                    stampId:this.selectSrc.stampId,
                    positionList:positionList,
                }
                if(this.selectSrc.depositId){  //托管签署
                    // this.detelateGetDocHash(signSubmitData);
                }else if(this.keyType == '003' ){  //托管证书h或者托管在网管密码机。 <!--this.stampType == '1'-->
                    this.depositSignDoc(signSubmitData);
                }else if(this.keyType == '002'){                     //PFX
                    this.pfxSignDoc(signSubmitData);
                }else{                                               //UKEY
                    this.getDocHash(signSubmitData)
                }                
            },
            //PFX签署接口
            pfxSignDoc(signSubmitData){
                this.ajaxPost(this.URL['pfxSignDoc'],{...signSubmitData},json=>{
                    const {getHashResult} = JSON.parse(json);
                    this.loadingStatus = false;
                    if(getHashResult == '001'){
                        [this.alertState,this.alertTxt,this.alertGoIndex] = [true,'签署成功',5];
                    }else{
                        this.signError(getHashResult);
                    }
                })
            },
            //托管证书托管在网管密码机。
            depositSignDoc(signSubmitData){
                this.httpPost(this.URL['depositSignDoc'],{
                    ...signSubmitData                    
                },json=>{
                    const {getHashResult} = json;
                    this.loadingStatus = false;
                    if(getHashResult == '001'){
                        [this.alertState,this.alertTxt,this.alertGoIndex] = [true,'签署成功',5];
                    }else{
                        this.signError(getHashResult);
                    }
                })
            },
            //ukey证书签署获取hash值
            getDocHash(signSubmitData){
                let This = this;
                $GDCA.exportUserCert(this.ddata,(usercert)=>{
                    let certBase64Str = usercert;
                    stampCert.pageGetCertInfo(()=> {
                        let data = {
                            ...signSubmitData,
                            certBase64Str
                        }  
                        This.httpPost(this.URL['getDocHashV2'],data,json=>{
                            const {getHashResult,certId,hashValue,sessionId} = json;
                            if(getHashResult == '001'){
                                if(this.selectSrc.certCode != certId){
                                    [this.alertState,this.alertTxt,this.alertGoIndex] = [true,'UKEY与签章不对应',1];
                                    this.loadingStatus = false;
                                    return;
                                }
                                this.submitData = {certId,docHash:hashValue,sessionId}
                                // this.pin.state = true;

                                gMethod.checkLoginKey(this, this.pin.val, res=>{
                                    $GDCA.setSignMethod(16,res=> {
                                        $GDCA.signData(this.ddata,hashValue,res=>{
                                            this.innerSignDocFunc(res);
                                        },err=>{
                                            this.signCancle = true;
                                            this.loadingStatus = false;
                                            [this.alertState,this.alertTxt,this.alertGoIndex,this.pin.sureBtnTxt,this.pin.val] = [true,'对数据签名失败',1,"确定",''];                                
                                        });
                                    },err=> {
                                        this.loadingStatus = false;
                                        this.signCancle = true;
                                        [this.alertState,this.alertTxt,this.alertGoIndex,this.pin.sureBtnTxt,this.pin.val] = [true,'设置签名方法失败',1,'确定',''];
                                    });
                                },restTime=>{
                                    [this.pin.sureBtnTxt,this.pin.val] = ["确定",''];
                                    if(restTime > 0){
                                        this.loadingStatus = false;
                                        this.signCancle = true;
                                        this.pin.tip = `PIN码错误，请重试（您还剩${restTime}次机会）`;
                                    }else{
                                        this.signCancle = true;
                                        this.loadingStatus = false;
                                        this.pin.tip = `已超过最大尝试次数，请联系客户服务<br/>（020-95105813）重置密码。`
                                    }
                                });
                                
                                
                            }else{
                                this.signCancle = true;
                                this.signError(getHashResult);
                                this.loadingStatus = false;
                            }
                        })
                    });
                },function(err){
                    [This.alertState,This.alertTxt,This.alertGoIndex,This.loadingStatus]=[true,"获取UKEY数据失败",1,false]
                });
            },            
            //签署  输入pin码的最后签署
            innerSignDocFunc(signValue){
                const {docHash,sessionId,certId} = this.submitData;
                const {stampId} = this.selectSrc;
                // const {stampId,certCode:certId} = this.selectSrc;
                this.signCancle = false;
                this.ajaxPost(this.URL['signDoc'],{
                    docId:this.docId,
                    docHash,
                    signValue,
                    sessionId,
                    stampId,
                    certId
                },json=>{
                    this.signCancle = true;
                    this.pin.state = false;
                    this.loadingStatus = false;
                    const {getHashResult} = JSON.parse(json);
                    if(getHashResult == '001'){
                        [this.alertState,this.alertTxt,this.alertGoIndex] = [true,'签署成功',5];
                        clearInterval(this.conLockInterval);
                    }else{ 
                        this.signError(getHashResult);
                    }                                                                         
                })
            },
            signError(getHashResult){
                let alertTxt = '';
                if(getHashResult == '002'){
                    alertTxt = '签署失败，服务器忙，或文档有问题';
                }else if(getHashResult == '003'){
                    alertTxt = '签章没有授权';
                }else if(getHashResult == '004'){
                    alertTxt = '签署条件不符合（未轮到签署或不是签署人，或文档已过期）'
                }else if(getHashResult == '006'){
                    alertTxt = '其他人正在签署';
                }else if(getHashResult == '008'){
                    alertTxt = '真宜签用户正在签署';
                }else if(getHashResult == '009'){
                    alertTxt = '文档版本不一致，请重新刷新页面';
                }else if(getHashResult == '007'){
                    alertTxt = '证书已被吊销';
                }else{
                    alertTxt = '服务器忙，请稍后重试';
                }
                [this.alertState,this.alertTxt,this.alertGoIndex,this.pin.sureBtnTxt] = [true,alertTxt,1,"确定"];
                setTimeout(()=>{
                    this.cancelHandle();
                },2000)
            },
            //判断有无资格签署
            toSignDocV2(){
                this.httpGet(this.URL['toSignDocV2'],{
                    docId:this.docId
                },({meta,data})=>{
                    if(meta.success){
                        if(data == 'TO_SIGN'){
                            this.intervalSignLock();
                            this.conLockInterval = setInterval(()=>{
                                this.intervalSignLock();
                            },this.intervalConLockDelay)
                        }else{
                            //1关闭弹框，2到达文档页面 3,未登录 4，到签章页面 5,到达详情页面
                            let obj = {
                                'TO_LOGIN':['您未登录，请重新登录',3],
                                'NO_RIGHT':['对不起，您没有签署该文档的权限',5],
                                'NO_TURN':['还未轮到你签署，稍等一下再回来签署吧',5],
                                'TO_VIEW':['抱歉，您只有查看的权限',5],
                                'OVERDUE':['文档已过期',5],
                                'ERROR_URL':['非法地址',2]
                            }
                            [this.alertState,this.alertTxt,this.alertGoIndex] = [true,obj[data][0],obj[data][1]]
                        }
                    }
                })
            }, 
            //获取此账户下面的所有托管印章
            getAllStamp(){
                let arr = [                                
                    this.REQUEST('GET',this.URL['personSeal'],{type:0,acceptStatus:0},true),
                    this.REQUEST('GET',this.URL['personSeal'],{type:1,acceptStatus:1},true),
                ];
                Promise.all(arr).then(res=>{
                    //res[0] 托管证书
                    let perCert = res[0].data.data.stampCertList.certInfo;
                    let perStamp = res[0].data.data.stampCertList.stampList;
                    perStamp.forEach(item => {
                        item.certInfo = perCert;
                        item.TYPE="delegate";
                    });
                    if(!perCert){   //不存在托管证书 先发托管证书
                        this.$store.commit("changePinState",true);
                        this.$store.commit("changePinIndex",1);    
                        return;
                    }else{
                        this.prepositionQuery();
                    }
                    //res[1] 机构证书
                    let organization = res[1].data.data.stampCertList;   //array
                    organization.forEach(item=>{
                        let cert = item.certInfo;
                        let orgId = item.orgId;

                        item.stampList.forEach(item2 =>{
                            item2.certInfo = cert;
                            item2.TYPE = "delegate",
                            item2.orgId = orgId
                        })
                    })
                    let organizationArr = []; 
                    organization.forEach(item=>{
                        item.stampList.forEach(item2=>{
                            organizationArr.push(item2)
                        })
                    })
                    this.delegateSeal = [...perStamp,...organizationArr];
                    this.selectSrc = this.delegateSeal[0];
                    this.selectDelegateIndex = 0;
                    /*if(this.sealListSmall.length == 0){
                        this.selectSrc = this.delegateSeal[0];
                        this.selectDelegateIndex = 0;
                    }*/
                    if(this.delegateSeal.length == 0 && this.CURACCOUNT.depositStatus){
                        this.$store.commit('changeDialog',{state:true,options:{title:'温馨提示',text:`您还没有签章，是否去添加签章`}})
                        this.dialogConfirm.confirm().then(() => {
                            this.$store.commit('changeDialog',{state:false,options:{}});
                            this.$router.push({
                                name:'ComSeal'
                            })
                        }).catch(() => {
                            this.$store.commit('changeDialog',{state:false,options:{}})                            
                        }) 
                    }
                })
            },
            //判断有无位置
            async prepositionQuery(){
                let This = this;
                let json = await this.REQUEST('GET',this.URL['prepositionQuery'],{
                    docId:this.docId
                })
                if(json.meta.success){
                    this.prePositionList = json.data.data ? json.data.data.prePositionList.filter(item=>item.accNo == this.CURACCOUNT.accId) : [];  //筛选自己的位置
                    if(this.prePositionList.length > 0){  //指定位置包含自己 
                        this.perPositionHasOwn = true;                        
                    }
                    let Timer = setInterval(()=>{
                        let pdfRender = This.$store.state.pdfRender;
                        if(pdfRender){
                            this.$store.commit('changePdfRender',false);
                            clearInterval(Timer);
                            This.init(2); 
                        }
                    },60)

                }else{
                    this.modelCommonTip(json.meta.msg)
                }
            },
            iframeAjax(){
                let This = this;
                let iframe = document.getElementById('if');
                this.iframeDom = iframe.contentWindow;         //获取iframe对象
                iframe.onload = iframe.onreadystatechange = function() {
                    if (this.readyState && this.readyState != 'complete') return;
                    else {
                        if(!This.viewer){
                            This.viewer = This.iframeDom.document.getElementById('viewer');
                            This.seal = This.iframeDom.document.getElementById('seal');                            
                        }
                        This.viewerContain =  This.iframeDom.document.getElementById('viewerContainer');     //获取viewer容器对象
                        This.outerContainer = This.iframeDom.document.getElementById('outerContainer');
                        This.sidebarContent = This.iframeDom.document.getElementById('sidebarContent');
                        $(This.seal).on('mousedown','.sealitem',function(){   //获取当前页数
                            This.sign.pageNumber = $(this).attr('data-page-number');
                        })
                        This.init();  
                    }
                }
            }
        },
        mounted(){
            this.docId = this.$route.params.docId;    
            this.sealPageList = [];  //进入页面前
            let This = this;
            
            // This.prepositionQuery();   //有无指定位置签署
            this.ajaxGetSignStamps();
            this.iframeAjax();
            
        }
    }
</script>
<style scoped lang="scss">
@import '../../../assets/css/sign.scss';
</style>

