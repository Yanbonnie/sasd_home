<template>
  <div id="app">
    <headerComponent v-show="headerShow && !type"></headerComponent>
    <router-view>

    </router-view>  
    <router-view name="sign">
       
    </router-view>
    <!-- <footerComponent  v-show="footerShow && !type"></footerComponent>  -->
    
    <Model v-show="model.state" :context="model.context" :topClass="model.topClass"></Model>
    <Vdialog v-show="$store.state.dialog.state && !type" :dialogOption="$store.state.dialog.options" ref="dialog"></Vdialog>
    
  </div>
</template>

<script>
import Vue from 'vue';
import HEADER from '@/components/header.vue';
import FOOTER from '@/components/footer.vue';
import Vdialog from '@/components/common/dialog/dialog.vue';
export default {
    name: 'app',
    data(){
  	    return{

  	    }
    },
    components:{
        headerComponent:HEADER,
        footerComponent:FOOTER,
        Vdialog:Vdialog
    },
    computed:{
        model(){
            return this.$store.state.model;
        },
        headerShow(){
            return this.$store.state.headerShow;
        },
        footerShow(){
            return this.$store.state.footerShow;
        },
        type(){
            return this.$store.state.type;
        }
    },
    mounted(){
        Vue.prototype.dialogConfirm = this.$refs.dialog;        
    }
}
</script>
<style lang="scss" scoped>
</style>