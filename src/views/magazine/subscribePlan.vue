<template>
  <section >

    <el-col :span="24" class="toolbar" >
      <el-button type="primary" @click="handleAdd">增加</el-button>
    </el-col>
    <el-table :data="datas" v-loading="loading" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center'}" border style="width: 100%">
      <el-table-column prop="name" label="订阅方案名称">
      </el-table-column>
      <el-table-column prop="subscribeType" label="订阅方案模式" >
      </el-table-column>
      <el-table-column prop="subscribePlanPeriod" label="订阅时长" min-width="120">
      </el-table-column>
      <el-table-column prop="price" label="订阅价格￥" :formatter="formatMoney">
      </el-table-column>
      <el-table-column prop="locked" label="状态"  sortable :formatter="formatLocked">
        </el-table-column>
      <el-table-column label="操作" sortable width="200">
        <template slot-scope="scope">
          <el-button type="info" @click="handleSee(scope.row)">详情</el-button>
          <el-button v-if="!scope.row.locked" type="danger" @click="handleDel(scope.row)">禁用</el-button>
          <el-button  v-else type="warning" @click="handleRe(scope.row)">恢复</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!--订阅方案-->
    <el-dialog title="订阅方案" class="dialog-70-width dialog-5-top"  :append-to-body="true"  :visible.sync="subscribeVisible" :close-on-click-modal="false">
      <el-form label-width="200px" >
        <el-form-item label="名称：" prop="name">
            <el-input v-model.trim="subscribePlan.name" :disabled="!!subscribePlan.id"></el-input>
          </el-form-item>
        <el-form-item label="订阅模式：">
          <el-radio v-model="subscribePlan.subscribeType"  :disabled="subscribePlan.id&&subscribePlan.subscribeType!=type.value" v-for="type in subscribeTypes" :key="type.value" :label="type.value">{{type.label}}</el-radio>
        </el-form-item>
        <template v-if="subscribePlan.subscribeType == 1">
          <el-form-item label="每期订阅截止时间：">
            在发行的前
            <el-input-number v-model="subscribePlan.subscribeDeadlineBefore" :disabled="!!subscribePlan.id" :precision="0" :min="0" ></el-input-number>
            天
          </el-form-item>
          <el-form-item label="订阅时长：">
            <el-radio v-model="subscribeMonth"  @change="monthChange"  :disabled="subscribePlan.id&&subscribeMonth!=month.value" v-for="month in subscribeMonths" :key="month.value" :label="month.value">{{month.label}}
            <template v-if="month.value == -1">
              <el-input-number v-model="inputMonth" @change="monthInputChange" :disabled="subscribeMonth!=-1||!!subscribePlan.id" size="mini" :precision="0" :controls="false" :min="1" :max="48"></el-input-number>月
            </template>
            </el-radio>
          </el-form-item>
        </template>
        <template v-if="subscribePlan.subscribeType == 2">
          <el-form-item label="截止订阅时间：">
            <el-date-picker
              v-model="subscribePlan.subscribeDeadline"
              type="date"
              placeholder="选择日期"
              :disabled="!!subscribePlan.id"
              value-format="yyyy/MM/dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="开始时间：">
            <el-date-picker
              v-model="subscribePlan.subscribeBegin"
              type="date"
              placeholder="选择日期"
              :disabled="!!subscribePlan.id"
              value-format="yyyy/MM/dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：">
            <el-date-picker
              v-model="subscribePlan.subscribeEnd"
              type="date"
              placeholder="选择日期"
              :disabled="!!subscribePlan.id"
              value-format="yyyy/MM/dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </template>
        <el-form-item label="订阅价格：">
            <el-radio v-model="subscribePlan.priceMode"  :disabled="subscribePlan.id&&subscribePlan.priceMode!=mode.value" v-for="mode in priceModes" :key="mode.value" :label="mode.value">{{mode.label}}
            <template v-if="mode.value == 2">
              <el-input-number v-model="subscribePlan.price" :disabled="subscribePlan.priceMode!=2||!!subscribePlan.id" size="mini" :precision="2" :controls="false" :min="0" ></el-input-number>元
            </template>
            </el-radio>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="subscribeVisible = false">关闭</el-button>
        <el-button type="primary" @click.native="submit" v-if="!subscribePlan.id" :loading="addFormLoading">保存</el-button>
      </div>
    </el-dialog>
    <!-- 分页条 -->
    <div class="block">
      <el-pagination background  @current-change="pageChange" :total="maxSize" :page-size="size" :current-page="page">
      </el-pagination>
    </div>
  </section>
