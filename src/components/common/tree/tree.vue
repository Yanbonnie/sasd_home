<template>
    <section class="tree">
        <div class="tree-menu-comm tree-menu">
            <!--  v-for="(item,index) in data" :key="index" -->
            <m-tree-list
                :data="data"
                :tabId="tabId"
                :index="1"
                :ulDisPlay="ulDisPlay"
                @selectTreeItem="selectTreeItem"
                @renameHandle="renameHandle"
                @copyHandle="copyHandle"
                @emitSelectTreeList = "emitSelectTreeList"
                @delLabel="delLabel"
                @addLabel="addLabelHandle"
                :dragState="dragState"
                :operState="operState"
            ></m-tree-list>
        </div>
    </section>
</template>
<script>
    import Vue from 'vue';
    Vue.component('m-tree-list',{
        data(){
            return{
                hoverId:null,
                temRename:null,
                enterState:false,
            }
        },
        computed:{
            count(){
               var c = this.increment;
               return ++c; 
            },
            stylePadding(){
                return {
                    'padding-left':this.count * 16 + 'px'
                }
            }
        },
        props:{
            data:{
                type:Array,
                default:[]
            },
            tabId:{
                type:String,
                default:null
            },
            dragState:{
                type:Boolean,
                default:false
            },
            increment:{
                type:Number,
                default:0
            },
            operState:{         //是否可以对tree操作
                type:Boolean,
                default:true,
            },
            index:{
                type:Number,
                default:2
            },
            ulDisPlay:{
                type:Number,
                default:2
            }
        },
        methods:{
            //点击treetitle
            selectTreeList(ev,item){
                $('.tree .tree-title strong').removeClass('active');
                let target = $(ev.target);
                target.addClass('active');
                this.emitSelectTreeList(item);
            },
            emitSelectTreeList(item){
                this.$emit("emitSelectTreeList",item);
            },
            //重命名click
            renameClick(ev,item){
                let target = $(ev.target);
                let itemSpan = target.parent('.oper').siblings('span');
                let itemInput = target.parent('.oper').siblings('input');
                $('.tree input').hide();
                $('.tree-title').find('span').show();
                itemSpan.hide();
                itemInput.show();
                itemInput.focus();
                this.temRename = item.title;
            }, 
            //重命名enter
            renameHandle(item){
                this.enterState = true;
                $('.tree input').hide();
                $('.tree-title').find('span').show();       
                this.temRename = null;
                setTimeout(()=>{
                    this.enterState = false;
                },600)
                if(item.addType){
                    this.$emit('addLabel',item);       
                    return;
                }else{
                    this.$emit("renameHandle",item);          
                    return;
                }
            },
            //重命名失去焦点
            blurHandlle(item){
                if(this.enterState){
                    return;
                } 
                this.enterState = false;                 
                $('.tree input').hide();
                $('.tree-title').find('span').show(); 
                if(item.addType){
                    this.$emit('addLabel',item);
                }else{
                    if(this.temRename && this.temRename != item.title){
                        this.temRename = null;
                        this.$emit("renameHandle",item);
                    }
                }
            },      
            //新建标签
            copyClick(ev,item){
                let target = $(ev.target);
                setTimeout(()=>{
                    target.parent('.oper').parent('.tree-title').siblings('ul').show();
                    target.parent('.oper').siblings('span').children('.icon-back').css({
                        "transform":'rotate(275deg)'
                    })
                },300)
                this.copyHandle(item);         
                this.temRename = 'a';       
            },  
            copyHandle(item){
                this.$emit("copyHandle",item);
            },   
            /*展开合上*/
            openChild(ev){
                let target = $(ev.target);
                let Siblings = target.parent('span').parent('.tree-title').siblings('ul');
                let attrState = Siblings.css('display')
                if(attrState == 'none'){
                    Siblings.show();
                    $(target).css({
                        "transform":'rotate(275deg)'
                    })                    
                }else{
                    Siblings.hide();
                    $(target).css({
                        "transform":'rotate(180deg)'
                    })
                }
            },
            drag(ev,item){
                ev.dataTransfer.setData("item",JSON.stringify(item));
            },
            allowDrop(ev){
                $('.tree-title strong').css({'color':''});
                $(ev.currentTarget).css({'color':this.Config.activeColor});
                 ev.preventDefault();
            },
            drop(ev,dropData){
                
                ev.preventDefault();
                $('.tree-title strong').css('background','');
                $('.addressBookList li').css('background','');
                // $(ev.target).css({
                //     'background':'#fffbea',
                //     "color":"#797979"
                // })
                let dragData = JSON.parse(ev.dataTransfer.getData("item"));          
                this.selectTreeItem(dragData,dropData)
            },
            dragEnd(ev){
                // console.log(ev)
                $('.tree-title strong').css('color','');
            },
            selectTreeItem(dragData,dropData){  
                this.$emit("selectTreeItem",dragData,dropData);
                // this.$emit("emitSelectTreeList",dropData);
                return;
            },
            //删除标签
            delLabel(item){
                this.$emit('delLabel',item);   
            },
            addLabelHandle(item){
                this.$emit('addLabel',item)
            }
        },
        mounted(){
            $('.show').focus();
        },
        template:`        
            <ul  :class="[index==1 ? '' : 'hide']">
                <li v-for="item of data">                
                    <div class="tree-title" :style="[stylePadding]" @mouseenter.stop="hoverId = item.uid" @mouseleave.stop="hoverId = null">
                        <span v-if="dragState" :title="item.title" :class="[item.inputType ? 'displayNo' : '']"><strong class="shengl" :class="[tabId == item.uid ? 'active':'']" @click="selectTreeList($event,item)" draggable="true" @dragstart.stop='drag($event,item)' @drop.stop="drop($event,item)" @dragover.stop="allowDrop($event)"  @dragend.stop="dragEnd">{{item.title}}</strong> <i class="iconfont icon-back ico" v-if="item.children.length > 0" @click.stop="openChild($event)"></i></span>
                        <span v-else><strong :title="item.title" @click="selectTreeList($event,item)" class="shengl"  :class="[tabId == item.uid ? 'active':'']">{{item.title}}</strong> <i class="iconfont icon-back ico" :class="[ulDisPlay==1 ? 'icoDown':'']" v-if="item.children.length > 0" @click.stop="openChild($event)"></i></span>
                        <input type="text" :class="[item.inputType ? 'show' : '']" v-model="item.title" @keyup.enter="renameHandle(item)" @blur.stop="blurHandlle(item)" @click.stop="item.title = item.title == '请输入标签名称' ? '' : item.title, temRename = item.title == '请输入标签名称' ? '请输入标签名称':item.title">
                        <strong class="oper" :class="[item.inputType ? 'opacity' : '']" v-show="hoverId == item.uid && operState">
                            <i class="iconfont icon-rename" title="重命名" @click.stop="renameClick($event,item)"></i>
                            <i class="iconfont icon-copy-circle" title="新增子标签" @click.stop="copyClick($event,item)"></i>
                            <i class="iconfont icon-del-cicrcle" title="删除" @click.stop="delLabel(item)"></i>      
                        </strong>
                    </div>
                    <!--如果循环的item有children属性，那么生成下一级-->
                    <m-tree-list 
                        :increment="count"
                        :index="ulDisPlay"
                        v-if='item.children.length > 0' 
                        :data="item.children"
                        :tabId="tabId"                        
                        @selectTreeItem="selectTreeItem"
                        @renameHandle="renameHandle"
                        @copyHandle="copyHandle"
                        @emitSelectTreeList = "emitSelectTreeList"
                        @delLabel="delLabel"
                        @addLabel="addLabelHandle"
                        :dragState="dragState"
                        :operState="operState"
                    ></m-tree-list>
                </li>
            </ul>
        `
    })
    /*****************************************/
    export default{
        name:'tree',
        data(){
            return{
                hoverId:null,
                temRename:null
            }
        },
        props:{
            data:{
                type:Array,
                default:function(){
                    return []
                }
            },
            tabId:{        //默认选中
                type:String,
                default:null
            },
            dragState:{     //是否可以拖拽
                type:Boolean,
                default:false
            },
            increment:{
                type:Number,
                default:0
            },
            operState:{         //是否可以对tree操作
                type:Boolean,
                default:true,
            },
            ulDisPlay:{  //判断子集是否是全部展开  1为全部展开  2为第一层展开
                type:Number,
                default:2
            }
        },
        computed:{
            count(){
               var c = this.increment;
               return ++c; 
            },
            stylePadding(){
                return {
                    'padding-left':this.count * 16 + 'px'
                }
            }
        },
        methods:{
            selectTreeItem(dragData,dropData){           
                this.$emit("selectTreeItem",dragData,dropData);
                return;
            },
            //重命名enter
            renameHandle(item,parData){
                $('.tree input').hide();
                $('.tree-title').find('span').show();       
                this.temRename = null;
                this.$emit("renameHandle",item,parData);
                return;
            },
            //复制标签
            copyHandle(item){
                this.$emit("copyHandle",item);
            }, 
            //选择item
            emitSelectTreeList(item){
                this.$emit("emitSelectTreeList",item);
            },
            //删除标签
            delLabel(item){
                this.$emit('delLabel',item);   
            },
            //添加标签
            addLabelHandle(item){
                this.$emit('addLabel',item)
            }
        },
        mounted(){
            
        }
    }
