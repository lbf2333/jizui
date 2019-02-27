<template>
  <div class="upload-img">
    <el-upload class="avatar-uploader" action="" accept="image/*" name="file" :show-file-list="false" :on-change="imgChange" :before-upload="()=>{return false}">
    <img v-if="imageUrl" :src="imageUrl" class="avatar" :onerror="`this.src='${$defaultImg}'`" title='点击更换图片'>
    <i v-else class="el-icon-plus avatar-uploader-icon"  title='点击更换图片'></i>
  </el-upload>
  </div>
</template>

<script>
export default {
  name: "uploadImg",
  components: {},
  props: {
    imageUrl: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    imgChange(file) {
      console.log(file);
      let imageUrl = URL.createObjectURL(file.raw);
      let fd = new FormData();
      fd.append("file", file.raw);
      this.$emit("update:imageUrl", imageUrl);
      this.$emit("getImgFd", fd);
    }
  }
};
</script>

<style lang="scss">
// 上传图片按钮样式
.upload-img{
  .avatar-uploader{
    line-height: 1;
  }
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #409eff;
  }
}
</style>

