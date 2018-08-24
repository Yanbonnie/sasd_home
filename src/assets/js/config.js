export default{
    install:function (Vue, options) {
        const img = require('../images/loading.gif');
        const configObj = {
            "zyq":{    //真宜签的配置
               "activeColor":"#ff563f",                                        //主题色，               
               "headerLogo":require('../images/logo_header.png'),              //登录系统后的导航栏logo
               "welLogoWhite":require('../images/welcome_white_logo.png'),     //欢迎页白色logo
               "welLogo":require('../images/welcome_red_logo.png'),            //欢迎页logo
               "loadingImg":require('../images/loading.gif'),                  //loading动画
               "Title":"真宜签"
            },
            "pensoon":{
                "activeColor":"#ff563f",                                        //主题色，               
                "headerLogo":require('../images/pensoon/logo.png'),              //登录系统后的导航栏logo
                "welLogoWhite":require('../images/pensoon/logo.png'),     //欢迎页白色logo
                "welLogo":require('../images/pensoon/logo.png'),            //欢迎页logo
                "loadingImg":require('../images/loading.gif'),                  //loading动画
                "Title":"磐信科技"
            }
        }

        const Config = configObj.zyq;

        Vue.prototype.Config = Config;
    }
}