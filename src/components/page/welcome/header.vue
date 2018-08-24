<template>
    <section class="welcome">
        <div class="weHeader "> <!--fixTop-->
            <div class="weContain flexWrap">
                <router-link to="/welcome/index" class="headerL">
                    <img :src="logoSrc" alt="">
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
        <div class="fiexd-right" >
            <div class="fixed-icon" @click="toTop"><i class="iconfont icon-top02"></i></div>
            <div class="fixed-icon service">
                <i class="iconfont icon-service"></i>
                <ul class="hover-box">
                    <li><img src="../../../assets/images/welcome/phone.png"><span>95105813</span></li>
                    <li><img src="../../../assets/images/welcome/qq.png"><a target="_blank" href="http://crm2.qq.com/page/portalpage/wpa.php?uin=8008301560&aty=2&a=2&curl=&ty=1">销售一交谈</a></li>
                    <li><img src="../../../assets/images/welcome/mail.png"><span>sales@gdca.com.cn</span></li>
                    <li><img src="../../../assets/images/welcome/time.png"><span>周一至周五 9:00-18:00 节假日休息</span></li>
                </ul>
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
                logoSrc:this.Config.welLogoWhite
            }
        },
        watch:{
            '$route'(to,from){
                this.routerName = to.name;
                if(this.routerName != 'WelcomeIndex'){
                    $('.weHeader').addClass('fixTop');
                    this.logoSrc = this.Config.welLogo;
                }else{
                    $('.weHeader').removeClass('fixTop');
                    this.logoSrc = this.Config.welLogoWhite;
                }
            }
        },
        methods:{
            toTop(){
                var speed=200;//滑动的速度
                $('body,html').animate({ scrollTop: 0 }, speed);
                return false;
            },
        },
        mounted() {
            this.routerName = this.$route.name;
            if(this.routerName != 'WelcomeIndex'){
                $('.weHeader').addClass('fixTop');
                this.logoSrc = this.Config.welLogo;
            }
            
            $(window).on('scroll',(ev)=>{
                if(ev.currentTarget.scrollY > 100 && this.routerName == 'WelcomeIndex'){
                    $('.weHeader').addClass('fixTop');
                    this.logoSrc = this.Config.welLogo;
                }else if(ev.currentTarget.scrollY <= 100 && this.routerName == 'WelcomeIndex'){
                    $('.weHeader').removeClass('fixTop');
                    this.logoSrc = this.Config.welLogoWhite;
                }else{
                    $('.weHeader').addClass('fixTop');
                    this.logoSrc = this.Config.welLogo;
                }
            })

            
            var Timer = null;
            var Timer2 = null;
            //右边浮动导航
            $('.fiexd-right .fixed-icon').on('mouseenter',function(){
                clearInterval(Timer2);
                var That = $(this);
                Timer2 = setInterval(function(){
                    That.siblings('.fixed-icon').find('.hover-box').fadeOut();
                    That.find('.hover-box').fadeIn();
                },100)      
                clearInterval(Timer);
            })

            $('.fiexd-right .fixed-icon').on('mouseleave',function(){
                var That = $(this);
                clearInterval(Timer2);
                Timer = setInterval(function(){
                    That.find('.hover-box').hide();
                },100);
                
            })
        }
    }
</script>
<style scoped   lang="scss">
@import '../../../assets/css/swiper/swiper.min.css';

</style>
