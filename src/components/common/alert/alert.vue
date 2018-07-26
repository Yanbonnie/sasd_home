<template>
	<div class="cover-box" >
		<div class="alert-model" :style="'width:'+alelrtClassWidth" :class="[scrollModel ? 'scrollModel' : '', type == 1 ? 'bigMargin' : type == 3 ? 'sysMargin':'']"  >
			<div class="alert-header" v-show="(type == 2 || type == 3) && headerStatus "> <!--v-if="type == 2"-->
				<slot name="alert-header">
					<h3>{{title}} <i class="iconfont icon-close" :class="[type==1?'autoClose':'']" @click="cancelHandle"></i></h3>
				</slot>
			</div>
			<div class="alert-sweet" v-if="type == 1 && headerStatus" >
				<img src="../../../assets/images/sweet.png" width="150" height="85" alt="">
			</div>
			<div class="alert-body"> <!--:class="[type == 1 ? 'bigMargin' : '']"-->
				<slot name="alert-content">
					<h3 v-if="!showHtml">{{context}}</h3>
					<h3 v-if="showHtml" v-html="context"></h3>
				</slot>
			</div>
			<div class="alert-footer"  v-show="footerStatus">
				<slot name="alert-footer">
					<div v-show="type == 2">
						<a href="javascript:;" class="cancel-btn"  @click="cancelHandle">{{cancelBtnTxt}}</a>
						<a href="javascript:;" class="sure-btn" @click="sureHandle" >{{sureBtnTxt}}</a>
					</div>
					<div v-show="type == 1">
						<a class="sweet-btn" @click="cancelHandle">我知道了</a>
					</div>
				</slot>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'alert-box',
  props: {
		title: {			// 名称
			type: String,
			default: "提示框"
		},
		headerStatus:{
			type:Boolean,
			default:true
		},
		footerStatus:{
			type:Boolean,
			default:true
		},
		context:{
			type:String,
			default:"这里是提醒文字"
		},
		showState:{         //弹框状态
			type:Boolean,
			default:false
		},
		alelrtClassWidth:{    //给alert添加样式
			type:String,
			default:'500px'
		},
		scrollModel:{        //给alert-model添加class是否滚动
			type:Boolean,
			default:false
		},
		type:{
			type:Number,   //只有一个确定  （3是特殊处理个人信息查看私钥）
			default:1
		},
		sureBtnTxt:{        //解决多次点击确定问题
			type:String,
			default:"确定"
		},
		cancelBtnTxt:{
			type:String,
			default:'取消'
		},
		showHtml:{         //解决body内容可以是传入的html
			type:Boolean,
			default:false,
		},
		sweet:{   //解决双滚动条问题
			type:Boolean,
			default:false  //默认不用解决双滚动条(公共弹框)
		},
		autoClose:{        //是否自动消失。默认不自动消失，如果要自动消失，请设置：autoClose = 'true'
			type:Boolean,
			default:false
		},
		timeClose:{        //自动消失时间，默认2s，如果需要自定义消失时间，请设置:timeClose = '3000'
			type:Number,
			default:2000
		}
	},
	data() {
		return {
		}
	},
	methods: {
		cancelHandle(){
			this.$emit("cancelHandle");
		},
		sureHandle(){
			if(this.sureBtnTxt == "确定"){
				this.$emit("sureHandle");
			}			
		}
	},	
	watch:{
		showState(curVal,oldVal){
			if(curVal){ //弹框显示
				if(this.sweet){
					$('body').css({"height":'auto',"overflow":'hidden'}); 
				}
			}else{      //弹框隐藏				
				if(this.sweet){
					$('body').css({"height":'auto',"overflow":'auto'}); 
				}
			}
		},
		autoClose(curVal,oldVal){
			if(curVal){  //true
				setTimeout(()=>{
					$('.autoClose').click();
				},this.timeClose)
			}
		}
	}
}
</script>
<style scoped lang="scss">
//  @import '../../../assets/css/font2/font.css';
@import '../../../assets/css/base.scss';
 a{text-decoration:none;}
 $border:#dedede;
