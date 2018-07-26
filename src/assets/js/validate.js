export default {
    isEmpty:function(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "") ? false : true;
    },
    isEmail : function(str) {
        // return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/i.test(str);/^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        return /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(str)
    },
    isPhone : function(str) {
        if(typeof str === 'number'){
            str = str.toString();
        }
        return /^0?1[3|4|5|7|8][0-9]\d{8}$/.test(str);
    },
    isCardNo:function(card){
        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(reg.test(card) === false)
        {
            return  false;
        }else{
            return true;
        }
    },
    isChina:function(str){
        return /^[\u4e00-\u9fa5]/.test(str)
    }
}