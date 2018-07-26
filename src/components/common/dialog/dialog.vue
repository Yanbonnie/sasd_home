<template>
<div class="dialog">
	<div class="mask"></div>
	<div class="dialog-content">
		<h3 class="title">{{ modal.title }}</h3>
		<div class="text">
            <p v-html="modal.text "></p>
        </div>
		<div class="btn-group"  v-if="modal.btnCount==2">
			<div class="btn inserShadow" @click="cancel">{{ modal.cancelButtonText }}</div>
			<div class="btn inserShadow" @click="submit">{{ modal.confirmButtonText }}</div>
		</div>
        <div class="btn-group oneBtn" v-if="modal.btnCount==1">
			<div class="btn inserShadow" @click="cancel">{{ modal.confirmButtonText }}</div>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: 'dialog',
	props: {
		dialogOption: {
            type:Object,
            default:()=>{
                return {
                    title:'提示',
                    text:'我是提示框',
                    cancelButtonText:'取消',
                    confirmButtonText:'确定',
                    btnCount:2
                }
            }
        }
	},
	data() {
		return {
			resolve: '',
			reject: '',
			promise: '', // 保存promise对象
		}
	},
	computed: {
		modal: function() {
            let options = this.dialogOption;
			return {
				title: options.title || '提示',
				text: options.text,
				cancelButtonText: options.cancelButtonText ? options.cancelButtonText : '取消',
                confirmButtonText: options.confirmButtonText ? options.confirmButtonText : '确定',
                btnCount:options.btnCount ? options.btnCount : 2
			}
		}
    },
	methods: {
		//确定,将promise断定为完成态
		submit() {
			this.resolve('submit');
		},
		// 取消,将promise断定为reject状态
		cancel() {
			this.reject('cancel');
		},
		//显示confirm弹出,并创建promise对象，给父组件调用
		confirm() {
			this.promise = new Promise((resolve, reject) => {
				this.resolve = resolve;
				this.reject = reject;
			});
			return this.promise; //返回promise对象,给父级组件调用
		}
    },
    mounted(){
        $(document).on('keydown',e=>{
            if(this.$store.state.dialog.state){
                if(e.which == 13){         //确定
                    this.resolve('submit');
                }else if(e.which == 27){   //取消
                    this.reject('cancel');
                }
            }
        })

        /*this.$store.commit('changeDialog',{state:true,options:{title:'删除',text:`确认删除${item.title}标签？`}})
        this.dialogConfirm.confirm().then(() => {
            this.$store.commit('changeDialog',{state:false,options:{}});
            this.httpPost(this.URL['delLabel'],{uid:item.uid,userId:this.curAccount.accId},(json)=>{
                if(json.meta.success){                    
                    this.contactList();
                }
            })
        }).catch(() => {
            this.$store.commit('changeDialog',{state:false,options:{}})
        }) */


        /*this.$store.commit('changeDialog',{state:true,options:{title:'提示',text:`没有检测到UKEY,请先插入Ukey`,btnCount:1}})
        this.dialogConfirm.confirm().then(() => {
            this.$store.commit('changeDialog',{state:false,options:{}});
        }).catch(() => {
            this.$store.commit('changeDialog',{state:false,options:{}})
        })*/
    }
}
</script>

<style lang="scss">
@import '../../../assets/css/base.scss';
.dialog {
	position: relative;
    .dialog-content {
        position: fixed;
        padding: 0 20px 25px;
        box-sizing: border-box;
        width: 520px;
        min-height: 220px;
        left: 50%;
        top: 50%;
        margin-left: -(520/2)*1px;
        margin-top: -110px;
        background: #fff;
        border-radius: 4px;
        z-index: 50002;
        .title {
            font-size: 14px;
            font-weight: normal;
            line-height: 30px;
            height: 50px;
            line-height: 50px;
            border-bottom: 1px #DEE2ED solid;
            color: $BLACK;
        }
        .text {
            font-size: 14px;
            line-height: 30px;
            color: $BLACK;
            margin-top: 31.5px;
            text-align: center;
            line-height: 25px;
            padding-bottom: 46px;
            span{
                color: $ACTIVECOLOR;
                margin: 0 5px;
            }
        }
        .btn-group {
            display: flex;
            justify-content: space-between;
            padding: 0 10px;
            &.oneBtn{
                .btn{
                    margin: 0 auto;
                }
            }
            .btn {
                width: 210px;
                height: 40px;
                font-size: 14px;
                cursor: pointer;
                text-align: center;
                background: #FFFFFF;
                border: 1px solid #CCCCCC;
                line-height: 40px;
                border-radius: 4px;
                color: $FONTCOLOR;
                padding: 0;
                &:last-child {
                    background: $ACTIVECOLOR;
                    box-shadow: 0 4px 10px 0 $ACTIVECOLOR5;
                    border-radius: 4px;
                    border: 1px solid $ACTIVECOLOR;
                    color: $WHITE;
                }
            }
        }
    }
    .mask {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 50001;
        background: rgba(0,0,0,.5);
    }
}
</style>