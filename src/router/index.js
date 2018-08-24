import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

const Hello = resolve => require(['@/components/Hello'], resolve)                              //demo
const SignatureHand = resolve => require(['@/components/page/signature/index'], resolve)                              //demo
const Noallow = resolve => require(['@/components/noallow'], resolve)                          //404页面
const Sweet = resolve => require(['@/components/sweet'], resolve)                              //提示页面

const WelcomeHeader = resolve => require(['@/components/page/welcome/header'], resolve)                   //欢迎页公共页面
const WelcomeIndex = resolve => require(['@/components/page/welcome/index'], resolve)                     //欢迎页首页
const insSign = resolve => require(['@/components/page/welcome/inspectionSign'], resolve)                 //在线验签页
const SignResult = resolve => require(['@/components/page/welcome/signState'], resolve)                   //在线验签结果
//首页
const IndexCom = resolve => require(['@/components/page/index/index'], resolve)                          //首页

//文档管理
const ManaFile = resolve => require(['@/components/page/file/mana_file'], resolve)                       //文档管理
const Detail = resolve => require(['@/components/page/file/detail'], resolve)                            //文档详情
const ToFill = resolve => require(['@/components/page/file/toFill'], resolve)                            //发起签约
const Sign = resolve => require(['@/components/page/file/Sign'], resolve)                                //签署页面
const BeforeSign = resolve => require(['@/components/page/file/beforeSign'], resolve)                    //先签署后发起页面


//个人中心
const UserIndex = resolve => require(['@/components/page/userCenter/userIndex'], resolve)                          //个人中心首页
const Account = resolve => require(['@/components/page/userCenter/account'], resolve)                              //我的账号
const Cert = resolve => require(['@/components/page/userCenter/cert'], resolve)                                    //我的证书
const Seal = resolve => require(['@/components/page/userCenter/seal'], resolve)                                    //个人签名
const ComSeal = resolve => require(['@/components/page/userCenter/com_seal'], resolve)                             //企业签章
const AddSeal = resolve => require(['@/components/page/userCenter/addSeal'], resolve)                              //企业添加签章
const jSignature = resolve => require(['@/components/page/userCenter/jSignature'], resolve)                        //个人添加签章
const Authorize = resolve => require(['@/components/page/userCenter/authorize'], resolve)                          //授权代表人
const CertAuthorize = resolve => require(['@/components/page/userCenter/certAuthorize'], resolve)                          //授权代表人
const Recored = resolve => require(['@/components/page/userCenter/buyRecored'], resolve)                           //购买记录
const Contacts = resolve => require(['@/components/page/userCenter/contacts'], resolve)                            //我的联系人
const NearContacts = resolve => require(['@/components/page/userCenter/nearContacts'], resolve)                    //最近联系人

//消息中心
const News = resolve => require(['@/components/page/news/news'], resolve)                                          //消息中心

//购买套餐
const Package = resolve => require(['@/components/page/package/package'], resolve)                                 //消息中心

//登录注册
const Login = resolve => require(['@/components/page/login/login'], resolve)                                       //登录页
const Register = resolve => require(['@/components/page/login/register'], resolve)                                 //注册页
const Forget = resolve => require(['@/components/page/login/forget'], resolve)                                     //忘记密码
const ForgetStep1 = resolve => require(['@/components/page/login/forgetStep1'], resolve)                           //忘记密码-1
const ForgetStep2 = resolve => require(['@/components/page/login/forgetStep2'], resolve)                           //忘记密码-2
const ForgetStep3 = resolve => require(['@/components/page/login/forgetStep3'], resolve)                           //忘记密码-3
const ForgetStep4 = resolve => require(['@/components/page/login/forgetStep4'], resolve)                           //忘记密码-4  成功

//企业实名认证
const ComRealStep1 = resolve => require(['@/components/page/userCenter/company/real_step1'], resolve)              //实名认证第一步（填写企业信息）
const ComRealStep2 = resolve => require(['@/components/page/userCenter/company/real_step2'], resolve)              //实名认证第二步（完善管理人信息）
const ComRealStep3 = resolve => require(['@/components/page/userCenter/company/real_step3'], resolve)              //实名认证第三步（等待打款，核对金额）
const ComRealStep4 = resolve => require(['@/components/page/userCenter/company/real_step4'], resolve)              //实名认证第四步（完成认证）


//编辑模板
const Editor = resolve => require(['@/components/page/template/editor'], resolve)              //自定义模板
//const sign_state = r => require.ensure([], () => r(require('@/components/sign_state')), 'sign_state')


