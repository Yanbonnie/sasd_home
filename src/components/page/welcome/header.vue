<template>
    <section class="welcome">
        <div class="weHeader "> <!--fixTop-->
            <div class="weContain flexWrap">
                <router-link to="/welcome/index" class="headerL">
                </router-link>
                <div class="headerR">
                    <div class="navRight">
                        <div class="navSideLift">
                            <ul>
                                <li><router-link to="/welcome/index">首页</router-link></li>
                                <!-- <li><a href="javascript:;">产品介绍</a></li>
                                <li><a href="javascript:;">解决方案</a></li>
                                <li><a href="javascript:;">安全中心</a></li>
                                <li><a href="javascript:;">行业案例</a></li> -->
                                <li><router-link to="/welcome/insign">在线验签</router-link></li>
                                <!-- <li><a href="javascript:;">关于我们</a></li> -->
                            </ul>
                        </div>
                        <div class="navSideRight" v-if="!CURACCOUNT">
                            <router-link to="/login"  class="loginBtn">登录</router-link>
                            <router-link to="/register" class="registerBtn">注册</router-link>
                        </div>
                        <div class="navSideRight" v-if="CURACCOUNT">
                            <router-link to="/index" class="loginBtn" style="margin-left:0;">个人中心</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <router-view></router-view>
        
    </section>
</template>
<script>    
    import '@/assets/css/welcome.scss';
    export default{
        data(){
            return{
                routerName:'',
            }
        },
        watch:{
            '$route'(to,from){
                this.routerName = to.name;
                if(this.routerName != 'WelcomeIndex'){
                    $('.weHeader').addClass('fixTop');
                }else{
                    $('.weHeader').removeClass('fixTop');
                }
            }
        },
        mounted() {
            this.routerName = this.$route.name;
            if(this.routerName != 'WelcomeIndex'){
                $('.weHeader').addClass('fixTop');
            }
            
            $(window).on('scroll',(ev)=>{
                if(ev.currentTarget.scrollY > 100 && this.routerName == 'WelcomeIndex'){
                    $('.weHeader').addClass('fixTop');
                }else if(ev.currentTarget.scrollY <= 100 && this.routerName == 'WelcomeIndex'){
                    $('.weHeader').removeClass('fixTop');
                }else{
                    $('.weHeader').addClass('fixTop');
                }
            })
            // $(window).on('scroll',(ev)=>{
            //     console.log(this.routerName)
            //     if(this.routerName == 'WelcomeIndex'){
            //         if(ev.currentTarget.scrollY > 100 ){
            //             $('.weHeader').addClass('fixTop');
            //         }else{
            //             console.log(33333)
            //             $('.weHeader').removeClass('fixTop');
            //         }
            //     }
                
            // })
        }
    }
</script>
<style scoped   lang="scss">
@import '../../../assets/css/swiper/swiper.min.css';

</style>
