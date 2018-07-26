<template>
    <section v-if="CURACCOUNT" style="position:absolute;top:0;" >
        <canvas id="myCanvas2" width="300px" height="100px" style="position:absolute;opacity:0;position:fixed;left:0;top:-500px; ">
            您的浏览器不支持canvas标签。
        </canvas>
        <div id="divView2" class="signet" style="width:200px;height:200px;overflow:hidden;opacity:0; position:fixed;left:0;top:-500px;">
            <div id="divSeal2"></div>
        </div>
        <alertModel title="请设置签署密码" v-show="setPinState" :type="2" @cancelHandle="pinCancelHandle" @sureHandle="pinSureHandle">
            <div slot="alert-content" class="signPsw" >
                <p class="tip" v-if="!this.CURACCOUNT.depositStatus">由于您没有签名证书，请先<span>设置签署密码</span>，供签署使用</p>
                <p class="input"><input type="password" :placeholder="this.CURACCOUNT.depositStatus ? '请输入签署密码':'请设置签署密码'" v-model.trim="pinVal" @keyup.enter="pinSureHandle" v-on:input="pinErr = ''"></p>
                <p class="warn">{{pinErr}}</p>
            </div>
        </alertModel>
        <!-- <alertModel title="风险提示" v-show="warnState" :type="2" :cancelBtnTxt="'继续发起签署'" :sureBtnTxt="'去实名认证'" @cancelHandle="warnStateHandle">
            <div slot="alert-content" class="warnState">
                <p>您的账号尚未实名认证，目前只能发起【未实名认证】合同，存在安全风险，建议实名认证后再发起签署。</p>
            </div>
            <div slot="alert-footer">
                <a href="javascript:;" class="cancel-btn"  @click="containSendSign">继续发起签署</a>
                <a href="javascript:;" class="sure-btn" @click="realClick">去实名认证</a>
            </div>
        </alertModel> -->
    </section>
