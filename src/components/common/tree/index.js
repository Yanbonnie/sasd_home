import TreeComponent from './tree.vue';

const Tree = {
	install:function(Vue){
		Vue.component('Tree',TreeComponent);
	}
}

export default Tree;