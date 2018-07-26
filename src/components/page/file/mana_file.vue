<template>
    <section class="manaFile contain">
        <div class="timeSelect clf">
            <div class="sideLeft">
                <input type="text" v-model="searchTitle" placeholder="文档主题" @keyup="searchHandle($event)" >
                <i class="iconfont icon-search"></i>
            </div>
            <div class="sideRight">
                <ul class="clf">
                    <li @click="getNowDate(90)">
                        <span class="item" :class="[timeIndex == 4 ? 'active' : '']">三月内</span>
                    </li>
                    <li  @click="getNowDate(30)">
                        <span class="item" :class="[timeIndex == 3 ? 'active' : '']">一月内</span>
                    </li>
                    <li @click="getNowDate(7)">
                        <span class="item" :class="[timeIndex == 2 ? 'active' : '']">一周内</span>
                    </li>
                    <li>
                        <input type="text"   class="timeDuration" id="reservation" placeholder="开始时间-结束时间" readonly>
                        <i class="iconfont icon-calendar"></i>
                    </li>                    
                </ul>
            </div>
        </div>
        <div class="styleSelect">
            <ul class="clf">
                <!-- <li><label>类别</label></li> -->
                <li><a href="javascript:;" :class="[tabIndex == 1 ? 'active':'']" @click="changeStatus(1,'')">全部</a></li>
                <li><a href="javascript:;" :class="[tabIndex == 2 ? 'active':'']" @click="changeStatus(2,'201')">待我签</a></li>
                <li><a href="javascript:;" :class="[tabIndex == 3 ? 'active':'']" @click="changeStatus(3,'202')">待他人签</a></li>
                <li><a href="javascript:;" :class="[tabIndex == 4 ? 'active':'']" @click="changeStatus(4,'300')">已完成</a></li>
                <!-- <li><a href="javascript:;">已过期</a></li> -->
                <li><a href="javascript:;" :class="[tabIndex == 5 ? 'active':'']" @click="changeStatus(5,'D400')">已撤销</a></li>
                <li><a href="javascript:;" :class="[tabIndex == 7 ? 'active':'']" @click="changeStatus(7,'mySend')">我发起</a></li>
                <li><a href="javascript:;" :class="[tabIndex == 6 ? 'active':'']" @click="changeStatus(6,'draf')">草稿箱</a></li>
            </ul>
        </div>
        <Table 
            :tableTitle="'最近文档'"  
            :tableLoading="file.loading" 
            :tableClass="tabIndex == 6 ? 'table-four':'document-file'" 
            :total="page.total" 
            :currentpage="page.currentpage" 
            :display="page.display" 
            :tableTitleState="false"
            @pagechange="pageChangeHandel"
            >
                <!-- <ul slot="panel-content" class="detailList" v-if="tabIndex != 6"> 
                    <li class="clf" v-for="(item,index) in file.list" :key="index"  @click="goDetail(item)"> 
                        <span><i class="iconfont icon-headimg" style="color:#ccc;font-size:20px;"></i></span>
                        <span :title="item.senderName">{{item.senderName}}</span>
                        <span :title="item.docName">{{item.docName}}</span>
                        <span>{{fileState(item.signStatus)}}</span>
                        <span>{{item.duration}}</span>
                        <span>
                            <a v-if="item.signStatus == '201'" href="javascript:;" 
                                @click.stop="$router.push({name:'Sign',params:{docId:item.docId},query:{tabIndex:tabIndex,tabStatus:tabStatus,pageIndex:page.currentpageIndex,enter:'manafile'}})"
                            >签署</a>
                            <a v-else href="javascript:;">查看</a>
                        </span>
                    </li>                    
                </ul> -->
                <ul slot="panel-content" class="ul"  v-if="tabIndex != 6">
                    <li class="clf th">
                        <span>文件名称</span>
                        <span>发起人</span>
                        <span>文件状态</span>
                        <span>有效期</span>
                        <span>操作</span>
                    </li>
                    <li class="clf" v-for="(item,index) in file.list" :key="index"  @click="goDetail(item)">
                        <span :title="item.docName"><i class="iconfont" :class="item.iconName"></i>{{item.docName}}</span>
                        <span :title="item.senderName">{{item.senderName}}</span>
                        
                        <span v-if="item.signStatus" :class="fileState(item.signStatus,item.overTime,'className')">{{fileState(item.signStatus,item.overTime)}}</span>
                        <span v-else class="refuse" >我发起</span>
                        <span>{{item.sendTime+'-'+item.duration}}</span>
                        <span>
                            <b href="javascript:;"  @click.stop="goDetail(item)"><i class="iconfont icon-eye" ></i>详情</b>
                            <b href="javascript:;"  @click.stop="goSign(item)" v-if="item.signStatus == '201' && !item.overTime"><i class="iconfont icon-edit"></i>签署</b>
                            <b href="javascript:;" @click.stop="downLoadHandle(item.docId)" v-else><i class="iconfont icon-download"></i>下载</b>
                        </span>
                    </li>
                </ul>
                
                <ul slot="panel-content" class="drafList" v-if="tabIndex == 6">
                    <li class="clf th" >
                        <span>文件名称</span>
                        <span>创建时间</span>
                        <span>签署人</span>
                        <span>操作</span>
                    </li>
                    <li class="clf" v-for="(item,index) in file.list" :key="index"  @click="goFill(item)">
                        <span :title="item.docName">{{item.docName}}</span>
                        <span>{{item.createTime}}</span>
                        <span :title="item.signators">{{item.signators}}</span>
                        <span><a @click.stop="delDraft(item)">删除</a></span>
                    </li>                    
                </ul>
            </Table>
            <!-- <div class="page-box">
                <pagination :total="file.page.total" :currentpage="file.page.currentpageIndex" :display="file.page.display"  @pagechange="pageChangeHandel"></pagination>
                <div class="page-num">
                    {{file.page.currentpageIndex}}/{{Math.ceil(file.page.total / file.page.display)}}，共{{file.page.total}}条
                </div>
            </div> -->
    </section>
