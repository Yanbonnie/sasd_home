const vision2 = 'api/v1/';
const vision = 'v0/'
// const vision = ''; 
const URL = {
    /*登录*/
    cloudSignLogin:vision+'cloudSignLogin',                                         //获取登录二维码
    cloudSignCheckLogin:vision+'cloudSignCheckLogin',                               //登录状态 （需要改成json方式提交）
    login:vision+'login',                                                           //账号登录
    getLoginErrorCount:vision+'getLoginErrorCount',                                 //获取登录失败次数    
    getCurAccount:vision+'cus/account/getCurAccount',                               //获取用户信息接口
    logoutWithoutPage:vision+'logoutWithoutPage',                                   //退出清除session
    refreshLogin:vision+'refreshLogin',                                             //刷新登陆接口
    updateCurEmail:vision+"cus/account/updateCurEmail",                             //设置邮箱
    keyLogin:vision+'keyLogin',

    //注册
    checkEmailSub:vision2+'account/checkEmailSub',                                   //检测邮件 {email：'',valideCode:''}
    checkEmailSendCode:vision2+'account/checkEmailSendCode',                         //发送邮箱验证码
    createCompany:vision2+'largeCompany/create',                                     //创建企业账户

    //忘记密码
    isSysEmailOrPhone:vision+'cus/account/isSysEmailOrPhone',                        //判断是手机还是邮箱
    verifyModelCode:vision+'cus/account/verifyModelCode',                            //验证是否是本人手机和验证码
    setPwdToPhone:vision+'cus/account/setPwdToPhone',                                //设置密码

    //index
    signDocCount:vision+'doc/documentList/signDocCount',                             //获取(待其他人签，待我签,已完成)数量,
    indexDraft:vision+'doc/documentList/indexDraft',                                 //获取草稿箱数量,    

    //扫码认证
    authQrCodeBind:vision+'sys/auth/authQrCodeBind',                                //扫码认证
    authQrCodeBindCheck:vision+'sys/auth/authQrCodeBindCheck',                      //实名认证扫码状态
    userAuthrity:vision+'sys/auth/userAuthrityLight',                               //实名认证    
    userAuthrityStep:vision+'sys/auth/userAuthrityStepLight',                       //实名认证接口    

    //发起签约
    uploadProgress:vision+'doc/document/uploadProgressLight',    
    createDocumentLight:vision+'doc/document/createDocumentLight',                  //发起签约
    getUploadDocLight:vision+'doc/document/getUploadDocLight',                      //获取草稿箱数据                

    //签约页面
    getPdfPageNum:vision+'doc/document/getPdfPageNum',                              //获取文档列表数据
    getPdfImgByPage:vision+'doc/document/getPdfImgByPage',                          //图片链接 ?pageNum=0&docId=9ea2c9b955cb460db7b814326856b241
    ajaxGetSignStamps:vision+'doc/document/ajaxGetSignStamps',                      //获取签章
    intervalSignLock:vision+'doc/document/intervalSignLock',                        //续锁
    extractCertNo:vision+'doc/sign/extractCertNo',                                  //获取签署的certNo
    getDocHashV2:vision+'doc/sign/getDocHashV2',                                    //获取签署提交参数
    signDoc:vision+'doc/sign/signDoc',                                              //签署文档
    ajaxGetSignQrCode:vision+'doc/cloud/ajaxGetSignQrCode',                         //获取签署二维码
    checkQrStatus:vision+'doc/cloud/checkQrStatus',                                 //获取签署状态
    toSignDocV2:vision+'doc/document/toSignDocV2',                                  //判断是否有资格签署
    depositSignDoc:vision+'doc/sign/depositSignDocV2',                              //托管证书托管在密码机的签署接口
    pfxSignDoc:vision+'doc/sign/pfxSignDocV2',                                      //PFX签署接口    
    personalSign:vision2+'delegate/individual/sign',                                //个人托管签署
    delegateSignDoc:vision+'doc/sign/delegateSignDoc',                              //托管证书批量签

    //文档列表
    searchAllDocumentList:vision+'doc/documentList/searchAllDocumentList',          //获取全部
    searchDocumentLight:vision+'doc/documentList/searchDocumentLight',              //获取文档列表(大Buser)
    searchSponsorDocListLight:vision+'doc/documentList/searchSponsorDocListLight',  //我发起的 
    searchStructDocumentLight:vision+'doc/documentList/searchStructDocumentLight',  //获取文档列表（大B管理员）
    searchDraftLight:vision+'doc/documentList/searchDraftLight',                    //草稿箱
    deleteDraft:vision+'doc/document/deleteDraft',                                  //删除草稿箱文档

    //个人中心
    verificationCode:vision+'cus/account/verificationCode',                         //获取手机验证码  （params:mobileNo）
    bindPhone:vision+'cus/account/bindPhoneLight',                                  //绑定手机(验证是否为自己的手机号)    
    modifyPhone:vision+'cus/account/modifyPhoneLight',                              //修改手机号码 phoneOld:13533596699 phoneNew:18825039689  code:543989
    modifyPassword:vision+'cus/account/modifyPasswordLight',                        //修改密码（pwdOld：xxx  pwdNew:xxx）
    // getIdCardExpire:vision+'sys/auth/getIdCardExpire',                           //获取身份证信息
    getIdCardExpire:vision2+'account/getCardId',                                    //获取身份证信息
    getHeadIcon:vision+'cus/account/getHeadIcon',                                   //获取头像,
    updatePin:vision2+'delegate/setup/pin/update',                                          //更新pin码
    resetPin:vision2+'delegate/setup/pin/reset',                                            //重设pin码
    relateUKey:vision+'cus/accountCert/relateUKeyLight',                                    //绑定ukey （关联证书）
    getAccountCertList:vision+'cus/accountCert/getAccountCertList',                         //获取已绑定证书列表
    deleteUKey:vision+'cus/accountCert/deleteUKey',                                         //解除绑定  (form)  
    saveIcon:vision2+'account/headicon/save',                                               //上传头像
    queryIcon:vision2+'account/headicon/query',                                             //查询头像

    //文档详情
    getDocumentInfoVo:vision+'doc/documentInfo/getDocumentInfoVo',                  //获取文档详情信息  
    signtorList:vision+'doc/documentInfo/signtorListLight',                         //获取签署人信息
    signtorListUnion:vision+'doc/documentInfo/signtorListUnion',                    //获取草送人信息
    downloadDocument:vision+'doc/documentInfo/downloadDocument',                    //下载文档
    viewDocument:vision+'doc/documentInfo/viewDocument',                            //预览文档
    repealDocumentLight:vision+'doc/documentInfo/repealDocumentLight',              //撤销文档（拒绝）
 
    //签章
    getStampAndCertList:vision+'doc/stamp/getStampAndCertList',                     //签章列表
    getStampPer:vision+'doc/stamp/getStampPerLight',                                //每个签章列表数据
    defaultStamp:vision+'doc/stamp/defaultStampLight',                              //设置默认签章
    delStamp:vision+'doc/stamp/delStampLight',                                      //删除签章
    getCertInfo:vision+'cus/accountCert/getCertInfo',                               //绑定UKEY接口
    addStampLight:vision+'doc/stamp/addStampLight',                                 //添加印章
    queryCert:vision2+'delegate/individual/cert/query',                             //获取当前登录用户的托管证书
    personAddseal:vision2+'delegate/stamp/individual/add',                          //个人托管证书添加签章
    companyAddseal:vision2+'delegate/stamp/organization/add',                       //机构证书添加签章
    personDelseal:vision2+'delegate/stamp/delete',                                  //个人账户删除签章
    personSeal:vision2+'delegate/stamp/query',                                      //托管证书查询接口   type 0-个人托管  1-机构托管

    apply:vision2+'delegate/individual/apply',                                       //个人托管证书签发的接口  post (userPin)
    applyOrganiza:vision2+'delegate/organization/apply',                             //机构托管证书签发的接口  post (userPin)
    grant:vision2+'delegate/organization/multigrant',                                //机构证书授权给个人
    grantOther:vision2+'delegate/organization/grant/query',                          //授权给了哪些用户
    accept:vision2+'delegate/organization/accept',                                   //个人接受机构证书的授权
    delmulticancelgrant:vision2+'delegate/organization/multicancelgrant',            //取消用户授权
    upgrade:vision2+'delegate/individual/upgrade',                                   //个人一级证书升级为3级证书
  

    createAccount:vision2+'account/create',                                           //注册账户
    //联系人
    addContact:vision2+'contact/add',                                                 //添加联系人
    contactList:vision2+'contact/getlist',                                            //联系人标签列表
    addLabel:vision2+'contact/add',                                                   //添加联系人标签
    renameLabel:vision2+'contact/rename',                                             //重命名标签
    delLabel:vision2+'contact/delete',                                                //删除标签
    changelevel:vision2+'contact/changelevel',                                        //更新层级关系接口  req = {uid:'',pid:''}
    resort:vision2+'contact/resort',                                                  //更新同级排序接口  req = {uid1:'xxx',uid2:'xxx'}
    getContactorJsonList:vision2+'contactor/getContactorJsonList',                    //获取联系人列表    req = {tabId:'',page:1,pageSize:12}
    addContactor:vision2+"contactor/addContactor",                                    //新建联系人  req = {phone:'',name:'',tabId:''}
    updateContactToTab:vision2+'contactor/updateContactToTab',                        //联系人添加到标签列表   req = {contactId :'',tabId:''}
    seachContact:vision2+'contactor/searchContactorByblurCondition',                  //搜索联系人
    delContactor:vision2+'contactor/delContactor',                                    //删除联系人
    getContactorByPhone:vision2+'contactor/getContactorByPhoneOrEmail',               //根据手机号码获取联系人
    imporeExcel:vision2+'contactor/imporeExcel',                                      //导入联系人
    downloadTemplate:vision2+'contactor/downloadTemplate',                            //下载模板
    downloadImportRes:vision2+'contactor/downloadImportRes',                          //下载链接

    //授权页面
    stampBindFind:vision2+'crossPlatform/stampBind/find',                             //根据stampId（印章ID）获取有印章使用权限的人
    stampBindLight:vision+'doc/stamp/stampBindLight',                                 //授权  {selectAccId：'xx,xx',stampId:''}


    //企业实名认证
    realAdd:vision2+'authCompany/add',                                    //填写企业信息
    getAuthCompanyStep:vision2+'authCompany/getAuthCompany',              //获取第一步骤信息接口
    getAuthAdministran:vision2+'authAdministrant/getAuthAdministran',     //获取第二步骤信息
    versionClass:vision2+'common/versionClass',                           //获取版本类型
    sendMsgVcode:vision2+'authAdministrant/sendMsgVcode',                 //发送验证码接口
    downloadApplyTab:vision2+'authAdministrant/downloadApplyTab',         //企业认证申请表下载
    downloadApplyPdfTab:vision2+'authAdministrant/downloadApplyPdfTab',   //下载申请表pdf
    addLegalY:vision2+'authAdministrant/addLegalY',                       //管理人是法人   实名认证信息提交
    addLegalN:vision2+'authAdministrant/addLegalN',                       //管理人不是法人 实名认证信息提交
    getStep:vision2+'authCompany/getStep',                                //获取当前在第几步骤
    getAuthCompany:vision2+'product/getAuthCompany',                      //获取产品信息
    generalUnitWx:vision2+'orderQrcode/generalUnitWx',                    //获取二维码
    payStatus:vision2+'payStatus/fetchAuthCompanyPayStatus',              //支付轮询接口
    updatePayStep:vision2+'authAdministrant/updatePayStep',               //更新步骤
    downloadImg:vision2+'common/downloadImg',                             //获取实名认证上传的图片

    //定位签署
    prepositionSave:vision2+'doc/preposition/save',                       //提交位置给后台
    prepositionQuery:vision2+'doc/preposition/query',                     //提交位置给后台  get  
    ajaxGetSignStampsWithoutDocChecked:vision+'doc/document/ajaxGetSignStampsWithoutDocChecked',    //先签后发起获取印章


}
export default URL;