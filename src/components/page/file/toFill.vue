<template>
    <section class="toFill contain">
        <!-- <nav>发起签约</nav> -->
        <div class="signFile" style="margin-top:20px;">
            <input type="file" id="file2" class="filestyle"  hidden/>
            <div class="dashed" id="drop_area">
                <!-- <img src="../../../assets/images/file_pdf.png"  class="upfile"/> -->
                <p class="iconP" v-if="docId && !uploadFileState"><i class="iconfont icon-success"></i></p>
                <!--<p class="iconP" v-if="!signFile && againState == 2"><i class="iconfont icon-warn"></i></p>上传文件被中断
                <p class="iconP" v-if="!signFile && againState == 2">上传文件被中断,请重新上传</p>          上传文件被中断-->
                <p class="iconP" v-if="uploadFileState && signFile"><img :src="loadingTheme" width="" height="50" alt=""></p>
                <p class="title"><span>{{pdfFileName ? pdfFileName : signTitle}}</span><a href="javascript:;" id="againUpLoad">{{docId ? '重新上传' : '上传文件'}}</a></p>
                <p class="tip" style="display:none;"><i class="iconfont icon-circle"></i>在签署文件首页添加<a>《仲裁条款》</a>若双方另行约定了管辖方式，请勿勾选</p>
            </div>
        </div>
        <div class="setting">
            <div class="box item">
                <label for="" class="">主题</label>
                <div class="sideRight">
                    <input type="text" v-model="signTitle" placeholder="请输入文档主题" class="title">
                </div>
            </div>
            <div class="box item">
                <label for="" class="">签约截止日期</label>
                <div class="sideRight">
                    <span class="calendarBox col-lg-3 col-md-4 col-sm-6">
                        <div class="input-append date form_datetime"  id="date_start">
                            <input size="16" type="text"  v-model.trim="durationTime" readonly placeholder="选择有效日期">
                            <b class="add-on"><i class="iconfont icon-calendar"></i></b>
                        </div>
                    </span>
                    <span class="time" @click="durationTime = ''"><i class="iconfont " :class="[durationTime ? 'icon-circle':'icon-solid_check']"></i><b>永久有效</b></span> <!--icon-solid_check-->
                </div>
            </div>
            <div class="box item">
                <label for="">签署方式</label>
                <div class="sideRight">
                    <ul>
                        <li  >
                            <a href="javascript:;" @click="signOrder = '001'" class="shengl">
                                <i class="iconfont" :class="[signOrder == '001' ? 'icon-radioOn':'icon-circle']"></i>
                                <span class="shengl">任意签<b>（签署人先到先签，无固定顺序）</b></span>
                            </a>
                        </li>
                        <li  class="shengl">
                            <a href="javascript:;" @click="signOrder = '002'" class="shengl">
                                <i class="iconfont " :class="[signOrder == '002' ? 'icon-radioOn':'icon-circle']"></i> 
                                <span>顺序签<b>（A->B->C->D ，可拖动签署人调整排序）</b></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="box item">
                <label for="">添加签署人</label>
                <div class="selectList">
                    <ul v-show="signOrder == '001'" class="noOrderSign">  <!--任意签-->
                        <!-- <li v-show="selectSignors.length == 0">暂未添加签署人</li> -->
                        
                        <li class="box" v-for="(item,index) in selectSignors" :key="index">
                            <span class="iconfont" :class="[ item.accType == 1 ? 'icon-com_sign':'icon-per-sign']"></span>
                            <span class="shengl">{{item.name}}</span>
                            <span class="shengl">{{item.phone ? item.phone : item.accNo}}</span>
                            <i class="iconfont icon-del-solid" @click="delSignors(item)"></i>
                        </li>
                        <li class="addSignBtn"><a href="javascript:;" @click="addMailState = true;getContactorJsonList()"><i class="iconfont icon-add"></i>从通讯录添加签署人</a></li>
                    </ul>
                    <ul class="orderSign" v-show="signOrder == '002'" >
                        <draggable v-model="selectSignors">
                            <transition-group>                                
                                <li class="box" v-for="(item,index) in selectSignors" :key="index">
                                    <span><b class="iconfont icon-menu_icon"></b></span>
                                    <span :class="[signOrder == '002'?'':'opacity']">{{index+1}}</span>
                                    <span class="iconfont " :class="[ item.accType == 1 ? 'icon-com_sign':'icon-per-sign']"></span>
                                    <span class="shengl">{{item.name}}</span>
                                    <span class="shengl">{{item.phone ? item.phone : item.accNo}}</span>
                                    <i class="iconfont icon-del-solid" @click="delSignors(item)"></i>
                                </li>
                            </transition-group>
                        </draggable>
                        <li class="addSignBtn"><a href="javascript:;" @click="addMailState = true;getContactorJsonList()"><i class="iconfont icon-add"></i>从通讯录添加签署人</a></li>
                    </ul>
                </div>                
            </div>
            <div class="box item">
                <label for=""></label>
                <div class="btnBox operBox">
                    <span @click="appointState = !appointState"><i class="iconfont icon-check-box "  :class="appointState ? 'active':''"></i>指定位置签署</span>
                </div>
            </div>
            <!-- <div class="box item">
                <label for=""></label>
                <div class="btnBox">
                    <a href="javascript:;" @click="addMailState = true;getContactorJsonList()"><i class="iconfont icon-add"></i>从通讯录添加签署人</a>
                    <a href="javascript:;"><i class="iconfont icon-add"></i>新建联系人</a>
                </div>
            </div> -->
        </div>
        <div class="bottomBox">
            <div class="clf">
                <a href="javascript:;" class="inserShadow2"  @click="createDocumentLight('draft')">{{draft.state ? '存草稿':'存储中...'}}</a>
                <a href="javascript:;" class="inserShadow2" @click="createDocumentLight('send')">{{send.state ? '下一步':'发送中...'}}</a>
            </div>
        </div>
        <!--添加签署人弹框-->
        <section class="mailListBox" v-show="addMailState">
            <div class="mailContent">
                <h3 class="mailHeader">
                    <span>请选择要添加的联系人</span>
                    <span @click="create.state=true;create.name='';create.phone='';"><i class="iconfont icon-add_empty"></i><b>添加联系人</b></span>
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
                </h3>
                <div class="mailBody clf">
                    <div class="sideLeft">
                        <h3>标签</h3>
                        <div class="sign_page_scroll sideLeftBox">
                            <p class="noMsg" v-show="menu.length == 0 && !labelState">
                                <span>暂无标签</span>
                                <router-link :to="{name:'Contacts'}">【新增标签】</router-link>
                            </p>
                            <div> 
                                <div>
                                    <!-- <Tree :data="item" :operState="false" @emitSelectTreeList = "selectTreeList"></Tree> -->
                                    <Tree   
                                    :data="menu" 
                                    @emitSelectTreeList = "selectTreeList"
                                    :dragState="false"
                                    :operState="false"
                                    :tabId="tabId"
                                    :ulDisPlay="1"
                                    ></Tree>
                                </div>                            
                            </div>
                        </div>
                    </div>
                    <div class="sideRight">
                        <Table 
                        :tableTitleState="false" 
                        :tableLoading="tableLoading" 
                        :total="page.total" 
                        :currentpage="page.currentpageIndex" 
                        :display="page.display" 
                        :tableClass="'signTable'"
                        @pagechange="pageChangeHandel">
                            
                            <ul slot="panel-content">
                                <li class="title">
                                    <span class="iconfont" :class="[selectAllState ? 'icon-checkbox_solid':'icon-square']" @click="checkbokSelectAll"></span>
                                    <span>姓名</span>
                                    <span>账号</span>
                                </li>
                                <li class="clf" v-for="(item,index) in conList"  :key="index" @click="selectSignor(item)">
                                    <div class="item ">
                                        <span class="iconfont" :class="[item.checked == 'true' ? 'icon-checkbox_solid' : 'icon-square' ]"></span>
                                        <span class="shengl">{{item.name}}</span>
                                        <span class="shengl">{{item.phone}}</span>
                                    </div>
                                </li>
                            </ul>
                            
                        </Table>
                    </div>
                </div>
                <div class="mailFooter">
                    <a href="javascript:;" class="inserShadow" @click="addMailState=false;selectSignors=[]">取消</a>
                    <a href="javascript:;" class="inserShadow2" @click="addMailState=false">确定</a>
                </div>
            </div>
        </section>
        <alertModel v-show="send.success" :headerStatus="false" :footerStatus="false" :type="2" class="successFill">
            <div slot="alert-content" class="alert-content">
                <p class="txt1"><b class="iconfont icon-checkbox_solid"></b>您已成功发起签约</p>
                <p>您可以点击<a href="javascript:;" @click="redirectHandle('Sign')">立即签署</a>完成签署</p>
                <p><a href="javascript:;" @click="redirectHandle('Detail')">查看详情</a></p>
                <!-- <p>您可以点击<router-link :to="{name: 'Sign', params: { docId: docId }}" >立即签署</router-link>完成签署</p>
                <p><router-link :to="{name: 'Detail', params: { docId: docId }}" >查看详情</router-link></p> -->
            </div>
        </alertModel>
        
        <Loading v-show="loadingStatus" text="发送中...请稍后"></Loading>
    </section>
