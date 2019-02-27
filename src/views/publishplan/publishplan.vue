<template>
  <section>

    <!-- 工具条 -->
    <el-col :span="24" class="toolbar" >
       <el-dropdown trigger="click"  @command="changeParent" style="float: left;">
        <el-button type="primary"  class="el-dropdown-link">
          {{currentParent.label}}&nbsp;<i class="el-icon-arrow-down el-iconright"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,key) in parents" :key="key"  :command="item" :disabled="item.value == currentParent.value">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-date-picker
          v-model="value13"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          @change="logTimeChange"
      >
      </el-date-picker>
    </el-col>

    <!-- 列表 -->
    <template>
      <el-table :data="datas"  v-loading="loading" style="width: 100%;">
        <el-table-column prop="id" label="id"  sortable>
        </el-table-column>
        <el-table-column prop="magazineName" label="杂志名" min-width="90"  sortable>
        </el-table-column>
        <el-table-column prop="count" label="订阅数量" min-width="100" sortable>
        </el-table-column>
        <el-table-column prop="price" label="价格" :formatter="formatMoney" sortable>
        </el-table-column>
        <el-table-column prop="publishDate" label="出版时间"  width="150"  sortable>
        </el-table-column>
        <el-table-column prop="publishedTimes" label="发行期数" min-width="100" sortable>
        </el-table-column>
        <el-table-column prop="status" label="状态" :formatter="formatPlanstatus" sortable>
        </el-table-column>
        <el-table-column label="操作" sortable width="200" >
          <template slot-scope="scope">
             <el-button  size="mini"  type="info" style="margin:3px;" @click="handleSchool(scope.row)">查看学校</el-button>
             <el-button  size="mini"  type="primary" style="margin:3px;" @click="handlePlan(scope.row)">导出计划</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页条 -->
      <div class="block">
        <el-pagination background  @current-change="pageChange" :total="maxSize" :page-size="size" :current-page="page">
        </el-pagination>
      </div>
    </template>
    <!-- 查看学校 -->
   <el-dialog :title="'学校列表'" class="dialog-70-width" :visible.sync="schoolVisible" :close-on-click-modal="false">
      <school-list :plan="currentData"></school-list>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="schoolVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import filters from "@/filters";
import schoolList from "./schoolList";
export default {
  data() {
    return {
      value13: '',
      beginDay:'',
      beginMonth:'',
      beginYear:'',
      endDay:'',
      endMonth:'',
      endYear:'',
      starttime:'',
      loading: false,
      datas: [],
      currentData: {},
      maxSize: 0,
      size: 6, //每页显示数据的条数
      page: 1, //当前页码
      currentParent: {
        value: 1,
        label: "未完成"
      },
      parents: [
        {
          value: 1,
          label: "未完成"
        },
        {
          value: 2,
          label: "已完成"
        }
      ],
      schoolVisible: false
    };
  },
  mounted() {
    this.getDatas();
  },
  watch: {},
  components: {
    schoolList
  },
  methods: {
    // 金额转化
    formatMoney(row, column, value) {
      //console.log(row)
      return filters.formatMoney(value);
    },
    formatPlanstatus(row, column, value) {
      //console.log(value)
      return filters.formatPlanstatus(value);
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
    changeParent(type) {
      this.currentParent = type;
      this.init();
      this.getDatas();
    },
    logTimeChange(val){
      console.log(val)
      let beginDate  = new Date(val[0])
      this.beginYear  = beginDate.getFullYear();
      this.beginMonth = beginDate.getMonth()+1;
      this.beginDay = beginDate.getDate();
      console.log(this.beginYear,this.beginMonth,this.beginDay)
      let endDate  = new Date(val[1])
      this.endYear  = endDate.getFullYear();
      this.endMonth = endDate.getMonth()+1;
      this.endDay = endDate.getDate();
      console.log(this.endYear,this.endMonth,this.endDay)
      this.getDatas();
    },
    // 获取数据
    getDatas() {
      let params = {
        beginDay:this.beginDay,
        beginMonth:this.beginMonth,
        beginYear:this.beginYear,
        endDay:this.endDay,
        endMonth:this.endMonth,
        endYear:this.endYear,
        page: this.page,
        size: this.size,
        // time:this.value13
        parent: this.currentParent.value
      };
      this.loading = true;
      if (this.currentParent.value === 1) {
        this.$api
          .getPlannotfinish(params)
          .then(res => {
            this.datas = res.params.subscribedPublishPlans;
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
      } else {
        this.$api
          .getPlanfinish(params)
          .then(res => {
            this.datas = res.params.subscribedPublishPlans;
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
      }
    },
    //导出计划
    handlePlan(row) {
      this.$confirm("确认导出该计划吗", "提示", {
        type: "warning"
      }).then(() => {
        let urlParams = {
          planId: row.id
        };
        this.$api
          .excelPlan(urlParams)
          .then(res => {
            console.log(res);
            let blob = new Blob([res], { type: "application/vnd.ms-excel" });
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            let fileName = `${row.magazineName}-${row.publishDate}发行订阅列表`;
            link.download = fileName;
            link.click();
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    handleSchool(row) {
      this.schoolVisible = true;
      this.currentData = row;
      console.log(row.id);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
