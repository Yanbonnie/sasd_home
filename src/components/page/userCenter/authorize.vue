<template>
    <section class="authorize">
        <div class="info">
            <div class="sideLeft">
                <div class="pictureBox">
                    <img v-if="headIcon&&headIcon!=1" :src="'data:image/png;base64,'+headIcon" alt="">
                    <div v-if="!headIcon && (CURACCOUNT.accStstus == 3 || USERSTATE == 0)" class="iconImg">
                        {{CURACCOUNT.displayName.substring(0,1)}}
                    </div>
                    <div class="txt">
                        <p>{{CURACCOUNT.displayName}}
                            <span v-if="CURACCOUNT.accStstus == 3" class="REAL"><i class="iconfont icon-solid_check"></i><b>实名用户</b></span>
                            <span v-else class="NOREAL">未实名</span>
                        </p>
                        <p class="account">账号：{{CURACCOUNT.accNo}}</p>
                    </div>
                </div>
            </div>
            <div class="sideRight">
                <h3>授权代表人能够使用您的企业签章完成签署，请谨慎设置！一旦设置授权代表人，即表示您阅读并同意<a href="javascript:;">《授权代表人管理办法》</a></h3>
                <p>接收授权代表人使用该签章签署的信息<i class="iconfont icon-checkbox_solid"></i></p>
            </div>
        </div>
        <div class="loadSource" style="top:400px;" v-show="certLoading" ><!---->
            <p><img :src="Config.loadingImg" alt="" width="80" height="80"></p>
        </div>
        <div class="no-message" v-if="!certLoading && delegateCertList.length == 0 && accountType">
            <p><img src="../../../assets/images/noAnyThing.png" alt="" ></p>
            <p>暂无数据</p>
        </div>
        <!-- 托管证书 -->
        <div v-for="(certItem,index) in delegateCertList" :key="index">
            <div class="authorizeList">                
                <div class="authorHeader box">
                    <!-- <div class="sideOne"><img :src="'data:image/jpeg;base64,'+item.base64_data" alt=""></div> -->
                    <div class="sideTwo second">
                        <h3>{{certItem.certInfo.ownerName}}</h3>
                        <p>证书编号：{{certItem.certInfo.certNo}}</p>
                        <p>授权代表人：已设置{{delegateAuthorize.length}}人</p>
                    </div>
                    <div class="sideThree" @click="addAuthorize(delegateAuthorize,1)">
                        <p><i class="iconfont icon-add_empty"></i></p>
                        <p>添加授权</p>
                    </div>
                    <div class="sideFour">
                        <i class="iconfont icon-reduce"></i>
                        <p>取消全部授权</p>
                    </div>
                </div>
                <div class="stampBox" >
                    <span v-for="(item,valIndex) in certItem.stampList" :key="valIndex">
                        <img :src="'data:image/jpeg;base64,'+item.stampImg" alt="">
                    </span>
                </div>
                <div class="list">
                    <div class="item box" v-for="(itemCont,indexCont) in delegateAuthorize" :key="indexCont"> 
                        <div class="item1">
                            <span class="iconfont icon-headimg"></span>
                        </div>
                        <div class="item2">
                            <p class="box">
                                <span>{{itemCont.userId}}</span>
                                <span v-if="itemCont.acceptStatus == 1" class="hasAuth"><i class="iconfont icon-solid_check"></i>已授权</span>
                                <span v-else class="wait">等待用户接受授权</span>
                            </p>                        
                        </div>  
                        <div class="item3 shengl">{{itemCont.userName}}</div>
                        <div class="item4"><a href="javascript:;" @click="delmulticancelgrant(itemCont)">取消授权</a></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Ukey -->
        <div class="no-message" v-if="!certLoading && certList.length == 0 && !accountType">
            <p><img src="../../../assets/images/noAnyThing.png" alt="" ></p>
            <p>暂无数据</p>
        </div>
        <div v-for="(certItem,index2) in certList" :key="index2">
            <div class="authorizeList" v-for="(item,index) in certItem.stampArr"  :key="index">                
                <div class="authorHeader box">
                    <div class="sideOne"><img :src="'data:image/jpeg;base64,'+item.base64_data" alt=""></div>
                    <div class="sideTwo second">
                        <h3>{{certItem.ownerInfo}}-{{item.stampName}}</h3>
                        <p>证书编号：{{item.certCode}}</p>
                        <p>授权代表人：已设置{{item.ids.length}}人</p>
                    </div>
                    <div class="sideThree" @click="addAuthorize(item,0)">
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
                            <!-- <img src="../../../assets/images/user.jpg" alt=""> -->
                        </div>
                        <div class="item2">
                            <p class="box">
                                <span>{{itemCont.displayName ? itemCont.displayName : itemCont.name}}</span>
                                <span v-if="itemCont.accStstus == 3" class="real"><i class="iconfont icon-solid_check"></i>实名用户</span>
                                <span v-else>未认证</span> <!--{{itemCont.accStstus == 1 ? '未激活' : '已激活'}}-->
                            </p>                        
                        </div>
                        <div class="item3 shengl">{{itemCont.accNo}}</div>
                        <div class="item4"><a href="javascript:;" @click="cancelAuth(item.ids,item.stampId,itemCont)" v-if="itemCont.accId != CURACCOUNT.accId">取消授权</a></div>
                    </div>
                    <!-- <div class="item box">
                        <div class="item1">
                            <img src="../../../assets/images/group.png" alt="">
                        </div>
                        <div class="item2">
                            <p class="box">
                                <span>张三</span>
                                <span class="real"><i class="iconfont icon-solid_check"></i>实名用户</span>
                            </p>                        
                        </div>
                        <div class="item3 shengl">
                            张三；李四；张三；李四；张三；李四；张三；李四；张三；李四；张三；李四；张三；李四张三；李四；张三；李四；张三；李四；张三；李四；张三；李四；张三；李四；张三；李四
                        </div>
                        <div class="item4"><a href="javascript:;">取消授权</a></div>
                    </div> -->
                </div>

                <!-- <div class="authorHeader box">
                    <div class="sideTwo">
                        <h3>{{certItem.ownerInfo}}-{{item.stampName}}</h3>
                        <p>证书编号：{{item.certCode}}</p>git
                        <p>授权代表人：已设置3人</p> 
                    </div>
                    <div class="sideThree">
                        <p><i class="iconfont icon-add_empty"></i></p>
                        <p>添加知情人</p>
                    </div>
                    <div class="sideFour">
                        <i class="iconfont icon-reduce"></i>
                        <p>取消全部知情人</p>
                    </div>
                </div>
                <div class="list">
                    <div class="item box">
                        <div class="item1">
                            <img src="../../../assets/images/user.jpg" alt="">
                        </div>
                        <div class="item2">
                            <p class="box">
                                <span>张三</span>
                                <span class="real"><i class="iconfont icon-solid_check"></i>实名用户</span>
                            </p>                        
                        </div>
                        <div class="item3 shengl">18823658956</div>
                        <div class="item4"><a href="javascript:;">取消授权</a></div>
                    </div>
                    <div class="item box">
                        <div class="item1">
                            <img src="../../../assets/images/group.png" alt="">
                        </div>
                        <div class="item2">
                            <p class="box">
                                <span>张三</span>
                                <span class="real"><i class="iconfont icon-solid_check"></i>实名用户</span>
                            </p>                        
                        </div>
                        <div class="item3 shengl">
                            张三；李四；张三；李四；张三；李四；张三；李四；张三；李四；张三；李四；张三；李四张三；李四；张三；李四；张三；李四；张三；李四；张三；李四；张三；李四；张三；李四
                        </div>
                        <div class="item4"><a href="javascript:;">取消授权</a></div>
                    </div>
                    <div style="height:100px;width:100%"></div>
                </div> -->
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
        <alertModel title="请设置签署密码" :sureBtnTxt="setPinBtn" v-show="signPswState" :type="2" @cancelHandle="signPswState=false;signPswErr='';signPsw=''" @sureHandle="grant">
            <div slot="alert-content" class="signPsw" >
                <p class="input"><input type="password" placeholder="请设置签署密码" v-model.trim="signPsw" @keyup.enter="grant" v-on:input="signPswErr = ''"></p>
                <p class="warn">{{signPswErr}}</p>
            </div>
        </alertModel>
       <!-- <Dendrogram :treeListData="treeListData" @selectTreeHandle="selectTreeHandle"></Dendrogram> -->
    </section>
