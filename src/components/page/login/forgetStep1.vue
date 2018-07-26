<template>
    <section class="forgetStep">
        <div class="forgetBody">
            <div class="form">
                <p class="box">
                    <label for="">账号</label>
                    <input type="text" placeholder="手机号或邮箱" v-model="emilOrPhone" @keyup.enter="nextHandle">
                </p>
                <p class="box">
                    <label for=""></label>
                    <span style="color:#ff503f;">{{tip}}</span>
                </p>
                <!-- <p class="box">
                    <label for="">验证码</label>
                    <input type="text" placeholder="请输入验证码">
                    <span><img id="v_code" src="http://justsign.com.cn/login/getValidityImage?random=11054464333c951202-fe55-4e24-a367-721399306825" alt="验证码"></span>
                </p> -->
            </div>
        </div>
        <div class="forgetFooter">
            <a href="javascript:;" :class="[emilOrPhone.length > 0 ? 'active':'']" @click="nextHandle">下一步</a>
        </div>
    </section>
</template>
<script>
export default {
  name: "step1",
  data() {
    return {
      emilOrPhone: "",
      tip: ""
    };
  },
  methods: {
    nextHandle() {
      const { emilOrPhone } = this;
      this.httpPost(this.URL["isSysEmailOrPhone"],{
          emilOrPhone
        },res =>{
          const { type, isExist } = res.data;
          if (res.meta.success) {
            if (isExist == -1) {
                this.tip = '账号不存在'
            }else{
                if (type == "001"){
                    //手机
                    this.setSData('phone',emilOrPhone)
                    this.$router.push({
                        name: "ForgetStep2"
                    });
                }else{

                }
            }
          } else {
            this.tip = "账号不存在";
          }
        }
      );
    }
  },
  mounted() {}
};
</script>
