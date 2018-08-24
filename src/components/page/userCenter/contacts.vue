<template>
    <section class="contacts">
        <div class="setpOne" v-show="step == 1">
            <nav class="clf">
                <!-- <router-link to="/user/nearcontacts">最近联系人</router-link>-->
                <a href="javascript:;"  @click="imporeExcelHandle">批量导入联系人</a> 
                <form id="importForms"  enctype="multipart/form-data" method="post" style="display:none">
                    <p class="clf">
                        <label>新成员导入</label>
                        <!-- <span @click="selectTemple" >{{importMem.txt}} -->
                            <input type="file" id="templateFile" name="importFile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" >
                        <!-- </span>                         -->
                    </p>
                </form>
                <a :href="apiPath+URL['downloadTemplate']" target="_blank">下载模板</a> 
                <div class="search">
                    <input type="text" v-model="searchTitle" placeholder="姓名/账号" @keyup.enter="searchHandle()" >
                    <i class="iconfont icon-search" @click="searchHandle"></i>
                </div>
            </nav>
            <section class="addressBook box">
                <!-- 标签tab -->
                <div class="sideLeft">
                    <h3>标签</h3>
                    <div class="clf bookList sign_page_scroll">
                        <p class="noMsg" v-show="menu.length == 0 && !labelState"><span>暂无数据</span></p>
                        <p class="loading" v-show="labelState"><img :src="Config.loadingImg" width="50" alt=""></p>
                        <div class="item">
                            <div>
                                <Tree   
                                    :data="menu" 
                                    :tabId="tabId"
                                    @selectTreeItem="dragTreeItem" 
                                    @renameHandle="renameHandle"
                                    @copyHandle="copyHandle"
                                    @emitSelectTreeList = "selectTreeList"
                                    @delLabel="delLabel"
                                    @addLabel="addLabelHandle"
                                    :dragState="true"></Tree>
                            </div>                            
                        </div>
                    </div>
                    <input type="text" class="addLableInput" placeholder="请输入新的标签名字" v-show="createLable" v-model="createLableTxt" @click.stop="createLable = true" v-on:blur="createLableHandle(createLableTxt,-1)"> <!--@keyup.enter="createLableHandle(createLableTxt,-1)"-->
                    <div class="addLabel">
                        <a href="javascript:;" @click.stop="createLable = true">
                            <i class="iconfont icon-add"></i>新建标签
                        </a>
                    </div>
                </div>
                <div class="sideRight">
                    <Table :tableTitleState="true" :tableLoading="tableLoading" :total="page.total" :currentpage="page.currentpageIndex" :display="page.display" @pagechange="pageChangeHandel">
                        <h3 slot="panel-header" > <!--:class="[conList.length > 0 ? '' : 'border']"-->
                            <a href="javascript:;" v-show="menu.length > 0" @click="create.state = true;create.phone='';create.name='';create.placeholder = '姓名'"><i class="iconfont icon-add"></i>添加联系人</a>
                            <a href="javascript:;" v-if="menu.length == 0"  @click.stop="createLable = true">请先新建标签</a>
                        </h3>
                        <ul slot="panel-content" class="addressBookList" v-show="conList.length > 0">
                            <li class="clf" v-for="(item,index) in conList"  @click="lookContact(item)" :key="index" @dragstart='drag($event,item)' @dragend="dragEnd" draggable="true">
                                <div class="item box">
                                    <span class="headImg">
                                        <!-- <img src="../../../assets/images/user.jpg" alt=""> -->
                                    </span>
                                    <span class="shengl">{{item.name}}</span>
                                    <span class="shengl">{{item.phone}}</span>
                                    <!-- <span><a href="javascript:;" @click="step = 2">编辑</a></span> -->
                                    <span @click.stop="clickIndex = index"><i class="iconfont icon-menu"></i></span>
                                </div>
                                <div class="selectBox" v-if="index == clickIndex">
                                    <!-- <p @click.stop="sendHimToSign(item)">发给他签</p> -->
                                    <p class="line">查看联系人</p>
                                    <p @click.stop="delContact(item)">删除联系人</p>
                                </div>
                            </li>
                        </ul>
                        
                    </Table>                    
                </div>
            </section>
        </div>
        <!-- 编辑或查看联系人 -->
        <div class="setpTwo" v-show="step == 2">
            <nav @click="step = 1"><i class="iconfont icon-back" ></i>返回</nav>
            <div class="contactInfo">
                <h3>联系人</h3>
                <div class="contactBody box">
                    <div class="sideLeft">
                        <img src="../../../assets/images/user.jpg" alt="">
                    </div>
                    <div class="sideCenter">
                        <p>姓名</p>
                        <p>手机</p>
                        <!-- <p>邮箱</p> -->
                        <!-- <p>账号</p> -->
                        <p>分组</p>
                        <!-- <p>备注名</p> -->
                    </div>
                    <div class="sideRight">
                        <p>
                            <span v-show="editCon.nameState == 1">{{edit.name}}</span>
                            <i class="iconfont icon-edit" @click="editHandle(1)" v-show="editCon.nameState == 1"></i>
                            <input type="text" v-model="edit.name" id="name" :class="[editCon.nameState==2 ? '':'opacity']" @keyup.enter="editCon.nameState=1" @blur="editCon.nameState=1">
                        </p>
                        <p>
                            <span v-show="editCon.phoneState == 1">{{edit.phone}}</span>
                        </p>
                        <!-- <p>
                            <span :class="[edit.email == '' ? 'none':'']" v-show="editCon.emailState == 1">{{edit.email == '' ? '请填写联系人邮箱' : edit.email}}</span>
                            <i class="iconfont icon-edit" @click="editHandle(3)" v-show="editCon.emailState == 1"></i>
                            <input type="text" :class="[editCon.emailState==2 ? '':'opacity']" v-model="edit.email" id="email"  @keyup.enter="editCon.emailState=1" @blur="editCon.emailState=1">                            
                        </p> -->
                        <!-- <p>
                            <span>未知</span>
                        </p> -->
                        <p class="clf">
                            <a href="javascript:;" @click="edit.labelState = edit.labelState ? 'false' : 'true'">{{edit.labelName}}</a>
                            <i class="iconfont icon-down_one" @click="edit.labelState = edit.labelState ? 'false' : 'true'"></i>
                            <p class="treeBox" v-show="edit.labelState">
                                <Tree   
                                    :data="menu" 
                                    :tabId="tabId"
                                    @emitSelectTreeList = "editSelectTreeList"
                                    :operState="false"
                                    :ulDisPlay="1"
                                    >
                                </Tree>
                            </p>
                        </p>
                        <!-- <p>
                            <span :class="[edit.memo == '' ? 'none' : '']" v-show="editCon.memoState == 1">{{edit.memo == '' ? '添加备注名' : edit.memo}}</span>
                            <i class="iconfont icon-edit" @click="editHandle(4)" v-show="editCon.memoState == 1"></i>
                            <input type="text" :class="[editCon.memoState==2 ? '':'opacity']" v-model="edit.memo" id="memo"  @keyup.enter="editCon.memoState=1" @blur="editCon.memoState=1">
                        </p> -->
                    </div>
                </div>
                <div class="contactFooter">
                    <div class="clf">
                        <a href="javascript:;" @click="cancelEditContactor">取消</a>
                        <a href="javascript:;" @click="editContactor">保存</a>
                    </div>
                </div>
            </div>
        </div>
        <!-- 新建联系人 -->
        <div v-show="create.state" class="createContact">
            <i class="icon icon-triggle"></i>
            <div class="formBox">
                <p>
                    <input type="text" v-model="create.phone" placeholder="手机/邮箱（回车）" v-on:input="createPhoneEnter" @keyup.enter="getContactorByPhone()">                    
                </p>
                <p>
                    <input type="text" v-model="create.name" :placeholder="create.placeholder" @keyup.enter="addContact" >
                </p>
                <div class="btnBox clf">
                    <a href="javascript:;" class="inserShadow" @click="create.state = false">取消</a>
                    <a href="javascript:;" class="inserShadow" @click="addContact">确定</a>
                </div>
            </div>
        </div>
        <!-- <div class="setpTwo" v-show="step == 3">
            <nav @click="step = 1"><i class="iconfont icon-back" ></i>返回</nav>
            <div class="contactInfo">
                <h3>新建联系人</h3>
                <div class="contactBody box">
                    <div class="sideLeft">
                        <img src="../../../assets/images/user.jpg" alt="">
                    </div>
                    <div class="sideCenter">
                        <p>姓名</p>
                        <p>手机</p>
                        <p>邮箱</p>
                        <p>账号</p>
                        <p>分组</p>
                        <p>备注名</p>
                    </div>
                    <div class="sideRight">
                        <p>
                            <input type="text" v-model="create.name" placeholder="请输入姓名">
                        </p>
                        <p>
                            <input type="text" v-model="create.phone" placeholder="请输入手机">
                        </p>
                        <p>
                            <input type="text" v-model="create.email" placeholder="请输入邮箱">
                        </p>
                        <p>
                            <span>未知</span>
                        </p>
                        <p class="clf">
                            <a href="javascript:;">通讯录</a>
                            <i class="iconfont icon-down_one"></i>
                        </p>
                        <p>
                            <input type="text" v-model="create.memo" placeholder="请输入备注">
                        </p>
                    </div>
                </div>
                <div class="contactFooter">
                    <div class="clf">
                        <a href="javascript:;">取消</a>
                        <a href="javascript:;">保存</a>
                    </div>
                </div>
            </div>
        </div> -->
        <!-- 删除联系人 -->
        <alertModel v-show="delCon.state" :title="'删除联系人'" :type="2" @cancelHandle="delCon.state=false" @sureHandle="sureDelCon">
            <div slot="alert-content">
                <p>确定从通讯录删除 <span :style="'color:#ff563f;'">李四 13412352645 </span>该联系人吗？</p>
            </div>
        </alertModel>
        <!-- loading -->
        <Loading v-show="loadingState" text="导入中..."></Loading> 
    </section>