</template>
<script> 
    const moment = require('@/assets/js/plugin/moment.js').moment;
    import '@/assets/js/plugin/daterangepicker.js' 
    import '@/assets/css/bootstrap.min.scss'  
    import '@/assets/css/daterangepicker-bs3.scss'  
    export default{
        name:'mana_file',
        data(){
            return{
                searchTitle:'',
                tabIndex:1,        //tabIndex  1-全部 2-待我签 3-待其他人签 4-已完成   5-已撤销   6-草稿箱 (已过期 已拒绝)
                tabStatus:'',      //tab状态
                timeIndex:null,       //日期选择  1日期控件，1-周内，2-一月内，3-三月内
                file:{
                    list:[],
                    loading:false,
                    beginTime:'',
                    endTime:''                    
                },
                timeDuration:'',  //
                page:{
                    total:null,
                    currentpageIndex:1,
                    display:12
                },
                options: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();  //-86400000 包括今天 
                    }
                },
                datapicker:1,      //第一次点击日期插件
            }
        },
        computed:{
            userState(){
                return this.$store.state.userState
            }
        },
        methods:{
            //删除草稿箱文档
            delDraft({docName,docId}){
                this.$store.commit('changeDialog',{state:true,options:{title:'删除',text:`删除后草稿将无法恢复，您确定要删除吗？`}})
                this.dialogConfirm.confirm().then(() => {
                    this.ajaxPost(this.URL['deleteDraft'],{docId},json=>{
                        if(json=='success'){
                            this.$store.commit('changeDialog',{state:false,options:{}});
                            this.searchDocumentLight();
                        }
                    })
                }).catch(() => {
                    this.$store.commit('changeDialog',{state:false,options:{}})
                }) 
            },
            //搜索
            searchHandle(event){
                if(event.keyCode == 13){  //enter
                    this.searchDocumentLight();
                }
            },
            getNowDate(n){
                this.timeDuration = '';
                $('#reservation').val('');
                if(n == 7){
                    this.timeIndex = 2;
                }else if(n == 30){
                    this.timeIndex = 3;
                }else if(n == 90){
                    this.timeIndex = 4;
                }else{
                    this.timeIndex = 1;
                }
                this.file.beginTime= this.getDataFn(n).formatwdate;
                this.file.endTime = this.getDataFn(n).currentdate;
                this.searchDocumentLight();
            },
            //改变tab状态
            changeStatus(num,status){  //tabIndex   status
                this.tabIndex = num;
                this.tabStatus = status;
                if(this.page.currentpageIndex != 1){
                    this.page.currentpageIndex = 1;
                    this.CUSTOMEVENT.$emit('tip2',1);
                }
                this.searchDocumentLight();                
            },
            //文档列表
            searchDocumentLight(){
                this.file.loading = true;
                let [data,reqUrl] = [null,null]  //声明变量
                if(this.tabIndex == 6){  //草稿箱
                    data = {
                        page:this.page.currentpageIndex,
                        pageSize:this.page.display,
                    }
                    reqUrl = this.URL['searchDraftLight']
                }else if(this.tabIndex == 7){  //我发起的
                    data = {
                        page:this.page.currentpageIndex,
                        pageSize:this.page.display,
                        condition:this.searchTitle,
                        beginTime:this.file.beginTime,
                        endTime:this.file.endTime,                        
                    }
                    reqUrl = this.URL['searchSponsorDocListLight']
                }else{
                    
                    if(this.tabIndex == 1){
                        reqUrl = this.URL['searchAllDocumentList']
                        // reqUrl = this.URL['searchDocumentLight']
                        data = {
                            page:this.page.currentpageIndex,
                            // pageIndex:this.page.currentpageIndex,
                            pageSize:this.page.display,
                            signStatus:this.tabStatus,
                            condition:this.searchTitle,
                            beginTime:this.file.beginTime,
                            endTime:this.file.endTime,
                        }
                    }else{
                        reqUrl = this.URL['searchDocumentLight']
                        data = {
                            page:this.page.currentpageIndex,
                            pageSize:this.page.display,
                            signStatus:this.tabStatus,
                            condition:this.searchTitle,
                            beginTime:this.file.beginTime,
                            endTime:this.file.endTime,
                        }
                    }
                   
                }                
                this.httpGet(reqUrl,data,(json)=>{
                    if(json.meta.success){
                        this.file.list = json.data.list;
                        this.page.total = json.data.totalCount;
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
            goDetail(item){
                this.$router.push({
                    name:"Detail",
                    params:{
                        docId:item.docId
                    },
                    query:{
                        tabIndex:this.tabIndex,
                        tabStatus:this.tabStatus,
                        pageIndex:this.page.currentpageIndex
                    }
                });
            },
            downLoadHandle(docId){    //下载
                window.location.href=this.apiPath+this.URL['downloadDocument']+'?docId='+docId;                
            },
            //到签署
            goSign(item){
                this.$router.push({name:'Sign',params:{docId:item.docId},query:{enter:'ManaFile',tabIndex:this.tabIndex,tabStatus:this.tabStatus,pageIndex:this.page.currentpageIndex}})
            },
            goFill(item){   //到发起签约页面
                this.$router.push({
                    name:"ToFill",
                    query:{
                        docId:item.docId
                    }
                });
            },
            pageChangeHandel(val){
                this.page.currentpageIndex = val;
                this.searchDocumentLight();
            }
        },
        mounted(){
            this.tabIndex = this.$route.query.tabIndex ? this.$route.query.tabIndex : 1;
            this.page.currentpageIndex = this.$route.query.pageIndex ? this.$route.query.pageIndex : 1;
            this.tabStatus = this.$route.query.tabStatus ? this.$route.query.tabStatus : '';
            this.CUSTOMEVENT.$emit('tip2',this.page.currentpageIndex);
            this.searchDocumentLight();
             $('#reservation').daterangepicker({
                 startDate:moment(this.getDataFn(30).formatwdate),
                 maxDate: moment(new Date())
             }, (start, end, label)=> {                 
                this.timeDuration = ($('#reservation').val()).split(' - ');
                this.file.beginTime = this.timeDuration[0];
                this.file.endTime = this.timeDuration[1];
                this.searchDocumentLight();
            });
            $('.sign_page_scrollBody').on('click','.btn-success',()=>{
                if(this.datapicker == 1){
                    this.datapicker = 2;                   
                    this.file.beginTime = this.getDataFn(30).formatwdate;
                    this.file.endTime = this.getDataFn(0).formatwdate;
                    this.searchDocumentLight();
                }
            })
        }
    }
</script>
