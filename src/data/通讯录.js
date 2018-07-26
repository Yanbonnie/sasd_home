
//1.标签列表接口
let req = {};

let res = {
    meta:{},
    data:[
        {
            uid:'',
            title:'',
            displayOrder:1,
            children:[]
        },
        {
            uid:'',
            title:'',
            displayOrder:2,
            children:[]
        },
    ]
}

//2.新建标签
let req = {
    title:'',
    pid:'',  //-1即为根
}

let res = {
    meta:{},
    data:null
}
//3.重命名标签
let req = {
    title:'',
    uid:'',  //-1即为根 
}

let res = {
    meta:{},
    data:null
}
//4.删除标签
let req = {
    uid:'',  
}

let res =  {
    meta:{},
    data:null
}

//5.更新同级排序接口
let req = {
    uid1:'xxx',
    uid2:'xxx'
}

let res = {
    meta:{},
    data:null
}

//6.更新层级关系接口
let req = {
    uid:'',
    pid:''
}

let res = {
    meta:{},
    data:null
}

//7.获取联系人列表
let req = {
    uid:'',
    page:1,  //当前第几页
    pageSize:12,   //每页多少条
}

let res = {
    meta:{},
    data:{        
        list:[
            {
                name:'',
                phone:'',
                img:'',
            }
        ],
        total:xx,
    }
}

//8.联系人添加到标签列表
let req = {
    accNo:'',
    uid:'',
}
let res = {
    meta:{},
    data:null
}

//9.新建联系人
let req = {
    phone:'',  //手机号码
    name:'',   //用户名字
    uid:'',
}
let res = {
    meta:{},
    data:null
}
//10.搜索联系人
let req = {
    condition:'',  //搜索字段
}

let res = {
    meta:{},
    data:{  //用户基本信息对象

    }
}


//11删除联系人
let req = {
    accNo:''
}


    // let menu = [
    //     {
    //         id:'1',
    //         title:"供应商1",
    //         count:'5',
    //         root:'1',
    //         children:[
    //             {
    //                 title:'A',
    //                 id:'13',
    //                 children:[
    //                     {
    //                         title:'AA',
    //                         children:[],
    //                         id:'14',
    //                     }
    //                 ]
    //             },
    //             {
    //                 title:'B',
    //                 children:[],
    //                 id:'15',
    //             },
    //             {
    //                 title:'B',
    //                 children:[],
    //                 id:'16'
    //             }
    //         ]
    //     },
    //     {
    //         id:"2",
    //         title:"供应商2",
    //         root:'1',
    //         count:'4',
    //         children:[]
    //     },
    //     {
    //         id:"3",
    //         title:"供应商3",
    //         root:'1',
    //         count:'1',
    //         children:[]
    //     },
    //     {
    //         id:"4",
    //         title:"供应商4",
    //         root:'1',
    //         count:'3',
    //         children:[]
    //     },{
    //         id:"5",
    //         title: "数安时代科技股份有限公司-经理 (4)",
    //         count:'6',
    //         root:'1',
    //         children: [{
    //             title: "研发中心-总监 (10)",
    //             id:'6',
    //             children: [
    //                 {
    //                     title: "平台研发-部门经理 (2)",
    //                     id:'7',
    //                     children: [
    //                         {
    //                             id:'8',
    //                             title: "开发组-组长 (1)",
    //                             children:[]
    //                         },
    //                         {
    //                             id:'9',
    //                             title: "测试组-组长 (1)",
    //                             children:[]
    //                         }
    //                     ]
    //                 }, {
    //                 id:'10',
    //                 title:"终端研发-部门经理 (2)",
    //                 children: [
    //                     {
    //                         title: "123",
    //                         id:'11',
    //                         children:[]
    //                     }
    //                 ]
    //             }]
    //         }, {
    //             title: "终端研发-部门经理 (2)",
    //             children:[],
    //             id:'12'
    //         }]
    //     }
    // ]