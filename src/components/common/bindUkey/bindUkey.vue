<template>
    <alertModel  :title="title" :alelrtClassWidth="'500px'" :type="2" class="ukeyCover">
        <div slot="alert-header">
            <h3>{{title}} <i class="iconfont icon-close autoClose"   @click="cancelHandle"></i></h3>
        </div>
        <div slot="alert-content">
            <div class="flex-wrap ">    
                    <label for="">请输入Pin码：</label>                
                    <div class="box">
                        <input type="password" v-model="pin.val" @keyup="pin.tip = ''" v-on:input="ukeyPsw = handleInput($event)" @keyup.enter="call_gdca_sof(pin.val)">
                        <a href="javascript:;" :class="[pin.val > 0 ? 'active':'']"  @click="call_gdca_sof(pin.val)">{{pin.sureBtnTxt}}</a>
                    </div>
                </div>
                <p class="warn" v-html="pin.tip" ></p>
                <div class="box autoWayBox">
                    <form id="uploadFormZiDong"  method="post" enctype="multipart/form-data">
                        <div class="sideLeft">
                            <div class="imgBox">
                                <!-- <img src="../../../assets/images/cert_z.png" alt=""> -->
                                <div id="divView" class="signet">
                                    <div id="divSeal"></div>
                                </div>
                            </div>
                        </div>
                        <input type="hidden" name="stampFlag" value="4">  
                        <input type="hidden" name="stampName" value="单位公章">  
                        <input type="hidden" name="genImgFile" >  
                        <input type="hidden" name="certValidDate">  
                        <input type="hidden" name="keyType" v-model="keyType">  
                        <input type="hidden" name="certBase64Data" >                          
                    </form>
                </div>
            
        </div>
        <div slot="alert-footer"></div>
    </alertModel>
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
    //gdca
    import '@/assets/js/GDCAPKI/jquery.jsonp.js'; 
    const Base64String = require("@/assets/js/GDCAPKI/base64.js").default;
    import '@/assets/js/GDCAPKI/gdca-pki-errcode.js'; 
    const $GDCA = require('@/assets/js/GDCAPKI/gdca-pki-lib.js').default;     
    import '@/assets/js/GDCAPKI/gdca_sof_method.js'; 
    const gMethod = require('@/assets/js/GDCAPKI/gdca_sof_method.js');

    import { handleInput,randomWord }  from '@/assets/js/pageCom.js';
    export default{
        name:'bindUkey',
        props:{
            title:{
                type:String,
                default:''
            },
            operIndex:{
                type:Number,
                default:1,      //1-绑定ukey登录证书   2-添加ukey证书
            }
        },
        data(){
            return{
                pin:{
                    val:'',                  //pin码的值
                    tip:'',                  //pin码提示
                    sureBtnTxt:"确定",       //PIN码按钮
                },
                ddata:null,
                random:null,
                ukeyCert:'',
                keyType:'001',              //证书类型 ukey001

                /*制章 */
                legalNameText:null,  //法定名称
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
            cancelHandle(){
                this.$emit("cancelHandle");
            },
            //绑定uKEY
            handleInput,randomWord,
            //调用证书客户端
            call_gdca_sof(pin) {
                let This = this;
                if(!pin){
                    this.modelCommonTip("请输入ukey密码");
                    return;
                }
                if(this.pin.sureBtnTxt != '绑定' && this.operIndex == 1) return;
                if(this.pin.sureBtnTxt != '确定' && this.operIndex == 2) return;
                this.pin.sureBtnTxt = '提交中...';
                let sign = "",certData = "";
                This.random = this.randomWord(true,32,1000);
                // $("#loadingBox_h").modal("show").find(".tip-h3").text("正在加载UKEY");
                gMethod.checkReadUserList(this, function (res) {
                    This.ddata = res;
                    gMethod.checkLoginKey(this, pin, function (res) {
                        $GDCA.exportUserCert(This.ddata, function (usercert) {
                            certData = usercert;
                            $GDCA.setSignMethod(16, function (res) {
                                var baseRan = new Base64String().encode(This.random);
                                $GDCA.signData(This.ddata, baseRan, function (res) {
                                    sign = res;
                                    if (null == sign  || "" == sign || "undefine" == sign) {
                                        This.pin.tip = "签名数据为空";
                                        This.pin.sureBtnTxt = This.operIndex == 1 ? '绑定' : '确定';
                                        return false;
                                    }
                                    if(This.operIndex == 1){  //绑定ukey登录证书
                                        This.relateUKey(sign,certData,This.random);
                                    }else{    //添加ukey证书
                                        This.addCert(certData);
                                    }                                   
                                }, function (err) {
                                    This.pin.tip = "签名数据失败";
                                    This.pin.sureBtnTxt = This.operIndex == 1 ? '绑定' : '确定';
                                });
                            }, function (err) {
                                This.pin.tip = "设置签名方法失败";
                                This.pin.sureBtnTxt = This.operIndex == 1 ? '绑定' : '确定';
                            });
                        }, function (err) {
                            This.pin.tip = "获取用户签名证书失败";
                            This.pin.sureBtnTxt = This.operIndex == 1 ? '绑定' : '确定';
                        });
                    }, function (restTime) {
                        if(restTime > 0){
                            This.pin.tip = "PIN码错误，请重试(您还剩"+restTime+"次机会)";
                           This.pin.sureBtnTxt = This.operIndex == 1 ? '绑定' : '确定';
                        }else{
                            This.pin.tip = '已超过最大尝试次数，请联系客户服务<br/>（020-95105813）重置密码。';
                            This.pin.sureBtnTxt = This.operIndex == 1 ? '绑定' : '确定';
                        }
                    });
                }, function (err) {
                    This.pin.tip = '控件初始化失败，请确认已插入UKEY及安装客户端';
                    This.pin.sureBtnTxt = This.operIndex == 1 ? '绑定' : '确定';
                    
                });
                return false;
            },          
            //关联证书
            relateUKey(sign,certData,random){
                this.httpPost(this.URL['relateUKey'],{
                    "sign": sign, 
                    "random": random, 
                    "certData": certData
                    },(res)=>{
                    if(res.meta.success){
                        let msg = res.data;
                        if ("success" == msg) {
                            if(this.operIndex == 1){   //关联证书成功之后添加证书以及添加印章
                                this.addCert(certData);
                                // this.$store.commit('changeDialog',{state:true,options:{title:'提示',text:`ukey证书绑定成功，下次登录您可选择用ukey登录`,btnCount:1}})
                                // this.dialogConfirm.confirm().then(() => {
                                //     this.$store.commit('changeDialog',{state:false,options:{}})
                                // }).catch(() => {
                                //     this.$store.commit('changeDialog',{state:false,options:{}})
                                // })
                            }
                            
                            
                        }else if ("already" == msg) {
                            this.modelCommonTip('绑定失败，该UKEY证书已绑定其它账户');
                            this.pin.val = '';
                            this.pin.sureBtnTxt = this.operIndex == 1 ? '绑定' : '确定';
                        }else if ("revocation" == msg) {
                            this.pin.val = '';
                            this.pin.sureBtnTxt = this.operIndex == 1 ? '绑定' : '确定';
                            this.modelCommonTip('UKEY证书已被吊销');
                            
                        }else if ("verifyFailed" == msg) {
                            this.pin.val = '';
                            this.pin.sureBtnTxt = this.operIndex == 1 ? '绑定' : '确定';
                            this.modelCommonTip('UKEY验签失败');                            
                        }else {
                            this.pin.val = '';
                            this.pin.sureBtnTxt = this.operIndex == 1 ? '绑定' : '确定';
                            this.modelCommonTip('服务器异常');
                        }
                    }else{
                        this.modelCommonTip(result.meta.message);
                        this.pin.val = '';
                        this.pin.sureBtnTxt = this.operIndex == 1 ? '绑定' : '确定';
                    }
                })
            },
            //添加证书
            addCert(usercert){
                this.ajaxGet(this.URL['getCertInfo'],{
                    'cert':usercert
                },(json)=>{
                    if(json.meta.success){
                        let data = json.data;
                        this.showCreateStamp();
                        this.legalNameChanged(data.owner);
                        this.autoCreate(usercert);
                        
                        this.pin.val = '';
                        this.pin.tip='';
                        this.pin.sureBtnTxt = this.operIndex == 1 ? '绑定' : '确定';
                        if(this.operIndex == 1){
                            $('.autoClose').click();
                            this.$store.commit('changeDialog',{state:true,options:{title:'提示',text:`ukey证书绑定成功，下次登录您可选择用ukey登录`,btnCount:1}})
                            this.dialogConfirm.confirm().then(() => {
                                this.$store.commit('changeDialog',{state:false,options:{}})
                            }).catch(() => {
                                this.$store.commit('changeDialog',{state:false,options:{}})
                            })                            
                        }
                    }
                })
            },
            //自动制章
            autoCreate(usercert){
                let This = this;
                this.genImgFile = this.saveGenImg();
                if(!this.genImgFile){
                    this.autoCreate();
                    return;
                }
                $("input[name='genImgFile']").val(this.genImgFile);
                $('input[name="certBase64Data"]').val(usercert);
                $('#uploadFormZiDong').ajaxSubmit({  
                    url : This.apiPath+This.URL['addStampLight'],  
                    xhrFields: {
                            withCredentials: true
                    },
                    type:'post',
                    beforeSubmit:function(){},
                    success: function(res){ 
                        if(This.operIndex == 2){
                             $('.autoClose').click();
                        }
                        /*let backData = JSON.parse(res);                        
                        if(backData.meta.success){
                            [This.pin.val,This.pin.sureBtnTxt,This.genImgFile] = ['','确定',null];
                            
                             This.getCertList();
                        }else{
                            [This.pin.sureBtnTxt,This.pin.val] = ['确定',''];
                            let msg = backData.meta.message;
                            if(msg == 'bad.cert'){
                                This.modelCommonTip("证书数据错误")
                            }else if(msg == 'invalid.cert'){
                                This.modelCommonTip("证书已过期")
                            }else if(msg == "flag.exist"){
                                This.modelCommonTip("签章类型已存在")
                            }else{
                                This.modelCommonTip(msg)
                            }
                        }*/
                    },
                    error:function(res){
                        if(res.statusText == "timeout"){
                            This.modelCommonTip('服务器繁忙，请稍后再试')
                        }                        
                    },
                    timeout:30000
                });
                
            },
            //绑定UKEYend

            /************************制章代码**********************/
            //创建签章
            showCreateStamp(){  //0表示自动创建，
                let This = this;                            
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
                // this.genImgFile = baseUrl.split(',')[1];
                return baseUrl.split(',')[1];
            },
            /**********制章end***********/
        },
        mounted() {
            this.pin.sureBtnTxt = this.operIndex == 1 ? '绑定':'确定'
        },
    }
</script>