</template>
<script>
    import Vue from 'vue';
    export default{
        name:'authorize',
        data(){
            return{
                signPswState:false,         //设置签署密码弹框
                signPsw:'',                 //签署密码
                signPswErr:"",
                signSelect:{                //托管授权用户数据
                    accIds:[],
                    accNames:[],
                    phones:[],
                },
                setPinBtn:'确定',
                delegateCertList:[],  //机构证书列表
                delegateAuthorize:[],  //机构证书授权给谁的列表
                certList:[],          //证书列表
                authorizeIndex:0,     //0-印章授权  1-机构证书授权  
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
                selectAuthorizeHasIds:{},         //选中的授权
                page:{
                    total:0,
                    currentpageIndex:1,
                    display:15
                },
                headIcon:1
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
            //获取机构托管证书列表
            async getDelegateCertList(){
                let {meta,data} = await this.REQUEST('GET',this.URL['personSeal'],{type:1,acceptStatus:1},true);
                this.delegateCertList = data.data.stampCertList;
                this.certLoading = false;  
                if(this.delegateCertList[0] && this.delegateCertList[0].orgId){
                    this.grantOther();
                }
                
            },
            //获取自己授权给了哪些用户列表
            async grantOther(){
                let { data } = await this.REQUEST('POST',this.URL['grantOther'],{
                    orgId:this.delegateCertList[0].orgId,
                    userId:this.CURACCOUNT.accNo
                },true);
                this.delegateAuthorize = data.data;
                this.delegateAuthorize = this.delegateAuthorize.map(item=>{
                    let cert = item.depositGrantInfoList.filter(item2=>item2.orgId == this.delegateCertList[0].orgId)[0];

                    return {
                        ...item,
                        ...cert
                    }
                })
            },
            //机构证书授权给个人
            async grant(){  
                if(this.signPsw == ''){
                    this.signPswErr="签署密码不能为空";
                    return;
                }
                const orgId = this.delegateCertList[0].orgId;  
                let signerInfo = this.signSelect.phones.map((item,index)=>{
                    return {
                        signerId:item,
                        signerName:this.signSelect.accNames[index]
                    }
                })
                if(this.setPinBtn == '提交中...') return;
                this.setPinBtn = '提交中...';
                let { meta, data } = await this.REQUEST('POST',this.URL['grant'],{
                    orgId,
                    userId:this.CURACCOUNT.accNo,
                    userPin:this.signPsw,
                    grantUserInfoList:signerInfo
                })
                if(meta.success){
                    this.modelCommonTip("授权成功");
                    this.setPinBtn = "确定";
                    [this.signPswState,this.signPsw,this.signPswErr,this.authorize.state] = [false,'','',false];
                    this.grantOther();
                }else{
                    this.setPinBtn = '确定';
                    this.modelCommonTip('授权失败');
                }        
            },        
            //托管取消授权
            delmulticancelgrant(item,type="single"){  //single-单个取消   all-全部
                let grantUserInfoList = []
                if(type == 'all'){

                }else{
                    grantUserInfoList = [{signerId:item.userId}]
                }
                this.$store.commit('changeDialog',{state:true,options:{title:'取消授权',text:`确认取消${item.userName}的授权？`}})
                this.dialogConfirm.confirm().then(() => {
                    this.$store.commit('changeDialog',{state:false,options:{}});
                    this.REQUEST('POST',this.URL['delmulticancelgrant'],{
                        orgId:this.delegateCertList[0].orgId,
                        grantUserInfoList
                    }).then(({meta,data})=>{
                        if(meta.success){
                            this.modelCommonTip("取消授权成功");
                            this.grantOther();
                        }else{
                            this.modelCommonTip("取消授权失败");
                        }
                    })
                }).catch(() => {
                    this.$store.commit('changeDialog',{state:false,options:{}})
                })
            },    
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
                let phones = [];
                let accNames = [];
                for(let i = 0 ; i < this.selectList.length; i++){
                    if(this.selectList[i].type == 'label'){
                        let pidArr = this.selectList[i].pid
                        if(pidArr.length > 0){
                            for(let j = 0; j < pidArr.length ; j++){
                                accIds.push(pidArr[j].accId);   
                                accNames.push(pidArr[j].name) 
                                phones.push(pidArr[j].phone)                            
                            }
                        }
                    }else{
                        accIds.push(this.selectList[i].accId)
                        accNames.push(this.selectList[i].name) 
                        phones.push(this.selectList[i].phone)        
                    }
                }
                if(!this.authorizeIndex){    //印章授权需要把已有的数据再传给后台
                    if(this.selectAuthorizeHasIds){   
                        this.selectAuthorizeHasIds.forEach(item =>{
                            accIds.push(item.accId);
                            // accNames.push(item.displayName);
                            // phones.push(item.userId ? itme.userId : '');
                        })
                    }
                }                
                
                if(this.authorizeIndex == 0){
                    this.stampBindLight(accIds,this.authorize.stampId,'授权成功')
                }else{
                    this.signSelect.accIds = accIds;
                    this.signSelect.accNames = accNames;
                    this.signSelect.phones = phones;
                    this.signPswState = true;
                }
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
            addAuthorize(item,index){
                let {ids,stampId} = item;
                this.authorize.state = true;
                this.authorizeIndex = index;
                this.page.total = 0;
                if(this.authorizeIndex == 1){
                    this.selectAuthorizeHasIds = item;
                }else{
                    this.selectAuthorizeHasIds = ids;
                }
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
                console.log("搜索")
                this.selectLabelArr = [];
                // if(this.temCondition == this.condition) return;                
                this.temCondition = this.condition;
                this.tableLoading = true;
                this.httpPost(this.URL['seachContact'],{
                    condition:this.condition,
                    userId:this.CURACCOUNT.accId,
                    page:this.page.currentpageIndex,
                    pageSize:this.page.display
                },json=>{
                    this.tableLoading = false;
                    if(json.meta.success){
                        this.conlist = JSON.parse(json.data.list).filter(item=>item.accType != 1);    //筛选掉企业的 因为企业的不能接受授权
                        this.conlist = this.conlist.filter(item=>{
                            console.log(this.selectAuthorizeHasIds)
                            if(this.selectAuthorizeHasIds){
                                console.log(this.authorizeIndex)
                                if(this.authorizeIndex ==  1){   //机构证书授权
                                    return !this.selectAuthorizeHasIds.some(val=>val.userId == item.phone)    //过滤机构证书已授权过的用户
                                }else{  
                                    return !this.selectAuthorizeHasIds.some(val=>val.accId == item.accId)     //过滤印章已授权过的用户
                                }
                                
                            }else{
                                return item
                            }
                            
                        })
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
                        userId:this.CURACCOUNT.accId
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
                    userId:this.CURACCOUNT.accId
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
            //获取所有联系人列表
            // getContactorJsonList(){
            //     this.tableLoading = true;
            //     this.httpPost(this.URL['getContactorJsonList'],{
            //         tabId:this.tabId,
            //         page:this.page.currentpageIndex,
            //         pageSize:this.page.display,
            //         userId:this.CURACCOUNT.accId
            //     },json=>{
            //         this.tableLoading = false;
            //         if(json.meta.success){
            //             this.conList = JSON.parse(json.data.list);                        
            //             this.page.total = Number(json.data.total)
            //         }else{
            //             this.modelCommonTip(json.meta.msg)
            //         }
            //     })
            // },
            //获取标签对应的联系人列表
            getContactorJsonList(arr){
                this.httpPost(this.URL['getContactorJsonList'],{
                    tabId:arr.uid,
                    page:1,
                    pageSize:1000,
                    userId:this.CURACCOUNT.accId
                },json=>{
                    if(json.meta.success){
                        arr.pid = JSON.parse(json.data.list).filter(item=>item.accType != 1); 
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
            this.contactList();    
            this.queryIcon();      
            if(this.accountType){
                this.getDelegateCertList();
            }else{
                this.getCertList();
            }
        }
    }
</script>
