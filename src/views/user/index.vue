<template>
  <section >
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="datas"  v-loading="loading" style="width: 100%;">
        <el-table-column prop="id" label="id"  sortable>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" min-width="90"  sortable>
        </el-table-column>
        <el-table-column label="头像" >
          <template slot-scope="scope">
            <img :src="scope.row.headUrl ||  $defaultImg" style="width:50px;height: 50px;border-radius: 100%;"  alt='加载失败...'>
          </template>
        </el-table-column>      
        <el-table-column prop="mobile" label="手机号码" min-width="110"  :formatter="(row, column, cellValue)=>{return cellValue?cellValue:'暂无'}" sortable>
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
      size: 5, //每页显示数据的条数
      page: 1, //当前页码
      currentData: {}
    };
  },
  mounted() {
    this.getDatas();
  },
  components: {},
  methods: {
    // 时间转化
    formatTime(row, column, value) {
      //console.log(row)
      return filters.formatTime(value);
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
        .getUsers(params)
        .then(res => {
          this.datas = res.params.users;
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
    }
  }
};
</script>

<style  lang="scss" scoped>
</style>
