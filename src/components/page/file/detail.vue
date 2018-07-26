<template>
    <section class="detail contain">
        <nav @click="back"><i class="iconfont icon-back"></i>详情页</nav>
        <div class="detailBox">
            <div class="info clf">
                <div class="sideLeft">
                    <h3>
                        <p :title="detailInfo.docName">{{detailInfo.docName}}</p>
                        <span :class="fileState(detailInfo.signStatus,0)">{{fileState(detailInfo.signStatus,1)}}</span>
                    </h3>
                    <p>抄送：{{ccSigner ? ccSigner : '暂无抄送人'}}</p>
                    <p  v-if="detailInfo.duration < 4133865600000">有效期：{{detailInfo.duration|filterdata(0)}}</p>
                    <p  v-if="detailInfo.duration >= 4133865600000">有效期：永久有效</p>
                    <p class="state">
                        <span class="signing" v-if="detailInfo.signStatus == '200' || detailInfo.signStatus == '201' || detailInfo.signStatus == '202'">签署中</span>
                        <span class="order">{{detailInfo.signOrderType == '002' ? '顺序签' : '任意签'}}</span>
                    </p>
                </div>
                <div class="sideRight">
                    <ul>
                        <li>
                            <a href="javascript:;" @click="downLoadHandle">
                                <p class="iconfont icon-download"></p>
                                <p>下载</p>
                            </a>
                        </li>
                        <!-- <li>
                            <a href="javascript:;">
                                <p class="iconfont icon-print"></p>
                                <p>打印</p>
                            </a>
                        </li>-->
                        <li>
                            <a href="javascript:;" @click="previewDoc">
                                <p class="iconfont icon-preview" style="font-size:20px;"></p>
                                <p>预览</p>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="detailList">
                <div class="sender box">
                    <span><i class="iconfont icon-headimg"></i></span>
                    <span>{{sender.name ? sender.name : sender.mobile }}</span>
                    <span>{{sender.mobile}}</span>
                    <span class="iconfont icon-official_seal opacity"></span> 
                    <span>{{sender.sendTime}}</span>                   
                    <span><i class="iconfont icon-sender"></i>发起人</span>                    
                </div>
                <div class="list">
                    <ul>
                        <li class="box line">
                            <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        </li>
                        
                        <li class="box"  :class="[index == turn ? 'turn':'',item.signed?'active':'']" v-for="(item,index) in signerList"  :key="index">  <!--active-->
                            <span :class="[detailInfo.signOrderType == '002' ? '':'opacity']"><b>{{index+1}}</b></span>
                            <span><i class="iconfont icon-circle-icon"></i></span>
                            <span class="iconfont icon-headimg"></span>
                            <span :title="item.name">{{item.name == '未注册用户' ? item.mobile : item.name}}</span>
                            <!-- <span><b class="shengl">{{item.stampType === '1' ? '手机号' : item.accNo}}</b> <i class="iconfont" :class="[item.stampType === '1' ? 'icon-sign_name':'icon-official_seal']"></i></span> -->
                            <span :title="item.accNo">
                                <b class="shengl">{{item.accNo}}</b>
                                <i class="iconSmall">{{item.accType != 1 ? '个人':'企业'}}</i> 
                                <!-- <i class="iconfont" :class="[item.accType != 1 ? 'icon-sign_name':'icon-official_seal']"></i> -->
                            </span>
                            <span></span>
                            <span class="shengl">{{item.signTime ? item.signTime : item.cancelTime}}</span>
                            <span :class="[item.signed ? 'finish' : 'unfinish',item.signStatus == 'NONE' ? 'opacity':'']" > <i class="iconfont " :class="[item.signed ? 'icon-check_gou':'icon-clock']"></i>{{item.signStatus == 'D400' ? '已撤销' : item.signed  ? '已签署' : '待签署'}}</span>
                        </li>
                        <!-- <li class="box turn">
                            <span><b>01</b></span>
                            <span><i class="iconfont icon-circle-icon"></i></span>
                            <span class="iconfont icon-headimg"></span>
                            <span>张三</span>
                            <span><b class="shengl">123818812345678@139.com.cn</b> <i class="iconfont icon-official_seal"></i></span>
                            <span></span>
                            <span>7.07.03 11:33</span>
                            <span class="finish"> <i class="iconfont icon-check_gou"></i>已签署</span>
                        </li>
                        <li class="box">
                            <span><b>01</b></span>
                            <span><i class="iconfont icon-circle-icon"></i></span>
                            <span class="iconfont icon-headimg"></span>
                            <span>张三</span>
                            <span><b class="shengl">123818812345678@139.com.cn</b> <i class="iconfont icon-official_seal"></i></span>
                            <span></span>
                            <span>7.07.03 11:33</span>
                            <span class="unfinish"> <i class="iconfont icon-clock"></i>待签署</span>
                        </li> -->
                        <li class="box bottom">
                            <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="operationBox clf"> <!--200是真宜签签署 || 待签署-->
                <div v-show="USERSTATE == 0" v-if="detailInfo.signStatus == '201' && !detailInfo.isOverTime">
                    <div class="clf" v-if="detailInfo.docId"> 
                        <a href="javascript:;" class="refuse" @click="repealDocumentLight">{{refuseBtn}}</a>
                        <a @click="goSign" class="sign">签署</a>
                    </div>
                    <div v-else>
                        <router-link :to="{name:'Sign',params:{'docId':detailInfo.docId},query:{enter:'detail'}}" class="signBtn">签署</router-link>
                    </div>
                </div>
                <div v-show="USERSTATE == 1">
                    <div v-if="hasOwnSign">  
                        <a href="javascript:;" class="refuse" @click="repealDocumentLight">{{refuseBtn}}</a>
                        <a @click="goSign" class="sign">签署</a>
                    </div>
                </div>
            </div>            
        </div>
        <div class="blank50"></div>
    </section>
