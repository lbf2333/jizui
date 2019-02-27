<template>
  <section class="card">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button  type="primary" style="float: right;" @click="handleExcel">导出表格</el-button>
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="datas"  v-loading="loading" style="width: 100%;">
        <el-table-column prop="id" label="id"  sortable>
        </el-table-column>
        <el-table-column prop="user.nickname" label="昵称" min-width="90"  sortable>
        </el-table-column>
        <el-table-column label="头像" >
          <template slot-scope="scope">
            <img :src="scope.row.user.headUrl ||  $defaultImg" style="width:50px;height: 50px;border-radius: 100%;"  alt='加载失败...'>
          </template>
        </el-table-column>   
        <el-table-column prop="orderNo" label="订单号" min-width="150"  sortable>
        </el-table-column>
         <el-table-column prop="money" label="金额(￥)" min-width="100" :formatter="formatMoney"  sortable>
         </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" :formatter="formatTime"  sortable>
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
  data() {
    return {
      loading: false,
      datas: [],
      maxSize: 0,
      size: 6, //每页显示数据的条数
      page: 1, //当前页码
      currentData: {}
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
      return -filters.formatMoney(value);
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
        size: this.size
      };
      this.loading = true;
      this.$api
        .getRecords(params)
        .then(res => {
          this.datas = res.params.money_records;
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
    //导出表格
    handleExcel(row) {
      this.$confirm("确认导出表格吗", "提示", {
        type: "warning"
      }).then(() => {
        let urlParams = {
          planId: this.planId,
          schoolId: row.id
        };
        this.$api
          .excelRecord(urlParams)
          .then(res => {
            let blob = new Blob([res], { type: "application/vnd.ms-excel" });
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            let fileName =
              "钱包记录表" +
              filters.formatTime(new Date().getTime(), "yyyy-MM-dd");
            link.download = fileName;
            link.click();
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
