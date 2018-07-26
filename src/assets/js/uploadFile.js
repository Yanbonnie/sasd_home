module.exports = {
    upLoadDate:{
        signTitle: '',   //文档名称
        signFile: null,    //文档流
        pdfFileName:'请上传需要签署的PDF文件',
        isImg: false,    //是否上传了pdf
        
    },
    upLoadMethod:{
        //发起签约
        clickFileFn(clickObj,fileObj) {
            
            var clickObj = $(clickObj)
            var FileObj = $(fileObj);
            clickObj.on('click',(e)=> {    
                if(this.accountType){   //托管
                    if(this.$route.name != 'ToFill'){
                        if(this.CURACCOUNT.accStstus != '3' && !this.warnState){   //未实名认证弹出风险提示
                            this.warnState = true;
                            return;
                        }
                        if(!this.CURACCOUNT.depositStatus){   //如果不存在托管证书，
                            this.$store.commit('changePinState',true);
                            this.$store.commit('changePinIndex',1);
                            return; 
                        }
                    }
                }
                FileObj.val('');
                FileObj.click();
            });
            // 文件更改                
            FileObj.on('change',(e)=>{
                e = e || window.event;  
                e.stopPropagation(); // 阻止冒泡  
                e.preventDefault();  //阻止默认行为                            
                let fileObj = FileObj[0].files[0];
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
                if(this.accountType){
                    if(this.CURACCOUNT.accStstus != '3' && !this.warnState){   //未实名认证弹出风险提示
                        this.warnState = true;
                        return;
                    }
                    if(!this.CURACCOUNT.depositStatus){   //如果不存在托管证书，
                        this.$store.commit('changePinState',true);
                        this.$store.commit('changePinState',1);
                        return; 
                    }
                }    
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
                this.modelCommonTip('上传大小不能超过10M');
                return false; 
            }
            this.pdfFileName = filename;
            this.isImg = true;                    
            this.signTitle = filename.split('.')[0];                 
            this.signFile = fileObj;
            this.upFn();
        },
    }
}