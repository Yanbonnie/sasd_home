<template>
    <div>
        <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
        
        <div id="signature">
        </div>
        <div class="nav-left" id="nav-left">
            <span class="color black active" data-value="#000000"><i></i></span>
            <span class="color blue" data-value="#0030ff"><i></i></span>
            <span class="color red" data-value = "#ff503f"><i></i></span>
            <span class="delete" id="reset"><b class="iconfont icon-del"></b></span>
            <span class="save" id="save"><b class=" iconfont icon-hook "></b></span>
        </div>
        <div id="someelement"></div>
    </div>
</template>
<script>
    import '@/assets/js/plugin/jSignature.js' 
    export default {
        data(){
            return{

            }
        },
        mounted(){
           var This = this;
           $(function() {
                var devicePixelRatio = window.devicePixelRatio;
                var canvas = null,
                ctx = null,
                w = null,
                h = null,
                color = null;
                // 1.
                var $sigdiv = $("#signature");
                $sigdiv.jSignature('init',
                    {
                        color:"#000",
                        lineWidth:'5',
                        width:window.innerWidth*devicePixelRatio,
                        height:window.innerHeight*devicePixelRatio
                    }
                )
                $('.jSignature').css({'width':window.innerWidth,'height':window.innerHeight});
                // 2.重置画布
                $sigdiv.jSignature("reset"); 
                
                //3.获取画布
                canvas=document.querySelector(".jSignature");
                
                // 设置画布背景色
                ctx = canvas.getContext('2d');
                ctx.fillStyle = '#fff';
                ctx.fillRect(0,0,canvas.width,canvas.height);
                
                //清除画布背景
                $("#signature").on('touchstart',function(){
                    $(this).css({
                        "background":'#ffffff'
                    })
                })

                $('#nav-left .color').on('click',function(){
                    var val = $(this).attr('data-value');
                    $(this).addClass('active');
                    $(this).siblings('.color').removeClass('active');
                    $sigdiv.jSignature("setColor",val); 
                    $sigdiv.jSignature("setLineWidth",'6'); 
                })

                $("#save").click(function(){
                    if($sigdiv.jSignature('getData','native').length == 0){
                        // alert("请写入您的签名");
                        This.modelCommonTip("请填写你的姓名")
                        return;
                    }
                    //将画布内容转换为图片
                    var datapair = $sigdiv.jSignature("getData", "image");
                    $('#someelement').show();
                    $('#someelement').html(`<img src="data:${datapair[0]},${datapair[1]}" style="width:100%"/>`)
                });
                
                $("#reset").click(function(){
                    let color = $('#nav-left .active').attr('data-value');
                    $sigdiv.jSignature("reset"); //重置画布，可以进行重新作画.
                    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);  //清除画布
                    $("#someelement").html("").hide();
                    $sigdiv.jSignature("setColor",color); 
                    $sigdiv.jSignature("setLineWidth",'6'); 
                });

                $("#reset").click();  //进入页面清除画布
            }); 
        }
    }
</script>

<style lang="scss" scoped>
*{
    padding: 0;
    margin: 0;
}
#signature{
    width: 100%;
    height: 100%;
    position: relative;
    background: url('../../../assets/images/signtxt2.png') no-repeat center center #fff;
    background-size: auto 50%;
}
.nav-left{
    width: 50px;
    height: 100%;
    position:absolute;
    left: 0;
    top:0;
    background:#f1f1f2;
    .black,.blue,.red{
        width: 32px;
        height: 32px;
        border-radius:100%;
        -ms-border-radius:100%;
        position:absolute;
        top:20px;
        left:5px;
        background:#6e6e6e;
        border:1px #000 solid;      
        display: black;  
        i{
            display: none;
        }
        &.active{
            background:#fff;
            i{
                display: block;
                background:#4a4a4a;
                position:absolute;
                left: 2px;
                top:2px;
                width: 26px;
                height: 26px;
                border-radius:100%;
                -ms-border-radius:100%;
                border:1px #000 solid;
                font-size: 0px;

            }
        }
    }
    .blue{
        top: 80px;
        background:#2e68e5;
        border:1px #184eba solid;
        &.active{
            i{
                background:#2e68e5;
                border:1px #184eba solid;
            }
        }
    }
    .red{
        top:140px;
        background:#ff503f;
        border:1px #ff503f solid;
        &.active{
            i{
                background:#ff503f;
                border:1px #ff503f solid;
            }
        }
    }
    .delete{
        position:absolute;
        bottom:100px;
        text-align:center;  
        width:50px;
        b{
            width: 32px;
            height: 32px;
            background: #fff;
            border-radius: 50%;
            display: inline-block;
            transform: rotate(90deg);
            line-height: 32px;
        }
    }
    .save{
        position:absolute;
        bottom: 30px;
        text-align:center; 
        width:50px;
        b{
            width: 32px;
            height: 32px;
            background: #fff;
            border-radius: 50%;
            display: inline-block;
            transform: rotate(90deg);
            line-height: 32px;
            color: green;
        }
    }

}
#someelement{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: none;
    background:#fff;
}
#someelement img{
    width:100%;
}
.btn-box{
    position: fixed;
    left:0;
    bottom:0;
    width: 100%;
    z-index: 3;
    input,a{
        width: 33.3%;
        display: block;
        height: 40px;
        line-height: 40px;
        float: left;
    }
    a{
        border: 1px #dedede solid;
        text-align: center;
        &.active{
            background: #ff503f;
            color: #fff;
        }
    }
}
</style>
