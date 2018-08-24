<template>
  <div class="panel-box"  v-cloak>
        <slot name="panel-header">
            <h3 class="title" v-if="tableTitleState">{{tableTitle}}</h3>
        </slot>
        <div class="table" :class="[tableClass]">
            <div class="loadSource" v-show="tableLoading"><!-- v-show="tableLoading"-->
                <p><img :src="Config.loadingImg" alt="" width="80" height="80"></p>
               
            </div>
            <slot name="panel-content">
                <!-- <ul>
                    <li class="clf icon">
                        <span><img src="../../../assets/images/user.jpg" alt=""></span>
                        <span>张三</span>
                        <span>这是一个发起文档的文档名称文档的文档名称</span>
                        <span>待我签</span>
                        <span>2017.04.23 - 2017.04.25</span>
                        <span><a class="javascript:;">重新编辑</a></span>
                    </li>
                    <li class="clf">
                        <span><img src="../../../assets/images/user.jpg" alt=""></span>
                        <span>张三</span>
                        <span>这是一个发起文档的文档名称文档的文档名称</span>
                        <span>待我签</span>
                        <span>2017.04.23 - 2017.04.25</span>
                        <span><a class="javascript:;">重新编辑</a></span>
                    </li>
                </ul> -->
            </slot>
            <div class="no-message" v-show="total == 0  && !tableLoading">
                <p><img src="../../../assets/images/noAnyThing.png" alt="" ></p>
                <p v-text="'暂无数据'"></p>
            </div> 
            <!-- <div style="width:100%;height:50px;" v-show="pageNumberState && total>display"></div> -->
            <div class="pageNumber" v-show="pageNumberState && total>display">
                <div class="page-box">
                    <pagination  :total="total" :currentpage="currentpageIndex" :display="display" :pagegroup="pagegroup"  @pagechange="pageChangeHandel"></pagination>
                    <div class="page-num" >
                        {{currentpageIndex}}/{{Math.ceil(total / display)}}，共{{total}}条
                    </div>
                </div>
            </div> 
        </div>
    </div>
</template>
<script>
    export default{
        name:'table',
        data(){
            return{
                currentpageIndex:this.currentpage
            }
        },
        props:{
            tableTitle:{   //table标题
                type:String,
                default:'列表标题'
            },
            tableTitleState:{    //table标题状态默认为true   true 显示 false 隐藏  
                type:Boolean,
                default:true
            },
            tableClass:{    //给table添加样式
                type:String,
                default:''
            },
            tableLoading:{   //table数据加载状态
                type:Boolean,
                default:false
            },
            tableListData:{  //table列表数据
                type:Array,
                default:function () {
                    return []
                }
            },
            total:{          //table翻页的总页数
                type:Number,
                default:1
            },
            currentpage:{    //table翻页的当前页数
                type:Number,
                default:1
            },
            display:{        //table翻页的每页条数
                type:Number,
                default:1
            },
            pageNumberState:{  //table翻页是否显示  
                type:Boolean,
                default:true
            },
            pagegroup:{
                type:Number,
                default:5
            }
        },
        methods:{
            pageChangeHandel(val){
                this.currentpageIndex = val;
                this.$emit('pagechange',val)
            }
        }
    }
