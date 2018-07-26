<template>
    <section class="addSeal pdB">
        <nav class="" @click="$router.push({name:'ComSeal'})"><i class="iconfont icon-back"></i>返回</nav>        
        <div class="createSeal">
            
            <h3 class="title">新增签章样式</h3>
            <!-- 自动创建方式 -->
            <div class="autoWay">
                <div class="box autoWayBox">
                    <div class="sideLeft">
                        <div class="imgBox">
                            <!-- <img src="../../../assets/images/cert_z.png" alt=""> -->
                            <div id="divView" class="signet">
                                <div id="divSeal"></div>
                            </div>
                        </div>
                    </div>
                    <div class="sideRight">
                        <p class="box">
                            <label for=""><b>*</b>公章名称</label>
                            <input type="text" id="legalNameText"  @keyup="legalNameChanged" placeholder="请输入签章名称" name="legalNameText" v-model="legalNameText">
                        </p>
                        <p class="box">
                            <label for="">公章类型</label>
                            <select id="sealTemplate" @change="sealTemplateChanged()" v-model="stampFlag" name="stampFlag">
                                <option value="1">合同章</option>
                                <option value="4">单位公章</option>
                                <option value="2">财务专用章</option>
                                <option value="3">发票专用章</option>
                            </select> 
                        </p>
                        <p class="box">
                            <label for="">印章编码</label>
                            <input id="infoCodingText" type="text" class="input-templet" placeholder="请输入印章编码" v-model="infoCodingText" @keyup="infoCodingChanged" autocomplete="off">
                        </p>
                        <p class="box" v-if="stampFlag == 3">
                            <label for="">税号</label>
                            <input id="appendix1Text" type="text" class="input-width" @keyup="appendix1Changed" v-model="appendix1Text" autocomplete="off">
                        </p>
                    </div>
                </div>
                <div class="line">
                    <a href="javascript:;" @click="showImgWay">或者 上传本地图片制章</a>
                    <span>or</span>
                </div>
            </div>
            <!-- 上传图片方式制章 -->
            <div class="imgWay">
                <form id="uploadFormStamp"  method="post" enctype="multipart/form-data">
                <div class="line">
                    <a href="javascript:;" @click="showAutoWay">或者 模版自动制章</a>
                    <span>or</span>
                </div>
                <div class="drap" >
                    <p class="box">
                        <label for="">公章类型</label>
                        <select id="sealTemplateType" v-model="stampFlag">
                            <option value="1">合同章</option>
                            <option value="4">单位公章</option>
                            <option value="2">财务专用章</option>
                            <option value="3">发票专用章</option>
                        </select> 
                    </p>
                    <input id="stampFile" v-if="certCode != 'company'" type="file" :name="uploadStampIndex == 2 ? 'stampFile':''">
                    <!-- <input id="stampFile" v-else type="file" :name="uploadStampIndex == 2 ? 'stampFile':''"> -->
                    
                    <div id="drop_area">
                        <h3 v-if="isImg">{{pdfFileName}}</h3>
                        <div class="img">
                            <img id="stampFile_pre" class="img_pre" src="" style="display:none">    
                        </div>                        
                        <h3>点击选择签章图片或将图片拖到此处</h3>
                        <p>支持 .png 文件格式  文档大小 < 10MB  长宽均<200像素</p>
                        <span>必须上传背景透明的图</span>
                    </div>
                    <ul>
                        <li>背景透明签章制作过程参考：</li>
                        <li>1、在白纸上盖章/签章</li>
                        <li>2、手机拍下或扫描</li>
                        <li>3、上传电脑除去被色背景</li>
                        <li>4、生成背景透明的PNG格式图片</li>
                    </ul>
                </div>
                <input type="hidden" name="stampFlag" v-model="stampFlag" v-if="certCode != 'company'">  
                <input type="hidden" name="stampName">  
                <input type="hidden" name="genImgFile" v-if="uploadStampIndex == 1 && certCode != 'company'" >   
                <input type="hidden" name="keyType" value="001" v-if="certCode != 'company'">  <!--ukey证书-->
                <input type="hidden" name="certCode" v-model="certCode" v-if="certCode != 'company'"> 
                </form>
            </div>
            <div class="btnBox">
                <div class="clf">
                    <a href="javascript:;" @click="$router.push({name:'ComSeal'})">取消</a>
                    <a href="javascript:;" @click="addStampLight">{{addStampTxt}}</a>
                </div>
            </div>            
        </div>
        <Loading v-show="loadingStatus" text="签章上传中...请稍后"></Loading>
    </section>
