<template>
    <section class="forget">
        <div class="header">
            <div class="container">
                <ul class="sideLeft">
                    <li>
                        <a href="javascript:;">
                            <img src="../../../assets/images/logo_header.png" width="80" height="26" alt="">
                        </a>
                    </li>
                </ul>
                <ul class="sideRight">
                    <li>
                        <a href="javascript:;">帮助</a>
                        <router-link :to="{path:'/login'}">登录</router-link>
                    </li>
                </ul>
            </div>
        </div>
        <div class="forgetBox">
            <h3>找回密码</h3>
            <router-view></router-view>  
        </div>
    </section>
</template>
<script>
    export default{
        name:'forget',
        data(){
            return{

            }
        },
        mounted(){

        }
    }
</script>
