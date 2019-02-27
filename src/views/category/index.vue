<template>
  <section>

    <!-- 工具条 -->
    <el-col :span="24" class="toolbar" >
       <!-- <el-dropdown trigger="click"  @command="changeParent" style="float: left;">
        <el-button type="primary"  class="el-dropdown-link">
          {{currentParent.label}}&nbsp;<i class="el-icon-arrow-down el-iconright"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,key) in parents" :key="key"  :command="item" :disabled="item.value == currentParent.value">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <el-button style="float: right;"  type="primary" @click="handleAdd">新增</el-button>
    </el-col>

    <!-- 列表 -->
    <template>
      <el-table :data="datas"  v-loading="loading" style="width: 100%;">
        <el-table-column prop="id" label="id"  sortable>
        </el-table-column>
        <el-table-column prop="name" label="分类名"  sortable>
        </el-table-column>
        <el-table-column label="操作" sortable >
          <template slot-scope="scope">
             <el-button  size="mini"  type="primary" style="margin:3px;" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button  size="mini"  type="danger" style="margin:5px;" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页条 -->
      <div class="block">
        <el-pagination background  @current-change="pageChange" :total="maxSize" :page-size="size" :current-page="page">
        </el-pagination>
      </div>
    </template>
    
    <!-- 新增分类 -->
    <el-dialog :title="`新增分类`"  class="" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form  :model="addForm" label-width="130px"  :rules="formRules"  ref="addForm" @submit.prevent.native >
        <el-form-item label="分类名"  prop="name">
          <el-input  v-model="addForm.name"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addFormLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 编辑分类 -->
    <el-dialog title="编辑分类" class="" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form  :model="editForm" label-width="130px"  :rules="formRules"  ref="editForm" @submit.prevent.native >
        <el-form-item label="分类名"  prop="name">
          <el-input  v-model="editForm.name"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editFormLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      datas: [],
      currentData: {},
      maxSize: 0,
      size: 6, //每页显示数据的条数
      page: 1, //当前页码
      formRules: {
        name: [{ required: true, message: "请输入分类名" }]
      },
      addFormVisible: false,
      addFormLoading: false,
      addForm: {
        name: "",
        parent: 1
      },
      editFormVisible: false,
      editFormLoading: false,
      editForm: {
        id: 0,
        name: "",
        parent: 1
      },
      currentParent: {
        value: 1,
        label: "杂志"
      },
      parents: [
        {
          value: 1,
          label: "杂志"
        },
        {
          value: 2,
          label: "教辅"
        }
      ]
    };
  },
  mounted() {
    this.getDatas();
  },
  watch: {},
  components: {},
  methods: {
    //初始化
    init() {
      this.page = 1;
      this.maxSize = 0;
      this.datas = [];
    },
    // 点击了不同的页数
    pageChange(val) {
      this.page = val;
      this.getDatas();
    },
    changeParent(type) {
      this.currentParent = type;
      this.init();
      this.getDatas();
    },
    // 获取数据
    getDatas() {
      let params = {
        page: this.page,
        size: this.size,
        parent: this.currentParent.value
      };
      this.loading = true;
      this.$api
        .getCategorys(params)
        .then(res => {
          this.datas = res.params.categories;
          if (this.page == 1) {
            this.maxSize = res.params.totalCount;
          }
        })
        .catch(error => {
          console.log(error);
          if (Number(error.info) == 4) {
            this.init();
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleAdd() {
      if (this.$refs.addForm !== undefined) {
        this.$refs.addForm.resetFields();
      }
      this.addFormVisible = true;
      this.addForm = {
        name: "",
        parent: this.currentParent.value
      };
    },
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addFormLoading = true;
            let body = {
              name: this.addForm.name,
              parent: this.addForm.parent
            };
            this.$api
              .addCategory(body)
              .then(() => {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.addFormVisible = false;
                this.getDatas();
              })
              .catch(error => {
                console.log(error);
              })
              .finally(() => {
                this.addFormLoading = false;
              });
          });
        }
      });
    },
    handleEdit(row) {
      if (this.$refs.editForm !== undefined) {
        this.$refs.editForm.resetFields();
      }
      this.editFormVisible = true;
      this.editForm = {
        id: row.id,
        name: row.name
      };
    },
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editFormLoading = true;
            let urlParams = {
              categoryId: this.editForm.id
            };
            let body = {
              name: this.editForm.name
            };
            this.$api
              .editCategory({ urlParams, body })
              .then(() => {
                this.$message({
                  message: "编辑成功",
                  type: "success"
                });
                this.editFormVisible = false;
                this.getDatas();
              })
              .catch(error => {
                console.log(error);
              })
              .finally(() => {
                this.editFormLoading = false;
              });
          });
        }
      });
    },
    //删除分类
    handleDel(row) {
      this.$confirm("确实删除该分类吗", "提示", {
        type: "warning"
      })
        .then(() => {
          let urlParams = {
            categoryId: row.id
          };
          this.$api
            .delCategory(urlParams)
            .then(() => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              if (this.datas.length == 1 && this.page != 1) {
                this.page--;
              }
              this.getDatas();
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
