<template>
	<div class="right_col">
		<!-- 模态框公共组件 -->
		<!-- <Model></Model>	 -->
		<h3>分页组件</h3>
		<pagination  :total="100" :currentpage="2"></pagination>
		<h3>树形菜单</h3>
		<Dendrogram :treeListData="treeListData"></Dendrogram>
	</div>
</template>

<script>
// import '../assets/css/test.scss';
export default {
	name: 'hello',
	data () {
		return {
			treeListData:[
				{
					title:"数安时代",
					pid:[1,2,3,4],
					children:[
						{
							title:"第二级",
							pid:[1,2,3],
							children:[
								{
									title:'第三级',
									pid:[1]
								}
							]
						}
					]
				},
				{
					title:'广州极米',
					pid:[1,2,3],
					children:[
						{
							title:"技术部",
							pid:[1,1,1,1,1]
						},
						{
							title:"人事部",
							pid:[1,1,1,1,1]
						}
					]
				},
				{
					title:'广东信鉴',
					pid:[]
				}
				
			]
		}
	},
	mounted(){
	}
}
</script>
<style scoped  lang="scss">
	.headerNav{
		display:none !important;
	}
</style>
