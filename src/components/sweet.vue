<template>
  <div class="noallow">
    <p>抱歉您的浏览器版本太低了，请升级到ie11或者采用chrome、360极速浏览器浏览</p>
    <a href="/static/sofwore/ChromeSetup.exe">点击下载谷歌浏览器</a>
  </div>
</template>

<script>
export default {
  name: 'noallow',
  data () {
    return {
  		
    }
  },
  mounted(){
    document.title = "抱歉提示"; 
  }
}
</script>
<style scoped lang="scss">
  .noallow{
    padding-top: 100px;
    img{
      display:block;
      margin:20px auto;
    }
    p{
      text-align:center;
    }
    a{
      text-align:center;
      display:block;
      margin:50px auto;
      background:#ff503f;
      border-radius:4px;
      color:#fff;
      width:150px;
      height: 35px;
      line-height: 35px;
      cursor: pointer;
    }
  }
</style>