</template>
<script>
    export default{
        name:'detail',
        data(){
            return{
                tabIndex:'',  //传过来的参数
                tabStatus:'',
                pageIndex:'',
                enter:'',

                docId:'',  //文档id
                detailInfo:{},    //文档详细信息
                ccSigner:'',      //抄送人
                sender:{},        //发送人
                signerList:[],    //签署人列表
                turn:null,        //轮到谁签署了
                refuseBtn:'拒签',
                hasOwnSign:false,   //判断签署人里面有没有人是当前账号的，并且签署状态是201的
            }
        },
        methods:{
            goSign(){
                const {tabIndex,tabStatus,pageIndex} = this;
                this.$router.push({
                    name:'Sign',
                    params:{docId:this.docId},
                    query:{
                        tabIndex,
                        tabStatus,
                        pageIndex,
                        enter:'detail'
                    }
                })
            },
            //预览
            previewDoc(){
                window.open(this.apiPath+this.URL['viewDocument']+'/'+this.detailInfo.docId+'.pdf');
            },
            downLoadHandle(docId){    //下载
                window.location.href=this.apiPath+this.URL['downloadDocument']+'?docId='+this.detailInfo.docId;                
            },
            //过滤状态
            fileState(value,index){ //0 -筛选class  1-筛选显示内容
                var statusTxt = [];
                switch(value){
                    case '200':
                        statusTxt = ['wait_me',"待签署"];
                        break;
                    case '201':
                        statusTxt = ['wait_me',"待我签"];
                        break;
                    case '202':
                        statusTxt = ['wait_other',"待他人签"];
                        break;
                    case '300':
                        statusTxt = ['finish',"已完成"];
                        break;
                    case 'D400':
                        statusTxt = ['refuse',"已撤销"];
                        break;
                    default:
                        break;
                        
                }
                if(this.detailInfo.isOverTime){
                    statusTxt = ['refuse','已拒绝']
                }
                return statusTxt[index];
                
                
            },
            //获取抄送人信息，发送人信息，签署人信息
            signtorListUnion(){ 
                this.turn = null;
                this.httpGet(this.URL['signtorListUnion'],{
                    docId:this.docId
                },(json)=>{
                    if(json.meta.success){
                        if(json.data.carbonList.length > 0){
                            this.ccSigner = json.data.carbonList[0].name ? json.data.carbonList[0].name : '';
                        }                        
                        this.sender = json.data.sender;
                        this.signerList = json.data.list;
                        for(let i = 0 ; i < this.signerList.length ; i++){
                            if(this.signerList[i].accNo.indexOf('@') == -1){
                                this.searchHandle(this.signerList[i],i);
                            }
                            
                            if(this.detailInfo.signOrderType == '002'){
                                if(!this.signerList[i].signed && this.turn == null ){
                                    this.turn = i;
                                }
                            }
                        }
                        this.hasOwnSign = this.signerList.some(item =>{
                            if(item.signStatus == '201'){
                                return item.accNo == this.CURACCOUNT.accNo 
                            }
                        });

                        
                    }
                })
            },
            //获取联系人名字
            searchHandle({mobile,accNo},index){
                this.httpPost(this.URL['seachContact'],{
                    condition:mobile ? mobile : accNo,
                    userId:this.$store.state.curAccount.accId
                },json=>{
                    this.tableLoading = false;
                    if(json.meta.success){
                        this.conList = JSON.parse(json.data.list);
                        if(this.conList.length > 0){
                            this.signerList[index].name = this.conList[0].name;
                            if(accNo == this.sender.accNo){
                                this.sender.name = this.conList[0].name;
                            }
                        }
                        // this.tabId = this.conList[0].tabId;
                        
                    }else{
                        // this.modelCommonTip(json.meta.msg)
                    }
                })
            },
            //拒绝签署
            repealDocumentLight(){
                if(this.refuseBtn != '拒签') return;

                this.$store.commit('changeDialog',{state:true,options:{title:'删除',text:`确认拒签${this.detailInfo.docName}？`}})
                this.dialogConfirm.confirm().then(() => {
                    this.refuseBtn = '处理中...';
                    this.$store.commit('changeDialog',{state:false,options:{}});
                    this.httpPost(this.URL['repealDocumentLight'],{
                        docId:this.docId
                    },json=>{
                        if(json.meta.success){
                            this.getDocumentInfoVo();                        
                        }else{
                            this.modelCommonTip(json.meta.message);
                        }
                    })
                }).catch(() => {
                    this.$store.commit('changeDialog',{state:false,options:{}})
                })
            },
            //获取文档详情页
            getDocumentInfoVo(){  
                this.httpGet(this.URL['getDocumentInfoVo'],{
                    docId:this.docId
                },(json)=>{
                    if(json.meta.success){
                        this.detailInfo = json.data;
                        this.signtorListUnion();
                    }else{
                        this.modelCommonTip(json.meta.message);
                    }
                })
            },
            back(){
                if(this.enter == 'index'){
                    this.$router.push({
                        name:'Index'
                    })
                }else{
                    this.$router.push({
                        name:'ManaFile',
                        query:{
                            tabIndex:this.tabIndex,
                            tabStatus:this.tabStatus,
                            pageIndex:this.pageIndex
                        }
                    })
                }
                
            }
        },
        mounted(){
            this.docId = this.$route.params.docId;
            let Timer = setInterval(()=>{
                this.docId = this.$route.params.docId;
                if(this.docId){
                    this.tabIndex = this.$route.query.tabIndex ? this.$route.query.tabIndex : '';
                    this.tabStatus = this.$route.query.tabStatus ? this.$route.query.tabStatus : '';
                    this.pageIndex = this.$route.query.pageIndex ? this.$route.query.pageIndex : '';
                    this.enter = this.$route.query.enter ? this.$route.query.enter : '';
                    clearInterval(Timer);
                    this.getDocumentInfoVo();
                }
            },30)
        }
    }
</script>
