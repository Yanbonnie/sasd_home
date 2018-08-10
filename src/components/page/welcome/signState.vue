<template>
    <section class="signState" v-cloak>
        
        <div class="result">
            <h3>验签结果</h3> 
            <!-- <p class="fileName">验签.pdf</p> -->
            <span class="iconfont " :class="[isSuccess ? 'icon-success':'icon-close-hollow']"></span>
            <h4>{{isSuccess ? '验签成功':'验签失败'}}</h4>
            <p class="errorTip" v-if="!isSuccess && isSuccess != -1"><i class="iconfont icon-warn"></i>{{SignResult.meta.message || ''}}</p>
            <div class="signerList" v-if="isSuccess">
                <div class="success" v-for="(item,index) in list" :key="index">
                    <span>签署方：{{item.signCertName}}</span>
                    <span>颁发机构：{{item.auth}}</span>
                    <span>签约时间：{{item.signTime}}</span>
                </div>
            </div>
            <a href="javascript:;" class="againYQ" @click="againHandle">继续验签</a>
        </div>
    </section>
</template>
<script>
    export default{
        name:'signState',
        data(){
            return{
                SignResult:'',
                isSuccess:-1,
                list:[]
            }
        },
        methods:{
            //继续验签
            againHandle(){
                this.removeSData('inspectionSign');
                this.$router.push({
                    name:'insSign'
                })
            },
            init(){
                let { meta , data } = this.SignResult;
                if(meta.success){   //成功
                    this.isSuccess = true;
                    this.list = data.list;
                }else{
                    this.isSuccess = false;
                }
            }
        },
        mounted() {
            this.SignResult = this.getSData('inspectionSign');
            console.log(this.SignResult)
            if(this.SignResult){
                this.init();
            }else{
                this.$router.push({
                    name:'insSign'
                })
            }
        },
        destroyed() {
            this.removeSData('inspectionSign');
        }
    }
</script>
