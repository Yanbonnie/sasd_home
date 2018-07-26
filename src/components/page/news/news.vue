<template>
    <section class="news contain">
        <!-- <nav>消息中心</nav> -->
        <Table :tableTitleState="false" class="newsTable" :total="page.total" :currentpage="page.currentpageIndex" :display="page.display" @pagechange="pageChangeHandel">
            <ul slot="panel-content">
                <li>
                    <span><i class="iconfont icon-square"></i></span>
                    <span>这是一个发起文档的文档名称</span>
                    <span>2017.07.13  15:20:00</span>
                </li>
                <li>
                    <span><i class="iconfont icon-checkbox_solid"></i></span>
                    <span>这是一个发起文档的文档名称</span>
                    <span>2017.07.13  15:20:00</span>
                </li>
            </ul>
        </Table>
    </section>
</template>
<script>
    export default{
        name:'news',
        data(){
            return{
                page:{
                    currentpageIndex:1,
                    total:20,
                    display:10                    
                },
            }
        },
        methods:{
            pageChangeHandel(val){  //最近联系人翻页
                console.log(val)
            },
        },
        mounted(){

        }
    }
</script>