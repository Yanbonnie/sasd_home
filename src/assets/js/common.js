export default {
    install:function (Vue, options) { 
        let localHost = window.location.host;
        let apiPath = '';
        let signState = null;   //签署状态，是本地还是生产。
        if(localHost == 'localhost:8089' || localHost == '192.168.22.212:8089') { //本地环境
            apiPath = "/proxy/";  
            signState = false;   //本地
        }else {
            apiPath = "/";                  //生产环境 
            signState = true;        
        }
        Vue.prototype.apiPath = apiPath;
        Vue.prototype.localHost = localHost;
        Vue.prototype.signState = signState;
        Vue.prototype.protocol = window.location.protocol+'//';   //获取是http还是https
        Vue.prototype.CURACCOUNT = null;
        Vue.prototype.hasUpGrade = false;
        Vue.prototype.accountType = localStorage.getItem('accountType') || null;    //1表示托管  0-表示Ukey
        
        //红色
        // Vue.prototype.ThemeColor = 'red';
        // Vue.prototype.loadingTheme = require('../images/loading.gif');  
        // Vue.prototype.activeColor = '#ff563f';   
    
    
    
        //蓝色
        // Vue.prototype.ThemeColor = 'blue';
        // Vue.prototype.loadingTheme = require('../images/loading_blue.gif');  
        // Vue.prototype.activeColor = '55BEED'; 
        
        /**
         * axios.get(url[,config])  
         * axios.post(url[,data[,config]])
         * config({
         *      baseURL:'',
         *      timeout:1000,
         *      responseType:'json',
         *      params:{},
         *      transformRequest:[],   只适合PUT,POST和PATCH
         *      transformResponse:[],
         *      validateStatus:function(){},
         *      cancelToken
         * })
         */
        /**get请求 */
        Vue.prototype.httpGet=function(url,data,sucFn,errFn){
            this.$http.get(apiPath+url+"?data="+new Date().getTime(),
                {
                    params:data,
                    headers: {'X-Requested-With':'XMLHttpRequest'}
                }).then((json)=>{
                    let data = json.data;
                    sucFn(data)
                }).catch((err)=>{
                    if(errFn){
                        errFn(err)
                    }else{
                        // console.log(err)
                    }
                })
        };
    
        /**post请求 */
        Vue.prototype.httpPost=function(url,data,sucFn,errFn){
            this.$http({
                method:"POST",
                url:apiPath + url,
                data:data,
                headers: {'X-Requested-With': 'XMLHttpRequest'},
            }).then((json)=>{
                let data = json.data;
                sucFn(data)
            }).catch((err)=>{
                if(errFn){
                    errFn(err)
                }else{
                    console.log(err)
                }
            })
        };
        /*ajaxPost请求 */
        Vue.prototype.ajaxPost = function(url,data,sucFn,errFn){
            $.ajax({
                type: "POST",
                url: apiPath + url,
                // dataType:'json',
                // dataType: "text",
                data: data,
            }).done((json) => {
                sucFn(json)
            }).fail((err) => {
                if(errFn){
                    errFn(err)
                }else{
                    console.log(err)
                }
            });;
        }
    
        /*ajaxGet */
        Vue.prototype.ajaxGet = function(url,data,sucFn,errFn){
            $.ajax({
                type:'GET',
                url:apiPath + url,
                data:data
            }).done((json)=>{
                sucFn(json)
            }).fail((err)=>{
                if(errFn){
                    errFn(err)
                }else{
                    console.log(err)
                }
            })
        }
    
        /*公共模态框*/
        Vue.prototype.modelCommonTip=function(msg,time,topClass){
            let Time = arguments[1] || 1500;
            let CLASS = arguments[2] || '';
            if(msg == "param.error"){
                msg = "提交的参数错误，无法进行操作";
            }
            this.$store.commit('changeModel',{
                state:true,
                context:msg,
                topClass:CLASS
            })
            setTimeout(()=>{
                this.$store.commit('changeModel',{
                    state:false,
                    context:'',
                    topClass:''
                })
            },Time)
        }
    
        //窗口改变
        Vue.prototype.resizeWindow = function(){
            /*if ($(window).width()>=1200)
            {
                $("body").removeClass().addClass("sign_page_scrollBody  w1200");
            }else if($(window).width() >= 1065) {
                $("body").removeClass().addClass("sign_page_scrollBody w1065")
            }else if($(window).width() >= 800){
                $("body").removeClass().addClass("sign_page_scrollBody w800")
            }else if($(window).width() >= 600){
                $("body").removeClass().addClass("sign_page_scrollBody w600")
            }else if($(window).width() >= 500){
                $("body").removeClass().addClass("sign_page_scrollBody small")
            }else{
                $("body").removeClass().addClass("sign_page_scrollBody xsmall")
            }*/
        }
    
        Vue.prototype.login=function({meta,data},router,store){
            if(meta.success){
                Vue.prototype.accountType = JSON.parse(localStorage.getItem('accountType'));
                Vue.prototype.CURACCOUNT = data;
                if(data.accType == 2 || data.accType == 3 || data.accType == 4){
                  Vue.prototype.USERSTATE = 1;
                }else{
                  Vue.prototype.USERSTATE = 0;
                }
                store.commit('changeAccount',data);
              }else{
                Vue.prototype.httpGet(Vue.prototype.URL['logoutWithoutPage'],{},(response)=>{});
                  router.push({
                    name:'Login'
                  })
                }
         }
    
        /* 数组包含对象去重 */
        Vue.prototype.unique3 = function(arr,field) {   //field  以对象中的什么字段去重
            /*var hash = {};
            arr = arr.reduce(function(item, next) {
                hash[next[field]] ? '' : hash[next[field]] = true && item.push(next);
                return item
            }, [])
            return arr;*/
            var hash = {};
            arr = arr.reduce(function(item, next) {
                if(next[field]){
                    hash[next[field]] ? '' : hash[next[field]] = true && item.push(next);
                }else{
                    item.push(next);
                }
                return item
            }, [])
            return arr;
        }
        /*数组不包含对象去重*/
        Vue.prototype.unique1 = function(arr){
            var res = [];
            var json = {};
            for(var i = 0; i < arr.length; i++){
                if(!json[arr[i]]){
                    res.push(arr[i]);
                    json[arr[i]] = 1;
                }
            }
            return res;
        }
        /*
        * 获取当前时间和一个月
        */
        Vue.prototype.getDataFn = function(n){ //n为1表示一周，为30表示一个月
            var nowdate = new Date();
            var Y = nowdate.getFullYear();
            var M = (nowdate.getMonth()+1) < 10 ? "0"+ (nowdate.getMonth()+1) : (nowdate.getMonth()+1);
            var D = nowdate.getDate();
            var currentdate = Y+'-'+M+'-'+D;
                
            nowdate.setDate(nowdate.getDate() - n);
            var y = nowdate.getFullYear();
            var m = (nowdate.getMonth()+1) < 10 ? "0"+ (nowdate.getMonth()+1) : (nowdate.getMonth()+1);
            var d = nowdate.getDate();
            var formatwdate = y+'-'+m+'-'+d;        
            return {
                "formatwdate":formatwdate,
                "currentdate":currentdate
            }
        }
    
        /*获取url的参数值 */
        Vue.prototype.getUrlPara= function(str,_url){
            var reg = new RegExp("(^|&)" + str + "=([^&]*)(&|$)", "i");
            var hrefIndex = window.location.href.indexOf('?');
            //var search = _url ? _url.split('?')[1] : window.location.search.substr(1);
            var search = _url ? _url.split('?')[1] :  window.location.href.substr(hrefIndex+1);
            var par = search.match(reg);
            var str = par ? decodeURIComponent(par[2]) : '';
            return str;
        }
    }
}