.cover-box{
	width:100%;
	// height:100%;
	position:fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
	background:rgba(0,0,0,0.8);
	z-index: 9999;
	overflow-y: auto;
	.alert-model{
		width:398px;
		position:absolute;
		top:20%;
		left:50%;
		transform:translateX(-50%);
		// transform:translate(-50%,-52%);
		// -ms-transform: translate(-50%,-52%);
		// transform: translateZ(0);
		background:#fff;
		border-radius:8px;
		padding:0 0 20px;
		&.scrollModel{
			top:10%;
			transform:translate(-50%,0);
			-ms-transform: translate(-50%,0);
		}
		.alert-header{
			height:55px;
			line-height:55px;
			padding:0;
			h3{
				font-size:16px;
				color:#000;
				position:relative;
				border-bottom:1px #dedede solid;
				padding:0 20px;
				font-weight: normal;
				i{
					width:45px;
					height:45px;
					text-align:right;
					font-size:12px;
					color:#979797;
					position:absolute;
					right:10px;
					top:0;
					font-weight: normal;
				}
			}
			
		}
		.alert-sweet{
			width: 150px;
			height: 150px;
			position: absolute;
			left: 50%;
			margin-left: -75px;
			border-radius: 100%;
			-ms-border-radius:100%;
			top: -70px;
			background:#fff;
			z-index: 1;
			img{
				width: 150px;
				position: absolute;
				left: 30px;
				top: 20px;
			}
		}		
		.alert-body{
			padding:30px 20px;
			min-height:20px;
			text-align:center;
			position: relative;
			z-index: 2;
			.gray{   //input灰色背景
				background:#dedede;
			}
			h3{
				font-weight: normal;
				line-height:35px;
				font-size: 14px;
			}
			.form{
				p{
					padding: 10px 0;
					font-size: 14px;
					label{
						width:100px;
						margin-right: 10px;
						display: block;
						float: left;
						height: 30px;
						line-height: 30px;
						text-align: right;
						b{
							color:$ACTIVECOLOR;
							margin-right: 5px;
						}
					}
					input{
						width: 200px;
						display: block;
						float: left;
						height: 30px;
						line-height: 30px;
						border: 1px $border solid;
						border-radius:2px;
						-ms-border-radius:2px;
						text-indent: 10px;
						overflow: hidden;
						&.code{
							width: 90px;
							border-radius: 0;
							-ms-border-radius:0;
							border-top-left-radius:2px;
							-ms-border-top-left-radius:2px;
							border-bottom-left-radius:2px;
							-ms-border-bottom-left-radius:2px;
						}
						
					}
					input[type="file"]{
						font-size: 100px;
					}
					.sendCode{
						width: 110px;
						height: 30px;
						line-height: 30px;
						border: 1px $border solid;
						display: block;
						float: left;
						color: #4a4a4a;
						margin-left: -1px;
						border-top-right-radius:2px;
						-ms-border-top-right-radius:2px;
						border-bottom-right-radius:2px;
						-ms-border-bottom-right-radius:2px;
					}
				}
			}
		}
		.alert-footer{
			// padding:10px 50px;
			max-width: 400px;
			width: 80%;
			margin: 0 auto;
			a,button{
				height:40px;
				line-height:40px;
				text-align:center;
				border:1px #e6e6e6 solid;
				border-radius:4px;
				display:block;
				max-width:150px;
				width: 40%;
				margin:2.5%;
				float:left;
				&.cancel-btn{
					background:#e6e6e6;
					color:#4b4b4b;
				}
				&.sure-btn{
					background:$ACTIVECOLOR;
					color:#fff;
					border:1px $ACTIVECOLOR solid;
					float:right;
				}
				&.center-btn{
					background:$ACTIVECOLOR;
					color:#fff;
					border:1px $ACTIVECOLOR solid;
					float:none;
					margin:2.5% auto;
				}
				&.sweet-btn{
					color: $ACTIVECOLOR;
					float: none;
					width: 100%;
					text-align: center;
					margin: 0;
					max-width: 100%;
					border: 0;
					height: 50px;
					line-height: 50px;
					border-top: 1px $border solid;
					font-size: 16px;
					cursor: pointer;
				}
				&.go-btn{
					width: 150px;
					height: 40px;
					line-height: 40px;
					float: none;
					margin: 0 auto;
					border: 1px $ACTIVECOLOR solid;
					background: $ACTIVECOLOR;
					text-align: center;
					color: #fff;
					border-radius: 0;
					cursor: pointer;
				}
			}
		}
		&.bigMargin{
			padding: 0;
			.alert-body{
				padding: 80px 20px 50px;
			}
			.alert-footer{
				width: 100%;
			}

		}
		&.sysMargin{
			padding: 0;
			.alert-body{
				padding: 30px 20px 30px;
			}
			.alert-footer{
				width: 100%;
			}
		}
	}
}
</style>
