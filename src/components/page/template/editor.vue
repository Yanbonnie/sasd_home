<template>
	<div class="tpl">
		<h1 class="h1" @click='getStr'>电子模板</h1>
		 
		<div contenteditable="true" v-html='refDiv' ref='ue' style='width: 100%;min-height:400px;border: 1px solid #000;font-size: 16px;'></div>
		<div class="btns" style='margin-top: 50px;'>
			
		    <button @click='ueCont'>获取内容</button>
		    
		    <button @click='addInput'>添加下划线</button>

		    <button @click='addImg'>添加签章</button>
		</div>
 
	    <div v-html='refDiv' @click='nextClickFn' style='border: 1px solid #000;'></div>

	    <button>安装</button>
	    <input v-input placeholder="请输入" />

	</div>
</template>
<script>
// import Vue from 'vue'
// import VueUEditor from '../components/UEditor.vue';

export default {

	name: 'tpl',
	components: {
		// VueUEditor
	},

	directives: { //自定义命令
	    drag: {
	    	inserted(el) {
		        let oDiv = el;
	    		console.log(oDiv);
	    		oDiv.onFocus = function(e) {
	    			console.log('点击了');
	    		};
	            // oDiv.onmousedown=function(ev){
	            // 	console.log('ev');
	            // 	console.log(ev);
	            // 	console.log('ev');
	            //     var disX=ev.clientX-oDiv.offsetLeft;
	            //     var disY=ev.clientY-oDiv.offsetTop;

	            //     document.onmousemove=function(ev){
	            //         var l=ev.clientX-disX;
	            //         var t=ev.clientY-disY;
	            //         oDiv.style.left=l+'px';
	            //         oDiv.style.top=t+'px';
	            //     };
	            //     document.onmouseup=function(){
	            //         document.onmousemove=null;
	            //         document.onmouseup=null;
	            //     };
	            // };
	    	},
	    	update(el) {
	    		console.log('update');
	    		console.log(el);
	    	}
	    },
	    input: (el)=> {
	    	console.log(el);
	    }
	},
	data() {
		return {
			str: '',
			text: '',
			strAA: '<h1 @click="strAAFn">点击吧</h1>',
			refDiv: '',
		}
	},
	mounted() {
		
	},
	methods: {
		getStr() {
			this.text = this.text.replace(/_+/g, "<input />")
		},

		strAAFn() {
			console.log('strAAFn');

		},
		refHtmlFn() {
			 
			 
			this.refDiv = this.$refs.div;
			 
			console.log(this.refDiv);
			 
		},
		ueCont() {

			this.refDiv = this.$refs.ue.innerHTML;
            console.log(this.refDiv);
		},
		addInput() {
			
			let str = '<textarea name="" placeholder="请输入内容" style="height: 18px;resize:horizontal;white-space:nowrap; border: none;border-bottom: 1px solid #000;font-size: 14px;"></textarea>';
			this.refDiv = this.$refs.ue.innerHTML + str;

			console.log(this.refDiv);


		},
		addImg() {let str = '<img src="https://ss3.baidu.com/-rVXeDTa2gU2pMbgoY3K/it/u=538458695,278428299&fm=202&src=2000&mola=new&crop=v1" width="100px" height="100px"/>';

			this.refDiv = this.$refs.ue.innerHTML + str;

			console.log(this.refDiv);
		},
		inputFn(e) {
			console.log(1);
			console.log(e);
		},
		nextClickFn(e) {
			// console.log('ddd');
			console.log(e);
			// console.log("e.target.nodeName="+e.target.nodeName);
			if(e.target.nodeName == 'TEXTAREA') {
				console.log('e.target');
				// console.log(e.target.value);
				e.target.onchange = function(event) {
					console.log('event');
					console.log(event);
				}
			}else if(e.target.nodeName == 'IMG') {
				console.log("当前src="+e.target.currentSrc);
                e.target.src = 'https://www.baidu.com/img/bd_logo1.png'
			}

		},
	}
}
</script>
<style lang="scss" scoped>
	textarea {
	 	border: none;border-bottom: 1px solid #000;
	}
</style>