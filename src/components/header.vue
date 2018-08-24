<template>
    <header class="headerNav">
        <div class="container">
            <ul class="sideLeft">
                <li class="logo">
                    <router-link to="/welcome/index">
                        <!-- <img src="../assets/images/logo.png" width="116" height="37" alt=""> -->
                        <!-- <span class="iconfont icon-logo"></span> -->
                        <span><img :src="Config.headerLogo" width="80" alt=""></span>
                    </router-link>
                </li>
                <li v-for="(item,index) in menu" :key="index">
                    <router-link :to="item.path">
                        {{item.title}}
                    </router-link>
                </li>
            </ul>
            <ul class="sideRight">
                <li>
                    <!-- <a title="升级为企业用户">
                        <span class="iconfont icon-company" ><b></b></span>
                    </a>  -->
                    <router-link title="购买套餐" to="/package">
                        <span class="iconfont icon-cart"></span>
                    </router-link> 
                    <!-- <router-link title="消息中心" to="/news">
                        <span class="iconfont icon-bell"><b></b></span>
                    </router-link> -->
                    <a title="退出" href="javascript:;" @click="exitStatus = true">
                        <span class="iconfont icon-exit"></span>
                    </a>
                </li>
            </ul>
            <a v-show="sendState" href="javascript:;" id="sendSign" class="startSign"><i class="iconfont icon-edit"></i>发起签约</a>
            <input type="file" id="file3" hidden>
        </div>
        <alertModel title="风险提示" v-show="warnState" :type="2" :cancelBtnTxt="'继续发起签署'" :sureBtnTxt="'去实名认证'" @cancelHandle="warnState = false;">
            <div slot="alert-content" class="warnState">
                <p>您的账号尚未实名认证，目前只能发起【未实名认证】合同，存在安全风险，建议实名认证后再发起签署。</p>
            </div>
            <div slot="alert-footer">
                <a href="javascript:;" class="cancel-btn"  @click="containSendSign">继续发起签署</a>
                <a href="javascript:;" class="sure-btn" @click="realClick">去实名认证</a>
            </div>
        </alertModel>
        <!-- <alertModel title="请设置签署密码" v-show="signPswState" :type="2" @cancelHandle="signPswState=false;signPsw='';signPswErr='';" @sureHandle="issueHandle">
            <div slot="alert-content" class="signPsw" >
                <p class="tip">由于您没有签名证书，请先<span>设置签署密码</span>，供签署使用</p>
                <p class="input"><input type="password" placeholder="请设置签署密码" v-model.trim="signPsw" @keyup.enter="issueHandle" v-on:input="signPswErr = ''"></p>
                <p class="warn">{{signPswErr}}</p>
            </div>
        </alertModel> -->
        <!-- <pinCom @pinSureHandle="issueHandle"></pinCom> -->
        
        <alertModel title="实名认证" :type = "2"  :footerStatus="false" v-show="real.state" @cancelHandle="real.state = false">
            <div slot="alert-content">
                <img src="../assets/images/real_ewm.png" alt="" />
                <p><br/>扫码下载真宜签app实名认证</p>
            </div>
        </alertModel>
        <Loading text="处理中...请稍等" v-show="loadingState"></Loading>
        <pinCom @pinSureHandle="issueHandle">{{Config.Title}}</pinCom>
        <alertModel :type="2" v-show="exitStatus" :context="'确认退出当前用户?'" :alelrtClassWidth="'398px'" @cancelHandle="exitStatus=false" @sureHandle="exitHandle"></alertModel>
    </header>
