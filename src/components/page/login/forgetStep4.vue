<template>
    <section class="forgetStep">
        <div class="forgetBody">
            <div class="form">
                <p>
                    <i class="iconfont icon-success"></i>
                </p>
                <p>新密码设置成功</p>
            </div>
        </div>
        <div class="forgetFooter">
            <router-link to="/login" class="active">确定</router-link>
        </div>
    </section>
</template>
<script>
    export default{
        name:'step1',
        data(){
            return{
                phone:''
            }
        },
        mounted(){
            this.phone = this.getSData('phone');
            if(this.phone){
                this.removeSData('phone');                
            }else{
                this.$router.push({
                    name:'Login'
                })
            }            
        }
    }
</script>
