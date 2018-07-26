const $GDCA = require('@/assets/js/GDCAPKI/gdca-pki-lib.js').default;     
const gMethod = require('@/assets/js/GDCAPKI/gdca_sof_method.js');
export default {

    signData:{
        //pdf-start
        outerContainer:null,   //最外层div
        iframeDom:null,        //iframe
        viewerContain:null,    //viewerContain
        sidebarContent:null,
        viewer:null,           //viewer——pdf展示框
        seal:null,             //seal——pdf模拟展示框
        ConW:null,             //容器宽度
        ConH:null,             //容器高度
        PDFW:null,             //pdf宽度
        PDFH:null,             //pdf高度（加padding）
        PDFHH:null,            //pdf高度（不加padding）
        disX:null,             //两边间隙
        originW:null,          //pdf原始尺寸宽
        originH:null,          //pdf原始尺寸高
        PADDING:8,             //border边框
        navH:47,
        sign:{                 //盖章的坐标
            pageNumber:null,   //盖章的页数
            x:0,
            y:0
        },
        objDownStatus:null,   //是否按住生成的印章
        currentDrag:null,     //判断当前拖拽的元素存不存在
        currentDragDiv:null,  //当前拖拽元素
        initState:false,      //判断是否已经生成了seal结构
        sealPageList:[],      //生成的印章列表   
        scaleState:false,     //是否可以放大缩小印章状态
        zoom:null,            //文档的缩放值
        SCALE:null,           //实际尺寸与当前尺寸的比值
        dragNum:1,            //当前生成的第几个印章
        //左边印章数据
        selectState:false,    //选择签章的弹框状态
        selectListStamp:[],   //印章下拉列表
        selectListIndex:null, //印章下拉列表选中index
        sealList:[],          //印章总数据（第一次获取之后不会参与修改）
        sealListSmall:[],     //印章数据
        selectSrc:null,       //显示印章大图
        selectIndex:0,        //选中托管之外印章的下标          
        selectDelegateIndex:null,        //选中托管印章的下标          
        //pdf-end
    },
    signMethod:{
        //初始化函数
        init(){
            
            let This = this;
            let _init = () => {  //重新初始化
                $(this.viewerContain).scrollTop(0);  
                this.zoom = this.iframeDom.PDFViewerApplication.toolbar.pageScale;  //文档缩放大小
                // console.log(this.iframeDom.PDFViewerApplication)
                this.PDFW = this.viewer.firstChild.clientWidth;    //获取pdf宽度
                this.PDFHH = this.viewer.firstChild.clientHeight;
                this.PDFH = this.viewer.firstChild.clientHeight + this.PADDING;
                this.ConW = this.viewerContain.clientWidth;  
                this.ConH = this.viewerContain.clientHeight; 
                this.disX = (this.ConW - this.PDFW) / 2 > 0 ? (this.ConW - this.PDFW) / 2 : 0;
                let sealLeft = this.disX >  0 ? this.disX : 0;
                //获取pdf的原始尺寸宽高
                if(!this.originW && !this.originH){
                    // this.originW = this.allArithmetic('divi',this.PDFW,this.zoom);
                    // this.originH = this.allArithmetic('divi',this.PDFHH,this.zoom);
                    this.originW = '595';
                    this.originH = '842';
                }                    
                // console.log("原始尺寸宽："+this.originW+"原始尺寸高："+this.originH)
                $(this.viewer).css({
                    'width':`${this.PDFW}px`,
                    'margin':'0 auto'
                })
                $(this.seal).css({
                    'width':`${this.PDFW}px`,
                    'margin':'0 auto',
                    'left':`${this.disX}px`
                })   
                if(!this.initState){   //生成seal结构
                    this.initState = true;
                    let Html = null;
                    for(let i = 0 ; i < this.iframeDom.PDFViewerApplication.pagesCount ; i++){
                        Html += `<div data-page-number="${i+1}" class="sealitem" style="width:${this.PDFW}px;height:${this.PDFHH}px"></div>`
                    }
                    $(this.seal).html(Html);

                    $(this.seal).find('div.sealitem').on('mouseenter',function(){
                        if(This.currentDrag){
                            $(this).append(This.currentDragDiv)
                        }
                    })

                    $(this.seal).on('click','.sealImg',function(ev){  //点击生成的印章
                        if(This.objDownStatus){return;}
                        if(This.scaleState){return}
                        This.currentDrag = $(this).attr('num');
                        This.currentDragDiv = this;
                        $(this).children('.icon-del-solid').hide();
                        $(this).css({
                            position:'fixed',
                            top:ev.clientY+'px',
                            left:ev.clientX+'px'
                        })
                        $(this).addClass('curDiv');
                        This.drag(This.currentDragDiv)
                    })

                    // $(this.seal).on('mouseenter','.sealImg',function(ev){  //摁住生成的印章
                    //     This.currentDragDiv = this;
                    //     This.currentDrag = $(this).attr('num');
                    //     This.objDrag(this);
                    //     This.objDownStatus = false;
                    // })

                    
                    $(this.seal).on('mouseenter','.sealImg',function(){   //印章移入
                        if(!This.currentDrag){    //不存在拖拽的元素
                            $(this).children('.icon-del-solid').show();
                            $(this).css({
                                "border":'1px #000 dashed'
                            })
                        }
                    })

                    $(this.seal).on('mouseleave','.sealImg',function(){  //印章移出
                        $(this).children('.icon-del-solid').hide();
                        $(this).css({
                            "border":'1px rgba(0,0,0,0) dashed'
                        })
                        
                    })
                   
                    $(this.seal).on('click','.icon-del-solid',function(ev){  //印章删除按钮点击
                        ev.stopPropagation();
                        $(this).parent('.sealImg').remove();
                        let num = $(this).parent('.sealImg').attr('num');
                        This.sealPageList = This.sealPageList.filter(function(item,index){
                            return item.num != num;
                        })
                    })

                    $(this.seal).on('mouseenter','.iconScal',function(ev){  //印章放大缩小
                        ev.stopPropagation();
                        This.scaleHandle(this)
                        
                    })
                    
                }else{   //改变seal里面div的宽高
                    $(this.seal).find('.sealitem').css({
                        'width':`${this.PDFW}px`,
                        'height':`${this.PDFHH}px`
                    })
                }
            }
            let _resize = ObjDiv =>{   //窗口改变重新计算定位
                let oldLeft = +($(ObjDiv).css('left').replace('px', ''))
                let oldTop = +($(ObjDiv).css('top').replace('px', ''))                  
                let [originalWidth, originalHeight] = [+(ObjDiv.style.width.replace('px','')), +(ObjDiv.style.height.replace('px',''))];
                let l = this.allArithmetic('divi',this.allArithmetic('multi',this.viewer.firstChild.clientWidth,oldLeft), this.PDFW) 
                let t = this.allArithmetic('divi',this.allArithmetic('multi',this.viewer.firstChild.clientHeight,oldTop), this.PDFHH) 
                let scale = this.allArithmetic('divi',this.viewer.firstChild.clientWidth,this.PDFW);
                $(ObjDiv).css({
                    'width' : this.allArithmetic('multi',originalWidth,scale),
                    'height' : this.allArithmetic('multi',originalHeight,scale),
                    'top' : t  + 'px',
                    'left':l +'px'
                })
            }
            let initiated = evt => {   //pdf渲染完成之后
                this.iframeDom.PDFViewerApplication.eventBus.off('pagerendered', initiated);  
                _init();
            }
            let Timer = setInterval(()=>{
                if(this.iframeDom.PDFViewerApplication.eventBus){
                    clearInterval(Timer);

                    this.iframeDom.PDFViewerApplication.eventBus.on('pagerendered', initiated);
                    this.iframeDom.PDFViewerApplication.eventBus.on('resize', evt => {     //监听窗口改变
                        let pdfImg = $(this.seal).find('.sealImg') 
                        for(let i = 0 ; i < pdfImg.length;i++){
                            _resize(pdfImg[i])
                        }
                        _init();
                    });  

                    this.iframeDom.PDFViewerApplication.eventBus.on('scalechanged',evt =>{ //监听选择大小
                
                        let pdfImg = $(this.seal).find('.sealImg') 
                        for(let i = 0 ; i < pdfImg.length;i++){
                            _resize(pdfImg[i])
                        }
                        _init();
                    })
                    this.iframeDom.PDFViewerApplication.eventBus.on('scalechanging',evt => {  //监听放大缩小
                        let pdfImg = $(this.seal).find('.sealImg') 
                        for(let i = 0 ; i < pdfImg.length;i++){
                            _resize(pdfImg[i])
                        }
                        _init();
                    })
                    this.iframeDom.PDFViewerApplication.eventBus.on('sidebarviewchanged',evt => {  //缩略图点击
                        let pdfImg = $(this.seal).find('.sealImg') 
                        for(let i = 0 ; i < pdfImg.length;i++){
                            _resize(pdfImg[i])
                        }
                        _init();
                    })
                    
                }
            },60)
            
        },
        //选择签章
        selectHandle(){
            if(this.selectListStamp.length == 0) return;
            this.selectState = true;
        },
        //签章列表选择
        filterStamp(itemVal,index){                
            if(itemVal == 'all'){
                this.sealListSmall = this.sealList;
            }else{
                this.sealListSmall = this.sealList.filter((item)=>{
                    return item.certCode == itemVal.certCode;
                })
            }                
            [this.selectSrc,this.selectState,this.selectListIndex] = [this.sealListSmall[0],false,index];
        },
        //清楚页面所有签章
        clearPageStamp(){

        },
        //提示框关闭按钮
        cancelHandle(){
            switch(this.alertGoIndex){
                case 1:
                    this.alertState = false;
                    break;
                case 2:
                    if(this.$route.query.enter == 'index'){
                        this.$router.push({name:'Index'});
                    }else if(this.$route.query.enter == 'detail'){
                        this.$router.push({name:'Detail'});
                    }else{
                        this.$router.push({name:'ManaFile'});
                    }                    
                    break;
                case 3:
                    // this.$store.commit('saveCurAccount',this.$router)
                    this.httpGet(this.URL['logoutWithoutPage'],{},(response)=>{});
                    this.$router.push({
                        name:'Login'
                    })
                    break;
                case 4:
                    this.$router.push({name:'ComSeal'});
                    /*if(this.userState == 0){
                        this.$router.push({name:'ComSeal'});
                    }else{
                        this.$router.push({name:'Seal'});
                    }   */                     
                    break;
                case 5:
                    this.$router.push({name:'Detail'});
                    break;
                case 6:   //发起失败
                    this.alertState = false;
                    this.alertGoIndex = null;
                    this.alertTxt = '';
                    this.pin.sureBtnTxt = '确定';
                    // [this.alertState,this.alertTxt] = [ false, ''];
                    break;                
                case 7:   //签署失败
                    this.$router.push({
                        name:'Detail',
                        params:{
                            docId:this.docId
                        }
                    })
                    break;
                
                default:
                    break;
            }
        },            
        //续锁
        intervalSignLock(){
            this.ajaxPost(this.URL['intervalSignLock'],{docId:this.docId},res=>{
                // if(json)
                let json = JSON.parse(res);
                if(json.result == '000') return;

                if(json.result == '001'){
                    this.alertTxt = '页面已过期，请重新打开。';
                }else if(json.result == '002'){
                    this.alertTxt = '服务器异常，请重试';
                }else if(json.result == '004'){
                    this.alertTxt = '其他签署人还未完成处理，请稍候片刻。';
                }else{
                    this.alertTxt = '服务器异常，请重试';
                }
                this.alertGoIndex = 2;
                this.alertState = true;
                clearInterval(this.conLockInterval);
            })
        },
        //获取签署需要使用的cerNo之前   过滤ukey
        extractCertNoBefore(){
            var This = this;
            gMethod.checkReadUserList(this, function (res) {   
                $GDCA.exportUserCert(res, function (usercert) {
                    This.extractCertNo(usercert)
                }, function (err) {

                });                    
            }, function (err) {

            });
        },
        //获取签署需要使用的cerNo
        extractCertNo(usercert){
            this.ajaxPost(this.URL['extractCertNo'],{
                'certData':usercert
            },json=>{                  
                let certCode = json.data;  //certCode
                if(json.meta.success){
                    //此处省略了证书有效期的判断
                    let fitThisUkey = null;
                    this.sealListSmall.map(item=>{
                        if(item.certCode == certCode){
                            fitThisUkey = true;
                        }
                    })
                    if(fitThisUkey){
                        if(this.sealListSmall.length == 0) return;
                        this.sealListSmall = this.sealListSmall.filter(item=>{
                            return item.certCode == certCode;
                        })
                        let defaultStamp = null;
                        for(let i = 0 ; i < this.sealListSmall.length ; i++){
                            if(this.sealListSmall[i].isDefault == 'Y'){
                                defaultStamp = this.sealListSmall.splice(i,1);
                            }
                        }
                        if(defaultStamp){
                            this.sealListSmall.unshift(defaultStamp[0]);
                        }
                        this.selectSrc = this.sealListSmall[0];
                    }
                }else{
                    let {message} = json.meta;
                    if(message == 'NO_LOGIN'){
                        this.alertGoIndex = 3;
                        this.alertTxt = '登录已过期，请重新登录';
                    }else if(message == 'WRONG_CERT'){
                        this.alertGoIndex = 1;
                        this.alertTxt = '检测到UKEY有故障，建议更换UKEY或咨询客服';
                    }else if(message == 'NO_CERT'){
                        this.alertGoIndex = 1;
                        this.alertTxt = '检测到UKEY有故障，建议更换UKEY或咨询客服';
                    }
                    this.alertState = true;
                }
            })
        },
        //获取签章
        ajaxGetSignStamps(json){
            this.ajaxPost(this.URL['ajaxGetSignStampsWithoutDocChecked'],{docId:this.docId},json=>{
                if(!json.meta){
                    this.alertGoIndex = 2;
                    this.alertState = true;
                    this.alertTxt="服务器异常，请重新进入";                        
                    return;
                }
                
                if(json.meta.success){  
                    if(json.data){
                        let {stampList,stampType} = json.data;                        
                        let defaultStamp = null;
                        /* 将默认签章放到第一位 */
                        for(let i = 0 ; i < stampList.length ; i++){
                            stampList[i].TYPE = 'nodelegate';
                            if(stampList[i].isDefault == 'Y'){
                                defaultStamp = stampList.splice(i,1);
                            }
                        }
                        if(defaultStamp){
                            stampList.unshift(defaultStamp[0]);
                        }
                        
                        /*end*/
                        this.sealList = this.sealListSmall = stampList;                              
                        this.selectSrc = this.sealListSmall[0];
                        this.stampType = stampType;
                        this.dealDropDownCerts(stampList);
                    }

                    if(!this.accountType){
                        this.extractCertNoBefore();
                    }
                }else{
                    this.modelCommonTip(json.meta.message || '失败');
                }
            })
        },
        //获取当前登录用户的托管证书及印章
        /*personSeal(){
            this.httpPost(this.URL['personSeal'],{},res=>{
                if(res.meta.success){
                    this.delegateSeal = res.data.data.stampList;
                    this.delegateCertInfo = res.data.data.certInfo
                }else{
                    this.modelCommonTip(res.meta.msg)
                }
            })
        },*/
        // 处理印章下拉列表
        dealDropDownCerts(stampList){
            this.selectListStamp = this.unique3(stampList,'certCode');
        },
        //点击印章生成签章
        createSeal(curItem,type){
            let arrEle = $(this.seal).find('.sealImg');            
            if(Array.from(arrEle).length > 0 && type == 'nodelegate'){
                let stampArr = Array.from(arrEle).map(item=>{
                    return $(item).attr('data-stampId');
                })    
                let Bol = stampArr.every(item=>item == curItem.stampId);
                if(Bol){
                    this.createHandle()
                }else{
                    this.$store.commit('changeDialog',{state:true,options:{title:'提示',text:`是否要清楚页面上的所有签章`}})
                    this.dialogConfirm.confirm().then(() => {
                        this.$store.commit('changeDialog',{state:false,options:{}});
                        this.deleteSeal('all');
                        this.createHandle();
                    }).catch(() => {
                        this.$store.commit('changeDialog',{state:false,options:{}})
                    })
                }
                
            }else{
                this.createHandle()
            }
        },
        createHandle(){
            let This = this;
            if(this.currentDrag){   //存在
                $('#dragBox .sealImg').remove();
                this.currentDrag = null;
            }
            $(this.seal).find('.fixed').remove();
            let {selectSrc} = this;
            if(this.currentDrag) return;
            let imgHref =selectSrc.base64_data?  'data:image/png;base64,'+selectSrc.base64_data : 'data:image/png;base64,'+selectSrc.stampImg;
            let W = null;
            let H = null;
            if(selectSrc.depositId){ //托管
                W = 190;
                H = 190*selectSrc.height/selectSrc.width;
            }else{    
                W = selectSrc.width*this.zoom;
                H = selectSrc.height*this.zoom;
            }
            let offsetLeftRight = $('#sideRight').position().left;
            let offsetTopRight = $('#sideRight').position().top+50;
            $('#dragBox').append(`<div class="sealImg sealSign curDiv fixed" data-type="${selectSrc.TYPE}" data-stampId="${selectSrc.stampId}" data-certCode="${selectSrc.certCode ? selectSrc.certCode : ''}" data-orgId="${selectSrc.orgId}" id="drag_sign_${this.dragNum}" num="${this.dragNum}" style="position:fixed;left:${offsetLeftRight}px;top:${offsetTopRight}px;z-index:100;width:${W}px;height:${H}px;border:1px #000 dashed;"><img src="${imgHref}" style="width:100%;height:100%;" /><span class="icon-del-solid" style="display:none;"></span><span class="iconScal"></span></div>`);
            this.currentDrag = this.dragNum;
            this.currentDragDiv = document.getElementById('drag_sign_'+this.dragNum);
            this.dragNum++;
            setTimeout(()=>{
                this.drag(this.currentDragDiv);
            },100)
        },
        //点击印章生成签章
        createSquare(){
            let This = this;
            let {selectSrc} = this;
            if(this.currentDrag) return;
            let offsetLeftRight = $('#sideRight').position().left;
            let offsetTopRight = $('#sideRight').position().top+50;
            $('#dragBox').append(`<div class="sealImg sealImg2 curDiv" id="drag_sign_${this.dragNum}" data-accno="${this.selectSignors[this.singerIndex].accId}" num="${this.dragNum}" style="position:fixed;left:${offsetLeftRight}px;top:${offsetTopRight}px;z-index:102;width:150px;height:100px;border:1px #acacac dashed;background:rgba(245, 245, 245, 0.8);cursor:pointer;">
            <span class="txt" style="position: absolute;top: 20px;text-align: center;display: block;font-size: 12px;width: 100%;">签章位置</span>
            <span class="name" style="position: absolute;bottom: -40px;text-align: center;display: block !important;font-size: 12px;width: 100%;background: rgba(255,255,255,0.8);border: 1px orange solid;line-height: 30px;border-radius: 5px;">${this.selectSignors[this.singerIndex].name}</span>
            <span class="icon-del-solid" style="display:none;"></span>
            </div>`);
            this.currentDrag = this.dragNum;
            this.currentDragDiv = document.getElementById('drag_sign_'+this.dragNum);
            this.dragNum++; 
            setTimeout(()=>{
                this.drag(this.currentDragDiv);
            },100)
        },

        //选择签署印章
        selectSealHandle(item,index,type="nodelegate"){    //nodelegate  选择的不是托管   delegate  选择的是托管
            // if(this.currentDrag) return;
            if(type == 'delegate'){
                this.selectDelegateIndex = index;
                this.selectIndex = null;
            }else{
                this.selectIndex = index;
                this.selectDelegateIndex = null;                   
            }
            this.selectSrc = item;


           /* let arrEle = $(this.seal).find('.sealSign');
            if(arrEle.length > 0){
                let arr = [];
                for(let i = 0 ; i < arrEle.length; i++){
                    arr.push(arrEle.eq(i).attr('data-TYPE'));
                }
                
                let Bol = arr.every(item=>item == type);
                if(Bol && type == 'delegate'){  //选中的是托管，并且页面上的印章也是托管
                    this.selectIndex = null;
                    this.selectDelegateIndex = index;
                    this.selectSrc = item;
                    this.$store.commit('changeDialog',{state:false,options:{}});
                   
                    // this.sele
                }else{  //不是全部都是托管
                    this.$store.commit('changeDialog',{state:true,options:{title:'提示',text:`是否要清楚页面上的所有签章`}})
                    this.dialogConfirm.confirm().then(() => {
                        this.selectIndex = index;
                        this.selectDelegateIndex = null;
                        this.selectSrc = item;
                        this.$store.commit('changeDialog',{state:false,options:{}});
                        this.deleteSeal('all')
                    }).catch(() => {
                        this.$store.commit('changeDialog',{state:false,options:{}})
                    })
                }

                
            }else{
                if(type == 'delegate'){
                    this.selectDelegateIndex = index;
                    this.selectIndex = null;
                }else{
                    this.selectIndex = index;
                    this.selectDelegateIndex = null;                   
                }
                this.selectSrc = item;
            }   */      
            
        },
        //印章列表删除印章
        deleteSeal(item){
            let arr = $(this.seal).find('.sealSign');
            if(item == 'all'){
                for(let i = 0 ; i < arr.length ; i++){
                    arr.eq(i).remove();
                }
                this.sealPageList = [];
            }else{
                for(let i = 0 ; i < arr.length ; i++){
                    if(arr.eq(i).attr('num') == item.num){
                        arr.eq(i).remove();
                    }
                }
                this.sealPageList = this.sealPageList.filter((itemObj,index)=>{
                    return itemObj.num != item.num;
                })
            }
            
            
        },//到达哪一页
        goPage(index){
            $(this.sidebarContent).find('a').eq(index-1).click();
        },
        //点击返回
        backHandle(){
            const {docId} = this;
            this.$router.push({
                name:'ToFill',
                query:{
                    docId,
                    from:'beforeSign'
                }
            })
        },
        //点击引导层
        guideHandle(){                
            if(this.guide.num == 3){
                this.guide.state = false;
            }
            this.guide.num ++ ;
        },        
        //印章放大缩小
        scaleHandle(obj){ 
            let This = this;
            obj.onmousedown = function(ev) {
                var ev = ev || event;
                ev.stopPropagation();                       
                $(This.iframeDom.document).css({
                    cursor:'se-resize'
                })
                let disX = ev.clientX;
                let ParentObj = $(obj).parent('.sealImg');
                let W = ParentObj.width();
                let H = ParentObj.height();
                let percent = W / H;
                if ( obj.setCapture ) {
                    obj.setCapture();
                }
                This.iframeDom.document.onmousemove = function(ev) {                        
                    var ev = ev || event;
                    This.scaleState = true;
                    let CurW = (W + (ev.clientX - disX)) < 100 ? 100 : (W + (ev.clientX - disX)) > 500 ? 500 : (W + (ev.clientX - disX));  
                    ParentObj.css({
                        width:CurW + 'px',
                        height:CurW/percent+'px',
                        border:'1px #000 dashed',
                        cursor:'se-resize'
                    })
                    $(obj).siblings('.icon-del-solid').hide();
                    
                }
                This.iframeDom.document.onmouseup = function(ev) {
                    var ev = ev || event;
                    ev.stopPropagation();   
                    setTimeout(()=>{
                        This.scaleState = false;
                    },30)
                             
                    $(obj).parent('.sealImg').css({
                        border:'1px rgba(0,0,0,0) dashed'
                    })
                    if(ParentObj[0].offsetTop+ParentObj.height() > This.PDFHH){
                       ParentObj.css({
                            top:This.PDFHH-ParentObj[0].offsetHeight + 'px'
                        }) 
                    }
                    This.iframeDom.document.onmousemove = obj.onmouseup = null;
                    //释放全局捕获 releaseCapture();
                    if ( obj.releaseCapture ) {
                        obj.releaseCapture();
                    }
                }
                
                return false;
            
            }
        },
        //拖拽函数
        drag(obj) {	
            let This = this;
            let objH = obj.style.height.replace('px','');
            This.viewerContain.onmousemove = function(ev) {    
                var ev = ev || event;
                let objXY = This.getClientXY(ev,obj);
                obj.style.left = objXY.X+1+'px';
                obj.style.top = objXY.Y+1+'px';     
                $(This.viewerContain).css({
                    // cursor:'pointer'
                    cursor:'move'
                })    
                $(This.seal).find('.sealImg img').css({
                    // cursor:'pointer'
                    cursor:'move'
                })    
                  
                $(This.seal).find('.sealImg').css({
                    "border":'1px rgba(0,0,0,0) dashed'
                })     
                $(This.currentDragDiv).css({
                    "border":'1px #000 dashed'
                }) 

                //处理印章签名
                $(This.seal).find('.sealImg2').css({
                    cursor:'move'
                }) 
                
                This.signStatus = false;
            }               
            This.viewerContain.onmouseup = function(ev) {
                This.viewerContain.onmousemove = This.viewerContain.onmouseup = null;
                if(!This.sign.pageNumber){
                    This.sign.pageNumber = document.getElementById('if').contentWindow.document.getElementById('pageNumber').value;
                }
                let objXY = This.getClientXY(ev,obj);
                let DisT = (This.sign.pageNumber-1) * This.PDFH;  //上区间
                let DisB = This.sign.pageNumber * This.PDFH - This.PADDING;  //下区间
                let PosTop = $(This.viewerContain).scrollTop()+objXY.Y-This.navH+1;
                let PosLeft = $(This.viewerContain).scrollLeft()+objXY.X-This.disX+1;
                if(PosTop < DisT){
                    PosTop = DisT;
                }
                if(PosTop > DisB-objH){
                    PosTop = DisB-objH;
                }
                $(obj).css({
                    'position':'absolute',
                    'top':PosTop - (This.PDFH*(This.sign.pageNumber-1))+'px',
                    'left':PosLeft+'px',
                    'border':'1px rgba(0,0,0,0) dashed'
                }).removeClass('fixed');

                This.signStatus = true;
                $(obj).attr('pageNum',This.sign.pageNumber)
                This.sign.x = PosLeft;
                This.sign.y = PosTop - (This.PDFH*(This.sign.pageNumber-1));
                This.currentDrag = null;
                This.sealPageList.unshift({
                    pageNum:This.sign.pageNumber,
                    num:$(obj).attr('num'),
                    src:$(obj).find('img').attr('src')
                })
                This.sealPageList = This.unique3(This.sealPageList,'num')  //数组去重
                $(This.viewerContain).css({
                    cursor:'default'
                })
                $(This.seal).find('.sealImg img').css({
                    // cursor:'move'
                    cursor:'pointer'
                })
                //处理签名框
                $(This.seal).find('.sealImg2').css({
                    cursor:'pointer'
                })   

                if ( obj.releaseCapture ) {
                    obj.releaseCapture();
                }
            }                
        },            
        //摁住拖拽
        objDrag(obj){
            var This = this;
            obj.onmousedown = function(ev) {
                var ev = ev || event;
                // $(This.seal).append(This.currentDragDiv)
                obj.style.position = 'fixed';
                This.objDownStatus = true;
                var disX = ev.clientX - this.offsetLeft;
                var disY = ev.clientY - this.offsetTop;
                obj.style.left = ev.clientX - ev.offsetX + This.disX - 1 + 'px';
                obj.style.top = ev.clientY - ev.offsetY + This.navH  - 1  +'px';
                if ( obj.setCapture ) {
                    obj.setCapture();
                }
                This.seal.onmousemove = function(ev) {
                    var ev = ev || event;
                    obj.style.left = ev.clientX - disX + This.disX - 1 + 'px';
                    obj.style.top = ev.clientY - disY + This.navH  + 'px';
                    // obj.style.left = ev.clientX - ev.offsetX + This.disX - 1 + 'px';
                    // obj.style.top = ev.clientY - ev.offsetY + 46 +'px';
                }
                obj.onmouseup = function(ev) {
                    var ev = ev || event;
                    obj.style.position = 'absolute';
                    obj.style.left = obj.style.left.replace('px','') - This.disX  + 'px';
                    obj.style.top = obj.style.top.replace('px','') - This.navH  + 'px';
                    This.seal.onmousemove = obj.onmouseup = null;
                    This.currentDrag = null;
                    //释放全局捕获 releaseCapture();
                    if ( obj.releaseCapture ) {
                        obj.releaseCapture();
                    }
                }
                
                return false;
            
            }
        },
        //获取鼠标位置
        getClientXY(ev,obj){         
            let L = ev.clientX;
            let T = ev.clientY;
            if ( L < this.disX ) {
                L = this.disX;
            } else if ( L > this.ConW - obj.offsetWidth - this.disX) {
                L = this.ConW - obj.offsetWidth - this.disX;
            }                    
            if ( T < 0 ) {
                T = 0;
            } else if ( T > this.ConH + this.navH - obj.offsetHeight ) {
                T = this.ConH + this.navH - obj.offsetHeight ;
            }
            return{
                X:L,
                Y:T
            }
        },
        //获取印章页数列表
        getSealPageList(){       
            this.sealPageList = [];
            let arr = $(this.seal).find('.sealImg');
            let list = []
            for(let i = 0 ; i < arr.length ; i++){
                list.unshift(arr.eq(i).attr('pagenum'))
            }
            console.log(list)
            this.sealPageList = list;
            // return this.unique1(list).sort(function(a,b){return a-b});
        },
        //精确计算加减乘除start
        isFloat(a){
            let reg = /\d.\d+/g
            return reg.test(a)
        },
        getFloatDigit(a){
            var digit, len
                    a = a.toString()
                    digit = a.split(".")
                    len = digit[1] == undefined ? 0 : digit[1].length
                    return len
        },
        allArithmetic(type,a,b){  //type(add,sub,multi,divi)
            var c, gfd_a, gfd_b, baseLen, baseMulti
            var a = Number(a),
                b = Number(b)
            if (this.isFloat(a) || this.isFloat(b)) {
                gfd_a = this.getFloatDigit(a)
                gfd_b = this.getFloatDigit(b)
                baseLen = gfd_a >= gfd_b ? gfd_a : gfd_b
                baseMulti = Math.pow(10, baseLen)
                a = type != "add" ? Number(a.toString().replace(".", "")) : a
                b = type != "add" ? Number(b.toString().replace(".", "")) : b
                if (type == "add") {
                    c = ((a * baseMulti + b * baseMulti) / baseMulti).toFixed(baseLen)
                } else if (type == "multi") {
                    c = (a * b) / Math.pow(10, gfd_a + gfd_b)
                } else if (type == "divi") {
                    c = ((a / b) * Math.pow(10, gfd_b - gfd_a))
                }
            } else {
                if (type == "add") {
                    c = a + b
                } else if (type == "multi") {
                    c = a * b
                } else if (type == "divi") {
                    c = a / b
                }
            }
            return c
        },
        //精确计算加减乘除end
    }
}