</template>

<script>
    import { mapState } from 'vuex';
    export default{
        name:'contacts',
        data(){
            return{
                searchTitle:'',            //搜索关键字
                step:1,                       //联系人状态  1为通讯录   2为查看(编辑)联系人  3-新建联系人
                tableLoading:true,
                conList:[],
                delCon:{                      //删除联系人
                    state:false,
                },
                edit:{                     //编辑
                    name:'',
                    phone:'',
                    email:'',
                    memo:'',
                    labelState:false,
                },
                editTem:{
                    name:'',
                    tabId:'',
                    tabName:'',
                },
                create:{                     //新建
                    state:false,
                    name:'',
                    phone:'',
                    email:'',
                    memo:'',
                    labelName:'',
                    placeholder:'姓名'
                },
                editCon:{
                    nameState:1,           //1为显示
                    phoneState:1,
                    emailState:1,
                    memoState:1,
                },
                page:{
                    currentpageIndex:1,
                    total:0,
                    display:10                    
                },
                /*******/
                menu:[],              //联系人标签数组
                labelState:true,     //标签列表加载状态  
                addLabelState:false,  //添加标签还是重命名
                addLabelParentItem:null,  //添加标签的父级数据
                clickIndex:null,      //点击联系人列表右边的操作按钮
                tabId:null,           //选中的标签id
                tabName:null,         //选中的标签名字
                oper:{                //操作标签Index
                    rnIndex:null,     //重命名index
                    copyIndex:null    //复制index
                },       
                editLable:"",         //编辑标签的名字
                createLable:false,
                createLableTxt:'',
                loadingState:false,


            }
        },
        computed:{
            ...mapState([
            'curAccount',
            ]),
        },
        watch:{
            /*create:{
                handler({phone,name},oldVal){
                    if(this.validateQb.isPhone(phone)){
                        if(!name){
                            this.getContactorByPhone(phone);
                        }
                        
                    }
　　　　　　　　　},
　　　　　　　　　deep:true
            }*/
        },
        methods:{
            //批量导入联系人
            imporeExcelHandle(){
                console.log(123)
                let This = this;
                $('#templateFile').val('');
                $('#templateFile').click();
                $('#templateFile').on('change',e=>{
                    e = e || window.event;  
                    e.stopPropagation(); // 阻止冒泡  
                    e.preventDefault();  //阻止默认行为                         
                    let fileObj = $('#templateFile')[0].files[0];
                    //检测是否有文件 
                    if(!fileObj){ 
                        return false; 
                    }
                    if(fileObj.type != 'application/vnd.ms-excel'){
                        this.modelCommonTip("请上传excel文档");
                        return;
                    }
                    this.loadingState = true;
                    $("#importForms").ajaxSubmit({
                        url:This.apiPath + This.URL['imporeExcel'],//默认是form action
                        success:json=>{    
                            this.loadingState = false;   
                            const { numFalse, numSuccess,resDownloadId} = json.data;  
                            if(json.meta.success){
                                this.contactList();
                                this.$store.commit('changeDialog',{state:true,options:{title:'温馨提示',text:`成功${numSuccess}条，失败${numFalse}条`,cancelButtonText:'关闭',confirmButtonText:'查看结果'}})
                                this.dialogConfirm.confirm().then(() => {
                                    this.$store.commit('changeDialog',{state:false,options:{}});
                                    window.location.href=this.apiPath+this.URL['downloadImportRes']+'?downId='+resDownloadId
                                }).catch(() => {
                                    this.$store.commit('changeDialog',{state:false,options:{}})
                                })
                            }else{
                                this.modelCommonTip(json.meta.msg)
                            }
                        }
                    });
                    // this.fileCom(fileObj)
                })
            },
            //编辑联系人
            lookContact(item){
                this.step = 2;
                [this.editTem.name,this.editTem.tabId,this.editTem.tabName] = [item.name,this.tabId,this.tabName];
                [this.edit.name,this.edit.phone,this.edit.contatcId,this.edit.email,this.edit.memo,this.edit.labelState,this.edit.labelName] = [item.name,item.phone,item.contatcId,'',item.memo,false,this.tabName]
            },
            //通过手机号码获取联系人信息
            getContactorByPhone(phone){
                this.httpPost(this.URL['getContactorByPhone'],{phone:this.create.phone},json=>{
                    if(json.meta.success){                        
                        if(json.data.displayName != this.create.phone){
                            this.create.name = json.data.displayName ? json.data.displayName : '';
                        }else{
                            this.create.placeholder = '请输入姓名';
                        }
                        /*if(!json.data.displayName){
                            this.create.placeholder = '改用户未实名'
                        }*/
                    }
                })
            },
            //搜索联系人列表
            searchHandle(){
                if(!this.searchTitle) return;
                this.tableLoading = true;
                this.httpPost(this.URL['seachContact'],{
                    condition:this.searchTitle,
                    userId:this.curAccount.accId
                },json=>{
                    this.tableLoading = false;
                    if(json.meta.success){
                        this.conList = JSON.parse(json.data.list);
                        if(this.conList.length > 0){
                            this.tabId = this.conList[0].tabId;
                            this.tabName = this.conList[0].title;
                        }                        
                    }else{
                        this.modelCommonTip(json.meta.msg)
                    }
                })

            },
            //删除联系人
            delContact(item){                
                this.$store.commit('changeDialog',{state:true,options:{title:'删除',text:`确认删除联系人${item.name}:${item.phone}？`}})
                this.dialogConfirm.confirm().then(() => {
                    this.delContactor(item).then((json)=>{
                        this.$store.commit('changeDialog',{state:false,options:{}});
                        // this.modelCommonTip('删除成功');
                        this.contactList();
                    })
                }).catch(() => {
                    this.$store.commit('changeDialog',{state:false,options:{}})
                })                 
            },
            //发给他签
            sendHimToSign(item){
                this.setSData('sendHimItem',item)
                this.$router.push({
                    name:'ToFill'
                })
                
            },
            //删除联系人接口
            delContactor(item){
                return new Promise((resolve,reject)=>{
                    this.httpPost(this.URL['delContactor'],{
                        contactId:item.contatcId,
                        userId:this.curAccount.accId
                    },json=>{
                        if(json.meta.success){        
                            resolve(json);   
                        }else{
                            this.modelCommonTip(json.meta.msg)
                        }
                    })
                })
            },
            //联系人更新到标签列表
            updateContactToTab(contactId ,tabId){
                this.httpPost(this.URL['updateContactToTab'],{
                    contactId ,
                    tabId,
                    userId:this.curAccount.accId
                },json=>{
                    if(json.meta.success){
                        this.getContactorJsonList();    
                    }else{
                        this.modelCommonTip(json.meta.msg)
                    }
                })
            },
            //监听新建联系人input框
            createPhoneEnter(){
                console.log(this.create.phone)
                if(this.validateQb.isPhone(this.create.phone) || this.validateQb.isEmail(this.create.phone)){
                    this.getContactorByPhone();
                }else{
                    this.create.name = '';
                    this.create.placeholder = '请输入昵称';
                }
            },
            //新建联系人
            addContact(){
                const { phone , name } = this.create;
                if(!phone){
                    this.modelCommonTip("请输入手机号码");
                    return;
                }else if(!name){
                    this.modelCommonTip("请输入姓名");
                    return;
                }else if(!this.validateQb.isPhone(phone) && phone.indexOf('@')  == -1){
                    this.modelCommonTip("手机号码格式不正确");
                    return;
                }
                this.addContactor(this.create).then(res=>{
                    this.create.state = false;
                    this.contactList();
                })
            },
            //新建联系人接口
            addContactor({phone,name}){
                return new Promise((resolve,reject)=>{
                    this.httpPost(this.URL['addContactor'],{
                        phone,  //手机号码
                        name,   //用户名字
                        tabId:this.tabId,
                        userId:this.curAccount.accId
                    },json=>{
                        if(json.meta.success){
                            resolve(json);
                        }else{
                            this.modelCommonTip(json.meta.msg)
                        }
                    })
                })
            },
            //取消编辑
            cancelEditContactor(){
                this.step = 1;
                [this.tabId,this.tabName] = [this.editTem.tabId,this.editTem.tabName];
            },
            //编辑联系人
            editContactor(){
                if(this.edit.name == ''){
                    this.modelCommonTip("姓名不能为空");
                    return;
                }
                if(this.editTem.name == this.edit.name && this.editTem.tabId == this.tabId){
                    this.step = 1;
                    return;
                }
                //先删除后添加
                this.delContactor(this.edit).then(res=>{
                    this.addContactor(this.edit).then(json=>{
                        this.step = 1;
                        this.getContactorJsonList();
                    })
                })
            },
            //联系人标签列表
            contactList(){
                this.labelState = true;
                this.httpPost(this.URL['contactList'],{
                    userId:this.curAccount.accId
                },json=>{       
                    this.labelState = false;  
                    if(json.meta.success){
                        this.menu = [];
                        this.menu = JSON.parse(json.data);                           
                        if(this.menu.length == 0){
                            this.createLableHandle('联系人','-1');   
                            // this.tableLoading = false;
                            return;
                        }
                        
                        if(!this.tabId){
                            this.tabId = this.menu[0].uid;
                            this.tabName = this.menu[0].title;
                        }
                        if(arguments[0] != 'rename'){
                            this.getContactorJsonList();
                        }
                        
                    }else{
                        this.modelCommonTip(json.meta.msg)
                    }
                })
            },        
            //新增标签
            createLableHandle(title,pid){
                if(this.validateQb.isEmpty(title)){
                    this.modelCommonTip('标签名称不能为空');
                    return;
                }
                this.httpPost(this.URL['addLabel'],{
                    title,
                    pid,
                    userId:this.curAccount.accId
                },json=>{
                    if(json.meta.success){
                        [this.createLable,this.createLableTxt] = [false,''];                        
                        this.contactList();
                    }else{
                        this.modelCommonTip(json.meta.msg)
                    }
                })
            },
            //删除标签
            delLabel(item){
                if(item.children.length){
                    this.modelCommonTip("该标签下含有子标签，无法删除");
                    return;
                }
                this.getContactorJsonList(2,item.uid).then(res=>{
                    if(res > 0){
                        this.modelCommonTip("该标签下含有联系人，不可删除");
                        return;
                    }else{
                        if(this.menu.length == 1){
                            this.modelCommonTip("最后一个标签不能删除");
                            return;
                        }
                        this.$store.commit('changeDialog',{state:true,options:{title:'删除',text:`确认删除${item.title}？`}})
                        this.dialogConfirm.confirm().then(() => {
                            this.httpPost(this.URL['delLabel'],{uid:item.uid,userId:this.curAccount.accId},(json)=>{
                                if(json.meta.success){
                                    this.$store.commit('changeDialog',{state:false,options:{}});
                                    this.contactList();
                                }
                            })
                        }).catch(() => {
                            this.$store.commit('changeDialog',{state:false,options:{}})
                        }) 
                    }
                })
            },
            forEachHandle(arr){
                for(let i = 0 ; i < arr.length ; i++){
                    if(arr[i].children.length > 0){
                        this.forEachHandle(arr[i].children)
                    }
                    if(arr[i].title == '请输入标签名称'){
                        arr.splice(i,1);
                    }                    
                }               
            },
            //标签选择
            selectTreeList(item){
                this.tabId = item.uid;
                this.tabName = item.title;
                this.getContactorJsonList();
            },
            //编辑联系人分组选择
            editSelectTreeList(item){
                this.edit.labelState = false;
                this.tabId = item.uid;
                this.tabName = item.title;
                this.edit.labelName = item.title;

            },
            /*tree树形新增标签 */
            copyHandle(item){
                this.forEachHandle(this.menu);
                item.children.push({
                    title:'请输入标签名称',
                    id:this.randomWord(true,32,1000),
                    inputType:true,
                    addType:true,
                    children:[]
                })
                this.addLabelState = true;
                this.addLabelParentItem = item;
            },
            /*添加标签 */
            addLabelHandle(item){
                if(item.title != '' && this.addLabelParentItem.uid){
                    this.createLableHandle(item.title,this.addLabelParentItem.uid);   
                    [this.addLabelState,this.addLabelParentItem] = [false,null];      
                                 
                }  
            },
            /*tree树形重命名 */
            renameHandle(item,parData){  
                this.forEachHandle(this.menu);
                if(item.title != '请输入标签名称'){
                    this.httpPost(this.URL['renameLabel'],{
                        title:item.title,
                        uid:item.uid,
                        userId:this.curAccount.accId
                    },json=>{
                        if(json.meta.success){
                            this.contactList('rename');
                        }else{
                            this.contactList('rename');
                            this.modelCommonTip(json.meta.msg)
                        }
                    })
                    
                }
            },            
            //树形拖拽
            dragTreeItem(dragData,dropData){  //dragData  拖拽元素   dropData  目标元素
                // console.log(dragData)
                // console.log(dropData)                  
                if(dragData.pid){   //标签拖拽
                    if(dragData.pid == -1){  //更新同级排序接口
                        this.httpPost(this.URL['resort'],{
                            uid1:dragData.uid,
                            uid2:dropData.uid,
                            userId:this.curAccount.accId
                        },(json)=>{
                            if(json.meta.success){
                                this.contactList();
                            }
                        })
                    }else{  //更新层级关系接口
                        this.httpPost(this.URL['changelevel'],{
                            uid:dragData.uid,
                            pid:dropData.uid,
                            userId:this.curAccount.accId
                        },(json)=>{
                            if(json.meta.success){
                                this.contactList();
                            }
                        })
                    }
                }else{ //联系人拖拽
                    this.tabId = dropData.uid;
                    this.tabName = dropData.title;
                    $('.tree-title strong').css('color','');
                    this.updateContactToTab(dragData.contatcId,dropData.uid)
                }
                
            },

            //联系人拖拽
            drag(ev,item,index){       //拖拽当前元素
                ev.dataTransfer.setData("item",JSON.stringify(item));
                ev.dataTransfer.setData("index",index);
            },
            allowDrop(ev){             //目标元素
                $('.bookList .item p').removeClass('active');
                $(ev.currentTarget).addClass('active');
                 ev.preventDefault();
            },
            drop(ev,dropData,index){   //目标元素
                ev.preventDefault();
                $('.bookList .item p').removeClass();
                let data = JSON.parse(ev.dataTransfer.getData("item"));
                let Index = ev.dataTransfer.getData("index");
                this.labelIndex = index;   //选中拖拽结束的标签
                console.log(data)
                console.log(dropData)
            },
            dragEnd(ev){               //拖拽当前元素
                $('.tree-title strong').css('background','');
            },
            /*标签拖拽end */
            editHandle(num){  //1-编辑姓名，2-编辑手机，3-编辑邮箱，4-编辑备注
                switch(num){
                    case 1:
                        this.editCon.nameState = 2;
                        $('#name').focus();
                        break;
                    case 2:
                        this.editCon.phoneState = 2;
                        $('#phone').focus();
                        break;
                    case 3:
                        this.editCon.emailState = 2;
                        $("#email").focus();
                        break;
                    case 4:
                        this.editCon.memoState = 2;
                        $('#memo').focus();
                        break;
                    default:
                        break;
                }
            },
            sureDelCon(){  //确认删除联系人

            },
            //获取联系人列表
            getContactorJsonList(num = 1,paramsTabId){  //1获取联系人列表  2-删除的时候获取联系人列表    第二个参数处理，删除的标签不是选中的标签            
                if(num == 1){
                    this.tableLoading = true;
                }
                return new Promise((resolve,reject)=>{
                    this.httpPost(this.URL['getContactorJsonList'],{
                        tabId:paramsTabId ? paramsTabId : this.tabId,
                        page:this.page.currentpageIndex,
                        pageSize:this.page.display,
                        userId:this.curAccount.accId
                    },json=>{
                        this.tableLoading = false;
                        if(json.meta.success){
                            this.conList = JSON.parse(json.data.list);                        
                            this.page.total = Number(json.data.total);
                            if(num == 2){
                                resolve(json.data.total)
                            }
                        }else{
                            this.modelCommonTip(json.meta.msg)
                        }
                    })
                })
            },
            pageChangeHandel(val){  //通讯录翻页
            },
            /*
                ** randomWord 产生任意长度随机字母数字组合
                ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
            */
            randomWord(randomFlag, min, max){
                let str = "",
                    range = min,
                    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                let pos = null;
                // 随机产生
                if(randomFlag){
                    range = Math.round(Math.random() * (max-min)) + min;
                }
                for(let i=0; i<range; i++){
                    pos = Math.round(Math.random() * (arr.length-1));
                    str += arr[pos];
                }
                return str;
            },
            init(){
                let This = this;
                $(document).on('click',()=>{
                    if(this.clickIndex || this.clickIndex == 0){
                        this.clickIndex = null;
                    }
                    if(this.oper.rnIndex || this.oper.rnIndex == 0){
                        this.oper.rnIndex = null;
                    }
                    if(this.oper.copyIndex || this.oper.copyIndex == 0){
                        this.oper.copyIndex = null;                        
                    }
                    if(!this.createLableTxt){
                        this.createLable = false;
                    }
                    this.forEachHandle(this.menu);
                    
                    
                })
                // $('.bookList p input').blur(function(){
                //     console.log(123)
                //     This.operIndex = null;
                // })
            }
        },
        mounted(){
            this.init();
            let Timer = setInterval(()=>{
                if(this.curAccount){
                    clearInterval(Timer);
                    this.contactList();
                }
            },30)
        }
    }
</script>