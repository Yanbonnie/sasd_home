<template>
    <section class="jSignatureBox">
        <nav @click="$router.push({name:'ComSeal'})"><i class="iconfont icon-back"></i>添加手写签名</nav>
        <div class="formBox">
            <!-- <div class="item">
                <label for="">印章名称</label>
                <input type="text" v-model="submit.stampName" placeholder="请输入印章名称">
            </div> -->
            <div v-show="autoState">
                <div class="item">
                    <label for="">自定义印章内容</label>
                    <input type="text" v-model="userName" placeholder="请输入印章内容，回车"  @keyup.enter="autoWrite">
                </div>
                <div class="item">
                    <label for="">字体大小</label>
                    <div class="slideBox">
                        <span class="slider" id="drag1"></span>
                    </div>
                </div>
                <div class="item">
                    <label for="">垂直位置</label>
                    <div class="slideBox">
                        <span class="slider" id="drag2"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="signBox">
            <div id="signature">
                <div id="someelement"></div>
                <!-- <canvas class="jSignature"  style="margin: 0px; padding: 0px; border: none;"></canvas> -->
            </div>
        </div>
        <div class="btn-box" id="btn-box">
            <a @click="quickHandle" class="autowrite"><b>快速<br/>生成</b></a>
            <!-- <div class="canvasBox" v-show="autoState">
                <input type="text" placeholder="请输入印章内容" v-model="userName" @keyup.enter="autoWrite">
                <div class="btnBox">
                    <a href="javascript:;" @click="autoState = false">关闭</a>
                    <a href="javascript:;" @click="autoWrite">确定</a>
                </div>
            </div> -->
            <a class="black" :class="[currentColor == 1 ? 'active': '']" @click="selectColor('#000',1)"></a>
            <a class="blue" :class="[currentColor == 2 ? 'active': '']" @click="selectColor('#0030ff',2)"></a>
            <a class="red" :class="[currentColor == 3 ? 'active': '']" @click="selectColor('#ff503f',3)"></a>
            
            <a href="javascript:;" @click="save" id="save" class="iconfont icon-hook save"></a>
            <a href="javascript:;" @click="reset" id="reset" class="iconfont icon-del reset"></a>
            
        </div>
        <Loading text="上传中..." v-show="loadingState"></Loading>
    </section>
</template>

