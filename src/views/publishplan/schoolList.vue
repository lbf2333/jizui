<template>
  <section >
    <!--工具条-->
    <el-col :span="24" class="toolbar">
       <el-dropdown trigger="click"  @command="changeState" style="float: left;">
        <el-button type="primary"  class="el-dropdown-link">
          {{currentState.label}}&nbsp;<i class="el-icon-arrow-down el-iconright"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,key) in states" :key="key"  :command="item" :disabled="item.value == currentState.value">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button style="float: right;" v-if="plan.status == 0"  type="primary" @click="handleAllexecution">全部发货</el-button>
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="datas"  v-loading="loading" style="width: 100%;" >
        <el-table-column prop="id" label="id" sortable>
        </el-table-column>
        <el-table-column prop="name" label="学校名" min-width="120" sortable>
        </el-table-column>
        <el-table-column prop="address" label="地址" min-width="180"  sortable>
        </el-table-column> 
        <el-table-column prop="status" label="状态" :formatter="formatStatus" sortable>
        </el-table-column> 
        <el-table-column label="操作"  sortable min-width="150">
         <template slot-scope="scope">
            <el-button  size="mini" v-if="scope.row.status==0" type="primary" style="margin:3px;" @click="handleExecution(scope.row)">发货</el-button>
            <el-button  size="mini" type="primary" style="margin:3px;" @click="handleExcel(scope.row)">导出计划表</el-button>
             <el-button  size="mini" type="primary" style="margin:3px;" @click="handleZip(scope.row)">按班别导出计划表</el-button>
          </template>
        </el-table-column>   
      </el-table>
      <!--工具条-->
      <div class="block">
        <el-pagination background  @current-change="pageChange" :total="maxSize" :page-size="size" :current-page="page">
        </el-pagination>
      </div>
    </template>

  </section>
</template>

<script>
import filters from "@/filters";
export default {
  props: ["plan"],
  data() {
    return {
      loading: false,
      datas: [],
      maxSize: 0,
      size: 3, //每页显示数据的条数
      page: 1, //当前页码
      currentData: {},
      currentState: {
        value: true,
        label: "所有"
      },
      states: [
        {
          value: true,
          label: "所有"
        },
        {
          value: false,
          label: "未发货"
        }
      ]
    };
  },
  mounted() {
    this.getDatas();
  },
  watch: {
    plan() {
      console.log(this.plan);
      this.init();
      this.getDatas();
    }
  },
  components: {},
  methods: {
    formatStatus(row, column, value) {
      return value == 0 ? "未发货" : "已发货";
    },
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
      let urlParams = {
        planId: this.plan.id
      };
      let params = {
        page: this.page,
        size: this.size,
        all: this.currentState.value
      };
      this.loading = true;
      this.$api
        .getSchoolsByPlanId({ urlParams, params })
        .then(res => {
          this.datas = res.params.schools;
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
    changeState(state) {
      this.currentState = state;
      this.init();
      this.getDatas();
    },
    //执行全部发货
    handleAllexecution() {
      this.$confirm("确认全部发货吗", "提示", {
        type: "warning"
      })
        .then(() => {
          let urlParams = {
            planId: this.plan.id
          };
          let params = {};
          this.$api
            .execution({ urlParams, params })
            .then(() => {
              this.$message({
                message: "发货成功",
                type: "success"
              });
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
    //执行发货
    handleExecution(row) {
      this.$confirm("确认发往该学校吗", "提示", {
        type: "warning"
      })
        .then(() => {
          let urlParams = {
            planId: this.plan.id
          };
          let params = {
            schoolId: row.id
          };
          this.$api
            .execution({ urlParams, params })
            .then(() => {
              this.$message({
                message: "发货成功",
                type: "success"
              });
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
    //导出学校
    handleExcel(row) {
      this.$confirm("确认导出该学校吗", "提示", {
        type: "warning"
      }).then(() => {
        let urlParams = {
          planId: this.plan.id,
          schoolId: row.id
        };
        this.$api
          .excelSchool(urlParams)
          .then(res => {
            let blob = new Blob([res], { type: "application/vnd.ms-excel" });
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            let fileName = `${this.plan.magazineName}-${row.name}-${
              this.plan.publishDate
            }发行订阅列表`;
            link.download = fileName;
            link.click();
            document.body.removeChild(link); // 下载完成移除元素
            window.URL.revokeObjectURL(link.href); // 释放掉blob对象
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    //导出压缩包
    handleZip(row) {
      this.$confirm("确认导出该学校吗", "提示", {
        type: "warning"
      }).then(() => {
        let urlParams = {
          planId: this.plan.id,
          schoolId: row.id
        };
        this.$api
          .zipSchool(urlParams)
          .then(res => {
            let blob = new Blob([res], { type: "application/zip" });
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            let fileName = `${this.plan.magazineName}-${row.name}-${
              this.plan.publishDate
            }发行订阅列表(按班别)`;
            link.download = fileName;
            link.click();
            document.body.removeChild(link); // 下载完成移除元素
            window.URL.revokeObjectURL(link.href); // 释放掉blob对象
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
  }
};
</script>

<style  lang="scss" scoped>
</style>
