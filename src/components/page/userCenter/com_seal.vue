<template>
    <section class="seal">
        <div class="addCert" v-if="!accountType">
            <h3><img src="../../../assets/images/red/addCertIcon.png" alt="" width="29" height="30"><span>添加证书</span></h3>
            <div class="addCertInfo">
                <div class="step">
                    <span><b>1</b><strong>下载证书客户端</strong></span>
                    <span><i></i></span>
                    <span><b>2</b><strong>添加证书</strong></span>
                </div>
                <div class="oper">
                    <div class="sideLeft">
                        <p>添加ukey证书需要先下载证书客户端，安装成功之后确保<br/>ukey已插入usb接口，才可进行证书的添加。</p>
                        <a href="http://justsign.com.cn/downloadCertClient" target="_blank" class="inserShadow2">下载证书客户端</a>
                    </div>
                    <div class="sideRight">
                        <p>直接将UKEY插入usb接口，系统会自动检测，您可<br/>直接点击添加证书按钮即可。</p>
                        <a href="javascript:;" @click="pinState = true"  class="inserShadow2">{{addCertBtn}}</a>
                    </div>
                </div>
            </div>
            <!-- <a href="javascript:;" @click="getCert(1)">{{addCertBtn}}</a>      -->
        </div>
        <div class="loadSource" style="top:400px;" v-show="certLoading" ><!---->
            <p><img :src="loadingTheme" alt="" width="80" height="80"></p>
        </div>
        

        <!-- 个人等待接受机构证书授权 -->
        <div class="acceptCert" v-if="USERSTATE == 1 && waitCert.length > 0 ">
            <h3>等待接受授权证书列表</h3>
            <ul>
                <li v-for="(item,index) in waitCert"  :key="index">
                    <span>证书名称：{{item.certInfo.ownerName}}</span>
                    <span><a href="javascript:;" @click="acceptHandle(item)">接受授权</a></span>
                </li>
            </ul>
        </div>


        <div class="no-message" v-if=" warrant_cert_seal.length == 0 && !delegateCert && accountType && !certLoading "> <!--!certLoading && certList.length == 0 && USERSTATE == 0 && -->
            <p><img src="../../../assets/images/noAnyThing.png" alt="" ></p>
            <p>暂无数据</p>
        </div>
        <!--个人托管证书-->
        <div class="sealBox" v-if="delegateCert">   <!-- v-if="USERSTATE == 1"-->
            <h3>证书名称：{{delegateCert.ownerName}}<span @click="goCreateSeal(delegateCert,1)"><i class="iconfont icon-add_empty"></i>添加签章</span><span @click="certInfo = delegateCert;lookCertState = true">查看证书</span></h3>
            <ul class="clf" v-if="delegateSeal.length > 0">
                <li v-for="(item,index) in delegateSeal" :key="index" class="item" >
                    <a href="javascript:;">
                        <!-- <span class="default" v-if="itemIn.isDefault == 'Y'"><img src="../../../assets/images/default.png" alt=""></span> -->
                        <b><img v-if="item.stampImg" :src="'data:image/png;base64,'+item.stampImg" alt=""></b>
                        <div class="operation">
                            <!-- <span v-if="$store.USERSTATE == 1" @click.stop = "setDefaultStamp(itemIn.stampBindId)"><i class="iconfont icon-default"></i>设为默认</span> -->
                            <span :style="{width:'100%'}" @click.stop = "delStamp(item,'delegate')"><i class="iconfont icon-del"></i>删除</span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>

        <!-- 授权托管证书（个人 已接受授权） / 机构证书（企业）-->
        <div class="sealBox" v-if="warrant_cert_seal.length > 0"  v-for="(item,index) in warrant_cert_seal" :key="index"> 
            <h3>证书名称：{{item.certInfo.ownerName}} <span @click="goCreateSeal(item.certInfo,1,2)" v-if="USERSTATE == 0"><i class="iconfont icon-add_empty"></i>添加签章</span><span @click="certInfo = item.certInfo;lookCertState = true">查看证书</span></h3>
            <ul class="clf" v-if="item.stampList.length > 0" >
                <li v-for="(item2,index2) in item.stampList" :key="index2" class="item" >
                    <a href="javascript:;">
                        <!-- <span class="default" v-if="itemIn.isDefault == 'Y'"><img src="../../../assets/images/default.png" alt=""></span> -->
                        <b><img v-if="item2.stampImg" :src="'data:image/png;base64,'+item2.stampImg" alt=""></b>
                        <div class="operation" v-if="USERSTATE == 0 ">
                            <!-- <span v-if="$store.USERSTATE == 1" @click.stop = "setDefaultStamp(itemIn.stampBindId)"><i class="iconfont icon-default"></i>设为默认</span> -->
                            <span :style="{width:'100%'}" @click.stop = "delStamp(item2,'delegate')"><i class="iconfont icon-del"></i>删除</span>
                        </div>
                    </a>                    
                </li>
            </ul>
        </div>


        <!-- <div class="no-message" v-if=" certListAll.length == 0 && stampList.length == 0 && !accountType && !certLoading">
            <p><img src="../../../assets/images/noAnyThing.png" alt="" ></p>
            <p>暂无数据</p>
        </div> -->
        <!-- 企业印章 -->
        <div class="sealBox" v-for="(item,index) in certListAll" :key = "index">
            <h3>证书名称：{{item.ownerInfo}}{{'('+item.stampArr.length+')'}}<span @click="goCreateSeal(item,0)"><i class="iconfont icon-add_empty"></i>添加签章</span><span @click="certInfo = item;lookCertState = true">查看证书</span></h3>
            <ul class="clf">
                <li v-for="(itemIn,index) in item.stampArr" :key="index" class="item">
                    <a href="javascript:;">
                        <span class="default" v-if="itemIn.isDefault == 'Y'"><img src="../../../assets/images/default.png" alt=""></span>
                        <b><img :src="'data:image/png;base64,'+itemIn.base64_data" alt=""></b>
                        <div class="operation">
                            <!-- <span v-if="USERSTATE == 1" @click.stop = "setDefaultStamp(itemIn.stampBindId)"><i class="iconfont icon-default"></i>设为默认</span> -->
                            <span :style="{width:'100%'}" @click.stop = "delStamp(itemIn,'sign')"><i class="iconfont icon-del"></i>删除</span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
        <!-- 授权印章 -->
        <div class="sealBox" v-if="USERSTATE == 1 && stampList.length > 0">
            <h3>授权签章样式</h3>
            <ul class="clf">
                <li v-for="(itemIn,index) in stampList" :key="index" class="item">
                    <a href="javascript:;">
                        <span class="default" v-if="itemIn.isDefault == 'Y'"><img src="../../../assets/images/default.png" alt=""></span>
                        <b><img :src="'data:image/png;base64,'+itemIn.base64_data" alt=""></b>
                        <!-- <div class="operation">
                            <span v-if="$store.USERSTATE == 1" @click.stop = "setDefaultStamp(itemIn.stampBindId)"><i class="iconfont icon-default"></i>设为默认</span>
                            <span :style="{width:$store.USERSTATE == 1 ? '' :'100%'}" @click.stop = "delStamp(itemIn)"><i class="iconfont icon-del"></i>删除</span>
                        </div> -->
                    </a>
                </li>
            </ul>
        </div>

        <pinCom @pinSureHandle="pinEnterHandle" :orgId="acceptOrgId"></pinCom>

        <!-- 查看证书 -->
        <div class="lookCertCover" v-show="lookCertState">
            <div class="lookCert">
                <i class="iconfont icon-del-solid close" @click="lookCertState = false;"></i>
                <div class="certPage">
                    <!-- <img class="seal" src="../../../assets/images/cert_z.png" alt=""> -->
                    <h3>数字证书</h3>
                    <ul v-if="certInfo">
                        <li class="box">
                            <label for="">颁发给</label>
                            <p v-if="certInfo.keyType == 'deposit'">{{certInfo.ownerName}}</p>
                            <p v-else>{{certInfo.ownerInfo}}</p>
                        </li> 
                        <li class="box">
                            <label for="">颁发机构</label>
                            <p>{{certInfo.issuer | filterorganization}}</p>
                        </li>                        
                        <li class="box">
                            <label for="">证书编号</label>                            
                            <p v-if="certInfo.keyType == 'deposit'">{{certInfo.certNo}}</p>
                            <p v-else>{{certInfo.cert_no}}</p>
                        </li>
                        <li class="box">
                            <label for="">证书序列号</label>                            
                            <p v-if="certInfo.keyType == 'deposit'">{{certInfo.certSerialNo}}</p>
                            <p v-else>{{certInfo.com_cert_id}}</p>
                        </li>
                        <li class="box">
                            <label for="">有效期</label>
                            <p v-if="certInfo.keyType == 'deposit'">{{certInfo.notBefore | filterdata}} - {{certInfo.notAfter | filterdata}}</p>
                            <p v-else>{{certInfo.valid_begin |filterdata }}- {{ certInfo.valid_end | filterdata}}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <bindUkey :title="'添加证书'"  :operIndex="2" v-show="pinState" @cancelHandle="pinState = false;getCertList()"></bindUkey> 
        <Loading text="处理中...请稍等" v-show="loadingState"></Loading>        
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

    //gdca
    import '@/assets/js/GDCAPKI/jquery.jsonp.js'; 
    const Base64String = require("@/assets/js/GDCAPKI/base64.js").default;
    import '@/assets/js/GDCAPKI/gdca-pki-errcode.js'; 
    const $GDCA = require('@/assets/js/GDCAPKI/gdca-pki-lib.js').default;     
    import '@/assets/js/GDCAPKI/gdca_sof_method.js'; 
    const gMethod = require('@/assets/js/GDCAPKI/gdca_sof_method.js');
    import Vue from 'vue';
    Vue.filter('filterorganization', function (value) { //过滤颁发机构
        let statusTxt = '无法获取';
        if(value){
            let certIssuer = value.toLowerCase();
            if(certIssuer.indexOf('gdca') != -1 || ( certIssuer.indexOf('guang') != -1 && certIssuer.indexOf('certificate auth') != -1)){
                statusTxt = '数安时代科技股份有限公司（GDCA）';
            }else{
                statusTxt = value;            
            }
        }
        
        return statusTxt;
    });
    import pinCom from '@/components/common/setPin/setPin';
    import bindUkey  from '@/components/common/bindUkey/bindUkey.vue';
    export default{
        name:"seal",
        data(){
            return{
                showDialog:false,
                lookCertState:false,
                hoverIndex:null,
                hoverIndex2:null,
                certLoading:true,    //证书加载状态
                certListAll:[],      //证书总列表
                certList:[],         //证书列表-临时变量
                stampList:[],        //印章列表
                addCertBtn:'添加证书',
                certInfo:null,       //证书信息
                delegateCert:'',                 //个人托管证书和印章
                delegateSeal:[],                 //个人托管证书签章
                warrant_cert_seal:[],            //授权证书和印章
                waitCert:[],                     //等待接受授权证书
                acceptOrgId:'',                  //接受授权证书id
                /***************/                

                loadingState:false,
                pinState:false,
            }
        },
        components:{
            pinCom,
            bindUkey
        },
        methods:{
            goCreateSeal(item,num,type=1){  //num-0企业添加   num-1个人添加  type=1 //个人托管或ukey  type=2 //机构
                if(num == 0 || type == 2 ){  //|| type == 2
                    this.$router.push({
                        name:'AddSeal',
                        query:{
                            certCode:type == 1 ? item.cert_no : 'company',
                            certName:item.ownerInfo ? item.ownerInfo : item.owner
                        }
                    })
                }else{
                    this.$router.push({
                        name:'jSignature',
                        query:{
                            type
                        }
                    })
                }
            },
            //获取证书列表
            getCertList(){
                this.certLoading = true;
                this.httpGet(this.URL['getStampAndCertList'],{},(json)=>{
                    if(json.meta.success){
                        this.certList = this.certListAll = [];
                        if(json.data.certList.length ==  0){
                            this.certLoading = false;
                            return;
                        }
                        this.certList = json.data.certList.map((item)=>{return {...item,stampArr:[]}});
                        this.getStampPerTotal(json.data.stampCount)
                    }else{
                       this.modelCommonTip(json.meta.message);
                    }
                })
            },
            //获取证书对应的印章
            getStampPerTotal(total){
                if(total <= 0) return ;
                for(let i = 1 ; i <= total ; i++){
                    this.httpPost(this.URL['getStampPer'],{ajaxTime:i},(json)=>{
                        if(this.certList.some(item=>item.certCode != json.data.stampList[0].cert_no)){   //判断当前拿回来的签章证书跟自己已存在的证书有无对应，对应的不添加进来
                            this.stampList.push(json.data.stampList[0]);  //印章列表
                        }
                        // this.stampList.push(json.data.stampList[0]);  //印章列表
                        json.data.stampList[0].ajaxTime= i;
                        for(let j = 0 ; j < this.certList.length; j++){
                            if(json.data.stampList[0].certCode == this.certList[j].cert_no){
                                this.certList[j].stampArr.push(json.data.stampList[0]);
                                this.certList[j].stampArr.sort(this.compare('ajaxTime'))
                            }
                        }
                    })
                }     
                this.certLoading = false;           
                this.certListAll = this.certList;
            },
            //根据数组的某一项进行升序排序
            compare(property){   
                return function(a,b){
                    var value1 = a[property];
                    var value2 = b[property];
                    return value1 - value2;
                }
            }, 
            //设置默认签章
            setDefaultStamp(stampId){  
                this.httpPost(this.URL['defaultStamp'],{
                    stampBindId:stampId
                },(json)=>{
                    if(json.meta.success){
                        this.getCertList();
                    }else{
                        this.modelCommonTip(json.meta.message)
                    }
                })
            },
            //确认删除签章
            delStamp(item,type="sign"){  //sign为普通印章   delegate-为托管印章
                this.$store.commit('changeDialog',{state:true,options:{title:'删除印章',text:`确认删除该印章？`}})
                let linkUrl = '';
                if(type == 'sign'){
                    linkUrl = this.URL['delStamp']
                }else{
                    linkUrl = this.URL['personDelseal'];
                }
                this.dialogConfirm.confirm().then(() => {
                    this.httpPost(linkUrl,{stampId:item.stampId},(json)=>{
                        if(json.meta.success){
                            this.$store.commit('changeDialog',{state:false,options:{}});
                            if(type == 'sign'){
                                this.getCertList();
                            }else{
                                this.personSeal();
                            }
                           
                        }
                    })
                }).catch(() => {
                    this.$store.commit('changeDialog',{state:false,options:{}})
                }) 
            },   
            //机构证书授权按钮点击
            authorizeOrgan(){
                this.$store.commit("changePinState",true);
                this.$store.commit("changePinIndex",3);
            },
            //接受授权按钮点击
            acceptHandle(item){
                this.acceptOrgId = item.orgId;
                this.$store.commit("changePinState",true);
                this.$store.commit("changePinIndex",2);
            },
            //PIN码确认
            pinEnterHandle(){
                this.loadingState = true;
                let Timer = setInterval(()=>{
                    let  upLoadFileState= this.$store.state.upLoadFileState;
                    if(upLoadFileState){
                        clearInterval(Timer)
                        this.loadingState = false;
                        if(upLoadFileState == 3){  //机构证书获取成功                            
                            this.modelCommonTip("授权成功");
                            this.personSeal();
                        }else if(upLoadFileState == 4){  //接受授权成功
                            this.modelCommonTip("接受授权成功");
                            this.personSeal();
                        }
                        this.$store.commit('changeUpLoadFileState',0)
                    }
                },60)
            }, 
            //获取当前登录用户的托管证书及印章
            personSeal(){   //type 0个人托管  1-机构托管和授权托管
                this.certLoading = true;
                let arr = [];
                if(this.USERSTATE == 0){   //机构的
                    arr = [
                        this.REQUEST('GET',this.URL['personSeal'],{type:0,acceptStatus:0},true),
                        this.REQUEST('GET',this.URL['personSeal'],{type:1,acceptStatus:1},true),
                    ]
                }else{  //个人的
                    arr = [
                        this.REQUEST('GET',this.URL['personSeal'],{type:0,acceptStatus:0},true),
                        this.REQUEST('GET',this.URL['personSeal'],{type:1,acceptStatus:1},true),     //已接受授权
                        this.REQUEST('GET',this.URL['personSeal'],{type:1,acceptStatus:0},true)      //等待接受授权
                    ]
                }
                Promise.all(arr).then(result=>{
                    this.certLoading = false;
                    /*个人托管证书 */
                    this.delegateSeal = result[0].data.data.stampCertList.stampList || [];
                    this.delegateCert = result[0].data.data.stampCertList.certInfo || null;
                    if(this.delegateCert){
                        this.delegateCert.keyType = 'deposit'
                    }

                    /*机构托管证书 或 个人接受授权机构托管证书*/
                    this.warrant_cert_seal = result[1].data.data.stampCertList;
                    this.warrant_cert_seal = this.warrant_cert_seal.map(item=>{
                        return {
                            stampList:item.stampList,
                            certInfo:{
                                ...item.certInfo,
                                keyType:'deposit'
                            }
                        }
                    })

                    if(result[2]){
                        this.waitCert = result[2].data.data.stampCertList;
                    }
                })
            }
        },
        mounted(){
            if(this.accountType){
                this.personSeal();
            }else{               
                this.getCertList();
            }
            $('.seal').on('mouseenter','.item',function(){
                $('.operation').hide();
                $(this).find('.operation').fadeIn();
            })
            $('.seal').on('mouseleave','.item',function(){
                $('.operation').fadeOut();
            })
        }
        
    }
</script>