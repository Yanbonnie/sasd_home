<template>
    <section class="contacts">
        <div class="setpOne">
            <nav>
                <a href="javascript:;" class="active">最近联系人</a>
                <router-link to="/user/contacts">通讯录</router-link>
                <div class="search">
                    <input type="text" v-model="searchTitle" placeholder="姓名/账号" @keyup="searchHandle($event)" >
                    <i class="iconfont icon-search"></i>
                </div>
            </nav>
            <section class="nearCon">
                <Table :tableTitleState="false" :total="page.total" :currentpage="page.currentpageIndex" :display="page.display" @pagechange="pageChangeHandel">
                    <ul slot="panel-content" class="nearConList">
                        <li class="clf box" v-for="(item,index) in nearConList" :key="index">
                            <span class="headImg"><img src="../../../assets/images/user.jpg" alt=""></span>
                            <span>{{item.userName}}</span>
                            <span>{{item.account}}</span>
                            <span @click.stop="clickIndex = index"><i class="iconfont icon-menu"></i></span>
                            <div class="selectBox" v-if="index == clickIndex">
                                <p>置顶</p>
                                <p>查看签署记录</p>
                                <p>从最近联系人移除</p>
                            </div>
                        </li>
                    </ul>
                </Table>
            </section>
        </div>
        <!-- 删除联系人 -->
        <alertModel v-show="delCon.state" :title="'删除联系人'" :type="2" @cancelHandle="delCon.state=false" @sureHandle="sureDelCon">
            <div slot="alert-content">
                <p>确定从通讯录删除 <span :style="'color:#ff563f;'">李四 13412352645 </span>该联系人吗？</p>
            </div>
        </alertModel>
    </section>
</template>

<script>
    let nearConList = [{
        userName:'张三',
        account:'18825039689'
    },
    {
        userName:'张三',
        account:'18825039689'
    }]
    export default{
        name:'nearcontacts',
        data(){
            return{
                searchTitle:'',            //搜索关键字
                nearConList:nearConList,
                delCon:{                   //删除联系人
                    state:false,
                },                
                page:{
                    currentpageIndex:1,
                    total:20,
                    display:10                    
                },  
                clickIndex:null
            }
        },
        methods:{
            //搜索联系人列表
            searchHandle(){

            },
            
            sureDelCon(){  //确认删除联系人

            },
            pageChangeHandel(val){  //最近联系人翻页
                console.log(val)
            },
            init(){
                let This = this;
                $(document).on('click',()=>{
                    if(this.clickIndex || this.clickIndex == 0){
                        this.clickIndex = null;
                    }
                })
            }
        },
        mounted(){
            this.init();
        }
    }
</script>