<script>
    import '@/assets/js/plugin/jSignature.js'
    export default{
        data(){
            return{
                canvas:null,
                ctx:null,
                W:null,
                H:null,
                color:'#000000',
                signDiv:null,
                currentColor:1,
                userName:'',
                loadingState:false,
                autoState:false,
                submit:{
                    stampName:'个人签名',
                    stampImg:''
                },
                size:null,
                offsetTop:null,
                fontNum:0,
                topNum:0,
                type:null,
                
            }
        },
        methods:{
            quickHandle(){
                if(this.autoState){
                    [this.autoState] = [false]
                }else{
                    this.autoState = true;
                    this.reset();
                }
                [this.userName,this.fontNum,this.topNum] = ['',0,0]
                $('.slider').css({
                    'left':'192.5px'
                })
            },
            drag(obj,type) {    
                let This = this;            
                obj.onmousedown = function(ev) {
                    var ev = ev || event;
                    
                    var disX = ev.clientX - this.offsetLeft;
                    var disY = ev.clientY - this.offsetTop;
                    var Tem = 193;
                    if ( obj.setCapture ) {
                        obj.setCapture();
                    }                    
                    document.onmousemove = function(ev) {
                        var ev = ev || event;
                       
                        var L = ev.clientX - disX;
                        var T = ev.clientY - disY;
                        var W = obj.parentNode.offsetWidth;
                        if ( L < 0 ) {
                            L = 0;
                        } else if ( L > W - 15 ) {
                            L = W - 15;
                        }
                        obj.style.left = L + 'px';
                        if(type == 'font'){
                            This.fontNum = L - Tem;
                            This.autoWrite({},1)
                        }else if (type == 'offsetTop'){
                            This.topNum = L - Tem;
                            This.autoWrite({},1)
                        }
                    }                    
                    document.onmouseup = function() {
                        document.onmousemove = document.onmouseup = null;
                        if ( obj.releaseCapture ) {
                            obj.releaseCapture();
                        }
                    }
                    return false;
                }
                
            },
            //添加印章
            personAddseal(){
                const { type } = this;
                const { stampName, stampImg} = this.submit;
                if(!stampName){
                    this.modelCommonTip("印章名称不能为空");
                    return;
                }
                this.loadingState = 'true';
                let url = '';
                if(type == 2){
                    url = this.URL['companyAddseal']
                }else{
                    url = this.URL['personAddseal']
                }
                this.httpPost(url,{
                    stampName,
                    stampImg
                },res=>{
                    this.loadingState = false;
                    if(res.meta.success){
                        this.$router.push({
                            name:'ComSeal'
                        })
                    }else{
                        this.modelCommonTip(res.meta.msg)
                    }
                })
            },
            init(){
                let $sigdiv = $("#signature");
                [this.W,this.H,this.signDiv] = [$sigdiv.width(),$sigdiv.height(),$sigdiv];
                $sigdiv.jSignature('init',
                    {
                        color:"#000",
                        lineWidth:'8',
                        width:this.W * 2,
                        height:this.H*2
                    }
                )
                $('.jSignature').css({'width':this.W+'px','height':this.H+'px'});
                // 2.重置画布
                $sigdiv.jSignature("reset"); 
                
                //3.获取画布
                this.canvas=document.querySelector(".jSignature");
                
                // 设置画布背景色
                this.ctx = this.canvas.getContext('2d');
                this.reset();
                // this.autoWrite();
                $("#signature").on('mousedown',function(){
                    $(this).css({
                        "background":'#f3f3f3'
                    })
                })
            },
            reset(){
                this.signDiv.jSignature("reset"); //重置画布，可以进行重新作画.
                this.ctx.clearRect(0,0,this.W,this.H);  //清除画布
                $("#someelement").html("").hide();
                this.signDiv.jSignature("setColor",this.color); 
                this.signDiv.jSignature("setLineWidth",'8'); 
            },
            save(){
                if(this.signDiv.jSignature('getData','native').length == 0){
                    // alert("请写入您的签名");
                    this.modelCommonTip("请写入您的签名");
                    return;
                }
                //将画布内容转换为图片
                let datapair = this.signDiv.jSignature("getData", "image");
                this.submit.stampImg = datapair[1]
                this.personAddseal();                
            },
            selectColor(color,num){
                this.color = color;
                this.currentColor = num;
                this.signDiv.jSignature("setColor",color); 
                this.signDiv.jSignature("setLineWidth",'8'); 
                let arr = this.signDiv.jSignature('getData','native');
                for(let i = 0 ; i < arr.length; i++){
                    if(arr[i] == 'name'){
                        this.autoWrite();
                    }
                }
            },
            autoWrite(ev,change = 0){

                $('#signature').css({
                    "background":'#f3f3f3'
                })

                if(ev.keyCode==13){
                    this.fontNum = 0;
                    this.topNum = 0;
                    $('.slider').css({
                        'left':192.5+'px'
                    })
                }
                this.reset();   //先清除
                let length = this.getStringLength(this.userName);   //文本字节长度
                this.size = (this.W / (length*2))*3 ;                //字体大小
                if(this.size > 200){
                    this.size = 200;
                }
               
                let SIZE = this.size + this.fontNum;   //计算后的文字大小
                let offsetLeft = (this.W - SIZE/2*length) / 2;      //计算距离左边
                this.offsetTop = 200;              //计算距离右边
                this.ctx.font=`${SIZE}px Arial`;
                this.ctx.fillStyle = this.color;                
                this.ctx.fillText(this.userName,offsetLeft,this.offsetTop+this.topNum);
                let arr = this.signDiv.jSignature('getData','native');
                let count = 0;
                for(let i = 0 ; i < arr.length ; i++){
                    if(arr[i] == 'name' ){
                        count = 1 ;
                    }
                }
                if(count == 0){
                    this.signDiv.jSignature('getData','native')[arr.length]="name";
                }
                
            },
            getStringLength(str) {
              return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
            }
        },
        mounted(){
            let This = this;
                this.type = this.$route.query.type;
                $(function() {
                    
                    This.init();
                    var oDiv = document.getElementById('drag1');
                    var oDiv2 = document.getElementById('drag2');                
                    This.drag(oDiv,'font');
                    This.drag(oDiv2,'offsetTop');
                });
        }
    }
</script>

