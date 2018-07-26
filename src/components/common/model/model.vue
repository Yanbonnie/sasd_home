<template>
    <section>
        <div class="mask"></div>
        <section class="comModel" :class="topClass">
        <h3 class="title">提示</h3>
            <div class="text">
                <p v-html="context"></p>
            </div>
    </section>
    </section>
  
</template>
<script>
export default {
  name: "model",
  props: {
    context: {
      //是否自动消失。默认不自动消失，如果要自动消失，请设置：autoClose = 'true'
      type: String,
      default: "我是提示内容"
    },
    topClass: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/css/base.scss";
/*.comModel{
    position: fixed;
    z-index: 10000;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-52%);
    -ms-transform: translate(-50%,-52%);
    background:rgba(0,0,0,0.7);
    color: #fff;
    padding: 20px;
    border-radius:10px;
    -ms-border-radius:10px;
    min-width:150px;
    text-align: center; 
    &.topClass{
        top: 30%;
    }
    &.topClass40{
        top: 40%;
    }
}*/

.comModel {
  z-index: 10000;
  position: fixed;
  padding: 0 20px 25px;
  box-sizing: border-box;
  width: 400px;
  left: 50%;
  top: 20%;
  margin-left: -(400/2) * 1px;
//   margin-top: -110px;
  background: #fff;
  border-radius: 4px;
  .title {
    font-size: 14px;
    font-weight: normal;
    line-height: 30px;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px #dee2ed solid;
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
    span {
      color: $ACTIVECOLOR;
      margin: 0 5px;
    }
  }
  &.topClass {
    top: 30%;
  }
  &.topClass40 {
    top: 40%;
  }
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
}
</style>
