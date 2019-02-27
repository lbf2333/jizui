<template>
  <section class="card">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" @submit.prevent.native>
        <el-form-item>
          <el-input v-model.trim="search.key"  @keyup.enter.native="handleSearch" placeholder="订单号">
            <template slot="prepend">100000</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
            <el-dropdown trigger="click"  @command="changeStatus" style="margin-right: 10px;float: left;">
        <el-button type="primary"  class="el-dropdown-link">
          {{currentStatus.label}}&nbsp;<i class="el-icon-arrow-down el-iconright"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="{ value: null, label: '全部状态'}" :disabled="!currentStatus.value">全部状态</el-dropdown-item>
          <el-dropdown-item v-for="(item,key) in statuses" :key="key"  :command="item" :disabled=" currentStatus.value && item.value == currentStatus.value">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
        </el-form-item>
        <!-- 开始时间跟结束时间筛选 -->
        <el-form-item  style="float: right;">
          <el-date-picker
            v-model="filterTime.startTime"
            type="date"  :editable="false"  @change="selectTime"
            placeholder="选择开始日期" value-format="yyyy-MM-dd HH:mm:ss" style="width:150px;"> 
          </el-date-picker>
          -
          <el-date-picker
            v-model="filterTime.endTime" @change="selectTime"
            type="date"  style="width:150px;" value-format="yyyy-MM-dd HH:mm:ss" :editable="false" 
            placeholder="选择结束日期"> 
          </el-date-picker>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="datas"  v-loading="loading" style="width: 100%;">
         <el-table-column type="expand" >
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="家长姓名">
                <span>{{ props.row.subscriberParentName|| '暂无'}}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ props.row.subscriberParentMobile|| '暂无'}}</span>
              </el-form-item>
              <el-form-item label="学生姓名">
                <span>{{ props.row.subscriberName|| '暂无'}}</span>
              </el-form-item>
              <el-form-item label="学校">
                <span>{{ props.row.subscriberSchool || '暂无'}}</span>
              </el-form-item>
               <el-form-item label="班级">
                <span>{{ props.row.subscriberClass || '暂无'}}</span>
              </el-form-item>
              <el-form-item label="地址">
                <span>{{ props.row.subscriberAddress || '暂无'}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="id"  sortable>
        </el-table-column>
        <el-table-column prop="orderNo" label="订单号" min-width="150"  sortable>
        </el-table-column>
         <el-table-column prop="price" label="金额(￥)" min-width="100" :formatter="formatMoney"  sortable>
        </el-table-column>
        <el-table-column prop="status" v-if="!currentStatus.value" label="状态" min-width="80" :formatter="formatState"  sortable>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="150" :formatter="formatTime"  sortable>
        </el-table-column>
        <el-table-column prop="payTime" label="支付时间" width="150" :formatter="formatTime"  sortable>
        </el-table-column>
        <el-table-column label="操作"  fixed="right" sortable min-width="100">
          <template slot-scope="scope">
             <el-button  size="mini"  type="primary" style="margin:3px;" @click="handleDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <div class="block">
        <el-pagination background  @current-change="pageChange" :total="maxSize" :page-size="size" :current-page="page">
        </el-pagination>
      </div>
    </template>

    <!-- 编辑学校 -->
    <el-dialog title="订单详情" class="dialog-70-width dialog-5-top" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form  :model="editForm" label-width="130px" class="order-detail" :rules="formRules"  ref="editForm" @submit.prevent.native >
        <el-form-item label="订单号">
          <el-input  :value="editForm.orderNo" disabled> </el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input  :value="formatState({},{},editForm.status)" disabled> </el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input  :value="formatTime({},{},editForm.createTime)" disabled> </el-input>
        </el-form-item>
        <el-form-item label="支付时间">
          <el-input  :value="formatTime({},{},editForm.payTime)" disabled> </el-input>
        </el-form-item>
				<el-form-item label="备注">
          <el-input  type="textarea" :rows="2"  v-model="editForm.remark" :disabled="!isEdit"></el-input>
        </el-form-item>
         <el-form-item label="学生姓名" prop="subscriberName">
          <el-input  v-model="editForm.subscriberName" :disabled="!isEdit"></el-input>
        </el-form-item>
         <el-form-item label="家长姓名" prop="subscriberParentName">
          <el-input  v-model="editForm.subscriberParentName" :disabled="!isEdit"> </el-input>
        </el-form-item>
        <el-form-item label="家长手机" prop="subscriberParentMobile">
          <el-input  v-model="editForm.subscriberParentMobile" :disabled="!isEdit"> </el-input>
        </el-form-item>
        <el-form-item label="收货地址" required>
          <el-input   v-if="!isEdit" :value="editForm.subscriberAddress" disabled> </el-input>
          <div class="edit-address"  v-else>
            <template>
              <div>
                <el-radio  v-model="editForm.addressType" :label="1">学校</el-radio>
                <el-radio  v-model="editForm.addressType" :label="2">私人地址</el-radio>
              </div>
              <template v-if="editForm.addressType == 1&&editForm.school">
                <location  :province.sync="editForm.school.location.province" :city.sync="editForm.school.location.city" :district.sync="editForm.school.location.district" @selectChange="selectLocation"  :isClear="false" ></location>
                <div style="float:left;" >
                  <el-select v-model="editForm.school.id" @change="selectSchool"  value-key="id"  placeholder="选择学校">
                    <el-option
                      v-for="item in editForm.school.schools"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-model="editForm.school.grade" v-if="editForm.school.id" @change="selectGrade"  placeholder="选择年级">
                    <el-option
                      v-for="item in editForm.school.grades"
                      :key="item.grade"
                      :label="grades[item.grade-1]"
                      :value="item.grade">
                    </el-option>
                  </el-select>
                  <el-select v-model="editForm.school.klass" v-if="editForm.school.id&&editForm.school.grades[editForm.school.grade-1]"  placeholder="选择班级">
                    <el-option
                      v-for="item in editForm.school.grades[editForm.school.grade-1].maxClass"
                      :key="item"
                      :label="klasses[item-1]"
                      :value="item">
                    </el-option>
                  </el-select>
                </div>
              </template>
              <template v-else>
                 <el-input  v-model="editForm.address"> </el-input>
              </template>
            </template>
          </div>
        </el-form-item>
      </el-form>
      <el-table :data="editForm.orderItemVos" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center'}" border style="width: 100%">
        <el-table-column prop="magazineName" label="杂志名称">
        </el-table-column>
        <el-table-column prop="subscribePlan" label="订阅方案">
        </el-table-column>
        <el-table-column label="起止时间" :formatter="formatDateRange">
        </el-table-column>
        <el-table-column prop="price" label="价格(￥)"  :formatter="formatMoney">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <template v-if="!isEdit">
          <el-button  type="primary" @click.native="handleEdit">编辑</el-button>
          <el-button  @click.native="editFormVisible = false">关闭</el-button>
        </template>
        <template v-else>
          <el-button @click.native="handleCancel">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editFormLoading">提交</el-button>
        </template>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { validatePhone } from "@/assets/js/utils";
import filters from "@/filters";
import location from "@/components/location";
export default {
  data() {
    return {
      search: {
        key: null
      },
      filterTime: {
        startTime: null,
        endTime: null
      },
      currentSearch: {
        key: null
      },
      currentStatus: {
        value: null,
        label: "全部状态"
      },
      statuses: [
        {
          value: 1,
          label: "未付款"
        },
        {
          value: 2,
          label: "已付款"
        },
        {
          value: 4,
          label: "部分发货 "
        },
        {
          value: 5,
          label: "全部发货 "
        }
      ],
      loading: false,
      datas: [],
      maxSize: 0,
      size: 6, //每页显示数据的条数
      page: 1, //当前页码
      currentData: {},
      editForm: {
        school: {
          location: {
            province: null,
            city: null,
            district: null
          }
        }
      },
      isEdit: false,
      formRules: {
        subscriberName: [{ required: true, message: "请输入学生姓名" }],
        subscriberParentName: [{ required: true, message: "请输入家长姓名" }],
        subscriberParentMobile: [{ required: true, validator: validatePhone }]
      },
      editFormLoading: false,
      editFormVisible: false,
      grades: [
        "一年级",
        "二年级",
        "三年级",
        "四年级",
        "五年级",
        "六年级",
        "初一",
        "初二",
        "初三"
      ],
      klasses: [
        "一班",
        "二班",
        "三班",
        "四班",
        "五班",
        "六班",
        "七班",
        "八班",
        "九班",
        "十班"
      ]
    };
  },
  mounted() {
    this.getDatas();
  },
  components: {
    location
  },
  methods: {
    // 时间转化
    formatTime(row, column, value) {
      //console.log(row)
      return filters.formatTime(value);
    },
    // 金额转化
    formatMoney(row, column, value) {
      //console.log(row)
      return filters.formatMoney(value);
    },
    // 状态转化
    formatState(row, column, value) {
      //console.log(row)
      switch (value) {
        case 1:
          return "未付款";
        case 2:
          return "已付款";
        case 3:
          return "待发货";
        case 4:
          return "部分发货";
        case 5:
          return "全部发货";
        case 6:
          return "退款中";
        case 7:
          return "退款完成";
      }
    },
    formatDateRange(row) {
      // console.log(row);
      let startTime = filters.formatTime(row.beginTime, "yyyy-M");
      let endTime = filters.formatTime(row.endTime, "yyyy-M");
      return startTime + "~" + endTime;
    },
    //初始化
    init() {
      this.page = 1;
      this.maxSize = 0;
      this.datas = [];
    },
    // 点击了不同的页数
    pageChange(val) {
      this.page = val;
      this.search.key = this.currentSearch.key;
      this.getDatas();
    },
    // 获取数据
    getDatas() {
      let params = {
        page: this.page,
        size: this.size,
        ...this.filterTime,
        status: this.currentStatus.value,
        orderNo: this.currentSearch.key
          ? "100000" + this.currentSearch.key
          : null
      };
      this.loading = true;
      this.$api
        .getOrders(params)
        .then(res => {
          this.datas = res.params.orders;
          if (this.page == 1) {
            this.maxSize = res.params.totalCount;
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //查询
    handleSearch() {
      this.currentSearch.key = this.search.key || null;
      this.init();
      this.getDatas();
    },
    changeStatus(status) {
      this.currentStatus = status;
      this.init();
      this.getDatas();
    },
    //选择日期
    selectTime() {
      this.init();
      this.search.key = this.currentSearch.key;
      this.getDatas();
    },
    handleDetail(row) {
      if (this.$refs.editForm !== undefined) {
        this.$refs.editForm.resetFields();
      }
      this.getData(row.orderNo);
      this.isEdit = false;
      this.editFormVisible = true;
    },
    // 返回年级
    getGrade(s) {
      let grade = s.substring(0, 2);
      // console.log(grade);
      switch (grade) {
        case "一年":
          return 1;
        case "二年":
          return 2;
        case "三年":
          return 3;
        case "四年":
          return 4;
        case "五年":
          return 5;
        case "六年":
          return 6;
        case "初一":
          return 7;
        case "初二":
          return 8;
        case "初三":
          return 9;
      }
    },
    // 返回班级
    getClass(s) {
      let klass = s.substring(2);
      // console.log(klass);
      switch (klass) {
        case "一班":
          return 1;
        case "二班":
          return 2;
        case "三班":
          return 3;
        case "四班":
          return 4;
        case "五班":
          return 5;
        case "六班":
          return 6;
        case "七班":
          return 7;
        case "八班":
          return 8;
        case "九班":
          return 9;
        case "十班":
          return 10;
      }
    },
    getData(id) {
      let urlParams = {
        orderNo: id
      };
      this.$api
        .getOrder(urlParams)
        .then(res => {
          this.currentData = res.params.order;
          this.editForm = JSON.parse(JSON.stringify(this.currentData));
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectLocation() {
      this.$set(this.editForm.school, "schools", []);
      this.$set(this.editForm.school, "id", null);
      this.$set(this.editForm.school, "name", null);
      this.$set(this.editForm.school, "grades", []);
      this.$set(this.editForm.school, "grade", null);
      this.$set(this.editForm.school, "klass", null);
      console.log(123123);
      this.getSchools();
    },
    getSchools() {
      let params = {
        province: this.editForm.school.location.province
          ? this.editForm.school.location.province.id
          : null,
        city: this.editForm.school.location.city
          ? this.editForm.school.location.city.id
          : null,
        district: this.editForm.school.location.district
          ? this.editForm.school.location.district.id
          : null
      };
      this.$api
        .getSchools(params)
        .then(res => {
          let datas = res.params.schools;
          this.$set(this.editForm.school, "schools", datas);
        })
        .catch(error => {
          console.log(error);
        });
    },
    getSchool(id, grade = null, klass = null) {
      let urlParams = {
        schoolId: id
      };
      this.$api
        .getSchool(urlParams)
        .then(res => {
          let data = res.params.school;
          let school = {
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
            grades: data.grades,
            grade: grade,
            klass: klass
          };
          this.$set(this.editForm, "school", school);
          console.log(this.editForm);
          this.getSchools();
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectSchool(value) {
      console.log(value);
      this.getSchool(value);
    },
    selectGrade() {
      this.$set(this.editForm.school, "klass", null);
    },
    handleEdit() {
      this.isEdit = true;
      let schoolId = this.editForm.subscriberSchoolId;
      if (schoolId != 0) {
        this.$set(this.editForm, "addressType", 1);
        let subscriberClass = this.editForm.subscriberClass;
        let grade = this.getGrade(subscriberClass);
        let klass = this.getClass(subscriberClass);
        this.getSchool(schoolId, grade, klass);
      } else {
        this.$set(this.editForm, "addressType", 2);
        let school = {
          location: {
            province: null,
            city: null,
            district: null
          }
        };
        this.$set(this.editForm, "school", school);
        this.$set(this.editForm, "address", this.editForm.subscriberAddress);
      }
    },
    handleCancel() {
      this.isEdit = false;
      this.editForm = JSON.parse(JSON.stringify(this.currentData));
    },
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          console.log(this.editForm);
          if (
            this.editForm.addressType == 1 &&
            (!this.editForm.school.id ||
              !this.editForm.school.grade ||
              !this.editForm.school.klass)
          ) {
            this.$message({
              message: "请选择完整的学校信息",
              type: "error"
            });
          } else if (this.editForm.addressType == 2 && !this.editForm.address) {
            this.$message({
              message: "请输入私人地址",
              type: "error"
            });
          } else {
            this.editFormLoading = true;
            let urlParams = {
              orderNo: this.editForm.orderNo
            };
            let body = {
              parentMobile: this.editForm.subscriberParentMobile,
              parentName: this.editForm.subscriberParentName,
              studentName: this.editForm.subscriberName,
              addressType: this.editForm.addressType,
							remark:this.editForm.remark
            };
            if (this.editForm.addressType == 1) {
              body = {
                ...body,
                grade: this.editForm.school.grade,
                klass: this.editForm.school.klass,
                schoolId: this.editForm.school.id
              };
            } else {
              body = {
                ...body,
                address: this.editForm.address
              };
            }
            console.log(body);
            this.$api
              .editOrder({ urlParams, body })
              .then(() => {
                this.$message({
                  message: "编辑成功",
                  type: "success"
                });
                this.isEdit = false;
                this.getData(this.editForm.orderNo);
                // this.editFormVisible = false;
                this.getDatas();
              })
              .catch(error => {
                console.log(error);
              })
              .finally(() => {
                this.editFormLoading = false;
              });
          }
        }
      });
    }
  }
};
</script>

<style  lang="scss">
// .order-detail{
//   .el-form-item{
//     margin-bottom: 20px;
//   }
// }
</style>
