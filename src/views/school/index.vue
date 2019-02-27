<template>
  <section>

    <!-- 工具条 -->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;" >
      <el-form :inline="true" style="float: left;"  @submit.prevent.native> 
        <el-form-item>
          <el-input v-model.trim="search.key"  @keyup.enter.native="handleSearch" placeholder="学校名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <location  style="float: left;padding-bottom: 10px;" :province.sync="province" :city.sync="city" :district.sync="district" @selectChange="citySearch"></location>
      <el-button style="float: right;padding-bottom: 10px;"  type="primary" @click="handleAdd">新增</el-button>
    </el-col>

    <!-- 列表 -->
    <template>
      <el-table :data="datas"  v-loading="loading" style="width: 100%;">
        <el-table-column prop="id" label="id"  sortable width="150">
        </el-table-column>
        <el-table-column prop="name" label="学校名"  sortable>
        </el-table-column>
        <el-table-column prop="address" label="地址"  sortable>
        </el-table-column>
        <el-table-column prop="scanCount" label="扫码次数" width="120" sortable>
        </el-table-column>
        <el-table-column label="操作" sortable >
          <template slot-scope="scope">
            <el-button  size="mini"  type="primary" style="margin:3px;" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button  size="mini"  type="danger" style="margin:5px;" @click="handleDel(scope.row)">删除</el-button>
            <el-button  size="mini"  type="info" style="margin:3px;" @click="handleSeeCode(scope.row)">查看二维码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页条 -->
      <div class="block">
        <el-pagination background  @current-change="pageChange" :total="maxSize" :page-size="size" :current-page="page">
        </el-pagination>
      </div>
    </template>
    
    <!-- 新增学校 -->
    <el-dialog :title="`新增学校`" :visible.sync="addFormVisible" class="dialog-70-width dialog-5-top" :close-on-click-modal="false">
      <el-form  :model="addForm" label-width="130px"  :rules="formRules"  ref="addForm" @submit.prevent.native >
        <el-form-item label="学校名"  prop="name">
          <el-input  v-model="addForm.name"> </el-input>
        </el-form-item>
        <el-form-item label="省市区"  prop="location">
          <location v-if="addFormVisible" :province.sync="addForm.location.province" :city.sync="addForm.location.city" :district.sync="addForm.location.district" @selectChange="selectLocation"  :isClear="false" ></location>
        </el-form-item>
        <el-form-item label="详细地址"  prop="detail">
          <el-input  v-model="addForm.detail"> </el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-checkbox-group v-model="addForm.history" :min="1" @change="(value)=>{return historyChange(1,value)}">
            <el-checkbox v-for="history in historys":label="history.value" :key="history.value">{{history.label}}</el-checkbox>
          </el-checkbox-group>
          <div class="primary" style="float:left; margin-right: 30px;">
            <div v-for="(grade,index) in addForm.grades" :key="index" style="margin:3px 10px 0 0;"  v-if="grade.grade <= 6">
              <span>{{grade.grade | grade}}，最多有几个班：</span><el-input-number size="mini" v-model="addForm.grades[index].maxClass":min="1"  :max="30" :precision="0"></el-input-number>
            </div>
          </div>
          <div class="junior" style="float:left;">
            <div v-for="(grade,index) in addForm.grades" :key="index" style="margin:3px 10px 0 0;"  v-if="grade.grade > 6 &&grade.grade <= 9 ">
              <span>{{grade.grade | grade}}，最多有几个班：</span><el-input-number  size="mini" v-model="addForm.grades[index].maxClass":min="1"  :max="30" :precision="0"></el-input-number>
            </div>
          </div>
          <div class="highs" style="float:left;">
            <div v-for="(grade,index) in addForm.grades" :key="index" style="margin:3px 10px 0 0;"  v-if="grade.grade > 9 ">
              <span>{{grade.grade | grade}}，最多有几个班：</span><el-input-number  size="mini" v-model="addForm.grades[index].maxClass":min="1"  :max="30" :precision="0"></el-input-number>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addFormLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 编辑学校 -->
    <el-dialog title="编辑学校" class="dialog-70-width dialog-5-top" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form  :model="editForm" label-width="130px"  :rules="formRules"  ref="editForm" @submit.prevent.native >
        <el-form-item label="学校名"  prop="name">
          <el-input  v-model="editForm.name"> </el-input>
        </el-form-item>
        <el-form-item label="省市区"  prop="location">
          <location v-if="editFormVisible" :province.sync="editForm.location.province" :city.sync="editForm.location.city" :district.sync="editForm.location.district" @selectChange="selectLocation"  :isClear="false" ></location>
        </el-form-item>
        <el-form-item label="详细地址"  prop="detail">
          <el-input  v-model="editForm.detail"> </el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-checkbox-group v-model="editForm.history" :min="1" @change="(value)=>{return historyChange(2,value)}">
            <el-checkbox v-for="history in historys":label="history.value" :key="history.value">{{history.label}}</el-checkbox>
          </el-checkbox-group>
          <div class="primary" style="float:left; margin-right: 30px;">
            <div v-for="(grade,index) in editForm.grades" :key="index" style="margin:3px 10px 0 0;"  v-if="grade.grade <= 6">
              <span>{{grade.grade | grade}}，最多有几个班：</span><el-input-number size="mini" v-model="editForm.grades[index].maxClass":min="1" :max="30" :precision="0"></el-input-number>
            </div>
          </div>
          <div class="junior" style="float:left;">
            <div v-for="(grade,index) in editForm.grades" :key="index" style="margin:3px 10px 0 0;"  v-if="grade.grade > 6 &&grade.grade<= 9 ">
              <span>{{grade.grade | grade}}，最多有几个班：</span><el-input-number  size="mini" v-model="editForm.grades[index].maxClass":min="1" :max="30" :precision="0"></el-input-number>
            </div>
          </div>
          <div class="highs" style="float:left;">
            <div v-for="(grade,index) in editForm.grades" :key="index" style="margin:3px 10px 0 0;"  v-if="grade.grade > 9">
              <span>{{grade.grade | grade}}，最多有几个班：</span><el-input-number  size="mini" v-model="editForm.grades[index].maxClass":min="1" :max="30" :precision="0"></el-input-number>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editFormLoading">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看二维码" class="see-code" :visible.sync="seeCodeVisible" :close-on-click-modal="false">
      <img :src="seeCodeUrl" alt="">
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="seeCodeVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import location from "@/components/location";
export default {
  data() {
    let validateLocation = (rule, value, callback) => {
      console.log(value);
      if (!value.province && !value.city && !value.district) {
        callback(new Error("请选择省市区"));
      } else if (!value.province || !value.province.id) {
        callback(new Error("请选择省"));
      } else if (!value.city || !value.city.id) {
        callback(new Error("请选择市"));
      } else if (!value.district || !value.district.id) {
        callback(new Error("请选择区"));
      } else {
        callback();
      }
    };
    return {
      search: {
        key: null
      },
      currentSearch: {
        key: null
      },
      loading: false,
      datas: [],
      currentData: {},
      maxSize: 0,
      size: 5, //每页显示数据的条数
      page: 1, //当前页码
      province: null,
      city: null,
      district: null,
      historys: [
        {
          value: 0,
          label: "小学"
        },
        {
          value: 1,
          label: "初中"
        },
        {
          value: 2,
          label: "高中"
        }
      ],
      primarys: [
        {
          grade: 1,
          maxClass: 1
        },
        {
          grade: 2,
          maxClass: 1
        },
        {
          grade: 3,
          maxClass: 1
        },
        {
          grade: 4,
          maxClass: 1
        },
        {
          grade: 5,
          maxClass: 1
        },
        {
          grade: 6,
          maxClass: 1
        }
      ],
      juniors: [
        {
          grade: 7,
          maxClass: 1
        },
        {
          grade: 8,
          maxClass: 1
        },
        {
          grade: 9,
          maxClass: 1
        }
      ],
      highs: [
        {
          grade: 10,
          maxClass: 1
        },
        {
          grade: 11,
          maxClass: 1
        },
        {
          grade: 12,
          maxClass: 1
        }
      ],
      formRules: {
        name: [{ required: true, message: "请输入学校名" }],
        detail: [{ required: true, message: "请输入详细地址" }],
        location: [
          { required: true, validator: validateLocation, trigger: "change" }
        ]
      },
      addFormVisible: false,
      addFormLoading: false,
      addForm: {
        name: "",
        location: {
          province: null,
          city: null,
          district: null
        },
        detail: "",
        grades: [],
        history: [0]
      },
      editFormVisible: false,
      editFormLoading: false,
      editForm: {
        id: 0,
        name: "",
        location: {
          province: null,
          city: null,
          district: null
        },
        detail: "",
        grades: [],
        history: [0]
      },
      seeCodeVisible: false,
      seeCodeUrl: ""
    };
  },
  mounted() {
    this.getDatas();
  },
  watch: {},
  components: {
    location
  },
  filters: {
    grade: function(value) {
      switch (value) {
        case 1:
          return "一年级";
        case 2:
          return "二年级";
        case 3:
          return "三年级";
        case 4:
          return "四年级";
        case 5:
          return "五年级";
        case 6:
          return "六年级";
        case 7:
          return "初一";
        case 8:
          return "初二";
        case 9:
          return "初三";
        case 10:
          return "高一";
        case 11:
          return "高二";
        case 12:
          return "高三";
      }
    }
  },
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
      this.search.key = this.currentSearch.key || null;
      this.getDatas();
    },
    changeParent(type) {
      this.currentParent = type;
      this.init();
      this.getDatas();
    },
    citySearch() {
      this.init();
      this.getDatas();
    },
    handleSearch() {
      this.init();
      this.currentSearch.key = this.search.key;
      this.getDatas();
    },
    // 获取数据
    getDatas() {
      let params = {
        page: this.page,
        size: this.size,
        name: this.currentSearch.key || null,
        provinceId: this.province ? this.province.id : null,
        cityId: this.city ? this.city.id : null,
        districtId: this.district ? this.district.id : null
      };
      this.loading = true;
      this.$api
        .getSchools(params)
        .then(res => {
          this.datas = res.params.schools;
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
        location: {
          province: null,
          city: null,
          district: null
        },
        detail: "",
        grades: [...this.primarys],
        history: [0]
      };
    },
    selectLocation() {},
    historyChange(type, value) {
      console.log(type, value);
      if (type == 1) {
        this.addForm.history = value;
        this.addForm.grades = [];
        if (value.indexOf(0) != -1) {
          this.addForm.grades.push(...this.primarys);
        }
        if (value.indexOf(1) != -1) {
          this.addForm.grades.push(...this.juniors);
        }
        if (value.indexOf(2) != -1) {
          this.addForm.grades.push(...this.highs);
        }
      } else {
        this.editForm.history = value;
        this.editForm.grades = [];
        if (value.indexOf(0) != -1) {
          this.editForm.grades.push(...this.primarys);
        }
        if (value.indexOf(1) != -1) {
          this.editForm.grades.push(...this.juniors);
        }
        if (value.indexOf(2) != -1) {
          this.editForm.grades.push(...this.highs);
        }
      }
    },
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            console.log(this.addForm);
            this.addFormLoading = true;
            let body = {
              name: this.addForm.name,
              province: this.addForm.location.province.name,
              provinceId: this.addForm.location.province.id,
              city: this.addForm.location.city.name,
              cityId: this.addForm.location.city.id,
              district: this.addForm.location.district.name,
              districtId: this.addForm.location.district.id,
              detail: this.addForm.detail,
              grades: this.addForm.grades
            };
            this.$api
              .addSchool(body)
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
      this.currentData = row;
      this.getData();
    },
    // 获取单个数据
    getData() {
      let urlParams = {
        schoolId: this.currentData.id
      };
      this.$api
        .getSchool(urlParams)
        .then(res => {
          let data = res.params.school;
          let history = [];
          let index = data.grades.findIndex(value => {
            return value.grade == 1;
          });
          if (index != -1) {
            history.push(0);
          }
          index = data.grades.findIndex(value => {
            return value.grade == 7;
          });
          if (index != -1) {
            history.push(1);
          }
          index = data.grades.findIndex(value => {
            return value.grade == 10;
          });
          if (index != -1) {
            history.push(2);
          }
          this.editForm = {
            id: data.id,
            name: data.name,
            location: {
              province: {
                id: data.provinceId,
                name: data.province
              },
              city: {
                id: data.cityId,
                name: data.city
              },
              district: {
                id: data.districtId,
                name: data.district
              }
            },
            detail: data.detail,
            grades: data.grades,
            history: history
          };
          console.log(this.editForm);
        })
        .catch(error => {
          console.log(error);
        });
    },
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editFormLoading = true;
            let urlParams = {
              schoolId: this.editForm.id
            };
            let body = {
              name: this.editForm.name,
              province: this.editForm.location.province.name,
              provinceId: this.editForm.location.province.id,
              city: this.editForm.location.city.name,
              cityId: this.editForm.location.city.id,
              district: this.editForm.location.district.name,
              districtId: this.editForm.location.district.id,
              detail: this.editForm.detail,
              grades: this.editForm.grades
            };
            this.$api
              .editSchool({ urlParams, body })
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
    //删除学校
    handleDel(row) {
      this.$confirm("确实删除该学校吗", "提示", {
        type: "warning"
      })
        .then(() => {
          let urlParams = {
            schoolId: row.id
          };
          this.$api
            .delSchool(urlParams)
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
    },
    handleSeeCode(row) {
      this.seeCodeVisible = true;
      this.seeCodeUrl = row.qrCodeUrl;
      // this.seeCodeUrl = `https://dushiren.oss-cn-shenzhen.aliyuncs.com/qrcode/school/${
      //   row.id
      // }.jpg`;
    }
  }
};
</script>

<style lang="scss" scoped>
.see-code{
  img{
    display: block;
    width: 430px;
    height: 430px;
    margin: auto;
  }
}
</style>
