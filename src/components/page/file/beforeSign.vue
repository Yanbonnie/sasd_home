<template>
    <section class="sign contain">
        <nav @click="backHandle"><i class="iconfont icon-back"></i>返回</nav>
        <div class="signBox box">
            <div class="sideLeft" id="dragBox">
                <div v-if="canSign">
                    <h3 @click="selectHandle">
                        <span class="iconfont icon-ukey"></span>
                        {{selectListIndex != null ? selectListStamp[selectListIndex].ownerInfo : '选择签章证书'}}
                        <i class="iconfont icon-down_one"></i>
                    </h3>
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
                        <img v-if="selectSrc" @click="createSeal(selectSrc,selectSrc.stampImg ? 'delegate':'nodelegate')" :src="selectSrc.base64_data ? 'data:image/png;base64,'+selectSrc.base64_data : 'data:image/png;base64,'+selectSrc.stampImg" alt="">
                    </div>
                    <div class="sealList">
                        <ul class="clf">
                            <li v-if="accountType" v-for="(item,index) in delegateSeal" :class="[selectDelegateIndex == index ? 'active':'']" :key="index" @click="createSeal(item,'delegate')" @mouseenter="selectSealHandle(item,index,'delegate')" >
                                <img :src="'data:image/png;base64,'+item.stampImg" alt="">      
                            </li>
                            <li v-if="!accountType" :class="[selectIndex == index ? 'active':'']" @mouseenter="selectSealHandle(item,index)"   @click="createSeal(item,'nodelegate')" v-for="(item,index) in sealListSmall" :key="index">
                                <img :src="'data:image/png;base64,'+item.base64_data" alt="">                            
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="appointBox" v-if="selectSignors.length > 0 && appointState" >
                    <h3>指定位置签署</h3>
                    <div class="signers">选择签署方 
                        <span class="iconfont icon-help">
                            <span class="warnTip">点击签署印章生成签名框，移动到文档指定位置即可</span>
                        </span>
                        
                    </div>
                    <p class="selected" @click="selectSign = true;">{{selectSignors[singerIndex].name}} <i class="iconfont icon-back"></i></p>
                    <ul class="sign_page_scroll" v-show="selectSign">
                        <li v-for="(item,index) in selectSignors" :key="index" @click="singerIndex = index; selectSign = false;">{{item.name}}</li>
                    </ul>
                    <div class="signOppoint" title="点击生成签名框" @click="createSquare">
                        <i class="iconfont icon-edit"></i>
                        指定签章位置 (0)
                    </div>
                    
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
                <a v-if="this.canSign && signStatus" href="javascript:;" id="signBtn" @click="beforeSign">签署</a>            
                <a v-if="!this.canSign && signStatus" href="javascript:;" id="signBtn"  @click="beforeSign">发起</a>            
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
        <alertModel class="pinDialog" v-show="pin.state" :type="2" style="z-index:99" title="pin码输入框"@cancelHandle="calcelSign">
            <div slot="alert-content">
                <input type="password" v-model="pin.val" placeholder="请输入pin码" @keyup.enter="submitSign" autocomplete="off">
                <p class="warn">{{pin.tip}}</p>
            </div>
            <div slot="alert-footer">
                <a href="javascript:;" class="cancel-btn"   @click="calcelSign">取消</a>
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
    import SIGN from '@/assets/js/beforeSign.js';
    export default{
        name:'sign',
        data(){
            return {
                guide:{
                    state:false,
                    num:1
                },
                ...SIGN.signData,     //pdf数据集合    
                
                signData:null,        //签署提交的数据   
                selectSignors:[],     //选中的签署人
                orderType:'',         //001任意签  002顺序签
                hasOwn:false,         //false  不包含自己   true包含自己
                isFirst:false,        //false  不是第一个签   true第一个签
                canSign:false,        //是否可以签署    true 先签后发起  直接发起
                selectSign:false,     //签署人列表状态
                singerIndex:0,        //签署人列表选中下标
                appointState:false,   //是否指定位置签署

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
                signCancle:true,            //签署文档过程中不允许取消或关闭签署弹框
                signStatus:true,            //可不可以签署
            }
        },
        computed:{
            userState(){
                return this.$store.state.userState;
            }
        },
        methods:{
            //pdf函数集合
            ...SIGN.signMethod,
            //取消扫码签
            canceSign(){
                clearInterval(this.ewm.Timer);
                [this.ewm.state,this.ewm.refush,this.ewm.Timer,this.ewm.src,this.ewm.tip] = [false,false,null,null,null];                
            },
            calcelSign(){
                if(this.signCancle){
                    this.pin.state = false,this.pin.val = '';this.loadingStatus=false;this.pin.sureBtnTxt='确定';
                }
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
            //签署之前验证
            beforeSign(){
                let arrSign = $(this.seal).find('.sealSign');    
                if(this.canSign && this.appointState){
                    if(arrSign.length == 0){
                        this.alertState = true;
                        this.alertTxt = '请点击签章并放置于文档任意位置';
                        this.alertGoIndex = 1;
                        return;
                    }
                }         
                let arrEle = $(this.seal).find('.sealImg2') || [];
                if(arrEle.length == 0 && this.signData.signOrders.split(',').length > 1 &&this.appointState){
                     this.modelCommonTip("请放置指定位置签名框",2500);
                     return;
                }

                let arrSignAcc = Array.from(arrEle).map(item=>{
                    return $(item).attr('data-accno');
                })
                if(Array.from(new Set(arrSignAcc)).length != this.selectSignors.length && this.appointState ){
                    this.modelCommonTip("您还缺少签名框，请核对");
                    return;
                }

                if(this.canSign){ //自己要签署  （顺序签，签署人包含自己，且自己排第一）
                    this.pin.state = true;                  
                }else{  //自己不需要签署  指定位置 -> 发起文档
                    this.prepositionSave('nosign');
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
                    if(this.appointState){   //指定位置签署    传位置 ->发起文档 ->签署
                        this.prepositionSave();
                    }else{     //不指定位置 发起文档 ->签署
                        this.loadingStatus = true;
                        this.delegateSignDoc('sign');
                    }
                }else{   //ukey
                    if(this.pin.val == ''){
                        this.modelCommonTip('pin码不能为空'); 
                        return;
                    }
                    this.loadingStatus = true;
                    gMethod.checkReadUserList(this,res=>{        
                        this.ddata = res;
                        if(this.appointState){   //指定位置签署    传位置 ->发起文档 ->签署
                            this.prepositionSave();
                        }else{     //不指定位置 发起文档 ->签署
                            this.loadingStatus = true;
                            this.signDoc('sign');
                        }
                        // this.signDoc();                
                    }, err=> {
                        this.loadingStatus = false;
                        this.alertTxt = '获取U-KEY失败，请确认是否插入U-KEY或安装客户端';
                        this.alertState = true;
                        this.alertGoIndex = 1;                    
                    });
                }
            },
            //提交位置给后台
            async prepositionSave(type="sign"){ //先判断自己有没有印章
                let arrSign = $(this.seal).find('.sealSign');    
                /*if(this.canSign && this.appointState){
                    if(arrSign.length == 0){
                        this.alertState = true;
                        this.alertTxt = '请点击签章并放置于文档任意位置';
                        this.alertGoIndex = 1;
                        return;
                    }
                }        */ 
                let arrEle = $(this.seal).find('.sealImg2') || [];
                 
                /*if(arrEle.length == 0 && this.signData.signOrders.split(',').length > 1){
                     this.modelCommonTip("请放置签名框");
                     return;
                }
                //判断选的人和拖拽的印章是不是一一对应
                let arrSignAcc = Array.from(arrEle).map(item=>{
                    return $(item).attr('data-accno');
                })
                if(Array.from(new Set(arrSignAcc)).length != this.selectSignors.length){
                    this.modelCommonTip("您还缺少签名框，请核对");
                    return;
                }*/

                let prePositionList = [];
                for(let i = 0 ; i < arrEle.length ; i++){
                    let P = Number(arrEle.eq(i).attr('pagenum'));
                    let W = parseInt(arrEle.eq(i).css('width'));
                    let H = parseInt(arrEle.eq(i).css('height'));
                    let T = parseInt(arrEle.eq(i).css('top'));
                    let L = parseInt(arrEle.eq(i).css('left'));

                    prePositionList.push({
                        accNo:arrEle.eq(i).attr('data-accno'),
                        signatureFieldInfo:{
                            "pageNum":P,
                            "x":this.allArithmetic('divi',L,this.PDFW).toFixed(4),
                            "y":this.allArithmetic('divi',T,this.PDFHH).toFixed(4),
                            "w":this.allArithmetic('divi',W,this.PDFW).toFixed(4),
                            "h":this.allArithmetic('divi',H,this.PDFHH).toFixed(4),
                            "xPadding":0,
                            "yPadding":1
                        }
                    })
                }                
                this.loadingStatus = true;
                let json =await this.REQUEST('POST',this.URL['prepositionSave'],{
                    docId:this.docId,
                    prePositionList
                });
                if(json.meta.success){
                    if(arrSign.eq(0).attr('data-type')=='delegate' ){   //托管签署
                        this.delegateSignDoc(type);   //发起签约- type='sign'需要签署 type='nosign'  不需要签署  
                    }else{  //ukey签署
                        this.signDoc(type);
                    }
                    
                }else{
                    this.modelCommonTip("失败，请重试")
                }
                
            },                     
            //托管签署  先发起后签署
            async delegateSignDoc(type='sign'){
                let arrEle = $(this.seal).find('.sealSign');
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
                        userId:this.CURACCOUNT.accNo ,
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
                if(!this.getSData('createDocId')){
                    let Json = await this.REQUEST('POST',this.URL['createDocumentLight'],this.signData);  //发起签约->签署
                    if(!Json.meta.success){
                        this.pin.state = false;                  
                        this.signCancle = true;
                        this.loadingStatus = false;
                        [this.alertState,this.alertTxt,this.alertGoIndex,this.pin.sureBtnTxt] = [true,'系统繁忙，请稍后重试',6,"确定"];
                        return;
                    }
                    this.setSData('createDocId',this.docId);
                }

                if(type == 'sign'){
                    let json = await this.REQUEST('POST',this.URL['delegateSignDoc'],{   //签署
                        docId:this.docId,
                        pdfSignInfoBodyList
                    })
                    this.pin.sureBtnTxt = "确定";
                    this.loadingStatus = false;
                    this.signCancle = true;
                    if(json.code == '001'){
                        this.removeSData('createDocId');
                        this.pin.state = false;
                        this.$router.push({
                            name:'Detail',
                            params:{
                                docId:this.docId
                            }
                        })
                    }else if(json.code == '003'){
                        this.modelCommonTip(json.msg);
                    }else{  //要跳到详情页
                        
                        [this.alertState,this.alertTxt,this.alertGoIndex,this.pin.sureBtnTxt] = [true,'系统繁忙，请稍后再签署',7,"确定"];
                    }
                }else{  //自己不需要签署 发起成功之后做处理
                    if(this.signData.orderType == '002'){  //有序到详情
                        this.$router.push({
                            name:'Detail',
                            params:{
                                docId:this.docId
                            }
                        })
                    }else{   //无序到签署   包含自己到签署，不包含自己到详情
                        if(this.hasOwn){  //包含自己 
                            this.$router.push({
                                name:'Sign',
                                params:{
                                    docId:this.docId
                                }
                            })
                        }else{
                            this.$router.push({
                                name:'Detail',
                                params:{
                                    docId:this.docId
                                }
                            })
                        }
                        
                    }
                }
            },
            //签署
            async signDoc(type){
                //先发起文档后签署
                this.signCancle = false;
                if(!this.getSData('createDocId')){   //有本地发起的文档说明已经发起成功了
                    let Json = await this.REQUEST('POST',this.URL['createDocumentLight'],this.signData);  //发起签约->签署
                    if(!Json.meta.success){
                        this.pin.state = false;
                        this.modelCommonTip('签署失败，请重新签署');
                        this.loadingStatus = false;
                        this.signCancle = true;
                        return;
                    } 
                    this.setSData('createDocId',this.docId);
                }
                if(type == 'nosign'){  //不需要签署
                    this.$router.push({
                        name:'Detail',
                        params:{
                            docId:this.docId
                        }
                    })
                }else{   //需要签署
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
                    if(this.keyType == '003' || this.stampType == '1'){  //托管证书h或者托管在网管密码机。
                        this.depositSignDoc(signSubmitData);
                    }else if(this.keyType == '002'){                     //PFX
                        this.pfxSignDoc(signSubmitData);
                    }else{                                               //UKEY
                        this.getDocHash(signSubmitData)
                    }  
                } 
            },
            //PFX签署接口
            pfxSignDoc(signSubmitData){
                this.ajaxPost(this.URL['pfxSignDoc'],{...signSubmitData},json=>{
                    const {getHashResult} = JSON.parse(json);
                    this.loadingStatus = false;
                     this.signCancle = true;
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
                     this.signCancle = true;
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
                                    [this.alertState,this.alertTxt,this.alertGoIndex] = [true,'UKEY与签章不对应,请换一个ukey',1];
                                    this.loadingStatus = false;
                                    this.pin.state = false;
                                    this.pin.val = '';
                                    return;
                                }
                                this.submitData = {certId,docHash:hashValue,sessionId}
                                if(this.appointState){  //指定位置签署
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
                                             this.signCancle = true;
                                             this.loadingStatus = false;
                                            [this.alertState,this.alertTxt,this.alertGoIndex,this.pin.sureBtnTxt,this.pin.val] = [true,'设置签名方法失败',1,'确定',''];
                                        });
                                    },restTime=>{
                                         this.signCancle = true;
                                        [this.pin.sureBtnTxt,this.pin.val] = ["确定",''];
                                        if(restTime > 0){
                                            this.pin.tip = `PIN码错误，请重试（您还剩${restTime}次机会）`;
                                            this.loadingStatus = false;
                                        }else{
                                            this.pin.tip = `已超过最大尝试次数，请联系客户服务<br/>（020-95105813）重置密码。`;
                                            this.loadingStatus = false;
                                        }
                                    })
                                }else{
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
                                            this.signCancle = true;
                                            this.loadingStatus = false;
                                            [this.alertState,this.alertTxt,this.alertGoIndex,this.pin.sureBtnTxt,this.pin.val] = [true,'设置签名方法失败',1,'确定',''];
                                        });
                                    },restTime=>{
                                        [this.pin.sureBtnTxt,this.pin.val] = ["确定",''];
                                        this.signCancle = true;
                                        this.loadingStatus = false;
                                        if(restTime > 0){
                                            this.pin.tip = `PIN码错误，请重试（您还剩${restTime}次机会）`
                                        }else{
                                            this.pin.tip = `已超过最大尝试次数，请联系客户服务<br/>（020-95105813）重置密码。`
                                        }
                                    });
                                }
                                
                            }else{
                                this.signError(getHashResult);
                                 this.signCancle = true;
                            }
                        })
                    });
                },function(err){
                     this.signCancle = true;
                    [This.alertState,This.alertTxt,This.alertGoIndex,This.loadingStatus]=[true,"获取UKEY数据失败",1,false]
                });
            },
            
            //签署  输入pin码的最后签署
            innerSignDocFunc(signValue){
                const {docHash,sessionId,certId} = this.submitData;
                const {stampId} = this.selectSrc;
                // const {stampId,certCode:certId} = this.selectSrc;
                this.ajaxPost(this.URL['signDoc'],{
                    docId:this.docId,
                    docHash,
                    signValue,
                    sessionId,
                    stampId,
                    certId
                },json=>{
                    this.pin.state = false;
                    this.signCancle = true;
                    const {getHashResult} = JSON.parse(json);
                    this.loadingStatus = false;
                    if(getHashResult == '001'){
                        [this.alertState,this.alertTxt,this.alertGoIndex] = [true,'签署成功',5];
                        this.removeSData('createDocId');
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
                [this.alertState,this.alertTxt,this.alertGoIndex] = [true,alertTxt,1];
                setTimeout(()=>{
                    this.cancelHandle();
                },2000)
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
                        item.TYPE="delegate"
                    });

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
                    
                    
                     if(this.sealListSmall.length == 0){
                        this.selectSrc = this.delegateSeal[0];
                        this.selectDelegateIndex = 0;
                    }
                    
                    
                })
            }         
        },
        beforeDestroy(){
            this.removeSData('createDocId');
        },
        mounted(){
            
            this.docId = this.$route.params.docId;  
            this.signData = this.getSData('signData').data; 
            this.appointState = this.getSData('signData').appointState;          
            this.hasOwn = this.signData.signOrders.split(',').some(item => item == this.CURACCOUNT.accId);
            this.isFirst = this.signData.signOrders.split(',')[0] == this.CURACCOUNT.accId ? true : false ;
            if(this.signData.orderType == '002' && this.hasOwn && this.isFirst){  //先签拖章发起
                this.canSign = true;
                this.selectSignors = this.getSData('signData').selectSignors.filter(item=>{return item.accId != this.CURACCOUNT.accId});  //自己可以签署的时候去除拖拽印章的自己的数据
                if(this.accountType){
                    this.getAllStamp();
                }else{
                    this.ajaxGetSignStamps();
                }
                
            }else{
                this.selectSignors = this.getSData('signData').selectSignors;
            }
            if(!this.signData){   //处理从浏览器进入页面跳转
                this.$router.push({
                    name:'Index'
                })
            }
            this.sealPageList = [];  //进入页面前
            
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
    }
</script>
<style scoped lang="scss">
@import '../../../assets/css/sign.scss';
</style>