</template>
<script>
import filters from "@/filters";
export default {
  props: ["magazineId"],
  data() {
    return {
      loading: false,
      datas: [],
      maxSize: 0,
      size: 3, //每页显示数据的条数
      page: 1, //当前页码
      addFormVisible: false,
      addFormLoading: false,
      editFormVisible: false,
      editFormLoading: false,
      subscribeVisible: false,
      subscribePlan: {
        name: "",
        price: 0,
        priceMode: 1, //价格的计算方式
        subscribeType: 1, //订阅模式
        subscribeBegin: null, //固定时间模式下的订阅开始时间
        subscribeEnd: null, //固定时间模式下的订阅结束时间
        subscribeDeadline: null, //固定时间模式下的订阅截止时间
        subscribeDeadlineBefore: 0, //自由模式下的提前多少天订阅
        months: 3 //自由模式下的订阅时长
      },
      subscribeTypes: [
        {
          value: 1,
          label: "自由订阅"
        },
        {
          value: 2,
          label: "固定时间订阅"
        }
      ],
      subscribeMonth: 3,
      inputMonth: 1,
      subscribeMonths: [
        {
          value: 3,
          label: "三个月"
        },
        {
          value: 6,
          label: "半年"
        },
        {
          value: 12,
          label: "一年"
        },
        {
          value: -1,
          label: "其他"
        }
      ],
      priceModes: [
        {
          value: 1,
          label: "自动根据出版计划计算"
        },
        {
          value: 2,
          label: "固定价格"
        }
      ]
    };
  },
  mounted() {
    this.getDatas();
  },
  components: {},
  watch: {
    magazineId() {
      console.log(this.magazineId);
      this.init();
      this.getDatas();
    }
  },
  methods: {
    // 金额转化
    formatMoney(row, column, value) {
      if (row.priceType == 1) {
        return "自动计算";
      } else {
        return filters.formatMoney(value);
      }
    },
    formatLocked(row, column, value) {
      return filters.formatLocked(value);
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
      this.getDatas();
    },
    // 获取数据
    getDatas() {
      let params = {
        page: this.page,
        size: this.size,
        magazineId: this.magazineId
      };
      this.loading = true;
      this.$api
        .getSubscribePlans(params)
        .then(res => {
          this.datas = res.params.subscribeVos;
          if (this.page == 1) {
            this.maxSize = res.params.totalCount;
          }
        })
        .catch(error => {
          console.log(error);
          if (error.code == 4) {
            this.init();
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getData(id) {
      let urlParams = {
        subscribePlanId: id
      };
      this.$api
        .getSubscribePlan(urlParams)
        .then(res => {
          let currentData = res.params.subscribePlan;
          this.subscribePlan = JSON.parse(JSON.stringify(currentData));
          this.subscribePlan.price /= 100;
          let months = this.subscribePlan.months;
          this.subscribeMonth = months;
          this.inputMonth = 1;
          if (months != 3 && months != 6 && months != 12) {
            this.subscribeMonth = -1;
            this.inputMonth = months;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleAdd() {
      this.subscribePlan = {
        name: "",
        price: 0,
        priceMode: 1,
        subscribeType: 1,
        subscribeBegin: null,
        subscribeEnd: null,
        subscribeDeadline: null,
        subscribeDeadlineBefore: 0,
        months: 3
      };
      this.subscribeMonth = 3;
      this.inputMonth = 1;
      this.subscribeVisible = true;
    },
    monthInputChange() {
      if (this.subscribeMonth == -1) {
        this.subscribePlan.months = this.inputMonth;
        console.log(this.subscribePlan.months);
      }
    },
    monthChange(value) {
      console.log(value);
      let month = value == -1 ? this.inputMonth : value;
      this.subscribePlan.months = month;
      console.log(this.subscribePlan.months);
    },
    submit() {
      if (this.subscribePlan.subscribeType == 2) {
        let nowTime = new Date().getTime();
        let subscribeDeadline = new Date(
          this.subscribePlan.subscribeDeadline
        ).getTime();
        let subscribeBegin = new Date(
          this.subscribePlan.subscribeBegin
        ).getTime();
        let subscribeEnd = new Date(this.subscribePlan.subscribeEnd).getTime();
        if (subscribeDeadline <= nowTime) {
          this.$message({
            message: "截止订阅时间要晚于今天",
            type: "error"
          });
          return;
        }
        if (subscribeBegin <= subscribeDeadline) {
          this.$message({
            message: "开始时间要晚于截止订阅时间",
            type: "error"
          });
          return;
        }
        if (subscribeEnd <= subscribeBegin) {
          this.$message({
            message: "结束时间要晚于开始时间",
            type: "error"
          });
          return;
        }
      }
      this.$confirm("确认提交吗？", "提示", {}).then(() => {
        this.addFormLoading = true;
        let body = JSON.parse(JSON.stringify(this.subscribePlan));
        body.magazineId = this.magazineId;
        body.price *= 100;
        console.log(body);
        // return;
        this.$api
          .addSubscribePlan(body)
          .then(() => {
            this.$message({
              message: "新增成功",
              type: "success"
            });
            this.subscribeVisible = false;
            this.getDatas();
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => {
            this.addFormLoading = false;
          });
      });
    },
    handleSee(row) {
      this.subscribeVisible = true;
      this.getData(row.id);
    },
    //删除订阅方案
    handleDel(row) {
      this.$confirm("确定禁用该订阅方案吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          let urlParams = {
            subscribePlanId: row.id
          };
          this.$api
            .delSubscribePlan(urlParams)
            .then(() => {
              this.$message({
                message: "禁用成功",
                type: "success"
              });
              this.getDatas();
            })
            .catch(error => {
              console.log(error);
            })
            .finally(() => {
              this.loading = false;
            });
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleRe(row) {
      this.$confirm("确定恢复该订阅方案吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          let urlParams = {
            subscribePlanId: row.id
          };
          this.$api
            .recoverSubscribePlan(urlParams)
            .then(() => {
              this.$message({
                message: "恢复成功",
                type: "success"
              });
              this.getDatas();
            })
            .catch(error => {
              console.log(error);
            })
            .finally(() => {
              this.loading = false;
            });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss">
.clazz-quiz {
  .logo {
    .avatar-uploader-icon {
      width: 315px;
      height: 150px;
      line-height: 150px !important;
    }
    .avatar {
      width: 315px;
      height: 150px;
      display: block;
    }
  }
  .option {
    text-align: center;
    + .option {
      margin-top: 5px;
    }
  }
}
</style>
