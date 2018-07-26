import alertComponent from './alert.vue';

const alertModel = {
	install:function(Vue){
		Vue.component('alertModel',alertComponent);
	}
}

export default alertModel;