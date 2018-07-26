<template>
    <section class="authorize">
        <div class="loadSource" style="top:400px;" v-show="certLoading" ><!---->
            <p><img :src="loadingTheme" alt="" width="80" height="80"></p>
        </div>
        <div class="no-message" v-if="!certLoading && certList.length == 0">
            <p><img src="../../../assets/images/noAnyThing.png" alt="" ></p>
            <p>没有证书无法授权</p>
        </div>
        <div v-for="(certItem,index2) in certList" :key="index2">
            <div class="authorizeList" v-for="(item,index) in certItem.stampArr"  :key="index">                
                <div class="authorHeader box">
                    <div class="sideTwo second">
                        <h3>{{certItem.ownerInfo}}-{{item.stampName}}</h3>
                        <p>证书编号：{{item.certCode}}</p>
                        <p>授权代表人：已设置{{item.ids.length}}人</p>
                    </div>
                    <div class="sideThree" @click="addAuthorize(item)">
                        <p><i class="iconfont icon-add_empty"></i></p>
                        <p>添加授权</p>
                    </div>
                    <div class="sideFour" @click="cancelAllAuth(item.stampId)">
                        <i class="iconfont icon-reduce"></i>
                        <p>取消全部授权</p>
                    </div>
                </div>
                <div class="list">
                    <div class="item box" v-for="(itemCont,indexCont) in item.ids" :key="indexCont"> <!---->
                        <div class="item1">
                            <span class="iconfont icon-headimg"></span>
                        </div>
                        <div class="item2">
                            <p class="box">
                                <span>{{itemCont.displayName ? itemCont.displayName : itemCont.name}}</span>
                                <span v-if="itemCont.accStstus == 3" class="real"><i class="iconfont icon-solid_check"></i>实名用户</span>
                                <span v-else><i class="iconfont "></i>{{itemCont.accStstus == 1 ? '未激活' : '已激活'}}</span>
                            </p>                        
                        </div>
                        <div class="item3 shengl">{{itemCont.accNo}}</div>
                        <div class="item4"><a href="javascript:;" @click="cancelAuth(item.ids,item.stampId,itemCont)" v-if="itemCont.accId != curAccount.accId">取消授权</a></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 添加授权弹框 -->
        <section class="addAuthorizeCover" v-show="authorize.state">
            <div class="authorizeBox">
                <div class="aHeader">
                    <h3>添加授权<i class="iconfont icon-close" @click="authorize.state = false"></i></h3>
                </div>
                <div class="aBody">
                    <div class="sideLeft">
                        <div class="search">
                            <i class="iconfont icon-search"></i>
                            <input type="text" placeholder="姓名/账号/标签" v-model="condition" id="condition"  @keyup="searchOper($event)">
                        </div>
                        <div v-show="selectLabelArr.length > 0" class="labelBox">
                            <ul>
                                <li :class="[labelIndex == index ?'active':'']" v-for="(item,index) in selectLabelArr" :key="index">{{item.title}}</li>
                            </ul>
                        </div>
                        <dragModel :showState="authorize.state" v-show="authorize.state">
                            <!-- 授权树形组件 -->
                            <!-- <ul class="sign_page_scroll" slot="dragTop">
                                <Dendrogram :treeListData="treeListData" @selectTreeHandle="selectTreeHandle"></Dendrogram>
                            </ul> -->
                            <div slot="dragBottom">
                                <Table 
                                    :tableTitleState="false" 
                                    :tableLoading="tableLoading" 
                                    :tableClass="'table-three'" 
                                    :total="page.total" 
                                    :currentpage="page.currentpage" 
                                    :display="page.display" 
                                    :pagegroup="3"
                                    @pagechange="pageChangeHandel"
                                    >
                                        <ul slot="panel-content" class="personList sign_page_scroll" style="border:0px;">
                                            <li style="text-align:center;display:block;color:#ff503f;" v-if="page.total == 0">请在输入框搜索您需要授权的联系人</li>
                                            <li v-for="(item,index) in conlist" :key="index" @click="selectConlist(item)">
                                                <span><i :class="[item.checked == 'true' ? 'icon-solid_check':'icon-circle']" class="iconfont"></i></span>
                                                <span>{{item.name}}</span>
                                                <span>{{item.phone}}</span>
                                            </li>
                                        </ul>
                                    </Table>
                            </div>
                        </dragModel>
                    </div>
                    <div class="sideRight sign_page_scroll">
                        <h3>已选</h3>
                        <Table
                            :tableTitleState="false"
                            :tableClass="'table-two'"
                        >
                            <ul slot="panel-content" style="border:0px;">
                                <li v-for="(item,index) in selectList" :key="index" @click="lookLabelContant(item)">
                                    <span>{{item.type == 'label' ? item.title : item.name}}</span>
                                    <span>{{item.type == 'label' ? '' : item.phone}}</span>
                                    <i @click.stop="delSelect(item)" class="iconfont icon-del-solid"></i>
                                </li>
                            </ul>
                        </Table>
                        
                    </div>
                    <a href="javascript:;" class="sureAuthBtn" :class="[selectList.length > 0 ? 'active':'']" @click="sureAuthHandle">确定</a>
                </div>
            </div>
        </section>
        <!-- 标签详情 -->
        <section class="labelCover" v-show="authorize.labelState">
            <div class="labelBox">
                <div class="labelList">
                    <h3>标签名称：{{authorize.labelTitle+`(${labelContastList.length}人)`}}<i class="iconfont icon-close" @click="authorize.labelState = false"></i></h3>
                    <Table
                        :tableTitleState="false"
                        :tableClass="'table-two'">
                        <ul slot="panel-content">
                            <li v-for="(item,index) in labelContastList" :key = "index" >
                                <span>{{item.name}}</span>
                                <span>{{item.phone}}</span>
                            </li>
                        </ul>
                    </Table>
                </div>
            </div>
        </section>
       <!-- <Dendrogram :treeListData="treeListData" @selectTreeHandle="selectTreeHandle"></Dendrogram> -->
    </section>
