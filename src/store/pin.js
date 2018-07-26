module.exports = {
    statePin:{
        setPinState:false,     //设置pin码弹框的状态  
        pinVal:'',            //pin的value 
        pinErr:'',
        pinIndex:0,           //1 发起签约  2-接受授权  3-已实名获取机构托管证书 4-升级证书 1-签署
        upLoadFileState:0,    //是否可以上传文件了  1上传成功  3-机构证书获取成功  4-接受授权成功  5-托管证书升级成功   2统一为失败
        pdfRender:false,
    },
    MutationsPin:{
        changePinState(state,bol){
            state.setPinState = bol;
        },
        changePinVal(state,val){
            state.pinVal = val;
        },
        changePinErr(state,val){
            state.pinErr = val;
        },
        changePinIndex(state,val){
            state.pinIndex = val;
        },
        changeUpLoadFileState(state,val){
            state.upLoadFileState = val;
        },
        changePdfRender(state,bol){
            state.pdfRender = bol;
        }
    }
}