/* 实名认证js */
export default {
    clickFileFn(clickBtn,fileBtn,updateSrc,type='image') {   //点击的按钮id，文件id，展示图id （src和id一致）  type-image默认是上传图片   pdf
        $('#'+clickBtn).on('click',()=> { 
            $("#"+fileBtn).val('');
            $('#'+fileBtn).click();
        });
        // 文件更改                
        $('#'+fileBtn).on('change',(e)=>{
            e = e || window.event;  
            e.stopPropagation(); // 阻止冒泡  
            e.preventDefault();  //阻止默认行为                            
            let fileObj = $("#"+fileBtn)[0].files[0];
            //检测是否有文件 
            if(!fileObj){ 
                  return false; 
            } 
            this.fileCom(fileObj,updateSrc,fileBtn,type)
        });
           
    },
    fileCom(fileObj,updateSrc,fileBtn,type){
        if(type == 'image'){
            if(fileObj.type.indexOf('image') === -1) {
                this.modelCommonTip('您选择的不是图片');
                return;
            }
        }else if(type == 'pdf'){
            if(fileObj.type.indexOf('pdf') === -1){
                if(fileObj.type.indexOf('image') === -1) {
                    this.modelCommonTip('您选择的不是pdf');
                    return;
                }
            } 
        }
        
        let filename = fileObj.name; //文件名称 
        let filesize = Math.floor((fileObj.size)/1024/1024);  
        let fsize = fileObj.size/1024/1024;
        if(filesize>10){ 
            this.modelCommonTip('上传大小不能超过10M');
            return false; 
        }
        this.blRegImg = fileObj;   //营业执照二进制流

        //图片预览
        if(type == 'image'){
            this.change(updateSrc,fileBtn, fileObj);
        }
        
    },
    /*图片预览*/
    change(pre_id,file_id,fileObj) {
        var pic = document.getElementById(pre_id), file = document.getElementById(file_id);

        if(file.files){
            this.html5Reader(fileObj,pre_id);
        }else{
            file.select();
            file.blur();
            var reallocalpath = document.selection.createRange().text;
            pic.width=116;
            pic.height=86;
            pic.style.opacity = 1;
            pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src=\"" + reallocalpath + "\")";
            this[pre_id] = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
        }
    },
    html5Reader(file,pre_id){
        var This = this;
        var file = file;
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
            var pic = document.getElementById(pre_id);
            $(pic).css('opacity',1);
            This[pre_id] = this.result;
        }
    },  
}