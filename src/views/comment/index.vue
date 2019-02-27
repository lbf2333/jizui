<template>
  <section>

    <!-- 工具条 -->
    <el-col :span="24" class="toolbar" >
       <el-dropdown trigger="click"  @command="changeEvaluate" style="float: left;">
        <el-button type="primary"  class="el-dropdown-link">
          {{currentEvaluate.label}}&nbsp;<i class="el-icon-arrow-down el-iconright"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,key) in evaluates" :key="key"  :command="item" :disabled="item.value == currentEvaluate.value">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>

    <!-- 列表 -->
    <template>
      <el-table :data="datas"  v-loading="loading" style="width: 100%;">
        <el-table-column prop="username" label="用户"  sortable>
        </el-table-column>
         <el-table-column label="头像" >
          <template slot-scope="scope">
            <img :src="scope.row.headUrl" style="width:50px;height: 50px;border-radius:100%;" :onerror="`this.src='${$defaultImg}'`" alt='加载失败...'>
          </template>
        </el-table-column>
         <el-table-column prop="star" label="星级"  sortable>
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="200"  sortable>
        </el-table-column>
        <el-table-column prop="time" label="评论时间" :formatter="formatTime" width="180" sortable>
        </el-table-column>
        
      </el-table>
      <!-- 分页条 -->
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
      currentData: {},
      maxSize: 0,
      size: 5, //每页显示数据的条数
      page: 1, //当前页码
      currentEvaluate: {
        value: 0,
        label: "所有"
      },
      evaluates: [
        {
          value: 0,
          label: "所有"
        },
        {
          value: 1,
          label: "好评"
        },
        {
          value: 2,
          label: "中评"
        },
        {
          value: 3,
          label: "差评"
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
    formatTime(row, column, value) {
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
    changeEvaluate(evaluate) {
      this.currentEvaluate = evaluate;
      this.init();
      this.getDatas();
    },
    // 获取数据
    getDatas() {
      let params = {
        page: this.page,
        size: this.size,
        evaluate: this.currentEvaluate.value
      };
      this.loading = true;
      this.$api
        .getComments(params)
        .then(res => {
          this.datas = res.params.comments;
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
  }
};
</script>

<style lang="scss" scoped>
</style>
