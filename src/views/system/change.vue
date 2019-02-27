<template>
  <div class="change-container">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model.trim="ruleForm.oldPassword" type="password" autocomplete="off" placeholder="请输入旧密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model.trim="ruleForm.newPassword" autocomplete="off" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model.trim="ruleForm.checkPass" autocomplete="off" placeholder="请再次输入，以便确认新密码"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        newPassword: "",
        checkPass: "",
        oldPassword: ""
      },
      rules: {
        newPassword: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 修改密码
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let body = {
            newPassword: this.ruleForm.newPassword,
            oldPassword: this.ruleForm.oldPassword
          };
          this.$api
            .updatePwd(body)
            .then(data => {
              console.log(data);
              this.resetForm(formName);
              this.$message({
                message: "修改成功",
                type: "success"
              });
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang='scss' scoped>
.change-container {
  display: flex;
  justify-content: center;
  margin-left: -50px;
  flex-direction: row;
  align-items: center;

  form {
    width: 500px;
    margin-top: 100px;
  }
}
</style>
