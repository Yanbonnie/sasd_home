
//1.邮箱获取激活码接口
let req = {
    email:'xxx'
}

let res = {
    meta:{
        success:true,
        msg:'ok',
    },
    data:null
}

// 2.确定激活码接口
let req = {
    email:'xxx',
    code:'xxx'
}
let res = {
    meta:{},
    data:null
}
//3.绑定(更换)邮箱接口提交参数
let req = {
    email:'xxx',      //邮箱
    code:'xxx',       //激活码
}

let res = {
    meta:{},
    data:null
}
// //3.修改邮箱接口

// let req = {
//     email:'xxx',      //新邮箱
//     code:'xxx',       //激活码
// }

// let res = {
//     meta:{
//         success:true,
//         msg:'ok'
//     },
//     data:null
// }