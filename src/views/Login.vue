<template>
  <div class="login-bg">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model.trim="ruleForm.username" autocomplete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off" @keyup.enter.native="handleSubmit" placeholder="密码"></el-input  >
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="loading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    var validateAccount = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error("请输入账号"));
      } else if (!/^[1-9]\d{10}$/.test(value.trim())) {
        callback(new Error("账号格式错误"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ required: true, validator: validateAccount }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checked: true
    };
  },
  mounted() {},
  methods: {
    // 重置按鈕事件
    handleReset() {
      this.$refs.ruleForm.resetFields();
    },
    // 登录按钮事件
    handleSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let body = {
            username: this.ruleForm.username,
            password: this.ruleForm.password
          };
          this.$api
            .login(body)
            .finally(() => {
              this.loading = false;
            })
            .then(data => {
              console.log(data);
              let { params } = data;
              sessionStorage.setItem("token", params.token);
              let redirect = decodeURIComponent(
                this.$route.query.redirect || "/change"
              );
              console.log(redirect);
              this.$router.push({
                path: redirect
              });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-bg {
  width: 100%;
  height: 100%;
  background-image: url("https://jizui.oss-cn-shenzhen.aliyuncs.com/admin/images/adminbg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-color: #fff;
  overflow: hidden;
  background-position: center center;
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.0);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto 0;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: rgba(255, 255, 255, 0.3);
    border: 1px solid #eaeaea;
    box-shadow: 0 0 5px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      font-size: 26px;
      color: #000;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
}
</style>