</template>
<script>
    import draggable from 'vuedraggable';
    import '@/assets/js/plugin/bootstrap-datepicker.js';
    import '@/assets/css/datepicker3.scss';
    import { upLoadDate, upLoadMethod} from '@/assets/js/uploadFile.js'
    export default{
        name:'toFill',
        data(){
            return {
                ...upLoadDate,

                docId:'',            //文档id                
                uploadFileState:false, //上传文件状态
                signatureType:'001',   //001默认签署方式  002是公平签署
                createType:null,       //发起文档类型
                send:{
                    state:true,       //发送签约的状态
                    success:false
                },    
                sendHimItem:null,     //从发给他签带过来的数据。
                draft:{
                    state:true,       //存草稿的状态
                    success:false
                }, 
                againState:1,          //从发起签约进来   2 为从首页入口进来

                //setting
                durationTime:'',           //签约截止日期
                signOrder:'001',           //001任意签  002顺序签
                //添加签署人
                addMailState:false,        //添加签署人弹框状态
                createMailState:false,     //新建签署人弹框状态
                create:{                     //新建
                    state:false,
                    name:'',
                    phone:'',
                    placeholder:'姓名'
                },
                ccState:false,             //是否添加抄送
                menu:[],
                tabId:null,           //选中的标签id
                labelState:false,
                /*联系人列表 */
                conList:[],
                curConListFirst:[],        //构造自己为联系人的第一位
                tableLoading:false,
                page:{
                    currentpageIndex:1,
                    total:1,
                    display:7                    
                },
                selectSignors:[],    //选中的签署人
                selectAllState:false,
                loadingStatus:false,


                //指定位置签署
                appointState:false,      //不指定签署位置

                //没有个人托管证书
                stampImg:''
            }
        },
        components: {
            draggable
        },
        methods:{
            ...upLoadMethod,
            //通过手机号码获取联系人信息
            getContactorByPhone(phone){
                this.httpPost(this.URL['getContactorByPhone'],{phone:this.create.phone},json=>{
                    if(json.meta.success){                        
                        if(json.data && json.data.displayName != this.create.phone){
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
            //监听新建联系人input框
            createPhoneEnter(){
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
                        userId:this.CURACCOUNT.accId
                    },json=>{
                        if(json.meta.success){
                            resolve(json);
                        }else{
                            this.create.state = false;
                            this.modelCommonTip(json.meta.msg)
                        }
                    })
                })
            },
            //新增标签
            createLableHandle(title,pid){
                this.httpPost(this.URL['addLabel'],{
                    title,
                    pid,
                    userId:this.CURACCOUNT.accId
                },json=>{
                    if(json.meta.success){                                
                        this.contactList();
                    }else{
                        this.modelCommonTip(json.meta.msg)
                    }
                })
            },
            //立即签署，查看文档
            redirectHandle(Name){
                this.$router.push({
                    name:Name,
                    params:{
                        docId:this.docId
                    }
                })
            },
            //发起签约
            createDocumentLight(createType){
                const { appointState } = this;
                let stampTypeList = this.selectSignors.map(item=>item.accType == 1 ? '0':'1');
                // console.log(this.selectSignors);
                // return;
                let signOrders = this.selectSignors.map(item=>item.accId);

                let hasOwn = signOrders.some(item =>item == this.CURACCOUNT.accId )
                let isFirst = signOrders[0] == this.CURACCOUNT.accId ? true : false;

                if(this.docId == ''){
                    this.modelCommonTip('请上传文档');
                    return;
                }
                let data={
                    docId:this.docId,                              //文档id
                    docName:this.signTitle,                        //主题
                    memo:'',                                       //备注
                    orderType:this.signOrder,                      //签署顺序
                    signatureType:this.signatureType,              //公平签署和默认签署
                    stampTypeList:stampTypeList.join(','),         //签章类型列表
                    createType:createType,                         //存草稿还是发送 draft/send
                    signOrders:signOrders.join(','),               //签署人用,隔开
                    carbonCopies:'',                               //抄送人用,隔开
                    duration:this.durationTime                     //有效期
                }                
                if(createType == 'send'){
                    if(this.selectSignors.length == 0){
                        this.modelCommonTip("请选择签署人");
                        return;
                    }
                }
                createType == 'send' ? this.send.state = false : this.draft.state = false;

                if(createType == 'send'){
                    if(appointState){   //指定签署
                        this.setSData('signData',{
                            data,
                            'selectSignors':this.selectSignors,
                            'appointState':true
                        })
                        this.$router.push({
                            name:'BeforeSign',
                            params:{
                                docId:this.docId
                            }
                        })
                    }else{   //不指定签署
                        
                        if(hasOwn && this.signOrder == '002' && isFirst){     //包含自己且有序签且自己是第一位签署    先签后发起
                            this.setSData('signData',{data,'selectSignors':this.selectSignors,'appointState':false})
                            this.$router.push({
                                name:'BeforeSign',
                                params:{
                                    docId:this.docId
                                }
                            })
                        }else{   //直接发起
                            this.sureSendDomcument(data)
                        }
                    }
                }else{
                    this.sureSendDomcument(data)
                }                
            },
            //直接发起
            sureSendDomcument(data){   //发起
                this.loadingStatus = true;
                this.httpPost(this.URL['createDocumentLight'],data,json=>{
                    this.send.state = true;
                    this.loadingStatus = false;
                    if(json.meta.success){
                        let {canToSign,docId,redirect} = json.data;
                        if(redirect == 'draft'){
                            this.$router.push({
                                name:'ManaFile',
                                query:{
                                    tabIndex:6,
                                    pageIndex:1,
                                    tabStatus:'draft'
                                }
                            })
                        }else  if(canToSign){
                            this.send.success = true;                            
                        }else{
                            this.$router.push({
                                name:'Detail',
                                params:{
                                    docId:this.docId
                                }
                            })
                        }                        
                    }else{
                        this.modelCommonTip(json.meta.msg)
                    }
                },res=>{
                    this.modelCommonTip('未知原因，发送失败')
                })
            },
            //选择签署人
            selectSignor(item){
                if(item.checked == 'true'){
                    item.checked = 'false';
                    this.selectAllState = false;
                     this.selectSignors =  this.selectSignors.filter((itemVal)=>{
                         return itemVal.accId != item.accId
                     })
                }else{
                    item.checked = 'true'
                    this.selectSignors.push(item);
                    this.selectSignors = this.unique3(this.selectSignors,'accId');
                    //判断全选
                    let countAll = 0;
                    this.conList.map(item=>{
                        if(item.checked == 'true'){
                            countAll++
                        }
                    })
                    if(countAll == this.conList.length && this.conList.length != 0){
                        this.selectAllState = true;
                    }
                }
            },
            //全选
            checkbokSelectAll(){
                if(this.conList.length == 0) return;
                if(this.selectAllState){ //取消全选
                    this.selectAllState = false;
                    this.conList = this.conList.map(item=>{
                        item.checked = 'false';
                        this.selectSignors = this.selectSignors.filter(itemVal=>{
                            return itemVal.accId !=  item.accId;
                        })
                        return item;
                    })
                }else{                   //全选
                    this.selectAllState = true;
                    this.conList = this.conList.map(item=>{                        
                        item.checked = 'true';
                        if(!this.selectSignors.some(item2=>item2.accId == item.accId)){
                            this.selectSignors.push(item);
                        }
                        return item;
                    })
                    this.unique3(this.selectSignors,'accId')
                }
            },
            //删除签署人
            delSignors(item){
                this.selectSignors =  this.selectSignors.filter((itemVal)=>{
                    return itemVal.accId != item.accId
                })
            },
            //标签选择
            selectTreeList(item){
                this.tabId = item.uid;
                this.getContactorJsonList();
            },
            createSigner(){  //创建签署人
                console.log('创建签署人')
            },
            /*clickFileFn() {
                $('#againUpLoad').on('click',()=> {
                    $('#file2').val('');
                    $('#file2').click();
                });
                // 文件更改                
                $('#file2').on('change',(e)=>{
                    e = e || window.event;  
                    e.stopPropagation(); // 阻止冒泡  
                    e.preventDefault();  //阻止默认行为                            
                    let fileObj = $('#file2')[0].files[0];
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
            fileCom(fileObj){
                    let Type = fileObj.type;
                    if(Type.indexOf('application/pdf') === -1 
                    && Type.indexOf('image') === -1 
                    && Type.indexOf('vnd.openxmlformats-officedocument.presentationml.presentation') === -1
                    && Type.indexOf('vnd.ms-excel') === -1
                    && Type.indexOf('vnd.openxmlformats-officedocument.spreadsheetml.sheet') === -1
                    && Type.indexOf('msword') === -1
                    && Type.indexOf('vnd.ms-powerpoint') === -1
                    && Type.indexOf('vnd.openxmlformats-officedocument.wordprocessingml.document') == -1
                    ) {
                        this.modelCommonTip('您选择的文件不符合要求');
                        return;
                    }
                    let filename = fileObj.name; //文件名称 
                    let filesize = Math.floor((fileObj.size)/1024/1024);  
                    let index1 = filename.lastIndexOf('.pdf');
                    let fsize = fileObj.size/1024/1024;
                    if(filesize>10){ 
                        this.modelCommonTip('上传大小不能超过300M');
                        return false; 
                    }
                    this.pdfFileName = filename;
                    this.isImg = true;                  
                    this.signTitle = filename.split('.')[0];                 
                    this.signFile = fileObj;
                    this.uploadFile();
            },*/
            upFn(){
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
                }).done((json) => {
                    if(json.meta.success)
                    this.uploadFileState = false;
                    this.docId =  json.data.docId;
                    this.setSData('docId',this.docId)
                }).fail((err) => {
                    console.log(err)    
                });
            },
            //联系人标签列表
            contactList(){
                this.labelState = true;
                this.httpPost(this.URL['contactList'],{
                    userId:this.CURACCOUNT.accId
                },json=>{         
                    this.labelState = false;
                    if(json.meta.success){
                        this.menu = [];
                        this.menu = JSON.parse(json.data);   
                        if(this.menu.length == 0){
                            this.conList.push(this.curConListFirst);
                            this.createLableHandle('联系人','-1');    //如果没有标签默认添加
                            return;
                        }
                        if(!this.tabId){
                            this.tabId = this.menu[0].uid;
                        }
                        this.getContactorJsonList();
                    }else{
                        this.modelCommonTip(json.meta.msg)
                    }
                })
            },             
            //获取联系人列表
            getContactorJsonList(){                
                if(!this.tabId) return;
                this.tableLoading = true;
                this.httpPost(this.URL['getContactorJsonList'],{
                    tabId:this.tabId,
                    page:this.page.currentpageIndex,
                    pageSize:this.page.display,
                    userId:this.CURACCOUNT.accId
                },json=>{
                    this.tableLoading = false;
                    if(json.meta.success){
                        this.conList = JSON.parse(json.data.list);   
                        this.curConListFirst.checked = 'false';                        //初始化自己的数据为false
                        this.conList.unshift(this.curConListFirst);                    //讲自己的数据添加到联系人列表               
                        this.page.total = Number(json.data.total);
                        this.page.total = this.page.total == 0 ? 1 : this.page.total;   //数据不可能为空，因为自己的数据永远存在。避免出现暂无数据的处理
                        let countAll = 0;
                        if(this.selectSignors.length > 0 && this.conList.length > 0){
                            for(let i = 0; i < this.conList.length;i++){
                                for(let j = 0 ; j < this.selectSignors.length; j++){
                                    if(this.conList[i].accId == this.selectSignors[j].accId){
                                        countAll++;
                                        this.conList[i].checked = "true";
                                    }
                                }
                            }
                        }
                        //判断全选

                        if(countAll == this.conList.length && this.conList.length != 0){
                            this.selectAllState = true;
                        }else{
                            this.selectAllState = false;
                        }
                    }else{
                        this.modelCommonTip(json.meta.msg)
                    }
                })
            },
            //获取草稿箱数据
            getUploadDocLight(){
                this.httpGet(this.URL['getUploadDocLight'],{
                    docId:this.docId
                },({meta,data:{signators,signOrder,duration,docName}})=>{
                    if(meta.success){
                        [this.pdfFileName,this.signTitle,this.selectSignors,this.signOrder,this.durationTime] = [docName,docName,signators,signOrder ? signOrder : '001',duration]
                        // console.log(this.selectSignor.length)
                        if(signators.length == 0) return;
                        for(let i = 0 ; i < signators.length; i++){
                            this.searchHandle(signators[i],i);
                        }
                    }else{
                        this.modelCommonTip(meta.message)
                    }
                })
            },
            //获取联系人名字
            searchHandle({mobile,accNo},index){
                this.httpPost(this.URL['seachContact'],{
                    condition:mobile ? mobile : accNo,
                    userId:this.$store.state.CURACCOUNT.accId
                },json=>{
                    if(json.meta.success){
                        this.conList = JSON.parse(json.data.list);
                        if(this.conList[0]){
                            this.selectSignors[index].name = this.conList[0].name;
                        }
                    }else{
                        // this.modelCommonTip(json.meta.msg)
                    }
                })
            },
            pageChangeHandel(val){  //联系人翻页
                this.page.currentpageIndex = val;
                this.getContactorJsonList();
            },
            init(){
                let This = this;
                /*日期控件*/
                $('#date_start').datepicker({
                    todayBtn: "linked",
                    startDate:new Date(),
                    keyboardNavigation: false,
                    forceParse: false,
                    calendarWeeks: true,
                    autoclose: true,
                    todayHighlight: true,
                    format: 'yyyy-mm-dd',  
                    
                }).on("changeDate",(e) => {
                    This.durationTime = $("#date_start").find('input').val();
                    $('#date_start').find('input').val(This.durationTime);
                });
            },
        },
        mounted(){
            this.clickFileFn('#againUpLoad',"#file2");
            this.dragFileFn();
            this.init();
            let FROM = this.$route.query.from;
            if(FROM && this.getSData('signData')){
                const { docName , docId , duration, orderType  } = this.getSData('signData').data;
                this.selectSignors = this.getSData('signData').selectSignors;
                this.appointState = this.getSData('signData').appointState;
                this.durationTime = duration;
                this.pdfFileName = docName;
                this.signTitle = docName;
                this.signOrder = orderType;
                this.docId = docId;
            }else{
                this.againState = this.$route.query.againState ? this.$route.query.againState : 1 ;
                this.signTitle = this.$store.state.signFile ? this.$store.state.signFile : '';            
                this.pdfFileName = this.$store.state.pdfFileName ? this.$store.state.pdfFileName : '请上传需要的pdf文件';            
                this.signFile = this.$store.state.upFile ? this.$store.state.upFile : null;
                this.docId = this.$route.query.docId ? this.$route.query.docId : this.getSData('docId') ? this.getSData('docId') : '';
                if(this.docId){
                    console.log("获取草稿箱数据")
                    this.getUploadDocLight();
                }
            }
            
            this.sendHimItem = this.getSData('sendHimItem');
            if(this.sendHimItem){  //发给他签过来的数据
                // console.log(this.sendHimItem)                
                this.selectSignors.push(this.sendHimItem)
            }
            if(this.signFile){
                this.upFn();
            }

            let { accId, accType, contatcId,memo,displayName,ownAccId,mobileNo,accNo} = this.CURACCOUNT 
            this.curConListFirst = {
                accId,
                accType,
                contatcId:'',
                memo,
                name:displayName?displayName:mobileNo,
                ownAccId:'',
                phone:accNo,
                checked:'false'                        
            }
            this.contactList();
            
        }
    }
</script>