</template>
<script>
    /*seal*/
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
        name:"addSeal",
        data(){
            return{
                loadingStatus:false,
                pdfFileName:'',        //文件名称
                signFile:null,         //文档流
                uploadFileState:false, //上传文件状态
                isImg:false,
                uploadStampIndex:1,    //1-上传印章  2-上传图片
                /*制章 */
                addStampTxt:'添加',
                stampFlag:'',         //类型
                legalNameText:null,  //法定名称
                stampName:null,
                infoCodingText:null,  //信息编码
                appendix1Text:'000000000000000000',  //税号
                colorIndex:1,   //印章颜色  1为红色  2为蓝色
                appendixTip:false,
                infoCodingTip:false,
                ddata:null,
                genImgFile:null,    //自动创建时的图片
                certCode:null,
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
        methods:{
            addStampLight(){
               let This = this;
               if(this.uploadStampIndex == 1){
                   if(!this.legalNameText){
                        this.modelCommonTip('公章名称不能为空');
                        return;
                    }
               }
                
                if(this.uploadStampIndex == 1){  //上传印章
                    this.genImgFile = this.saveGenImg();
                    if(!this.genImgFile){
                        this.addStampLight();
                        return;
                    } 
                    $("input[name='stampFile']").val('');
                    $("input[name='genImgFile']").val(this.genImgFile); 
                    $("input[name='stampName']").val($("#sealTemplate").find("option:selected").text()); 
                }else{  //上传图片
                    $("input[name='stampName']").val($("#sealTemplateType").find("option:selected").text());                     
                    if(!this.validateUploadImg($("#stampFile")[0].files[0])) return;
                }
                this.addStampTxt = '添加中...';
                this.loadingStatus = true;
                if(this.certCode == 'company'){
                    this.httpPost(this.URL['companyAddseal'],{
                        stampName:$("input[name='stampName']").val(),
                        stampImg:this.genImgFile
                    },res=>{
                        this.loadingState = false;
                        if(res.meta.success){
                            this.$router.push({
                                name:'ComSeal'
                            })
                        }else{
                            this.modelCommonTip(res.meta.msg)
                        }
                    })
                }else{
                    $('#uploadFormStamp').ajaxSubmit({  
                        url : This.apiPath+This.URL['addStampLight'],  
                        xhrFields: {
                            withCredentials: true
                        },
                        type:'post',
                        success:res=>{ 
                            [this.addStampTxt,this.loadingStatus ] =['添加',false] 
                            let json = JSON.parse(res);                        
                            if(json.meta.success){
                                this.modelCommonTip("添加签章成功");
                                setTimeout(()=>{
                                    this.$router.push({
                                        name:'ComSeal'
                                    })
                                })
                            }else{
                                let msg = json.meta.message;
                                if(msg == 'bad.cert'){
                                    this.modelCommonTip("证书数据错误")
                                }else if(msg == 'invalid.cert'){
                                    this.modelCommonTip("证书已过期")
                                }else if(msg == "flag.exist"){
                                    this.modelCommonTip("签章类型已存在")
                                }else{
                                    this.modelCommonTip(msg)
                                }
                            }
                        },
                        error:res=>{
                            [this.addStampTxt,this.loadingStatus ] =['添加',false] 
                            if(res.statusText == "timeout"){
                                this.modelCommonTip('服务器繁忙，请稍后再试')
                            }                        
                        },
                        timeout:30000
                    });
                }
                 
            },
            /**************上传图片****************/
            clickFileFn() {
                $('#drop_area').on('click',()=> {
                    $("#stampFile").val('');
                    $('#stampFile').click();
                });
                // 文件更改                
                $('#stampFile').on('change',(e)=>{
                    e = e || window.event;  
                    e.stopPropagation(); // 阻止冒泡  
                    e.preventDefault();  //阻止默认行为                            
                    let fileObj = $("#stampFile")[0].files[0];
                    //检测是否有文件 
                    if(!fileObj){ 
                          return false; 
                    } 
                    this.fileCom(fileObj)
                });
                   
            },
            dragFileFn() {
                let that = this;
                $(document).on({ 
                    dragleave:function(e){    //拖离 
                        e.preventDefault(); 
                    }, 
                    drop:function(e){  //拖后放 
                        e.preventDefault(); 
                    }, 
                    dragenter:function(e){    //拖进 
                        e.preventDefault(); 
                    }, 
                    dragover:function(e){    //拖来拖去 
                        e.preventDefault(); 
                    } 
                });                   
                let box = document.getElementById('drop_area'); //拖拽区域 
                box.addEventListener("drop",(e)=>{
                    e.preventDefault(); //取消默认浏览器拖拽效果 
                    let fileList = e.dataTransfer.files; //获取文件对象 
                      //检测是否是拖拽文件到页面的操作 
                    if(fileList.length == 0){ 
                        return false; 
                    } 
                    this.fileCom(fileList[0]);
                },false); 
            },
            //上传图片验证
            validateUploadImg(fileObj){
                if(fileObj.type.indexOf('image/png') === -1) {
                    this.modelCommonTip('您选择的不是png图片');
                    $('#stampFile_pre').attr('src','').hide();
                    this.pdfFileName = '';
                    return false;
                }
                
                let filesize = Math.floor((fileObj.size)/1024/1024);  
                let fsize = fileObj.size/1024/1024;
                if(filesize>10){ 
                    this.modelCommonTip('上传大小不能超过10M');
                    $('#stampFile_pre').attr('src','').hide();
                    this.pdfFileName = '';
                    return false; 
                }
                return true;
            },
            fileCom(fileObj){
                if(!this.validateUploadImg(fileObj)) return;
                let filename = fileObj.name; //文件名称 
                this.pdfFileName = filename;
                this.signFile = fileObj;

                //图片预览
                this.change('stampFile_pre','stampFile', fileObj);
                $("#stampFile_pre").show();
                this.isImg = true;                    
                // this.signTitle = filename.substring(0,index1);  
                // this.uploadFile();
            },
            /*图片预览*/
            change(pre_id,file_id,fileObj) {
                var pic = document.getElementById(pre_id), file = document.getElementById(file_id);
                if(file.files){
                    this.html5Reader(fileObj,pre_id);
                }else{
                    file.select();
                    file.blur();
                    var reallocalpath = document.selection.createRange().text;
                    pic.width=116;
                    pic.height=86;
                    pic.style.opacity = 1;
                    pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src=\"" + reallocalpath + "\")";
                    pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
                }
            },
            html5Reader(file,pre_id){
                var file = file;
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e){
                    var pic = document.getElementById(pre_id);
                    $(pic).css('opacity',1);
                    pic.src=this.result;
                }
            },  
            uploadFile(){
                this.uploadFileState = true;
                let formData = new FormData();        
                formData.append('uploadFile',this.signFile);
                $.ajax({
                    url: this.apiPath+this.URL['uploadProgress'],
                    dataType: 'json',
                    type: 'POST',
                    // headers: {'token': sessionStorage.getItem("token")},
                    processData: false,
                    contentType: false,
                    cache: false,
                    data: formData,
                }).done((result) => {
                    this.uploadFileState = false;
                }).fail((err) => {
                    console.log(err)    
                });
            },
            /************************上传图片end**********************/

            /************************制章代码**********************/
            /*印章代码 */
            //创建签章
            showCreateStamp(num){  //0表示自动创建，1表示上传签章，2表示添加签章

                let This = this;
                // this.addStamp.index = num;
                // this.pin.tip = "";
                // $("#stampFile_pre").prop("src","").hide();
                // $("#imgShow .iconTip,#imgShow .icon-picture").show();
                // this.bindUkeyTip = "请先插入UKEY";
                // this.bindUkeyState = false;
                // this.certBase64Data  = this.signCertData = null;
                // if(num == 0){
                    // this.creatStamp.state = true;
                    this.infoCodingText = null;
                    this.colorIndex = 1;         
                    this.stampFlag = 1;                    
                    // this.creatStamp.title = '自动创建';        
                    if(!this.rPaper){
                        var $divView;
                        $divView = $('#divView');
                        this.divWidth = $divView.width();
                        this.divHeight = $divView.height();
                        $divView.width(this.divWidth);
                        $divView.height(this.divHeight);
                        this.rPaper = Raphael('divSeal', this.divWidth, this.divHeight);
                        this.viewBoxHeight = this.viewBoxWidth * this.divHeight / this.divWidth;
                        this.rPaper.setViewBox((this.divWidth - this.viewBoxWidth) / 2, (this.divHeight - this.viewBoxHeight) / 2, this.viewBoxWidth, this.viewBoxHeight);
                    }
                    this.sealTemplateChanged(1);
                    // this.autoTimer();
                // }     
            },
            selectType(){
                this.stampFlag = $('#sealTemplate2').val();
                
                // if( $("#sealTemplate2").find("option:selected").text() == "无"){
                //     this.stampName = '';
                // }else{
                //     this.stampName = $("#sealTemplate2").find("option:selected").text();
                // }
            },
            sealTemplateChanged(num) {
                var templateIndex = null;
                if(num == 1){  //初始化
                    templateIndex = 0;
                    $("#sealTemplate option:first").prop("selected", 'selected');  
                }else{
                    templateIndex = $('#sealTemplate').get(0).selectedIndex;
                }
                this.stampFlag = $('#sealTemplate').val();
                this.jsonSeal = readSealTemplate(templateIndex,this.legalNameText);                    
                this.sealTemplate2Controls();
                this.textTypeChanged();
                if(this.colorIndex == 1){
                    this.selectColorChanged(1,"#ff0000");
                }else{
                    this.selectColorChanged(2,"#4a90e2");
                }
                $('#infoCodingText').val(this.infoCodingText)
                this.jsonSeal.infoCoding.text = this.infoCodingText;  //信息编码
                this.infoCodingChanged();    
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
            // 文本参数改变
            textTypeChanged() {
                let This = this;
                This.setControlsFlag = true;
                var sealLegalNamePrms = This.jsonSeal.legalName == null ? null : This.jsonSeal.legalName.prms;
                var sealInfoCodingPrms = This.jsonSeal.infoCoding == null ? null : This.jsonSeal.infoCoding.prms;
                var sealAppendix1Prms = This.jsonSeal.appendix1 == null ? null : This.jsonSeal.appendix1.prms;
                $('#fontName').val(null);
                $('#charHeight').val(null);
                $('#charWidth').val(null);
                $('#autoCharWidth').val(null);
                $('#charDistance').val(null);
                $('#textWidth').val(null);
                $('#textOffset').val(null);
                $('#textDegree').val(null);
                This.setControlsFlag = false;
            },
            // 绘制印章
            drawSeal() {
                let This = this;
                This.rPaper.clear();
                This.arrSeal = arraySealTemplate(This.rPaper, This.divWidth / 2, This.divHeight / 2, This.jsonSeal);
            },
            // 信息编码文本改变时
            infoCodingChanged() {
                // value=value.replace(/[^\d]/g,'')
                if(this.infoCodingText && this.infoCodingText != ''){
                    // this.infoCodingText = this.infoCodingText.replace(/[^\d]/g,'');
                    this.infoCodingText = this.infoCodingText.replace(/[^\w\.\/]/ig,'');
                    if(this.infoCodingText.length > 13){
                        this.infoCodingTip = true;
                    }else{
                        this.infoCodingTip = false;
                    }
                }
                
                this.jsonSeal.infoCoding.text = this.infoCodingText == '' ? null : this.infoCodingText;
                this.drawSeal();
            },
            //税号改变
            appendix1Changed() {
                if(this.appendix1Text && this.appendix1Text != ''){
                    this.appendix1Text = this.appendix1Text.replace(/[^\w\.\/]/ig,'');
                    if(this.appendix1Text.length > 18){
                        this.appendixTip = true;
                    }else{
                        this.appendixTip = false;
                    }
                }                
                this.jsonSeal.appendix1.text = this.appendix1Text == '' ? null : this.appendix1Text;
                this.drawSeal();
            },
            //法定名称文本改变时
            legalNameChanged() {
                this.jsonSeal.legalName.text = $('#legalNameText').val() == '' ? null : $('#legalNameText').val();
                this.drawSeal();
            },
            //颜色改变时
            selectColorChanged(num,color) {
                this.colorIndex = num;
                if (this.setControlsFlag == true){return;}
                   
                this.jsonSeal.color = color;
                this.drawSeal();
            },
            saveGenImg() {
                // if (!verifyText()) // 校验参数
                //     return;
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
                    This.alertCommonTip("请重新生成图片");
                    return;
                }
                // this.genImgFile = baseUrl.split(',')[1];
                return baseUrl.split(',')[1];
            },
            //返回企业签章页面
            showImgWay(){
                this.uploadStampIndex = 2;
                this.stampFlag = 1;
                $('.autoWay').slideUp();
                $('.imgWay').slideDown();
            },
            showAutoWay(){
                this.uploadStampIndex = 1;
                this.stampFlag = 1;
                $('.autoWay').slideDown();
                $('.imgWay').slideUp();
            },
            init(){
                this.clickFileFn();
                this.dragFileFn();
                this.showCreateStamp(0);
            },
        },
        mounted(){
            this.certCode = this.$route.query.certCode;
            this.legalNameText = this.$route.query.certName;
            this.init();
            
        }
    }
</script>
<style lang="scss" scoped>
    @import '../../../assets/css/seal/sealMaker.css';
    @import '../../../assets/css/seal/spectrum.css';
</style>

