<template>
	<div class="pagination-box" v-show="page > 1">
		<ul class="pagination clf">
			<li :class="{'disabled': current == 1}"><a href="javascript:;" @click="setCurrent(1)"> 首页 </a></li>
			<li :class="{'disabled': current == 1 }" v-show="isShowPreNex == 0"><a href="javascript:;" @click="setCurrent(current - 1)"> 上一页 </a></li> 
			<li v-for="(p,index) in grouplist" :class="{'active': current == p.val}" :key="index">
				<a href="javascript:;" @click="setCurrent(p.val)"> {{ p.text }} </a>
			</li>
			<li :class="{'disabled': current == page }" v-show="isShowPreNex == 0"><a href="javascript:;" @click="setCurrent(current + 1)"> 下一页</a></li>
			<li :class="{'disabled': current == page}"><a href="javascript:;" @click="setCurrent(page)"> 尾页 </a></li>
		</ul>
		<!--<ul class="pagination pull-right">
			<li><span> 共 {{ total }}  条数据 </span></li>			
			<li><span> 每页显示 {{ display }}  条数据 </span></li>
			<li><span> 共 {{ page }} 页 </span></li>
			<li><span> 当前第 {{ current }} 页 </span></li>
		</ul>-->
	</div>
</template>

<script>

export default {
  name: 'pagination',
  props: {
		total: {			// 数据总条数
			type: Number,
			default: 0
		},
		display: {			// 每页显示条数
			type: Number,
			default: 10
		},
		currentpage: {			// 当前页码
			type: Number,
			default: 1
		},
		pagegroup: {		// 分页条数 -- 奇数
			type: Number,
			default: 5,
			coerce:function(v){
				v = v > 0 ? v : 5;
				return v % 2 === 1 ? v : v + 1;
			}
		},
		//add
		isShowPreNex:{
			type:Number,
			default:0
		}
	},
	data() {
		return {
			current: this.currentpage
		}
	},
	computed: {
		page:function() { // 总页数
			return Math.ceil(this.total / this.display);
		},
		grouplist:function(){ // 获取分页页码
			var len = this.page , temp = [], list = [], count = Math.floor(this.pagegroup / 2) ,center = this.current;
			if( len <= this.pagegroup ){
				while(len--){ temp.push({text:this.page-len,val:this.page-len});};
				return temp;
			}
			while(len--){ temp.push(this.page - len);};
			var idx = temp.indexOf(center);            	
			(idx < count) && ( center = center + count - idx); 
			(this.current > this.page - count) && ( center = this.page - count);
			temp = temp.splice(center - count -1, this.pagegroup);            	
			do {
				var t = temp.shift();
				list.push({
					text: t,
					val: t
				});
			}while(temp.length);            	
			if( this.page > this.pagegroup ){
				(this.current > count + 1) && list.unshift({ text:'...',val: list[0].val - 1 });
				(this.current < this.page - count) && list.push({ text:'...',val: list[list.length - 1].val + 1 });
			}
			return list;
		}
	},
	methods: {
		setCurrent: function(idx) {
			if( this.current != idx && idx > 0 && idx < this.page + 1) {
				this.current = idx;
				this.$emit('pagechange',idx);               	
			}else{
					this.current = idx;
			}          
		}
	},
	mounted(){
		this.CUSTOMEVENT.$on('tip2',function(a){
      this.setCurrent(a)
    }.bind(this));
	}
}
</script>
<style scoped lang="scss">
@import '../../../assets/css/base.scss';
.pagination-box{height:30px;margin-top:3px;}
.pagination {
  display: block;
  padding-left: 0;
  border-radius: 4px;
}
.pagination > li {
  display: inline !important;
}
.pagination > li > a,
.pagination > li > span {
  position: relative;
  float: left;
	padding: 3px 8px !important;
	margin: 0 5px;
  line-height: 1.42857143;
  color: #4B4B4B;
  text-decoration: none;
  background-color: #fff;
	// border: 1px solid #ddd;
	border-radius: 4px;
}
.pagination > li:first-child > a,
.pagination > li:first-child > span {
  margin-left: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.pagination > li:last-child > a,
.pagination > li:last-child > span {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.pagination > li > a:hover,
.pagination > li > span:hover
// .pagination > li > a:focus,
// .pagination > li > span:focus 
{
  z-index: 2;
  color: #23527c;
  background-color: #eee;
  border-color: #ddd;
}
.pagination > .active > a,
.pagination > .active > span,
.pagination > .active > a:hover,
.pagination > .active > span:hover
// .pagination > .active > a:focus,
// .pagination > .active > span:focus 
{
  z-index: 3;
  color: #fff;
  cursor: default;
  background-color: #fff;
  border-color: #ddd;
  color:$ACTIVECOLOR !important;
}
.pagination > .disabled > span,
.pagination > .disabled > span:hover,
// .pagination > .disabled > span:focus,
.pagination > .disabled > a,
.pagination > .disabled > a:hover
// .pagination > .disabled > a:focus 
{
  color: #ccc;
  cursor: not-allowed;
  background-color: #fff;
  border-color: #ddd;
}
</style>