</template>
<script>
    let menu = [
        [
            {
                title:'首页',
                path:'/index',
                type:101
            },
            {
                title:'文档管理',
                path:'/manafile',
                type:201
            },
            {
                title:'企业账户',
                path:'/user',
                type:301
            }
        ],
        [
            {
                title:'首页',
                path:'/index',
                type:101
            },
            {
                title:'文档管理',
                path:'/manafile',
                type:201
            },
            {
                title:'个人中心',
                path:'/user',
                type:301
            }
        ]
    ]
    import pinCom from '@/components/common/setPin/setPin';
    import { upLoadDate,upLoadMethod} from '@/assets/js/uploadFile.js';
    export default {
        name:'header',
        data(){
            return{
                loadingState:false,
                //未实名点击发起签约的数据
                warnState:false,
                /*发起签约 */
                // signTitle: '',   //文档名称
                // signFile: {},    //文档流
                // pdfFileName:'请上传需要签署的PDF文件',
                ...upLoadDate,
                sendState:true,  //发起签约按钮显示隐藏
                type:null,
                exitStatus:false,
                menu:null,

                signPswState:false,         //设置签署密码弹框
                signPsw:'',                 //签署密码
                signPswErr:"",
                stampImg:'',                //生成默认签章
                real:{
                    state:false,
                }
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
            realClick(){   //点击实名认证(有待修正)
                this.warnState = false;
                if(this.userState){  //个人  userState == 1
                    this.real.state = true;
                }else{
                    // this.getStep();
                    this.$router.push({
                        name:'ComRealStep1'
                    })
                }                   
            },
            canDraw(){               
                let canvas = document.getElementById("myCanvas");
                //简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
                if(canvas.getContext){  
                    //获取对应的CanvasRenderingContext2D对象(画笔)
                    let ctx = canvas.getContext("2d");
                    
                    //设置字体样式
                    ctx.font = "50px Courier New";
                    //设置字体填充颜色
                    ctx.fillStyle = "#000";
                    //从坐标点(0,60)开始绘制文字
                    ctx.fillText(`${this.CURACCOUNT.mobileNo}`, 0, 60);
                    this.stampImg = canvas.toDataURL("image/png");

                    this.REQUEST('POST',this.URL['personAddseal'],{stampImg:this.stampImg.split(',')[1],stampName:'默认签章'}).then(({meta,data})=>{
                        this.signPswState = false;
                        this.warnState = false; 
                        this.loadingState = false;
                        //此处跳转到第二页            
                        this.$router.push({
                            name:'ToFill',
                            query:{
                                againState:2
                            }
                        })
                    })

                }
            },
            //个人托管证书签发
            issueHandle(){
                $('#file3').val('');
                $('#file3').click(); 
            },
            //继续发起签署
            containSendSign(){
                if(!this.CURACCOUNT.depositStatus){
                    this.$store.commit('changePinState',true);
                    this.$store.commit('changePinIndex',1);
                }else{
                    $('#file3').val('');
                    $('#file3').click();
                    this.warnState = false;
                }
            },
            exitHandle(){  //退出
                this.httpGet(this.URL['logoutWithoutPage'],{},(response)=>{});
                this.removeSData('depositStatus');
                setTimeout(function(){
                    window.location.href="/login"
                },300)
            },
            async upFn(event) {
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
                    this.$store.commit('changePinState',false)
                        if(upLoadFileState){
                            clearInterval(Timer);
                            this.$store.commit('changeUpLoadFileState',0) 
                            if(upLoadFileState == 1){  //成功
                                this.warnState = false;
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
                    this.$store.commit('changePinState',false)
                    this.$store.commit('changeUpLoadFileState',0) 
                    this.warnState = false;
                    this.$router.push({
                        name:'ToFill',
                        query:{
                            againState:2
                        }
                    })
                }
            },
        },
        mounted(){
            this.clickFileFn('#sendSign','#file3');
            let Timer = setInterval(()=>{
                if(this.userState != null){
                    clearInterval(Timer);
                    this.menu = menu[this.userState];
                }
            },30)
        },
        watch:{
            '$route':function(to,from){
                this.type = to.meta.type;
                if(to.name == 'ToFill'){
                    this.sendState = false;
                }else{
                    this.sendState = true;
                }
            }
        }
    }
</script>