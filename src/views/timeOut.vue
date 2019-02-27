<template>
  <div class="error-page">
      <div class="error-code">请求超时</div>
      <div class="error-desc">请稍后再试</div>
      <div class="error-handle">
        <el-button class="error-btn" type="primary" size="large" @click="goBack">重新登录</el-button>
      </div>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.push({
        path: "login"
      });
    }
  }
};
</script>


<style scoped>
.error-page {
  text-align: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 110px;
}
.error-code {
  font-size: 100px;
  font-weight: bold;
  color: #2d8cf0;
}
.error-desc {
  margin-top: 50px;
  font-size: 30px;
  color: #777;
}
.error-handle {
  margin-top: 30px;
  padding-bottom: 200px;
}
</style>
