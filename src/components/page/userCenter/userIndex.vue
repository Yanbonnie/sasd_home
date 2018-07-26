<template>
   <section class="userCenter">
        <nav class="nav">
            <div class="blank15"></div>
            <div class="userNav clf ">
                <ul class="box">
                    <li v-for="(item,index) in menuList" :key="index">
                        <router-link :to="item.path" exact class="shengl" :class="[userType && userType == item.type ? 'router-link-active' : '']"><i class="iconfont" :class="item.icon"></i>{{item.name}}</router-link>
                    </li>
                </ul>
            </div>
        </nav>
        <div class="userBody">
            <router-view></router-view>  
        </div>
    </section>
</template>
<script>
    export default{
        data(){
            return{
                menuList:[],
                type:null,
                menu:{
                    userPer:[
                        {
                            name:"我的账户",
                            path:"/user",
                            icon:"icon-account"
                        },
                        {
                            name:"我的签章",    
                            path:'/user/comseal',
                            icon:"icon-com_sign",
                            type:'202'
                        },
                        // {
                        //     name:"购买记录",
                        //     path:"/user/recored",
                        //     icon:"icon-recored"
                        // },
                        {
                            name:"我的联系人",
                            path:"/user/contacts",
                            icon:"icon-mycontact",
                            type:'205'
                        },                        
                    ],
                    userCom:[
                        {
                            name:"企业账户",
                            path:"/user",
                            icon:"icon-account"
                        },
                        {
                            name:"企业签章",
                            path:"/user/comseal",
                            icon:"icon-com_sign",
                            type:'202'
                        },
                        {
                            name:"印章授权",
                            path:"/user/authorize",
                            icon:"icon-warrant"
                        },
                        // {
                        //     name:"购买记录",
                        //     path:"/user/recored",
                        //     icon:"icon-recored"
                        // },
                        {
                            name:"联系人",
                            path:"/user/contacts",
                            icon:"icon-mycontact",
                            type:'205'
                        }
                    ]
                }
            }
        },
        methods:{

        },
        mounted(){
            if(this.USERSTATE == 1){
                this.menuList = this.menu.userPer;
            }else{
                this.menuList = this.menu.userCom;
            }
        },
    }
</script>
