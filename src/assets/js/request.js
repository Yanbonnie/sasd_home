import Vue from 'vue';

export let REQUEST = function(method,url,data,isSuccBack = false){   //isSuccBack 是否是json.meta.success为ture时才返回
    let Params = {}
    if(method == 'POST'){
        Params = {
            data,
        }
    }else{
        Params = {
            params:data
        }
    }
    return new Promise((resolve,reject)=>{
        this.$http({
            method,
            url:Vue.prototype.apiPath+url,
            ...Params
        }).then(json=>{
            let data = json.data;
            if(isSuccBack){
                if(data.meta.success){
                    resolve(data)
                }else{
                    this.modelCommonTip(data.data.msg ? data.data.msg  : data.meta.msg);
                }
            }else{
                resolve(data);
            }
            
        }).catch(err=>{
            // this.modelCommonTip("现在访问人数太多，请稍后重试");
            console.log(err)
        })
    })
}


export let REQUESTAjax = function(method,url,data){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: method,
            url: Vue.prototype.apiPath + url,
            // dataType:'json',
            data: data,
        }).done((json) => {
            resolve(json)
        }).fail((err) => {
            console.log(err)
        });;
    })
}