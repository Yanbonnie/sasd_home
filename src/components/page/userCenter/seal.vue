<template>
    <section class="seal">
        <div class="sealBox" v-show="sealStep == 1">
            <h3>个人签名样式（3个） <span @click="sealStep = 2"><i class="iconfont icon-add_empty"></i>添加</span><span @click="lookCertState = true;">查看证书</span></h3>
            <ul class="clf">
                <li>
                    <a href="javascript:;">
                        <b><img src="../../../assets/images/logo.png" alt=""></b>
                        <div class="operation" >
                            <span><i class="iconfont icon-default"></i>设为默认</span>
                            <span><i class="iconfont icon-del"></i>删除</span>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="javascript:;">
                        <b><img src="../../../assets/images/logo.png" alt=""></b>
                        <div class="operation">
                            <span><i class="iconfont icon-default"></i>设为默认</span>
                            <span><i class="iconfont icon-del"></i>删除</span>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="javascript:;">
                        <b><img src="../../../assets/images/logo.png" alt=""></b>
                        <div class="operation">
                            <span><i class="iconfont icon-default"></i>设为默认</span>
                            <span><i class="iconfont icon-del"></i>删除</span>
                        </div>
                    </a>
                </li>
                
            </ul>
        </div>
        <div class="sealBox" v-show="sealStep == 1">
            <h3>授权的签章（1个）<span @click="lookCertState = true;">查看证书</span></h3>
            <ul class="clf">
                <li>
                    <a href="javascript:;">
                        <b><img src="../../../assets/images/logo.png" alt=""></b>
                        <div class="operation" >
                            <p>数安科技股份有限公司授权</p>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
        <!-- 添加签章 -->
        <div class="addSealBox" v-show="sealStep == 2">
            <nav @click="sealStep = 1"><i class="iconfont icon-back" ></i>返回</nav>
            <div class="addSealBody">
                
                <div class="ewm">
                    <p>添加签名需要在手机端完成</p>
                    <img src="../../../assets/images/erweima.png"/>
                    <p>扫码打开或下载手机版<a href="javascript:;">真宜签</a></p>
                </div>
                <div class="tipBox">
                    <ul class="box">
                        <li>
                            <img src="../../../assets/images/seal01.png" alt="">
                            <p><span>1</span></p>
                            <p>点击“个人中心”</p>
                        </li>
                        <li>
                            <img src="../../../assets/images/seal02.png" alt="">
                            <p><span>2</span></p>
                            <p>点击“我的签名”</p>
                        </li>
                        <li>
                            <img src="../../../assets/images/seal03.png" alt="">
                            <p><span>3</span></p>
                            <p>点击“添加签名”</p>
                        </li>
                    </ul>
                    <h3><i class="iconfont icon-warn"></i>手机提交签章后，请<span>刷新</span>此页面</h3>
                </div>
                <!-- <div class="tipBox">
                    <i class="iconfont icon-scaning"></i>
                    <p>使用你的手机版<span>真宜签</span>扫码</p>
                    <p>手机提交签章后，请<span>刷新</span>此页面</p>
                </div> -->
            </div>
        </div>
        <!-- 查看证书 -->
        <div class="lookCertCover" v-show="lookCertState">
            <div class="lookCert">
                <i class="iconfont icon-del-solid close" @click="lookCertState = false;"></i>
                <div class="certPage">
                    <img class="seal" src="../../../assets/images/cert_z.png" alt="">
                    <h3>数字证书</h3>
                    <ul>
                        <li class="box">
                            <label for="">颁发给</label>
                            <p>张三</p>
                        </li>
                        <li class="box">
                            <label for="">颁发者</label>
                            <p>GLOBAL DIGITAL CYBERSECURITY AUTHORITY CO.，LTD.</p>
                        </li>
                        <li class="box">
                            <label for="">有效期</label>
                            <p>2017.10.18 至 2018.10.18</p>
                        </li>
                        <li class="box">
                            <label for="">序列号</label>
                            <p>20070000000023823456782345432689</p>
                        </li>
                        <li class="box">
                            <label for="">证件号</label>
                            <p>4415*************213</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    export default{
        name:"seal",
        data(){
            return{
                lookCertState:false,
                sealStep:1,    //1-我的签章第一页面  2-添加签章(个人)

            }
        },
        mounted(){

        }
        
    }
</script>