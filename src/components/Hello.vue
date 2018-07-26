<template>
	<div class="right_col">
		<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
        <p class="hello">{{msg}}</p>
	</div>
</template>

<script>
// import '../assets/css/test.scss';
export default {
	name: 'hello',
	data () {
		return {
		    msg: 'Welcome to Your Vue.js'
		}
	},
	mounted(){
		$(function(){
			$("input[type=button]").click(function(){
				addTag("em",temText);
			});
			$("#Editor a").mouseup(function(){
				temText=getSelText();
			});
		});
		var temText="";
		function addTag(tagName,textVal){
			var obj  = $("#Editor a");
			var tagHtml = "<"+tagName+">"+textVal+"</"+tagName+">";
			var html = $(obj).html();
			html = html.replace(textVal,tagHtml);
			$(obj).html(html);
		}
		
		function getSelText() {
			return $.browser.msie?document.selection.createRange().text:document.getSelection();
		}
	}
}
</script>
<style scoped  lang="scss">
	.headerNav{
		display:none !important;
	}
</style>