let router = new Router({  
  mode: 'history',
  routes: [
    {
        path:'/signatureHand',
        name:'SignatureHand',
        components:{
          default:'',
          sign:SignatureHand
        },
        meta:{
          step:1
        }
    },
    {
      path:'/hello',
      name:'Hello',
      component:Hello,
      meta:{
        step:1
      }
  },
    /*第一部分 */
    {
      path:'/welcome',
      name:'WelcomeHeader',
      component:WelcomeHeader,
      meta:{
        step:2
      },
      children:[
        {
          path:'index',
          name:'WelcomeIndex',
          component:WelcomeIndex,
          meta:{
            step:2
          }
        },
        {
          path:'insign',
          name:'insSign',
          component:insSign,
          meta:{
            step:2
          }
        },
        {
          path:'signresult',
          name:'SignResult',
          component:SignResult,
          meta:{
            step:2
          }
        }
      ]
    },
    /*第二部分*/
    {
      path:'/login',
      name:'Login',
      component:Login,
      meta:{
        step:1
      }
    },
    {
      path:'/register',
      name:'Register',
      component:Register,
      meta:{
        step:1
      }
    },
    {
      path:'/forget',
      name:'Forget',
      component:Forget,
      meta:{
        step:1
      },
      children:[
        {
          path:'step1',
          name:'ForgetStep1',
          component:ForgetStep1,
          meta:{
            step:1
          }
        },
        {
          path:'step2',
          name:'ForgetStep2',
          component:ForgetStep2,
          meta:{
            step:1
          }
        },
        {
          path:'step3',
          name:'ForgetStep3',
          component:ForgetStep3,
          meta:{
            step:1
          }
        },
        {
          path:'success',
          name:'ForgetStep4',
          component:ForgetStep4,
          meta:{
            step:1
          }
        }
      ]
    },
    /**********************************第三部分*****************************/
    {
      path:'/index',        //首页
      name:'Index',
      component:IndexCom
    },
    {
      path:'/manafile',        //文档管理
      name:'ManaFile',
      component:ManaFile,      
    },
    {
      path:'/detail/:docId',        //文档详情
      name:'Detail',
      component:Detail,
    },
    {
      path:'/tofill',        //发起签约
      name:'ToFill',
      component:ToFill
    },
    {
      path:'/sign/:docId',        //签约
      name:'Sign',
      component:Sign,
      meta:{
        step:1
      }
    },    
    {
      path:'/beforesign/:docId',        //签约
      name:'BeforeSign',
      component:BeforeSign,
      meta:{
        step:1
      }
    },
    {
      path:'/user',
      component:UserIndex,
      children:[
        {
          path:'',    //我的账户
          name:'Account',
          component:Account
        },
        {
          path:'cert',       //我的证书
          name:'Cert',
          component:Cert
        },
        {
          path:'seal',       //个人签名
          name:'Seal',
          component:Seal
        },
        {
          path:'comseal',       //企业签章
          name:'ComSeal',
          component:ComSeal
        }, 
        {
          path:'addseal',       //添加签章
          name:'AddSeal',
          component:AddSeal,
          meta:{
            type:'202'
          }
        },  
        {
          path:'jSignature',
          name:'jSignature',
          component:jSignature,
          meta:{
            type:'202'
          }
        },
        {
          path:'authorize',       //授权代表人签章
          name:'Authorize',
          component:Authorize
        },
        {
          path:'cert_authorize',       //机构证书授权
          name:'CertAuthorize',
          component:CertAuthorize
          
        },
        {
          path:'recored',       //我的购买记录
          name:'Recored',
          component:Recored
        },
        {
          path:'contacts',       //我的联系人
          name:'Contacts',
          component:Contacts
        },
        {
          path:'nearcontacts',       //最近联系人
          name:'NearContacts',
          component:NearContacts,
          meta:{
            type:'205'
          }
        }
      ]
    },
    /************************企业实名认证****************************/
    {
      path:'/company/realStep1',
      name:'ComRealStep1',
      component:ComRealStep1
    },
    {
      path:'/company/realStep2',
      name:'ComRealStep2',
      component:ComRealStep2
    },
    {
      path:'/company/realStep3',
      name:'ComRealStep3',
      component:ComRealStep3
    },
    {
      path:'/company/realStep4',
      name:'ComRealStep4',
      component:ComRealStep4
    },
    {
      path:'/news',             //消息中心
      name:'News',
      component:News
    },
    {
      path:'/Package',             //购买套餐
      name:'Package',
      component:Package
    },
    {
      path:'/editor',              //编辑模板页面
      name:'Editor',
      component:Editor
    },
    {
      path:'/sweet',
      component:Sweet,
      meta:{
        step:1
      }
    },
    {
      path:'/404',
      component:Noallow,
      meta:{
        step:1
      }
    },
    {
      path:'/',
      redirect:'/welcome/index'
    },   
    {
      path:'*',
      redirect:'/404'
    }
  ]
})


//路由跳转之前
router.beforeEach(async (to, from, next) => {
  document.title=Vue.prototype.Config.Title+',让签署更有效';
  document.body.scrollTop = 0;  
  Vue.prototype.HEIGHT = $(document).height();
  Vue.prototype.userType = to.meta.type;
  /*控制登陆注册也页头页脚隐藏*/
  if(to.meta.step == 1 ){   //登录注册页忘记密码页
    if(to.name != 'Sign' && to.name != 'BeforeSign'){
      store.commit('changeHeaderState',false)
    }
    if(to.name == 'Sign' || to.name == 'BeforeSign'){  //
      let {meta,data} = await Vue.prototype.REQUEST('GET',Vue.prototype.URL['getCurAccount'],{});
      Vue.prototype.login({meta,data},router,store)
    }
    store.commit('changeFooterState',false)
  }else if(to.meta.step == 2){
    store.commit('changeHeaderState',false)
    let {meta,data} = await Vue.prototype.REQUEST('GET',Vue.prototype.URL['getCurAccount'],{});
    if(meta.success){
      Vue.prototype.CURACCOUNT = data;
    }else{
      Vue.prototype.CURACCOUNT = null;
    }
    // Vue.prototype.login({meta,data},router,store)
    
  }else{
    store.commit('changeHeaderState',true)
    store.commit('changeFooterState',true)
    
    //登录请求
    let {meta,data} = await Vue.prototype.REQUEST('GET',Vue.prototype.URL['getCurAccount'],{});
    Vue.prototype.login({meta,data},router,store)
  }
  /*控制签约页面不存在发起签约按钮 */
  if(to.name != 'ToFill'){
    store.commit('saveUpFile',null);
    Vue.prototype.removeSData('sendHimItem');
    Vue.prototype.removeSData('docId');
    Vue.prototype.removeSData('SP');
  }

  if(to.name != 'BeforeSign' && to.name != 'ToFill'){  //不是发起签约页面清签署数据
    Vue.prototype.removeSData('signData');
  }
  //控制
  next();
})

export default router;
