// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
import axios from 'axios'
axios.defaults.withCredentials = true
Vue.prototype.$http = axios;

/*CSS*/
import '@/assets/font/iconfont.css'
import '@/assets/css/common.scss'
import '@/assets/css/login.scss'
import '@/assets/css/style.scss'
import '@/assets/css/animation.scss'
import '@/assets/css/media.scss'
/*JS*/
import url from '@/assets/js/URL.js'
Vue.prototype.URL = url

import {REQUEST,REQUESTAjax} from '@/assets/js/request.js'
Vue.prototype.REQUEST = REQUEST;
Vue.prototype.REQUESTAjax = REQUESTAjax;

Vue.prototype.validateQb =  require('@/assets/js/validate.js').default;
import MyPlugin from './assets/js/common.js'
Vue.use(MyPlugin)


import ConfigPlugin from './assets/js/config.js'
Vue.use(ConfigPlugin)


//模态框公共组件
import Model from './components/common/model/index.js';
Vue.use(Model)

//Table公共组件
import Table from './components/common/table/index.js';
Vue.use(Table)

//页码公共组件
import pagination from './components/common/pagination/index.js';
Vue.use(pagination)

//温馨提示公共组件
import alertModel from './components/common/alert/index.js';
Vue.use(alertModel)

//公共加载效果
import Loading from './components/common/loading/index.js';
Vue.use(Loading)

//树形菜单公共组件
import Tree from './components/common/tree/index.js';
Vue.use(Tree)

//授权树形菜单
import Dendrogram from './components/common/dendrogram/index.js';
Vue.use(Dendrogram)

import dragModel from './components/common/dragModel/index.js';
Vue.use(dragModel)


// import '@/assets/js/plugin/jquery-1.8.3.min.js'
import '@/assets/js/plugin/jquery.form.js';

/*时间戳转换北京时间*/
Vue.filter('filterdata', function (value,index,second) {//value为13位的时间戳  index为0的话是永久有效，为1的话是为空   second(是否包含时分秒)
    function add0(m) {
        return m < 10 ? '0' + m : m
    }
    if(value){
      var time = new Date(parseInt(value));
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      if(second){
        return y + '.' + add0(m) + '.' + add0(d)+ ' ' +add0(h)+':'+add0(mm)+':'+add0(s);
    }else{
        return y + '.' + add0(m) + '.' + add0(d)
    }
      
    }else{
      if(index == 0){
        return '永久有效';
      }else{
        return '';
      }
    }   
});

Vue.prototype.setLData=function(key, value){
  localStorage.setItem(key, JSON.stringify(value));
};
Vue.prototype.getLData=function(key, value){
   return JSON.parse(localStorage.getItem(key));
};

Vue.prototype.setSData=function(key, value){
  sessionStorage.setItem(key, JSON.stringify(value));
 };
 /*
  * 获取localStorage
  */
 Vue.prototype.getSData=function(key){
   return JSON.parse(sessionStorage.getItem(key));
 };
 /*
  * 清楚localStorage数据
  */
 Vue.prototype.removeSData=function(key){
   window.sessionStorage.removeItem(key);
 };

Vue.prototype.resizeWindow();
$(window).resize(function(){
  Vue.prototype.resizeWindow()
});

Vue.config.productionTip = false
Vue.prototype.CUSTOMEVENT = new Vue()   //自定义事件
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
