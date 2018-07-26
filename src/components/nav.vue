<template>
    <section class="loginNav">
        <div class="logo">
            <router-link to="/welcome/index">
                <img src="../assets/images/logo_white.svg" alt="">
            </router-link>
        </div>
        <div>
            <p><!--<a href="javascript:;">返回官网</a> |--> {{tip}}？ <router-link class="link" to="register" v-if="tip == '没有账号'">前往注册</router-link><router-link class="link" to="login" v-if="tip == '已有账号'">前往登录</router-link></p>
        </div>
    </section>
</template>
<script>
    export default{
        props:{
            tip:{
                type:String,
                default:''
            }
        },
        data(){
            return{

            }
        }
    }
</script>
