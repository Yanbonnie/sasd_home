import dragModelCom from './dragModel.vue';

const dragModel = {
	install:function(Vue){
		Vue.component('dragModel',dragModelCom);
	}
}

export default dragModel;