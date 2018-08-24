<template>
    <section class="index mainContain" v-if="CURACCOUNT">
        <div class="userInfo clf">
            <ul>
                <li>
                   <div class="flexL">
                        <img v-if="headIcon&&headIcon!=1" :src="'data:image/png;base64,'+headIcon" class="headIcon" alt="">
                        <div v-if="!headIcon && (CURACCOUNT.accStstus == 3 || USERSTATE == 0)" class="iconImg">
                            {{CURACCOUNT.displayName.substring(0,1)}}
                        </div>
                   </div>
                    <div class="flexR">
                        <h3>
                                <b class="shengl" v-if="CURACCOUNT.accType == 1">{{CURACCOUNT.displayName}}</b>
                                <b class="shengl" v-else>{{CURACCOUNT.memName ? CURACCOUNT.memName : CURACCOUNT.displayName}}</b>
                                <!-- <span v-if="CURACCOUNT.accStstus != '3'"><img class="noReal" src="../../../assets/images/real/no_real_icon.png" alt=""></span>
                                <span v-else><img class="realIcon" src="../../../assets/images/real/real_icon.png" alt=""></span> -->
                                <span v-if="CURACCOUNT.accStstus == 3" class="REAL"><i class="iconfont icon-solid_check"></i><b>实名用户</b></span>
                                <span v-else class="NOREAL">未实名</span>
                        </h3>  
                        <p>{{CURACCOUNT.accNo}}</p>
                    </div>
                </li>
                 <!-- <li>
                    <router-link to="user/cert">
                        <p class="iconfont icon-cert "></p>
                        <p>我的证书</p>
                    </router-link>
                </li>  -->
                <li>
                    <router-link :to="{name:'ComSeal' }">
                        <p class="iconfont icon-com_sign"></p>
                        <p>我的签章</p>
                    </router-link>
                </li>
                <li>
                    <a href="javascript:;">
                        <p>13</p>
                        <p>可签次数</p>
                    </a>
                </li>
                <li>
                    <a href="javascript:;">
                        <p>0</p>
                        <p>可用模板</p>
                    </a>
                </li>
            </ul>
        </div>
        <div class="realNo" v-if="CURACCOUNT.accStstus != '003'">
            <div class="realIn">
                <div class="realitem">
                    <p>{{Config.Title}}的账号还未进行<a href="javascript:;" @click="realClick">实名认证</a>，认证后将获得以下{{Config.Title}}专业电子合同服务</p>
                    <ul class="clf">
                        <li>专属CA证书</li>
                        <li>签发电子合同资格</li>
                        <li>电子合同法律有效险</li>
                        <li>司法鉴定报告</li>
                    </ul>
                </div>
                <div class="realitemR">
                    <a href="javascript:;" @click="realClick" class="goReal">去认证</a>
                </div>
            </div>
        </div>
        <div class="signFile" style="margin-top:47px;">
            <input type="file" id="file" class="filestyle" style="display:none;"  />
            <div class="dashed" id="drop_area">
                <!-- <img v-if="!isImg" src="../../assets/image/shangchuan.png"  class="upfile"/> -->
                <img v-if="loadingState" src="../../../assets/images/file_pdf.png"  class="upfile"/>
                <!-- <p v-if="isImg" class="up-word" id="upword">{{pdfFileName}}</p> -->
                <p class="mark" v-if="!isImg">*点击选择上传文件或拖动文件到此处</p>
                <p class="tip">支持 .doc/.docx/.pdf 文件格式  文档大小 < 10MB</p>
                <a href="javascript:;" class="pulse"><i class="iconfont icon-edit"></i>发起签约</a>
            </div>
        </div>
        <div class="news" v-if="news.length > 0" > 
                <i class="iconfont icon-laba"></i>
                <div v-if="news.length > 1  && USERSTATE ==  1" style="height:30px;overflow:hidden;">
                    <marquee direction="up"  scrolldelay="10" scrollamount="1" loop="-1" behavior="scroll" hspace="20" vspace="0" onMouseOver="this.stop()"   
      onMouseOut="this.start()" width="100%" height="30px">             
                    <ul>
                        <li v-for="(item,index) in news" :key="index">
                            <p v-if="item.type == 'acceptAuthorize'">
                                <span>您有一个证书：{{item.certInfo.ownerName}}需要接受授权</span>
                                <a href="javascript:;" @click="acceptHandle(item)">接受授权</a>
                            </p>
                             <p v-if="item.type == 'upgrade'">
                                <span>您有一个证书：{{item.ownerName}}需要接受授权</span>
                                <a href="javascript:;" @click="upgradeHandle()">升级</a>
                            </p>
                        </li>
                    </ul>
                    </marquee>
                </div>
                <div v-else style="height:30px;overflow:hidden;">
                    <ul>
                        <li v-if="news[0].type == 'acceptAuthorize'">
                            <span>您有一个证书：{{news[0].certInfo.ownerName}} 需要接受授权</span>
                            <a href="javascript:;"  @click="acceptHandle(news[0])">接受授权</a>
                        </li>
                        <li v-if="news[0].type == 'getAuthorize' && CURACCOUNT.accStstus == '3'" v-for="(item,index) in news" :key="index" >
                            <span>账号实名认证已通过审核，点击获取按钮可获取机构证书</span>
                            <a href="javascript:;" @click="authorizeOrgan">获取</a>
                        </li>
                        <li v-if="news[0].type == 'upgrade'">
                            <span>您有一个证书:{{news[0].ownerName}}需要升级</span>
                            <a href="javascript:;"  @click="upgradeHandle()">升级</a>
                        </li>
                    </ul>
                </div>
        </div>
        <div class="menuTab clf">
            <ul class="clf">
                <li>
                    <router-link :to="{ name: 'ManaFile', query: { tabIndex: 3 ,tabStatus:202,pageIndex:1}}">
                        <div>
                            <i class="iconfont icon-waitother"></i>
                        </div>
                        <div>
                            <h3>{{showNum.one}}</h3>
                            <p class="shengl">待其他人签</p>
                        </div>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'ManaFile', query: { tabIndex: 2 ,tabStatus:201,pageIndex:1}}">
                        <div>
                            <i class="iconfont icon-waitme"></i>
                        </div>
                        <div>
                            <h3>{{showNum.two}}</h3>
                            <p>待我签</p>
                        </div>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'ManaFile', query: { tabIndex: 6 ,tabStatus:'draf',pageIndex:1}}">
                        <div>
                            <i class="iconfont icon-darft"></i>
                        </div>
                        <div>
                            <h3>{{showNum.three}}</h3>
                            <p>草稿箱</p>
                        </div>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'ManaFile', query: { tabIndex: 4 ,tabStatus:300,pageIndex:1}}">
                        <div>
                            <i class="iconfont icon-finish"></i>
                        </div>
                        <div>
                            <h3>{{showNum.four}}</h3>
                            <p>已完成</p>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="nearFile">
            <Table :tableTitle="'最近文档'" :pageNumberState="false" :tableLoading="file.loading" :tableClass="'document-file near-file'" :total="file.total">
                <div slot="panel-header">
                    <h3 class="title">最近文档<router-link to="/manafile" class="more">更多<i class="iconfont icon-open_page" style="font-size:12px;margin-left:5px;"></i></router-link></h3>
                </div>
                <ul slot="panel-content" class="ul">
                    <li class="clf th">
                        <span>文件名称</span>
                        <span>发起人</span>
                        <span>文件状态</span>
                        <!-- <span>有效期</span> -->
                        <span>操作</span>
                    </li>
                    <li class="clf" v-for="(item,index) in file.list" :key="index" @click="pdfShow = true; docId = item.docId;pdfName = item.docName;pdfShowItem = item;">
                        <span :title="item.docName"><i class="iconfont" :class="item.iconName"></i>{{item.docName}}</span>
                        <span :title="item.senderName">{{item.senderName}}</span>
                        
                        <span :class="fileState(item.signStatus,item.overTime,'className')">{{fileState(item.signStatus,item.overTime)}}</span>
                        <!-- <span>{{item.sendTime+'-'+item.duration}}</span> -->
                        <span>
                            <b href="javascript:;"  @click.stop="goDetail(item)"><i class="iconfont icon-eye" ></i>详情</b>
                            <b href="javascript:;"  @click.stop="goSign(item)" v-if="item.signStatus == '201' && !item.overTime"><i class="iconfont icon-edit"></i>签署</b>
                            <b href="javascript:;" @click.stop="downLoadHandle(item.docId)" v-else><i class="iconfont icon-download"></i>下载</b>
                        </span>
                    </li>
                </ul>
            </Table>
        </div>
        <div class="pdfShow" v-show="pdfShow">
            <div class="top">
                <div>{{pdfName}}</div>
                <i class="iconfont icon-close_small" @click.stop="pdfShow = false"></i>
            </div>
            <div class="center" v-if="pdfShowItem">
                <iframe id="if" :src='"/static/pdf/web/viewer.html?file="+apiPath+URL["viewDocument"]+"/"+this.docId+".pdf"' width="100%" height="800px" scrolling="no">
                    您的浏览器不支持框架
                </iframe>
            </div>
            <div class="bottom">
                <a href="javascript:;" class="sign" @click.stop="goSign(pdfShowItem)" v-if="pdfShowItem && pdfShowItem.signStatus == '201' && !pdfShowItem.overTime">签署</a>
                <a href="javascript:;" class="sign" @click="repealDocumentLight(pdfShowItem)" v-if=" pdfShowItem && pdfShowItem.signStatus == '201' && !pdfShowItem.overTime">拒签</a>
                <a href="javascript:;" @click="downLoadHandle(pdfShowItem.docId)">下载</a>
            </div>
        </div>
        <alertModel title="实名认证" :type = "2"  :footerStatus="false" v-show="real.state" @cancelHandle="real.state = false">
            <div slot="alert-content">
                <img src="../../../assets/images/real_ewm.png" alt="" />
                <p><br/>扫码下载真宜签app实名认证</p>
            </div>
        </alertModel> 
        <!-- <alertModel :title="'实名认证'" :sureBtnTxt="real.sureBtnTxt" class="bigUserModel"  :alelrtClassWidth="'700px'" :showState="real.state" :type="2" v-show="real.state"  @sureHandle="sureRealHandle">
            <div slot="alert-header" class="saoma clf">        
                <p v-show="real.num != 2">{{real.num == 0 ? '上传身份证认证':'手机扫码，真宜签认证'}}</p>
                <p style="cursor:pointer;" v-show="real.num == 2" @click="backScanStep"><i class="iconfont icon-back"></i>手机实名认证步骤</p>
                <i v-show="real.num != 2" class="iconfont" :class="[real.num == 0 ? 'icon-ewm_real':'icon-pc']" @click="changeRealState"></i>
                <i v-show="real.num != 2" class="iconfont" :class="[real.num == 0 ? 'icon-sm':'icon_real']"></i>
            </div>
            <div slot="alert-content" class="clf security_real">
                <div class="real" v-show="real.num == 0">
                    <form id="realBox" method="post" enctype="multipart/form-data">
                        <div class="certimg">
                            <a href="javascript:;" class="font" @click="uploadImgChange('frontImg','frontFile')">
                                <div class="imgBg">
                                    <img src="../../../assets/images/sfz_front.png" alt="">
                                </div>                            
                                <p>点击上传身份证人像面</p>
                                <div class="frontImg" >
                                    <img src="../../../assets/images/transparent.png" id="frontImg"/>
                                </div>
                                <input type="file" id="frontFile" name="idcard_file_f">
                            </a>    
                        </div>
                        <div class="certimg">
                            <a href="javascript:;" class="back" @click="uploadImgChange('backImg','backFile')">
                                <div class="imgBg">
                                    <img src="../../../assets/images/sfz_back.png" alt="">
                                </div>
                                <p>点击上传身份证国徽面</p>
                                <div class="backImg">
                                    <img src="../../../assets/images/transparent.png" id="backImg"/>
                                </div>
                                <input type="file" id="backFile" name="idcard_file_b">
                            </a>     
                        </div>
                    </form>
                    <div class="clf tipBox">
                        <p class="frontTip"></p>
                        <p class="backTip"></p>
                        <p class="allTip" style="width:100%;"></p>
                    </div>
                    <p class="clf" v-if="mobileStatus != 1">
                        <label for=""><b>*</b>手机号码</label>
                        <input type="text" v-model.trim="real.mobile">
                    </p>
                    <p class="clf code" v-if="mobileStatus != 1">
                        <label for=""><b>*</b>验证码</label>
                        <input type="text" v-model.trim="real.code">
                        <a href="javascript:;" class="sendCode" @click="getCode(0)">获取验证码</a>
                    </p>
                    <p class="clf">
                        <label for=""><b>*</b>真实姓名</label>
                        <input type="text" v-model.trim="real.idCardName">
                    </p>
                    <p class="clf">
                        <label for=""><b>*</b>身份证号</label>
                        <input type="text" v-model.trim="real.idCardNo">
                    </p>
                </div>
                <div class="realEwm" v-show="real.num == 1">
                    <div class="ewm-box clf">
                        <span>
                            <b>
                                <img v-show="!scanImg" src="" alt="二维码生成中">
                                <img v-show="scanImg" :src="'data:image/png;base64,'+scanImg" alt="二维码生成中">                                
                                <b class="refushEwm" v-show="overState">
                                    <a href="javascript:;" @click="getScanImg">刷新二维码</a>
                                </b>
                            </b>
                            <p>{{scanTxt}}</p>
                        </span>
                        <span>
                            <img src="../../../assets/images/shoujitu.png" alt="">
                        </span>
                    </div>
                    <div class="ewm-tip">
                        <p>
                            使用你的手机版 <a href="http://m.gdca.com.cn/" target="_blank">真宜签</a> 完成实名认证 | <a href="javascript:;" @click="goStep">手机实名认证步骤</a><br>扫一扫完成网页端实名认证
                        </p>
                    </div>
                </div>
                <div class="realStep clf" v-show="real.num == 2">
                    <ul class="clf">
                        <li>
                            <img src="../../../assets/images/pic01.png" alt="">
                            <p>点击"个人中心"</p>
                        </li>
                        <li>
                            <img src="../../../assets/images/pic02.png" alt="">
                            <p class="step2">点击"开始实名认证"</p>
                        </li>
                        <li>
                            <img src="../../../assets/images/pic03.png" alt="">
                            <p class="step3">认证完成</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div slot="alert-footer" class="bottom">
                <div v-show="real.num == 0" :class="mobileStatus != 1 ? 'marginTop20':''">
                    <a class="center-btn" @click="sureRealHandle">{{real.sureBtnTxt}}</a>
                </div>
                <i class="iconfont icon-close" @click="closeRealModel"></i>
            </div>
        </alertModel> -->
        <Loading :text="'身份证识别中,请稍等'" v-show="realState"></Loading>
        <!-- 确认扫码实名认证 -->
        <alertModel :title="'当前用户与'+Config.Title+'用户信息不匹配'"  :type="2" :alelrtClassWidth="'600px'"  v-show="scanState"  @cancelHandle="cancelScanHandle" @sureHandle="sureScanHandle">
            <div slot="alert-content" class="scan-model">
                <p v-show="!matching.name">当前用户的姓名<span>{{scanData.curName}}</span>将更改为<span>{{scanData.authName}}</span></p>
                <p v-show="!matching.phone">当前用户的手机<span>{{scanData.curPhone}}</span>将更改为<span>{{scanData.authPhone}}</span></p>
            </div>
        </alertModel>

        <alertModel title="风险提示" v-show="warnState" :type="2" :cancelBtnTxt="'继续发起签署'" :sureBtnTxt="'去实名认证'" @cancelHandle="warnState = false;">
            <div slot="alert-content" class="warnState">
                <p>您的账号尚未实名认证，目前只能发起【未实名认证】合同，存在安全风险，建议实名认证后再发起签署。</p>
            </div>
            <div slot="alert-footer">
                <a href="javascript:;" class="cancel-btn"  @click="containSendSign">继续发起签署</a>
                <a href="javascript:;" class="sure-btn" @click="realClick">去实名认证</a>
            </div>
        </alertModel>
        <pinCom @pinSureHandle="issueHandle" :orgId="orgId"></pinCom>
        <Loading text="处理中...请稍等" v-show="loadingState"></Loading>
    </section>
    
