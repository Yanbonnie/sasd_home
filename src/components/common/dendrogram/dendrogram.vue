<template>
    <div class="tree" style="padding:20px 0 0">
        <!-- <div class="loadSource" v-show="treeLoading">
            <p><img src="../../../assets/images/loading.gif" alt="" width="80" height="51"></p>
        </div> -->
        <ul id="browser" class="treeview">
             <tree-list :treeListData="treeListData" @selectTreeHandle="selectTreeHandle"></tree-list>  
        </ul>
    </div>
</template>

<script>
import Vue from 'vue';
Vue.filter('filterIcon', function (value,length) { //过滤颁发机构
    let statusTxt = '';
    if(value){
        if(value.indexOf('icon-company') != '-1'){
            statusTxt = 'icon-man';
        }else if(value.indexOf('tree-folder-open') != '-1' && length == 0 ){
            statusTxt = 'folderNo';
        }else{
            statusTxt = 'folder';
        }
    }    
    return statusTxt;
});
import '@/assets/css/jquery.treeview.scss';
import { mapGetters } from 'vuex';
Vue.component('tree-list',{
    name:'treelist',
    data(){
        return{
            clickIndex:null,
            // treeId:null,
        }
    },
    methods:{
        selectTreeItem(ev,item){
            let target = ev.target;    
            if(item.pid.length == 0) return;   //不可点击        
            // $('#browser .item').find('span').removeClass();   
            let oper = null;
            if($(target).hasClass('active')){
                $(target).removeClass('active');
                oper = 'del';
            }else{
                $(target).addClass('active');     
                oper = 'add';            
            }
            this.$emit("selectTreeHandle",{
                item,
                oper
            });
        },
        //对外函数
        selectTreeHandle(obj){
            this.$emit("selectTreeHandle",obj);
        }
    },
    computed:{
        ...mapGetters([
        'userState'
        ])
    },
    props:{
        treeListData:{
            type:Array,
            default:function(){
                return []
            }
        },
    },
    template:`
        <div>
            <ul>
                <li v-for="(item,index) in treeListData" :key="index" :class="[(treeListData.length-1) === index ? 'lastCollapsable':'']">
                    <div class="item">
                        <span :class="[item.pid.length == 0 ? 'disable' : '']" @click.stop="selectTreeItem($event,item)">{{item.title}}<b>{{item.pid.length+'人'}}</b></span>
                    </div> 
                    <tree-list :treeListData="item.children" @selectTreeHandle="selectTreeHandle"></tree-list>
                </li>
            </ul>
        </div>
    `
});
export default {
    name: 'tree',
    data(){
        return {
            hoverIndex:null,
            treeId:null,
        }
    },
    props:{
        treeListData:{
            type:Array,
            default:function(){
                return []
            }
        }
    },
    methods:{
        selectTreeHandle(obj){
            this.$emit("selectTreeHandle",obj);
        }
    },
    mounted(){  
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
