<template>
    <section class="buyRecored">
        <div class="record">
            <ul>
                <li class="box">
                    <div class="sideLeft">
                        ¥39.60
                    </div>
                    <div class="sideRight">
                        <h3>优惠套餐</h3>
                        <p>有效期至 2018.02.14</p>
                    </div>
                    <a href="javascript:;">申请发票</a>
                </li>
                <li class="box">
                    <img src="../../../assets/images/invoice.png" class="left-icon" alt="">
                    <div class="sideLeft">
                        ¥39.60
                    </div>
                    <div class="sideRight">
                        <h3>优惠套餐</h3>
                        <p>有效期至 2018.02.14</p>
                    </div>
                    <a href="javascript:;">查看发票</a>
                </li>
                <li class="box invalid">
                    <div class="sideLeft">
                        ¥39.60
                    </div>
                    <div class="sideRight">
                        <h3>优惠套餐</h3>
                        <p>已退款</p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="page-box">
            <pagination :total="page.total" :currentpage="page.currentpageIndex" :display="page.display"  @pagechange="pageChangeHandel"></pagination>
            <div class="page-num">
                {{page.currentpageIndex}}/{{Math.ceil(page.total / page.display)}}，共{{page.total}}条
            </div>
        </div>
    </section>
</template>
<script>
    export default{
        name:'buyRecored',
        data(){
            return{
                recored:{
                    list:[],
                    
                },
                page:{
                    currentpageIndex:1,
                    total:20,
                    display:10                    
                }
            }
        },
        methods:{
            pageChangeHandel(val){
                console.log(val)
            }
        },
        mounted(){
            
        }
    }
</script>