</template>
<script>
    import { mapState } from 'vuex';
    /*seal*/
    import '@/assets/js/plugin/jquery-1.8.3.min.js'
    import '@/assets/js/seal/Blob.js'; 
    import Raphael from 'raphael';
    import '@/assets/js/seal/raphael.export.js'; 
    import '@/assets/js/seal/canvg.min.js'; 
    const saveSvg = require("@/assets/js/seal/saveSvgAsPngYy.js").default;
    import '@/assets/js/seal/spectrum.js'; 
    import '@/assets/js/seal/FileSaver.min.js'; 
    import '@/assets/js/seal/canvas-toBlob.js'; 
    const arraySealTemplate =  require('@/assets/js/seal/makeSealByRaphael.js')
    const readSealTemplate = require('@/assets/js/seal/sealTemplates.js');
    export default{
        props:{
            orgId: {			// 名称
                type: String,
                default: ""
            }
        },
        data(){
            return{
                pinVal:'',
                pinErr:'',
                stampImg:'',  
                
                //声明变量
                rPaper:null,
                arrSeal:null,
                jsonSeal:null,
                divWidth:null,
                divHeight:null,
                viewBoxWidth:70,
                viewBoxHeight:null,
                setControlsFlag:false,
                customImg:new Image(),
                actualImgWidth:null,
                actualImgHeight:null,
            }
        },
        computed:mapState(['setPinState']),
        methods:{
            pinSureHandle(){
                if(!this.pinVal){
                    this.pinErr = "签署密码不能为空";
                    return;
                }
                if(!this.CURACCOUNT.depositStatus){  //没有个人托管证书
                    if(this.$store.state.pinIndex == 1){       //发起签约的时候，先发个人托管证书
                        this.$emit("pinSureHandle");   
                        this.applyPerson();
                    }else if(this.$store.state.pinIndex == 2){  //接受授权的时候，先发个人托管证书后接受授权
                        this.$emit("pinSureHandle"); 
                        this.applyPerson();
                    }else if(this.$store.state.pinIndex == 3){  //机构托管证书授权，先下发个人托管证书后获取机构证书
                        this.$emit("pinSureHandle");   
                        this.applyPerson();
                    }else{}
                }else{  //有个人托管证书
                    if(this.$store.state.pinIndex == 1){       //发起签约的时候，先发个人托管证书
                        this.$emit("pinSureHandle");   
                        this.applyPerson();
                    }if(this.$store.state.pinIndex == 2){  //接受授权的时候
                        this.$emit("pinSureHandle");   
                        this.acceptAuthorize();
                    }else if(this.$store.state.pinIndex == 3){  //机构托管证书授权，直接签发
                        this.$emit("pinSureHandle");   
                        this.applyOrganiza(); 
                    }else if(this.$store.state.pinIndex == 4){   //个人证书升级
                        this.$emit("pinSureHandle");   
                        this.upgradeHandle();
                    }else{}
                }
                
            },
            pinCancelHandle(){
                this.pinVal='';
                this.pinErr='';
                this.$store.commit("changePinState",false)
                this.$emit("pinCancelHandle");  
            },
            //画图
            canDraw(){               
                let canvas = document.getElementById("myCanvas2");
                //简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
                if(canvas.getContext){  
                    //获取对应的CanvasRenderingContext2D对象(画笔)
                    let ctx = canvas.getContext("2d");
                    let CanvasTxt = this.CURACCOUNT.accStstus == 3 ? this.CURACCOUNT.displayName : this.CURACCOUNT.mobileNo;
                    // let CanvasTxt = '数安时代测试测试试试试数安时代测试测试试试试'
                    let FONT = 50;
                    if(this.CURACCOUNT.accStstus == 3){
                         FONT = CanvasTxt.length <= 6 ? 50 : 35-(CanvasTxt.length-7)*5 <= 15 ? 15 : 35-(CanvasTxt.length-7)*5;
                    }                    
                    //设置字体样式
                    ctx.font = `${FONT}px Courier New`;
                    //设置字体填充颜色
                    ctx.fillStyle = "#000";
                    //从坐标点(0,60)开始绘制文字
                    
                    let X = null;
                    if(CanvasTxt.length == 11){
                        X = 0;
                    }else{
                        X = (300-(CanvasTxt.length*FONT))/2
                    }
                    ctx.fillText(`${CanvasTxt}`, X, 60);
                    this.stampImg = canvas.toDataURL("image/png");
                }
            },
            //签发个人托管证书
            async applyPerson(){
                this.REQUEST('POST',this.URL['apply'],{
                    userPin:this.pinVal
                }).then(response=>{
                    if(response.meta.success){
                        this.REQUEST('GET',this.URL['refreshLogin'],true).then(result=>{   //刷新登录状态
                            this.REQUEST('GET',this.URL['getCurAccount'],{}).then(json2=>{
                                this.login(json2,this.$router,this.$store)
                                this.REQUEST('POST',this.URL['personAddseal'],{stampImg:this.stampImg.split(',')[1],stampName:'默认签章'}).then(res=>{
                                    if(this.$store.state.pinIndex == 1){  //发起签约
                                        if(this.CURACCOUNT.accStstus == 3){
                                            this.applyOrganiza();
                                        }else{
                                            this.pinVal = '';
                                            this.pinErr = '';      
                                            this.$store.commit('changePinIndex',0)  //成功                               
                                            this.$store.commit('changeUpLoadFileState',1)  //成功
                                            this.$store.commit('changePinState',false)
                                        }
                                    }else if(this.$store.state.pinIndex == 2){         //接受授权
                                        this.acceptAuthorize();
                                    }else if(this.$store.state.pinIndex == 3){         //机构证书获取 || 发起签约
                                        this.applyOrganiza();
                                    }else{}
                                })
                            });                            
                        })
                    }else{
                        this.pinVal = '';
                        this.pinErr = '';
                        this.$store.commit('changePinState',false); 
                        this.$store.commit('changeUpLoadFileState',2)  //失败
                    }
                })
                
            },
            //机构证书授权
            async applyOrganiza(){
                let genImgFile = this.saveGenImg();
                if(!genImgFile){
                    this.applyOrganiza();
                    return;
                }
                let { meta, data } = await this.REQUEST('POST',this.URL['applyOrganiza'],{
                    userPin:this.pinVal
                })
                if(meta.success){   //授权成功添加印章
                    this.pinVal = '';
                    this.pinErr = '';
                    // this.$store.state.pinIndex == 0;
                    this.$store.commit('changePinIndex',0);
                    this.$store.commit('changePinState',false)
                    this.$store.commit('changeUpLoadFileState',3)  //成功

                    this.REQUEST('POST',this.URL['companyAddseal'],{
                        stampName:'默认印章',
                        stampImg:genImgFile
                    }).then(res=>{})
                }else{
                    // this.pinVal = '';
                    this.pinErr = meta.msg;
                    this.$store.commit('changeUpLoadFileState',2)  //失败
                }
                
            },
            //个人接受授权
            async acceptAuthorize(){
                let {meta,data } = await this.REQUEST('POST',this.URL['accept'],{
                    userId:this.CURACCOUNT.accNo,
                    userPin:this.pinVal,
                    orgId:this.orgId
                })
                if(meta.success){
                    this.pinVal = '';
                    this.pinErr = '';
                    // this.$store.state.pinIndex == 0;
                    this.$store.commit('changePinIndex',0);
                    this.$store.commit('changePinState',false)
                    this.$store.commit('changeUpLoadFileState',4)  //成功
                }else{
                    this.pinErr = meta.msg;
                    this.$store.commit('changeUpLoadFileState',2)  //失败
                }
            },
            async upgradeHandle(){
                let {meta,data } = await this.REQUEST('POST',this.URL['upgrade'],{
                    userPin:this.pinVal,
                })
                if(meta.success){
                    this.pinVal = '';
                    this.pinErr = '';
                    // this.$store.state.pinIndex == 0;
                    this.$store.commit('changePinIndex',0);
                    this.$store.commit('changePinState',false)
                    this.$store.commit('changeUpLoadFileState',5)  //成功
                }else{
                    this.pinErr = meta.msg;
                    this.$store.commit('changeUpLoadFileState',2)  //失败
                }
            },
            /************************制章代码**********************/
            //创建签章
            showCreateStamp(){  //0表示自动创建，
                let This = this;                     
                    if(!this.rPaper){
                        var $divView;
                        $divView = $('#divView2');
                        this.divWidth = $divView.width();
                        this.divHeight = $divView.height();
                        $divView.width(this.divWidth);
                        $divView.height(this.divHeight);
                        this.rPaper = Raphael('divSeal2', this.divWidth, this.divHeight);
                        this.viewBoxHeight = this.viewBoxWidth * this.divHeight / this.divWidth;
                        this.rPaper.setViewBox((this.divWidth - this.viewBoxWidth) / 2, (this.divHeight - this.viewBoxHeight) / 2, this.viewBoxWidth, this.viewBoxHeight);
                    }
                    this.sealTemplateChanged(1);
            },
            //默认单位公章  index为1
            sealTemplateChanged(num) {
                var templateIndex = 1;
                this.jsonSeal = readSealTemplate(templateIndex,this.legalNameText);                    
                this.sealTemplate2Controls();
                this.drawSeal();
            },
            // 印章模板参数（除文本参数外）输出到控件
            sealTemplate2Controls() {
                let This = this;
                This.setControlsFlag = true;
                var sealExFrame = This.jsonSeal.exFrame;
                var sealInFrame = This.jsonSeal.inFrame;
                var sealLegalName = This.jsonSeal.legalName;
                var sealInfoCoding = This.jsonSeal.infoCoding;
                var sealAppendix1 = This.jsonSeal.appendix1;
                var sealAppendix2 = This.jsonSeal.appendix2;
                var sealAppendix3 = This.jsonSeal.appendix3;
                var sealCenterPattern = This.jsonSeal.centerPattern;
                var sealCenterLine = This.jsonSeal.centerLine;
                // 印章颜色
                if (This.jsonSeal.color != null) {
                    $('#sealColor').spectrum('set', This.jsonSeal.color);
                }
                // 外圆
                if (sealExFrame != null) {
                    $('#exFrameExWidth').val(sealExFrame.exWidth);
                    $('#exFrameExHeight').val(sealExFrame.exHeight);
                    $('#exFrameLineWidth').val(sealExFrame.lineWidth);
                } else {
                    $('#exFrameExWidth').val(null);
                    $('#exFrameExHeight').val(null);
                    $('#exFrameLineWidth').val(null);
                }
                // 内圆
                if (sealInFrame != null) {
                    $('#inFrameExWidth').val(sealInFrame.exWidth);
                    $('#inFrameExHeight').val(sealInFrame.exHeight);
                    $('#inFrameLineWidth').val(sealInFrame.lineWidth);
                } else {
                    $('#inFrameExWidth').val(null);
                    $('#inFrameExHeight').val(null);
                    $('#inFrameLineWidth').val(null);
                }
                // 法定名称文字
                if (sealLegalName != null) {
                    $('#legalNameText').val(sealLegalName.text);
                } else {
                    $('#legalNameText').val(null);
                }
                // 信息编码文字
                if (sealInfoCoding != null) {
                    $('#infoCodingText').val(sealInfoCoding.text);
                } else {
                    $('#infoCodingText').val(null);
                }
                // 附文1
                if (sealAppendix1 != null) {
                    $('#appendix1Text').val(sealAppendix1.text);
                } else {
                    $('#appendix1Text').val(null);
                }
                // 附文2
                if (sealAppendix2 != null) {
                    $('#appendix2Text').val(sealAppendix2.text);
                } else {
                    $('#appendix2Text').val(null);
                }
                // 附文3
                if (sealAppendix3 != null) {
                    $('#appendix3Text').val(sealAppendix3.text);
                } else {
                    $('#appendix3Text').val(null);
                }
                // 中心图案
                if (sealCenterPattern != null) {
                    $('#centerPattern').val(sealCenterPattern.style);
                    $('#cntPtnWidth').val(sealCenterPattern.width);
                    $('#cntPtnOffsetX').val(sealCenterPattern.offsetX);
                    $('#cntPtnOffsetY').val(sealCenterPattern.offsetY);
                } else {
                    This.jsonSeal.centerPattern = {};
                    This.jsonSeal.centerPattern.style = 'none';
                    $('#centerPattern').val('none');
                    $('#cntPtnWidth').val(null);
                    $('#cntPtnOffsetX').val(null);
                    $('#cntPtnOffsetY').val(null);
                }
                // 中心线
                if (sealCenterLine != null) {
                    $('#centerLineLength').val(sealCenterLine.length);
                    $('#centerLineWidth').val(sealCenterLine.lineWidth);
                    $('#centerLineInterval').val(sealCenterLine.interval);
                    $('#centerLineOffsetX').val(sealCenterLine.offsetX);
                    $('#centerLineOffsetY').val(sealCenterLine.offsetY);
                } else {
                    $('#centerLineLength').val(null);
                    $('#centerLineWidth').val(null);
                    $('#centerLineInterval').val(null);
                    $('#centerLineOffsetX').val(null);
                    $('#centerLineOffsetY').val(null);
                }
                This.setControlsFlag = false;
            },
            // 绘制印章
            drawSeal() {
                let This = this;
                This.rPaper.clear();
                This.arrSeal = arraySealTemplate(This.rPaper, This.divWidth / 2, This.divHeight / 2, This.jsonSeal);
            },
            //法定名称文本改变时
            legalNameChanged(name) {
                this.jsonSeal.legalName.text = name;
                this.drawSeal();
            },
            saveGenImg() {
                let This = this;
                This.rPaper.clear();
                var imgWidth, imgHeight;
                if (This.jsonSeal.exFrame != null) {
                    imgWidth = This.jsonSeal.exFrame.exWidth;
                    imgHeight = This.jsonSeal.exFrame.exHeight;
                } else {
                    if (This.jsonSeal.inFrame != null) {
                        imgWidth = This.jsonSeal.inFrame.exWidth;
                        imgHeight = This.jsonSeal.inFrame.exHeight;
                    } else {
                        alert('导出图片错误！印章缺乏内圆外圆！');
                        return;
                    }
                }
                $('#divSeal').width(imgWidth);
                $('#divSeal').height(imgHeight);
                This.rPaper.setSize(imgWidth, imgHeight);
                This.rPaper.setViewBox();
                This.arrSeal = arraySealTemplate(This.rPaper, imgWidth / 2, imgHeight / 2, This.jsonSeal);
                // 修改过的saveSvgAsPng.js --> saveSvgAsPngYy.js
                saveSvg.svgAsDataUri($(This.rPaper.toSVG()).get(0), 'seal.png', {
                    'scale': 300 / 25.4
                });
                $('#divSeal').width(This.divWidth);
                $('#divSeal').height(This.divHeight);
                This.rPaper.setSize(This.divWidth, This.divHeight);
                This.rPaper.setViewBox((This.divWidth - This.viewBoxWidth) / 2, (This.divHeight - This.viewBoxHeight) / 2, This.viewBoxWidth, This.viewBoxHeight);
                This.drawSeal();
                let baseUrl = saveSvg.getImg();
                if (baseUrl == '') {
                    This.modelCommonTip("请重新生成图片");
                    return;
                }
                return baseUrl.split(',')[1];
            },
            /**********制章end***********/
        },
        mounted(){          
            let Timer = setInterval(()=>{
                if(this.CURACCOUNT){
                    clearInterval(Timer);
                    if(!this.CURACCOUNT.depositStatus){
                        let Timer2 = setInterval(()=>{       //等到有canvas才画图
                            let canvas = document.getElementById("myCanvas2");
                            if(canvas){
                                clearInterval(Timer2)
                                this.canDraw();
                            }
                        },600)                        
                        // if((this.$route.name == 'ComSeal' || this.$route.name == 'Index' || this.$route.name == 'Sign')){
                        //     this.showCreateStamp();
                        //     this.legalNameChanged(this.CURACCOUNT.displayName);
                        // }
                    }
                    if((this.$route.name == 'ComSeal' || this.$route.name == 'Index' || this.$route.name == 'Sign') && this.USERSTATE == 0){
                        this.showCreateStamp();
                        this.legalNameChanged(this.CURACCOUNT.displayName);
                    }
                    /*else{                            
                        if((this.$route.name == 'ComSeal' || this.$route.name == 'Index' || this.$route.name == 'Sign') && this.USERSTATE == 0){
                            this.showCreateStamp();
                            this.legalNameChanged(this.CURACCOUNT.displayName);
                        }
                    }*/
                }
            },60)            
        }
    }
</script>