</script>
<!--scoped-->
<style lang="scss" >
@import '../../../assets/css/base.scss';
    ul {
        padding: 0;
        margin: 0;
        list-style: none;
    }
    .tree-menu {
        background:#fff;
        height: 100%;
        padding-left: 25px;
        ul{
            li{
                padding-left: 0 !important;
                overflow: hidden;
            }
            &.hide{
                display: none;
            }
        }
    }
    
    .tree-menu-comm span {
        display: block;
        font-size: 12px;
        position: relative;
    }
    
    .tree-contro .ico {
        background-position: 3px -92px;
    }
    
    .tree-title .ico {
        position: absolute;
        cursor: pointer;
        left: -15px;
        top: 0;
        opacity: 0.8;
        transform: rotate(180deg);
        line-height: 35px;
        font-size: 12px !important;
        color: #797979;
        text-indent: 0;
    }
    .tree-title .icoDown{
        transform: rotate(270deg);
    }
    .tree-title{
        position: relative;
        span{
            display: block;
            &.displayNo{
                display:none;
            }
            strong{
                &:hover{
                    color: $ACTIVECOLOR;
                }
            }
        }
        .oper{
            position: absolute;
            right: 10px;
            top: 0;
            height: 30px;
            i{
                font-weight: normal;
                height: 30px;
                line-height: 30px;
                color: #acacac;
                &:hover{
                    color: $ACTIVECOLOR;
                }
            }
            &.opacity{
                display: none;
            }
        }
        input{
            // position: relative;
            display:none;
            border: 1px #edeef0 solid;
            text-indent: 5px;
            height: 35px;
            box-sizing: border-box;
            line-height: 35px;
            &.show{
                display: block;
                margin: 5px 0;
            }
        }
    }
    .tree-menu-comm span strong {
        display: block;
        width: 100%;
        position: relative;
        line-height: 35px;
        padding-right: 80px;
        color: #797979;        
        font-weight: normal;
        cursor: pointer;
        &.active{
            // background: #fffbea;
            color: $ACTIVECOLOR;
            font-weight: bold;
        }
    }
    
    .tree-nav {
        background: #e7f2fe;
        border: 1px solid #bfdaf4;
        padding-left: 14px;
        margin-left: 0px;
    }
    
    
    /*无箭头*/
    
    .tree-contro-none .ico {
        background-position: -999px -99px;
    }
    /*箭头朝下*/
    
    .tree-contro .ico {
        background-position: 3px -92px;
    }
</style>