</template>
<script>
    import translateImg from '@/assets/images/transparent.png';
    import { upLoadDate, upLoadMethod} from '@/assets/js/uploadFile.js';
    import pinCom from '@/components/common/setPin/setPin';
    import Vue from 'vue';
    export default{
        name:'index',
        data(){
            return{
                loadingState:false, 
                //未实名点击发起签约的数据
                warnState:false,
                // signPswState:false,         //设置签署密码弹框
                // signPsw:'',                 //签署密码
                // signPswErr:"",
                // stampImg:'',                //生成默认签章
                headIcon:1,
                curAccount:{},
                mobileStatus:0,            //绑定手机状态  1为已绑定
                realState:false,           //实名状态
                real:{                     //实名认证
                    state:false,           //状态
                    num:0,                 //0-实名认证  1-扫码认证
                    frontImg:null,         //身份证正面
                    backImg:null,          //身份证反面
                    idCardName:null,       //真实姓名
                    idCardNo:null,         //身份证号
                    idCardToken:null,      //身份证token
                    sureBtnTxt:'确定',     
                    mobile:'',
                    code:''
                },
                //扫码认证
                scanState:false,    
                scanTxt:'',           //扫描状态
                overState:false,      //扫描是否超时
                scanNum:0,            //扫码失败次数
                matching:{            //信息匹配
                    name:true,        //匹配
                    phone:true,       //匹配
                },
                scanTimer:null,       //扫码计时器
                scanImg:null,         //实名认证二维码
                claimUuid:null,       //获取二维码返回的id
                confirm:false,   
                scanData:{
                    curName:null,
                    curPhone:null,
                    authName:null,
                    authPhone:null,
                },
                sendCodeState:true,    //可不可以发送验证码（true 可发送）
                ResetCodeTime:0,       //倒计时
                /*发起签约公共数据 */
                ...upLoadDate,
                // /*最近文档 */
                file:{
                    list:[],
                    loading:false,
                    total:null
                },
                
                //获取数量
                showNum:{
                    one:'',
                    two:'',
                    three:'',
                    four:''
                },
                totalNum:null,
                pdfShow:false,
                pdfShowItem:null,
                pdfName:'',
                docId:'',
                news:[],
                orgId:''
            }
        },
        components:{
            pinCom
        },
        computed:{
            userState(){
                return this.$store.state.userState
            }
        },
        methods:{
            ...upLoadMethod,
            //获取机构证书按钮点击
            authorizeOrgan(){
                this.$store.commit("changePinState",true);
                this.$store.commit("changePinIndex",3);
            },
            //接受授权
            acceptHandle(item){
                this.orgId = item.orgId;
                this.$store.commit("changePinState",true);
                this.$store.commit("changePinIndex",2);                
            },
            //升级证书
            upgradeHandle(){
                this.$store.commit("changePinState",true);
                this.$store.commit("changePinIndex",4);          
            },
            //获取通知  1判断有需要接受授权的通知
            getNews(){
                let arr = []; 
                if(this.USERSTATE == 0){   //企业账户 判断是否要显示获取机构证书按钮
                    arr.push(this.REQUEST('GET',this.URL['personSeal'],{type:1,acceptStatus:1},true)),   //机构证书
                    arr.push(this.REQUEST('GET',this.URL['personSeal'],{type:0,acceptStatus:0},true))    //个人托管证书
                }else{   //个人账户
                    arr.push(this.REQUEST('GET',this.URL['personSeal'],{type:1,acceptStatus:0},true)),   //机构证书授权还未接受授权  1 1  机构证书授权已经接收授权证书
                    arr.push(this.REQUEST('GET',this.URL['personSeal'],{type:0,acceptStatus:0},true))    //个人托管证书
                }
                Promise.all(arr).then(res=>{
                    if(this.USERSTATE == 0){    
                        if(res[0].data.data.stampCertList.length  == 0 &&  this.CURACCOUNT.accStstus == 3){
                            this.news = [
                                {
                                type:'getAuthorize'     // 获取机构证书  
                                }
                            ]
                        }else{
                            this.news = [];
                        }
                        
                    }else{
                        this.news = res[0].data.data.stampCertList.map(item=>{
                            return {
                                ...item,
                                type:'acceptAuthorize'  //接受授权    
                            }
                        })
                    }
                    if(res[1] && res[1].data.data.stampCertList.certInfo && this.USERSTATE == 1){
                        let Arr = res[1].data.data.stampCertList.certInfo.certificatePolicyOid.split('.');
                        if(Arr[Arr.length-1] == 1 && this.CURACCOUNT.accStstus == 3){
                            this.news.push({
                                ownerName:res[1].data.data.stampCertList.certInfo.ownerName,
                                type:'upgrade'         //升级托管证书
                            })
                            Vue.prototype.hasUpGrade = true;
                        }
                    }
                })

            },
            //个人托管证书签发
            issueHandle(){               
                if(this.$store.state.pinIndex == 1){
                    $('#file').val('');
                    $('#file').click(); 
                }else{
                    this.loadingState = true;
                    let Timer = setInterval(()=>{
                        let  upLoadFileState= this.$store.state.upLoadFileState;
                        if(upLoadFileState){
                            clearInterval(Timer)
                            this.loadingState = false;
                            if(upLoadFileState == 3){  //机构证书获取成功   
                                this.$store.commit('changeUpLoadFileState',0)
                                this.getNews();     

                                this.$store.commit('changeDialog',{state:true,options:{title:'提示',text:`机构证书获取成功？`,confirmButtonText:'查看证书'}})
                                this.dialogConfirm.confirm().then(() => {
                                    this.$store.commit('changeDialog',{state:false,options:{}});
                                    this.$router.push({
                                        name:'ComSeal'
                                    })
                                }).catch(() => {
                                    this.$store.commit('changeDialog',{state:false,options:{}})
                                }) 
                            }else if(upLoadFileState == 4){  //接受授权成功
                                this.$store.commit('changeUpLoadFileState',0)
                                this.getNews();  

                                this.$store.commit('changeDialog',{state:true,options:{title:'提示',text:`接受授权成功`,confirmButtonText:'查看授权印章'}})
                                this.dialogConfirm.confirm().then(() => {
                                    this.$store.commit('changeDialog',{state:false,options:{}});
                                    this.$router.push({
                                        name:'ComSeal'
                                    })
                                }).catch(() => {
                                    this.$store.commit('changeDialog',{state:false,options:{}})
                                }) 
                            }else if(upLoadFileState == 5){  //托管证书升级成功
                                this.$store.commit('changeUpLoadFileState',0);
                                this.getNews();
                            }else{}                 
                        }
                    },60)
                }
                  
            },
            //继续发起签署
            containSendSign(){
                if(!this.CURACCOUNT.depositStatus){
                    this.$store.commit('changePinState',true);
                    this.$store.commit('changePinIndex',1);
                }else{
                    $('#file').val('');
                    $('#file').click();
                    this.warnState = false;
                }
            },
            //拒绝签署
            repealDocumentLight({docId,docName}){
                this.$store.commit('changeDialog',{state:true,options:{title:'删除',text:`确认拒签${docName}？`}})
                this.dialogConfirm.confirm().then(() => {
                    this.$store.commit('changeDialog',{state:false,options:{}});
                    this.httpPost(this.URL['repealDocumentLight'],{
                        docId:docId
                    },json=>{
                        if(json.meta.success){
                            this.modelCommonTip("拒签成功");
                            [this.pdfShow] = [false];
                            this.signDocCount('201',2);
                            this.searchDocumentLight();
                        }else{
                            this.modelCommonTip(json.meta.message);
                        }
                    })
                }).catch(() => {
                    this.$store.commit('changeDialog',{state:false,options:{}})
                })
            },
            downLoadHandle(docId){    //下载
                window.location.href=this.apiPath+this.URL['downloadDocument']+'?docId='+docId;                
            },            
            //到签署
            goSign(item){
                this.$router.push({name:'Sign',params:{docId:item.docId},query:{enter:'index'}})
            },
            //到详情
            goDetail(item){
                this.$router.push({name:'Detail',params:{docId:item.docId},query:{enter:'index'}})
            },
            fileState(value,overTime,type="status"){ //type = status  过滤状态   className-过滤class
                let statusTxt = '';
                let className = ''
                switch(value){
                    case '200':
                        statusTxt = "待签署";
                        className = "waitMe";
                        break;
                    case '201':
                        statusTxt = "待我签";
                        className = "waitMe";
                        break;
                    case '202':
                        statusTxt = "待他人签";
                        className = "waitHim";
                        break;
                    case '300':
                        statusTxt = "已完成";
                        className = "finish";
                        break;
                    case 'D400':
                        statusTxt = "已撤销";
                        className = "refuse";
                        break;
                    default:
                        break;
                        
                }
                if(type == 'status'){
                    if(overTime){
                        return '已过期'
                    }else{
                        return statusTxt;
                    }
                    
                }else{
                    if(overTime){
                        return 'overdue'
                    }else{
                        return className;
                    }
                }                
            },
            //获取最近文档(个人账户)
            searchDocumentLight(){
                this.file.loading = true;
                this.httpGet(this.URL['searchAllDocumentList'],{
                    page:1,
                    pageSize:5,
                    signStatus:'',
                    condition:'',
                    beginTime:'',
                    endTime:'',
                },(json)=>{
                    if(json.meta.success){
                        this.file.list = json.data.list;
                        this.file.total = json.data.totalCount;
                        this.file.loading = false;
                        this.file.list = this.file.list.map(item=>{
                            return {
                                ...item,
                                "iconName":item.creatorId == this.CURACCOUNT.accId ? 'icon-fa' : 'icon-shou'
                            }
                        })
                    }
                })
            },
            //小b，大buser
            signDocCount(status,num){    //获取数量             
                this.httpGet(this.URL.signDocCount,{
                    signStatus:status
                },(json)=>{
                    if(json.length > 30) return;   //解决返回数据错误
                    if(num == 1){
                        this.showNum.one = json;                        
                    }
                    if(num == 2){
                        this.showNum.two = json;
                    }
                    if(num == 4){
                        this.showNum.four = json;
                    }
                })
            },
            indexDraft(){  //获取草稿箱数据
                this.httpGet(this.URL.indexDraft,{},(json)=>{
                    this.showNum.three = json;
                })
            },
            realClick(){   //点击实名认证(有待修正)
                this.warnState = false;
                if(this.userState){  //个人  userState == 1
                    this.real.state = true;
                    this.real.num = 0;
                    //初始化实名认证数据            
                    this.real.frontImg = false;
                    this.real.backImg = false;
                    this.real.idCardNo = this.real.idCardName = this.real.idCardToken = null;
                    this.real.mobile = '';
                    $(".frontTip,.backTip,.allTip").text('');
                    $("#frontImg,#backImg").attr('src',translateImg);
                    $(".imgBg").show().siblings('p').show(); 
                }else{
                    // this.getStep();
                    this.$router.push({
                        name:'ComRealStep1'
                    })
                }                   
            },
            //获取当前实名认证在哪一步
            async getStep(){
                let json = await this.REQUEST('GET',this.URL['getStep'],{})
                
                if(json.meta.success){
                    const { step,verifyId } = json.data.data;
                    if(step == 'step0_start'){
                        this.$router.push({
                            name:'ComRealStep1'
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
                    }
                }else{
                    this.modelCommonTip(json.data.msg)
                }
            },
            closeRealModel(){  //关闭实名认证弹框
                this.real.state = false;
                this.ResetCodeTime = 0;
                clearInterval(this.scanTimer);
            },
            cancelScanHandle(){  //取消覆盖信息
                this.scanState = false;
                this.getScanImg();
            },
            sureScanHandle(){  //扫码信息不匹配，确定实名认证并覆盖信息
                this.confirm = true;
                this.authQrCodeBindCheck();
            },
            authQrCodeBindCheck(){
                this.httpGet(this.URL.authQrCodeBindCheck,{
                    claimUuid:this.claimUuid,
                    confirm:this.confirm
                },(result)=>{
                    if(result.meta.success){
                        this.modelCommonTip('实名认证成功!');
                        this.getData();
                        this.real.state=false;
                        this.scanState = false;     
                        clearInterval(this.scanTimer);                
                    }else{
                        let msg = result.meta.message;
                        if(msg == 'confirm'){  //真宜签账号和当前账号不匹配
                            this.scanData.curName = result.data.curName;
                            this.scanData.curPhone = result.data.curPhone,
                            this.scanData.authName = result.data.authName;
                            this.scanData.authPhone = result.data.authPhone;
                            if(this.scanData.curName === this.scanData.authName){
                                this.matching.name = true;
                            }else{
                                this.matching.name = false;
                            }
                            if(this.scanData.curPhone === this.scanData.authPhone){
                                this.matching.phone = true;
                            }else{
                                this.matching.name = false;
                            }
                            this.scanState = true;
                            clearInterval(this.scanTimer);
                            this.scanTxt = '';
                        }else if(msg == 'LOADING'){
                            this.scanTxt="扫码成功，等待输入pin码";
                             this.overState = true;
                        }else if(msg == 'CANCEL'){
                            this.scanTxt = '用户取消授权';
                            this.overState = true;
                            clearInterval(this.scanTimer);
                        }else if(msg == 'TIME_OUT'){
                            this.scanTxt = '二维码失效';
                            this.overState = true;
                            clearInterval(this.scanTimer)
                        }else if(msg == 'no.login'){   //下面是签吧的失败判断
                            this.modelCommonTip('请重新登录');

                        }else if(msg == 'not.allow' || msg == 'acc_type'){
                            this.modelCommonTip('您无权限');
                        }else if(msg == 'binded'){
                            this.modelCommonTip('您已实名认证');
                        }else if(msg == 'ERROR'){
                            this.modelCommonTip("服务器忙，请稍后重试");
                        }else if(msg == 'PHONE_BINDED'){
                            this.modelCommonTip('该手机号已绑定');
                            this.scanTxt = '该手机号已绑定';
                            this.scanState = false;
                            this.overState = true;
                            clearInterval(this.scanTimer)
                        }else{
                            
                        }
                    }
                })
            },
            changeRealState(){    //切换实名认证方式
                this.real.num = this.real.num == 0 ? 1 : 0;
                if(this.real.num == 1){
                    this.ResetCodeTime = 0;
                    this.sendCodeState = true;
                    this.getScanImg();
                }else{
                    clearInterval(this.scanTimer);                    
                }

            },
            getScanImg(){        //扫码认证获取二维码
                this.scanTxt = '';
                this.overState = false;
                clearInterval(this.scanTimer);
                this.httpGet(this.URL.authQrCodeBind,{},(result)=>{
                    // let result = response.data;
                    if(result.meta.success){
                        this.scanImg = result.data.qRCodeBase64;
                        this.claimUuid = result.data.claimUuid;
                        this.scanTimer = setInterval(()=>{
                            this.authQrCodeBindCheck();
                        },1000);
                    }else{
                        ++this.scanNum;
                        let msg = result.meta.message;                        
                        if(msg == 'no.login'){
                            this.modelCommonTip('请重新登录');
                            setTimeout(()=>{
                                window.location.href = this.linkHref + 'logout'
                            },2000)
                        }else if(msg == 'acc_type'){
                            this.modelCommonTip('您没有权限');
                            setTimeout(()=>{
                                this.real.num = 0;  
                            },1500)
                            
                        }else if(msg == 'binded'){
                            this.modelCommonTip("您已实名认证");
                        }else if(msg == 'busy'){
                            if(this.scanNum < 3){
                                this.getScanImg();
                            }else{
                                this.modelCommonTip('服务器忙，请稍后再试');
                                this.overState = true;
                            }                            
                        }else{
                            if(this.scanNum < 3){
                                this.getScanImg();
                            }else{
                                this.modelCommonTip('服务器忙，请稍后再试');
                                this.overState = true;
                            }
                        }
                    }
                })
            },
            goStep(){  //手机认证步骤
                this.real.num = 2;
                clearInterval(this.scanTimer);
            },
            backScanStep(){  //回到实名认证
                this.real.num = 1;
                this.getScanImg();
            },
            beforeReal(){    //实名认证前的验证
                if(!this.real.frontImg){
                    this.modelCommonTip('请上传身份证正面图片');
                    return false;
                }
                if(!this.real.backImg){
                    this.modelCommonTip('请上传身份证反面图片');
                    return false;
                }
                if(!this.real.idCardName){
                    this.modelCommonTip('真实姓名不能为空');
                    return false;
                }
                if(this.real.idCardName == ''){
                    this.modelCommonTip('真是姓名不能为空');
                    return false;
                }
                if(!this.real.idCardNo){
                    this.modelCommonTip('身份证号不能为空');
                    return false;
                }
                if(this.real.idCardNo == ''){
                    this.modelCommonTip('身份证号不能为空');
                    return false;
                }
                if(!this.validateQb.isCardNo(this.real.idCardNo)){
                    this.modelCommonTip('身份证号码不合法，请核对');
                    return false;
                }
                return true;
            },
            sureRealHandle(){ //点击实名认证确定按钮
                if(this.real.sureBtnTxt != '确定') return
                if(!this.beforeReal()) return;                 
                this.real.sureBtnTxt = "提交中...";
                if(this.mobileStatus != 1){  //未绑定手机（先绑定手机）
                    this.bindPhoneHandle(this.real.mobile,this.real.code,()=>{
                        this.userAuthrityHandle();  //调用实名认证接口
                    })
                }else{
                    this.userAuthrityHandle();
                }              
            },
            bindPhoneHandle(phone,code,success){   //绑定手机
                this.httpPost(this.URL.bindPhone,{
                    phone:phone,
                    code:code
                },(result)=>{
                    if(result.meta.success){
                        success();
                    }else{
                        this.real.sureBtnTxt = "确定";
                        let msg = result.meta.message;
                        if(msg == 'overtime'){
                            this.modelCommonTip('超时！请重新获取验证码！');
                        }else if(msg == 'wrong'){
                            this.modelCommonTip("验证码错误");
                        }else if(msg == 'wrongPhone'){
                            this.modelCommonTip('手机格式错误');
                        }else{
                            this.modelCommonTip(msg);
                        }
                    }
                    
                })
            },
            userAuthrityHandle(){  //调用实名认证接口
                this.real.sureBtnTxt = "提交中...";
                this.httpPost(this.URL.userAuthrity,{
                    "idCardName": this.real.idCardName,
                    "idCardNo":this.real.idCardNo,
                    "idCardToken":this.real.idCardToken
                },(result)=>{
                    this.real.sureBtnTxt = "确定";
                    if(result.meta.success){
                        this.real.state = false;
                        this.getData();
                        this.modelCommonTip("实名认证成功");

                        //初始化验证码数据
                        this.ResetCodeTime = 0;
                        this.sendCodeState = true;
                        $(".sendCode").text("获取验证码");
                        $(".sendCode").css({'cursor':'pointer','background':"#fff"});
                        
                    }else{
                        let msg = result.meta.message;
                        if(msg == 'NO_LOGIN'){
                            this.modelCommonTip("登录已过期");
                            setTimeout(()=>{
                                window.location.href=this.linkHref+"login";
                            },2000)
                        }else if(msg == 'dunplicate.phone'){
                            this.modelCommonTip("该手机号已经实名认证过了，不能重复认证");
                        }else if(msg == 'identify.false'){
                            this.modelCommonTip("该姓名与身份证号码不对应，请确认");
                        }else if(msg == 'identify.error'){
                            this.modelCommonTip("身份证信息验证失败，请重试")
                        }else if(msg == 'ERROR'){
                            this.modelCommonTip("系统异常，请稍候重试");
                        }else if(msg == 'WRONG_ACCOUNT_TYPE'){
                            this.modelCommonTip("实名认证的账户类型不正确");
                        }else if(msg == 'NO_PARAM'){
                            this.modelCommonTip("参数为空");
                        }else if(msg == 'NO_RESPONSE'){
                            this.modelCommonTip("系统异常，请稍后重试");
                        }else if(msg == 'DUNPLICATE'){
                            this.modelCommonTip("此手机号或身份证已被认证，不能重复申请");
                        }else if(msg == 'NOT_RELATE'){
                            this.modelCommonTip("上传的身份证照与填写的姓名不匹配");
                        }else if(msg == 'BAD_DATA'){
                            this.modelCommonTip("实名认证数据错误，认证失败");
                        }else{
                            this.modelCommonTip(msg);
                        }
                    }
                })
            },
            realHandle(){   //调用OCR
                let This = this;
                if(!this.real.frontImg){
                    $(".frontTip").text("请上传身份证正面图片")
                    return;
                }
                if(!this.real.backImg){
                    $(".backTip").text("请上传身份证背面图片")
                    return;
                }
                this.realState = true;
                let formData = new FormData();             
                formData.append('idcard_file_f', $('#frontFile')[0].files[0]);
                formData.append('idcard_file_b', $('#backFile')[0].files[0]);
                $.ajax({
                    url: This.apiPath+This.URL['userAuthrityStep'],
                    dataType: 'json',
                    type: 'POST',
                    // headers: {'token': sessionStorage.getItem("token")},
                    processData: false,
                    contentType: false,
                    cache: false,
                    data: formData,
                }).done((result) => {
                    This.realState = false;
                    This.real.idCardToken = result.data.idCardToken;
                    if(result.meta.success){
                        This.real.idCardName = result.data.idCardName;
                        This.real.idCardNo = result.data.idCardNo;
                        $(".allTip").text("身份证上传完成");
                        $(".frontTip,.backTip").text("");
                        This.realState = false;
                    }else{
                        if(result.meta.message == 'invalid.data.idcard_f'){
                            $(".frontTip").text("请重新上传身份证正面图片")
                        }else if(result.meta.message == 'invalid.data.idcard_b'){
                            $(".backTip").text("请重新上传身份证背面图片")
                        }else if(result.meta.message == 'error'){
                            This.modelCommonTip("服务器异常，请稍后重试");
                        }else{
                            This.modelCommonTip(result.meta.message)
                        }
                    }

                }).fail((err) => {
                    console.log(err)    
                });
            },
            //实名认证上传图片
            uploadImgChange(objImg,obj){   //点击上传图片
                $("#"+obj).val("");
                $(".allTip").text("");
                $("#"+obj).unbind().on('change',()=>{
                    let name = $("#"+obj).val().split('.')[1];
                    if(name != 'png' &&  name != "gif" && name != "jpg" && name != "jpeg"){
                        this.modelCommonTip("不支持该类型，请上传png、gif或jpg类型图片");
                        return false;
                    }
                    var oMyFile = $("#"+obj);
                    if(oMyFile.files){  //判断ie是否支持此属性
                        let filesSize = $("#"+obj)[0].files[0].size/1024/1024;
                        if(filesSize > 2){
                            this.modelCommonTip("请上传小于2M的图片");
                            return false;
                        }
                    }                    
                    this.change(objImg, obj);

                    if(objImg == 'backImg'){   
                        $('.backTip').text("");
                        $('.backImg').siblings('.imgBg').hide();
                        $('.backImg').siblings('p').hide();
                    }else{
                        $('.frontTip').text("");
                        $('.frontImg').siblings('.imgBg').hide();    
                        $('.frontImg').siblings('p').hide();                    
                    }
                    
                //    $('#stampFile').val('');  //解决第二次选同一张图片，不能触发onchange事件
                })
            },
            change(pre_id,file_id) {
                let This = this;
                var pic = document.getElementById(pre_id), file = document.getElementById(file_id);
                if (file == undefined || file == '') {
                    return;
                }
                var ext=file.value.substring(file.value.lastIndexOf(".")+1).toLowerCase();
                if(ext == ''){
                    return;
                }
                if(ext!='png'&&ext!='jpg'&&ext!='jpeg'&&ext!='gif'){
                    this.modelCommonTip("图片的格式必须为png、jpg、gif格式！");
                    return;
                }
            
                if(file.files){
                    this.html5Reader(file,pre_id);
                }else{
                    file.select();
                    file.blur();
                    var reallocalpath = document.selection.createRange().text;
                    pic.width=116;
                    pic.height=86;
                    pic.style.opacity = 1;
                    pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src=\"" + reallocalpath + "\")";
                    pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
                    if(pre_id == 'backImg'){
                        This.real.backImg = true;
                    }else{
                        This.real.frontImg = true;
                    }
                    setTimeout(()=>{
                        if(This.real.frontImg && This.real.backImg){
                            This.realHandle();
                        }
                    }) 
                }
            },
            html5Reader(file,pre_id){
                let This = this;
                var file = file.files[0];
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e){
                    var pic = document.getElementById(pre_id);
                    $(pic).css('opacity',1);
                    pic.src=this.result;
                    if(pre_id == 'backImg'){
                        This.real.backImg = true;
                    }else{
                        This.real.frontImg = true;                        
                    }
                    setTimeout(()=>{
                        if(This.real.frontImg && This.real.backImg){
                            This.realHandle();
                        }
                    }) 
                }
            },
            getCode(num){  //获取验证码 (0-实名认证获取验证码   1-绑定手机或者修改手机获取验证码)        
                if(this.validateQb.isEmpty(this.real.mobile)){
                    this.modelCommonTip('手机号码不能为空');
                    return false;
                }
                if(!this.validateQb.isPhone(this.real.mobile)){
                    this.modelCommonTip('手机号码格式不正确');
                    return false;
                }    
                if(!this.sendCodeState) return false;  
                this.httpGet(this.URL.verificationCode,{
                    mobileNo:this.real.mobile
                },(result)=>{
                    if(result == "success"){
                        this.sendCodeState = false;
                        this.ResetCodeTime = 60;
                        this.resetCode();          
                    }
                })
            },
            resetCode(){ //验证码倒计时
                this.ResetCodeTime -- ;
                if(this.ResetCodeTime <= 0){
                    this.ResetCodeTime = 60;
                    this.sendCodeState = true;
                    $(".sendCode").text("获取验证码");
                    $(".sendCode").css({'cursor':'pointer','background':"#fff"});
                }else{
                    $(".sendCode").text("重新发送("+this.ResetCodeTime+'s)');
                    $(".sendCode").css({'cursor':'not-allowed','background':'#e6e7ed'});
                    setTimeout(()=>{
                        this.resetCode();
                    },1000)
                }                
            },            
            upFn(event) {
                if(!this.signFile.size) {
                    this.modelCommonTip('请上传需要签署的PDF文件')
                    return false;
                }
                
                this.$store.commit('saveUpFile',this.signFile);
                this.$store.commit('saveSignTitle',this.signTitle);
                this.$store.commit('savePdfFileName',this.pdfFileName);
                if(!this.CURACCOUNT.depositStatus){   //不存在托管证书的时候
                    this.loadingState = true;
                    let Timer = setInterval(res=>{
                    let upLoadFileState = this.$store.state.upLoadFileState;
                        if(upLoadFileState){
                            clearInterval(Timer);
                            this.$store.commit('changePinState',false)
                            this.$store.commit('changeUpLoadFileState',0) 
                            if(upLoadFileState != 2){  //成功
                                this.$router.push({
                                    name:'ToFill',
                                    query:{
                                        againState:2
                                    }
                                })
                            }else{
                                this.loadingState = false;
                                this.modelCommonTip("文件上传失败，请重新上传")
                            }
                        }
                    },60)
                }else{
                    this.$store.commit('changeUpLoadFileState',0) 
                    this.$store.commit('changePinState',false)
                    this.$router.push({
                        name:'ToFill',
                        query:{
                            againState:2
                        }
                    })
                }
            },
            queryIcon(){                
                this.REQUEST('GET',this.URL['queryIcon'],{}).then(({meta,data})=>{
                    this.loadingState = false;
                    if(meta.success && data.data){
                        this.headIcon = data.data.icon;
                    }else{
                        this.headIcon = 0;
                        if(this.CURACCOUNT.accStstus !=3 && this.USERSTATE == 1) {   //未实名
                            this.getHeadIcon();
                        }
                    }
                })
            },
            async getHeadIcon(){
                this.headIcon = await this.REQUEST('GET',this.URL['getHeadIcon'],{});
            }
        },
        mounted(){
            this.clickFileFn('#drop_area','#file');
            this.dragFileFn();
            this.curAccount = this.CURACCOUNT;
            this.signDocCount('202',1);
            this.signDocCount('201',2);
            this.signDocCount('300',4);
            this.indexDraft();
            this.searchDocumentLight();
            // this.getHeadIcon();
            this.queryIcon();
            this.getNews();
            // this.$store.commit('changeDialog',{state:true,options:{title:'删除联系人',text:`确定从通讯录删除<span>李四 13412352645</span>该联系人吗？`}})
            // this.dialogConfirm.confirm().then(() => {
            //     this.$store.commit('changeDialog',{state:false,options:{}});
                
            // }).catch(() => {
            //     this.$store.commit('changeDialog',{state:false,options:{}})
            // })
            
        }
    }
</script>