</script>
<style lang="scss" scoped>
@import '../../../assets/css/base.scss';
$BORDER:#DEE2ED;
.panel-box{
    // border: 1px $BORDER solid;
    padding-bottom: 20px;
    .title{
        height: 50px;
        line-height: 50px;
        padding-left: 25px;
        font-weight: normal;
        color: #6E7571;
        font-size: 14px;    
        border: 1px $BORDER solid;
        border-bottom: 0;
        
        a{
            &.more{
                color: $ACTIVECOLOR;
                float: right;
                margin-right: 1%;
            }
            .iconfont{
                font-size: 12px !important;
            }
        }
    }
    .table{
        // padding-left: 20px;
        position: relative;
        border: 1px #edeef0  solid;
        ul{
            // border: 1px $BORDER solid;            
        }
        li{
            // display: -webkit-flex;  /* 新版本语法: Chrome 21+ */
            // display: flex;          /* 新版本语法: Opera 12.1, Firefox 22+ */
            // display: -webkit-box;   /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
            // display: -moz-box;      /* 老版本语法: Firefox (buggy) */
            // display: -ms-flexbox;   /* 混合版本语法: IE 10 */   
            display: flex;


            height: 50px;
            line-height: 50px;
            border-bottom: 1px #edeef0 solid;
            clear: both;
            position: relative;
            cursor: pointer;
            padding-left: 25px;
            &:hover{
                // background: $ACTIVECOLOR1;
                background: #f2f2f2;
            }
            &:last-child{
                border: 0;  
            }
            span{
                // -webkit-box-flex: 1;
                // -webkit-flex: 1;        /* Chrome */  
                // -ms-flex: 1;            /* IE 10 */  
                // flex: 1;                /* NEW, Spec - Opera 12.1, Firefox 20+ */
                // -webkit-box-flex: 1;    /* OLD - iOS 6-, Safari 3.1-6 */  
                // -moz-box-flex: 1;       /* OLD - Firefox 19- */  
                // display: block;

                display:block;
                word-break:keep-all;/* 不换行 */
                white-space:nowrap;/* 不换行 */
                overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
                text-overflow:ellipsis;
                a{
                    width: 60px;
                    height: 25px;
                    border: 1px $BORDER solid;
                    text-align: center;
                    line-height: 23px;
                    border-radius: 50px;
                    -ms-border-radius:50px;
                    display: block;
                    cursor: pointer;
                    margin-top: 13px;
                    color:$ACTIVECOLOR;
                }
                &.headImg{
                    width: 60px;
                    img{
                        width: 30px;
                        height: 30px;
                        border-radius: 100%;
                        -ms-border-radius:100%;
                        margin-top: 10px;
                    }
                }
            } 
            &.icon{
                &::before{
                    position: absolute;
                    width: 8px;
                    height:8px;
                    line-height: 8px;
                    border-radius: 50px;
                    -ms-border-radius:50px;
                    content: '.';
                    font-size: 0;
                    background:$ACTIVECOLOR;
                    top: 50%;
                    margin-top: -4px;
                }
            }           
        }
        &.table-two{
            span{
                width: 48%;
                padding-left: 2%;
            }
        }
        &.table-four{
            span{
                width: 23%;
                // float: left;
                padding-left: 2%;
                &:nth-child(3){
                    width: 28%;
                }
            }
        }
        &.table-five{
            span{
                width: 18%;                
                padding-left: 2%;
            }
        }
        &.table-six{
            span{
                width: 14.6%;                
                padding-left: 2%;
            }
        }
        &.table-seven{
            span{
                width: 12.2%;                
                padding-left: 2%;
            }
        }
        &.table-eight{
            span{
                width: 10.5%;                
                padding-left: 2%;
            }
        }
        &.table-file{
            span{
                padding-left:2%;
                &:nth-child(1){
                    width: 60px;
                    line-height: 50px;
                    height: 50px;
                    img{
                        width: 30px;
                        height: 30px;
                        border-radius: 100%;
                        -ms-border-radius:100%;
                        margin-top: 10px;
                    }
                }
                &:nth-child(2){
                    width: 10%;
                }
                &:nth-child(3){
                    width: 42%;
                }
                &:nth-child(4){
                    width: 8%;
                }
                &:nth-child(5){
                    width: 15%;
                    text-align: right;
                }
                &:nth-child(6){
                    width: 20%;
                    a{
                        // margin: 10px auto 0;
                        float: right;
                        margin-right: 10%;
                    }
                }
            }
        }
        .page-box{
          position: absolute;
          width: 100%;
          bottom: -50px;
          left: 0;  
          .pagination-box{
              padding-bottom: 0;
          }
          .page-num{
              line-height: 30px;
              right: 10px;
          }
        }
    }
}
    
</style>
