<template>
    <section class="inspectionSign">
        <div class="signFile">
            <h3>验证文件签名的有效性，以及是否被篡改！</h3>
            <input type="file" id="file" class="filestyle" style="display:none;"  />
            <div class="dashed" id="drop_area"> <!-- @click="selectFile"-->
                <img src="../../../assets/images/welcome/sign_icon.png"  class="upfile"/>
                <p class="tip">请上传需要验证的PDF文件，文件大小需要&lt;10M</p>
                <p class="sweet">点击上传文件或拖动文件到此处</p>
            </div>
        </div>
        <Loading v-show="loadingState"></Loading> 
    </section>
</template>
<script>
    export default{
        name:'inspectionSign',
        data(){
            return{
                loadingState:false,
                fileObj:''
            }
        },
        methods:{
            selectFile(){
                let This = this;
                $('#file').val('');
                $('#file').click(); 
                $('#file').unbind().on('change',function(){
                    let fileObj = $(this)[0].files[0];
                    This.fileCom(fileObj);
                })
            },
            fileCom(fileObj){
                let fsize = fileObj.size/1024/1024;
                if(fileObj.type.indexOf('pdf') == -1){
                    this.modelCommonTip('请上传pdf文件');
                    return false;
                }
                if(fsize > 10){
                    this.modelCommonTip('上传大小不能超过10M');
                    return false;
                }

                //符合要求
                this.loadingState = true;
                let formData = new FormData();        
                formData.append('uploadFile',fileObj);
                $.ajax({
                    url: this.apiPath+this.URL['verify'],
                    dataType: 'text',
                    type: 'POST',
                    processData: false,
                    contentType: false,
                    cache: false,
                    data: formData,
                }).done(json => {
                    this.loadingState = false;
                    let res = JSON.parse(json);
                    this.setSData('inspectionSign',res);
                    this.$router.push({name:'SignResult'})
                }).fail(err=> { 
                    console.log(err);  
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
            }
        },
        mounted() {
            this.dragFileFn();
        }
    }
</script>