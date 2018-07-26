<template>
  <div class="noallow">
    <p>您所访问的页面不存在</p>
    <router-link to="/welcome/index">跳转到首页</router-link>
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
    document.title = "404"; 
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
