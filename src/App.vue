<template>
  <div id="app">
    <transition name="fade"
                mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {}
};
</script>

<style lang="scss">

body {
  margin: 0px;
  padding: 0px;
  /*background: url(assets/bg1.jpg) center !important;
    background-size: cover;*/
  // background: #1F2D3D;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}

#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}

.el-submenu [class^="fa"] {
  vertical-align: baseline;
  margin-right: 10px;
}

.el-menu-item [class^="fa"] {
  vertical-align: baseline;
  margin-right: 10px;
}

.toolbar {
  background: #f2f2f2;
  padding: 10px;
  //border:1px solid #dfe6ec;
  margin: 10px 0px;
  .el-form-item {
    margin-bottom: 10px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

/* 增加功能样式 */

// 导航条可滚动操作
.menu-scrollbar {
  height: 100%;
  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
  .el-scrollbar__view {
    height: 100%;
  }
}

// 穿梭栏
.el-transfer{
  text-align:center;
}
.el-transfer-panel{
  text-align:left;
}

// 表格展开详情
.demo-table-expand {
  font-size: 0;
  label {
    width: 80px;
    color: #99a9bf;
  }
  .el-form-item {
    &:last-child {
      // width: 100%;
    }
    margin-right: 40px;
    min-width: 40%;
    max-width: 100%;
  }
}


/* 新增样式规则*/
.block {
  text-align: center;
  margin-top: 40px;
}


// 弹窗距离顶部距离
.dialog-5-top{
  .el-dialog {
    margin-top: 5vh!important;
  }
  
}

// 弹窗宽度
.dialog-70-width {
  .el-dialog {
    width: 70%;
  }
}

// logo显示样式(未上传时显示方块，上传后显示图片固定比例)
.logo {
  .avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px !important;
    text-align: center;
  }
  .avatar {
    max-width: 100%;
    max-height: 200px;
    display: block;
  }
}

// 直接显示一个form
.only-form {
  flex: none;
  overflow: hidden;
  min-width: 500px;
  margin: 50px auto 0;
  width: 50%;
  border: 1px solid #ccc;
  padding: 50px;
}

//去除type=number的加减箭头
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
input[type="number"]{
  -moz-appearance: textfield;
}
</style>