</template>
<script>
    export default{
        name:'authorize',
        data(){
            return{
                certList:[],          //证书列表
                certLoading:true,
                tableLoading:false,   //联系人列表状态
                treeListData:[],      //标签数据
                labelArr:[],          //标签一维数组
                selectLabelArr:[],    //查找出来的标签下拉列表
                labelIndex:-1,        //标签列表下标
                // tabId:null,        //标签列表
                conlist:[],           //联系人列表
                condition:'',         //搜索关键字
                temCondition:null,      //搜索临时变量
                selectList:[],        //选中的联系人或者列表
                labelContastList:[],  //选中的标签对应的联系人
                authorize:{
                    state:false,
                    labelState:false,
                    labelTitle:'',
                    stampId:'',
                },
                page:{
                    total:0,
                    currentpageIndex:1,
                    display:15
                },
            }
        },
        computed:{
            curAccount(){
                return this.$store.state.curAccount;
            }
        },
        watch:{
            condition(newVal){
                if(newVal != ''){
                    this.filterLabel();
                }else{
                    this.selectLabelArr = [];
                }
            }
        },
        methods:{
            //取消全部授权
            cancelAllAuth(stampId){
                this.$store.commit('changeDialog',{state:true,options:{title:'取消全部授权',text:`确认取消全部人的授权？`}})
                    this.dialogConfirm.confirm().then(() => {
                        this.$store.commit('changeDialog',{state:false,options:{}});
                        this.stampBindLight([],stampId,'取消授权成功');
                }).catch(() => {
                    this.$store.commit('changeDialog',{state:false,options:{}})
                })
            },
            //取消授权
            cancelAuth(accIdsArr,stampId,item){  //授权人数组，印章id，当前授权人
                // console.log(accIdsArr,item)
                this.$store.commit('changeDialog',{state:true,options:{title:'取消授权',text:`确认取消${item.displayName}的授权？`}})
                this.dialogConfirm.confirm().then(() => {
                    this.$store.commit('changeDialog',{state:false,options:{}});
                    let accIds = [];
                    for(let i = 0 ; i < accIdsArr.length; i++){
                        accIds.push(accIdsArr[i].accId)
                    }
                    accIds = accIds.filter(itemVal=>{
                        return itemVal != item.accId
                    })
                    
                    // return
                    this.stampBindLight(accIds,stampId,'取消授权成功');
                }).catch(() => {
                    this.$store.commit('changeDialog',{state:false,options:{}})
                })
            },
            //确认授权
            sureAuthHandle(){  
                if(this.selectList.length == 0){
                    this.modelCommonTip('请选择签署人');
                    return;
                }
                let accIds = [];
                for(let i = 0 ; i < this.selectList.length; i++){
                    if(this.selectList[i].type == 'label'){
                        let pidArr = this.selectList[i].pid
                        if(pidArr.length > 0){
                            for(let j = 0; j < pidArr.length ; j++){
                                accIds.push(pidArr[j].accId)
                            }
                        }
                    }else{
                        accIds.push(this.selectList[i].accId)
                    }
                }
                this.stampBindLight(accIds,this.authorize.stampId,'授权成功')
                
            },
            //授权接口
            stampBindLight(accIds,stampId,successTip){
                this.httpPost(this.URL['stampBindLight'],{
                    selectAccId:accIds.join(','),
                    stampId:stampId
                },({meta})=>{
                    if(meta.success){
                        this.modelCommonTip(successTip);
                        this.authorize.state = false;
                         this.$store.commit('changeDialog',{state:false,options:{}});
                        this.getCertList();  //获取证书
                    }
                })
            },
            //添加授权按钮点击
            addAuthorize({ids,stampId}){
                this.authorize.state = true;
                [this.conlist,this.selectList,this.condition,this.authorize.stampId] = [[],[],'',stampId];
                /*if(ids.length == 0) return;
                for(let i = 0 ; i < this.conlist.length; i++){
                    for(let j = 0; j < ids.length;i++){
                        if(this.conlist[i].contatcId == ids.contatcId){
                            this.conlist[i].checked = true;
                        }
                    }
                }*/
            },
            //右边删除
            delSelect({type,uid,contatcId}){
                if(type == "label"){
                    this.selectList = this.selectList.filter(itemVal=>{
                        return itemVal.uid != uid
                    })
                }else{
                    this.selectList = this.selectList.filter(itemVal=>{
                        return itemVal.contatcId != contatcId
                    })
                    this.conlist = this.conlist.map(itemVal=>{
                        if(itemVal.contatcId == contatcId){
                            itemVal.checked = false;
                        }
                        return itemVal;
                    })
                }
            },
            //过滤选中的标签或列表，避免重复
            filterSelectList(field){
                if(this.selectList.length == 0) return;
                this.selectList = this.unique3(this.selectList,field);
            },
            //操作搜索框
            searchOper(ev){
                if(ev.keyCode == 13){  
                    if(this.labelIndex == -1){ //搜索联系人
                        this.searchHandle();
                    }else{                     //添加标签到已选
                        let num = 0;
                        this.selectList.push({type:'label',...this.selectLabelArr[this.labelIndex]});
                        this.filterSelectList('uid');
                        [this.condition,this.temCondition,this.selectLabelArr] = ['',null,[]];
                    }
                }else{
                    if(this.selectLabelArr.length==0) return;
                    if(ev.keyCode == 40){  //向下按键                    
                        this.labelIndex = this.labelIndex == this.selectLabelArr.length ? -1 : this.labelIndex+1;                        
                    }else if(ev.keyCode == 38){
                        this.labelIndex = this.labelIndex == 0 ? this.selectLabelArr.length : this.labelIndex-1
                    }
                }
            },
            //选择来联系人到选中列表
            selectConlist(item){
                item.checked = item.checked == 'true' ? 'false':'true';
                if(item.checked == 'true'){
                    this.selectList.push(item);
                    this.filterSelectList('contatcId');
                }else{
                    this.selectList = this.selectList.filter(itemVal=>{
                        return (itemVal.contatcId != item.contatcId) || (itemVal.type == 'label');
                    })
                }
            },
            //搜索联系人列表
            searchHandle(){
                this.selectLabelArr = [];
                if(this.temCondition == this.condition) return;                
                this.temCondition = this.condition;
                this.tableLoading = true;
                this.httpPost(this.URL['seachContact'],{
                    condition:this.condition,
                    userId:this.curAccount.accId,
                    page:this.page.currentpageIndex,
                    pageSize:this.page.display
                },json=>{
                    this.tableLoading = false;
                    if(json.meta.success){
                        this.conlist = JSON.parse(json.data.list);
                        this.page.total = Number(json.data.total);
                        if(this.selectList.length == 0) return;                        
                        for(let i = 0 ; i < this.selectList.length ; i++){
                            for(let j = 0 ; j < this.conlist.length ; j++){
                                if(this.selectList[i].contatcId == this.conlist[j].contatcId){
                                    this.conlist[j].checked = 'true';
                                }
                            }
                        }
                    }else{
                        this.conlist = [];
                        this.page.total = 0;
                    }
                })   
            },
            //过滤标签
            filterLabel(){
                this.labelIndex = -1;
                if(this.labelArr){
                    this.selectLabelArr = this.labelArr.filter(item=>{
                        return item.title.indexOf(this.condition) != -1;
                    })
                }
            },
            //获取证书列表
            getCertList(){
                this.certLoading = true;
                this.httpGet(this.URL['getStampAndCertList'],{},(json)=>{                    
                    if(json.meta.success){
                        this.certList = json.data.certList;
                        if(this.certList.length == 0){
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
            //获取证书对应的印章  ?
            getStampPerTotal(total){
                if(total <= 0) return ;
                for(let i = 1 ; i <= total ; i++){
                    this.httpPost(this.URL['getStampPer'],{ajaxTime:i},(json)=>{
                        if(json.meta.success){                            
                            json.data.stampList[0].ajaxTime= i;
                            for(let j = 0 ; j < this.certList.length; j++){
                                if(json.data.stampList[0].certCode == this.certList[j].cert_no){
                                    this.stampBindFind(json.data.stampList[0]).then((res)=>{
                                        if(res.length > 0){
                                            for(let k = 0 ; k < res.length ; k++){
                                                if(!res[k].displayName){
                                                    this.seachContact(res[k].accNo).then(contastData=>{   //联系人无displayname通过手机号码去获取displayName
                                                        if(contastData){
                                                            res[k].displayName = contastData.name
                                                        }
                                                    })
                                                }
                                            }
                                        }
                                        json.data.stampList[0].ids = res;    //将授权的人员放到ids里面，后面使用
                                        this.certList[j].stampArr.push(json.data.stampList[0]);
                                        this.certList[j].stampArr.sort(this.compare('ajaxTime'));    
                                    })
                                }
                            }
                        }else{
                            this.modelCommonTip(json.meta.message);
                        }
                    })
                }                
                this.certListAll = this.certList;
                this.certLoading = false;
            },
            //根据stampId（印章ID）获取有改印章使用权限的人
            stampBindFind({stampId}){
                return new Promise((resolve, reject) => {
                    this.httpPost(this.URL['stampBindFind'],{stampId},json=>{
                        if(json.meta.success){
                            resolve(json.data)
                        }else{
                            this.modelCommonTip(json.meta.msg)
                        }
                    })
                });
                
            },
            //通过手机号码获取联系人信息
            seachContact(searchVal){
                return new Promise((resolve, reject) => {
                    this.httpPost(this.URL['seachContact'],{
                        condition:searchVal,
                        userId:this.curAccount.accId
                    },json=>{
                        if(json.meta.success){
                            resolve(JSON.parse(json.data.list)[0])
                        }
                    })
                });
            },
            //根据数组的某一项进行升序排序
            compare(property){   
                return function(a,b){
                    var value1 = a[property];
                    var value2 = b[property];
                    return value1 - value2;
                }
            }, 
            //联系人标签列表
            contactList(){
                this.labelState = true;
                this.labelArr = [];
                this.httpPost(this.URL['contactList'],{
                    userId:this.curAccount.accId
                },json=>{         
                    if(json.meta.success){
                        this.treeListData = JSON.parse(json.data);
                        if(this.treeListData.length == 0)  return;
                        this.forEachHandle(this.treeListData)
                    }else{
                        this.modelCommonTip(json.meta.msg)
                    }
                })
            },
            forEachHandle(arr){
                for(let i = 0 ; i < arr.length ; i++){
                    this.labelArr.push(arr[i]);
                    if(arr[i].children.length > 0){
                        this.forEachHandle(arr[i].children)
                    } 
                    this.getContactorJsonList(arr[i])              
                }               
            },
            //获取标签对应的联系人列表
            getContactorJsonList(arr){
                this.httpPost(this.URL['getContactorJsonList'],{
                    tabId:arr.uid,
                    page:1,
                    pageSize:1000,
                    userId:this.curAccount.accId
                },json=>{
                    if(json.meta.success){
                        arr.pid = JSON.parse(json.data.list); 
                    }else{
                        this.modelCommonTip(json.meta.msg)
                    }                    
                })                
            },
            //查看组人员
            lookLabelContant(item){
                if(item.type == 'label'){
                    this.authorize.labelState = true;
                    this.authorize.labelTitle = item.title;
                    this.labelContastList = item.pid;
                }
            },
            pageChangeHandel(val){
                this.page.currentpageIndex = val;
                this.searchHandle();
            },
        },
        mounted(){
            let Timer = setInterval(()=>{
                if(this.curAccount){
                    clearInterval(Timer);
                    this.getCertList();
                    this.contactList();
                }                
            },30)
        }
    }
</script>
