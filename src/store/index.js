import Vue from 'vue'
import Vuex from 'vuex'
import {statePin,MutationsPin} from './pin';

Vue.use(Vuex)

const state = {
  headerShow:true,         //首页顶部导航栏是否显示
  footerShow:true,         //首页顶部导航栏是否显示
  curAccount:null,         //用户所有数据
  userState:null,          //用户状态 0-企业用户   1-个人用户
  model:{state:false,context:'',topClass:''},    //模态框默认数据
  dialog:{state:false,options:{}},    //dialog对话框的状态
  upFile:null,          //上传文档文档流
  signFile:null,        //上传文档主题名称
  pdfFileName:null,     //上传文档名称,

  ...statePin
}
const Mutations = {
  changeHeaderState(state,bol){
    state.headerShow = bol;
  },
  changeFooterState(state,bol){
    state.footerShow = bol;
  },
  changeModel(state,jsonData){      //改变公共模态框状态
    state.model = jsonData
  },
  saveUpFile(state,jsonData){
    state.upFile = jsonData;
  },
  saveSignTitle(state,str){
    state.signFile = str;
  },
  savePdfFileName(state,str){
    state.pdfFileName = str;
  },
  //new
  changeDialog(state,obj){
    state.dialog = {
      ...obj
    };
  },
  changeAccount(state,jsonData){
    state.curAccount = jsonData;
    if(state.curAccount.accType == 2 || state.curAccount.accType == 3 || state.curAccount.accType == 4){
      state.userState = 1;
    }else{
      state.userState = 0;
    }
  },
  ...MutationsPin
}

const Getters = {}

export default new Vuex.Store({
  state:state,
  mutations:Mutations,
  getters:Getters
})
