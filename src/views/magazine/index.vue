<template>
  <section>

    <!-- 工具条 -->
    <el-col :span="24" class="toolbar" >
       <!-- <el-dropdown trigger="click"  @command="changeType" style="float: left;">
        <el-button type="primary"  class="el-dropdown-link">
          {{currentType.label}}&nbsp;<i class="el-icon-arrow-down el-iconright"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,key) in types" :key="key"  :command="item" :disabled="item.value == currentType.value">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <el-button style="float: right;"  type="primary" @click="handleAdd">新增</el-button>
    </el-col>

    <!-- 列表 -->
    <template>
      <el-table :data="datas"  v-loading="loading" style="width: 100%;">
        <el-table-column prop="id" label="id"  sortable>
        </el-table-column>
        <el-table-column prop="title" label="标题"  sortable>
        </el-table-column>
         <el-table-column label="封面" >
          <template slot-scope="scope">
            <img :src="scope.row.coverUrl" style="width:70px;height: 90px;" :onerror="`this.src='${$defaultImg}'`" alt='加载失败...'>
          </template>
        </el-table-column>
        <el-table-column prop="typeName" label="分类"  sortable>
        </el-table-column>
      <!--   <el-table-column prop="price" label="价格(￥)" :formatter="formatMoney" sortable>
        </el-table-column> -->
         <el-table-column prop="subscribeCount" label="订阅数"  sortable>
        </el-table-column>
        <el-table-column prop="enabled" label="状态"  sortable :formatter="formatStatus">
        </el-table-column>
        <el-table-column label="操作" sortable width="200">
          <template slot-scope="scope">
            <el-button  size="mini"  type="primary" style="margin:3px;" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button  size="mini"  type="info" style="margin:3px;" @click="handlePublish(scope.row)">出版计划</el-button>
            <el-button  size="mini"  type="primary" style="margin:3px;" @click="handleSubscribe(scope.row)">订阅方案</el-button>
            <el-button  size="mini" v-if="scope.row.enabled" type="danger" style="margin:3px;" @click="updateStatus(scope.row, false)">下架</el-button>
            <el-button  size="mini" v-else type="warning" style="margin:3px;" @click="updateStatus(scope.row, true)">上架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页条 -->
      <div class="block">
        <el-pagination background  @current-change="pageChange" :total="maxSize" :page-size="size" :current-page="page">
        </el-pagination>
      </div>
    </template>

     <!--出版计划界面-->
    <el-dialog title="出版计划" class="dialog-5-top" :visible.sync="publishPlanVisible" :close-on-click-modal="false">
      <el-form label-width="150px">
        <el-form-item label="类型：">
          <el-input :value="formatPublishType(publishPlan.type)" readonly></el-input>
        </el-form-item>
        <el-card shadow="never">
          <template v-if="publishPlan.type == 1">
            <el-form-item label="出版时间：">
              <el-input :value="formatPublishWeek(publishPlan.items[0].day)" readonly></el-input>
            </el-form-item>
            <el-form-item label="价格￥：">
              <el-input :value="publishPlan.items[0].price/100" readonly></el-input>
            </el-form-item>
          </template>
          <template v-if="publishPlan.type == 2">
            <el-form-item label="发行日期：">
              <div v-for="(plan, index) in publishPlan.items" :key="index" style="margin-bottom:20px;">
                <span>{{index == 0?"上半月":"下半月"}}</span>
                <el-input :value="publishPlan.items[index].day" readonly style="width:30%;margin:0 20px;"></el-input>
                <span>价格￥：</span>
                <el-input :value="publishPlan.items[index].price/100" readonly  style="width:30%;"></el-input>
              </div>
            </el-form-item>
          </template>
          <template v-if="publishPlan.type == 3">
            <el-form-item label="发行时间(日)：">
               <el-input :value="publishPlan.items[0].day" readonly></el-input>
            </el-form-item>
            <el-form-item label="价格￥：">
              <el-input :value="publishPlan.items[0].price/100" readonly></el-input>
            </el-form-item>
          </template>
          <template v-if="publishPlan.type == 5">
            <el-table :data="publishPlan.items" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center'}" border style="width: 100%">
              <el-table-column prop="day" label="天">
              </el-table-column>
              <el-table-column prop="price" label="价格￥" :formatter="formatMoney">
              </el-table-column>
            </el-table>
          </template>
          <template v-if="publishPlan.type == 4">
            <el-table :data="publishPlan.items" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center'}" border style="width: 100%">
              <el-table-column prop="month" label="月份">
              </el-table-column>
              <el-table-column prop="day" label="天">
              </el-table-column>
              <el-table-column prop="price" label="价格￥" :formatter="formatMoney">
              </el-table-column>
            </el-table>
          </template>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="publishPlanVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!--编辑订阅方案界面-->
    <el-dialog title="订阅方案" class="dialog-70-width dialog-5-top" :visible.sync="subscribePlanVisible" :close-on-click-modal="false">
      <subscribe-plan :magazineId="currentData.id"></subscribe-plan>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="subscribePlanVisible = false">关闭</el-button>
      </div>
    </el-dialog>

  </section>
</template>
<script>
import subscribePlan from "./subscribePlan";
import filters from "@/filters";
export default {
  data() {
    return {
      loading: false,
      datas: [],
      currentData: {},
      maxSize: 0,
      size: 4, //每页显示数据的条数
      page: 1, //当前页码
      currentType: {
        value: 1,
        label: "杂志"
      },
      types: [
        {
          value: 1,
          label: "杂志"
        },
        {
          value: 2,
          label: "教辅"
        }
      ],
      publishPlanVisible: false,
      publishPlan: {},
      subscribePlanVisible: false
    };
  },
  mounted() {
    this.getDatas();
  },
  watch: {},
  components: {
    subscribePlan
  },
  methods: {
    formatPublishType(value) {
      switch (value) {
        case 1:
          return "周刊";
        case 2:
          return "半月刊";
        case 3:
          return "月刊";
        case 4:
          return "自定义年度出版计划";
        case 5:
          return "自定义月份出版计划";
      }
    },
    formatPublishWeek(value) {
      switch (value) {
        case 1:
          return "周一";
        case 2:
          return "周二";
        case 3:
          return "周三";
        case 4:
          return "周四";
        case 5:
          return "周五";
        case 6:
          return "周六";
        case 7:
          return "周日";
      }
    },
    // 金额转化
    formatMoney(row, column, value) {
      //console.log(row)
      return filters.formatMoney(value);
    },
    // 金额转化
    formatStatus(row, column, value) {
      //console.log(row)
      return value ? "正常使用" : "已下架";
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
    changeType(type) {
      this.currentType = type;
      this.init();
      this.getDatas();
    },
    // 获取数据
    getDatas() {
      let params = {
        page: this.page,
        size: this.size,
        type: this.currentType.value,
        enabled: false
      };
      this.loading = true;
      this.$api
        .getMagazines(params)
        .then(res => {
          this.datas = res.params.magazines;
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
      this.$router.push({
        name: "magazineForm"
      });
    },
    handleEdit(row) {
      this.$router.push({
        path: "/magazineForm",
        query: {
          magazineId: row.id
        }
      });
    },
    handlePublish(row) {
      this.currentData = row;
      this.publishPlanVisible = true;
      this.getPublishPlan();
    },
    getPublishPlan() {
      let urlParams = {
        magazineId: this.currentData.id
      };
      this.$api
        .getPublishPlan(urlParams)
        .then(res => {
          this.publishPlan = res.params.publish_plan;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSubscribe(row) {
      this.currentData = row;
      this.subscribePlanVisible = true;
    },
    updateStatus(row, enabled) {
      let title = "上架";
      if (!enabled) {
        title = "下架";
      }
      this.$confirm(`确定${title}该杂志吗?`, "提示", {
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          let urlParams = {
            magazineId: row.id,
            enabled: enabled
          };
          this.$api
            .updateMagazineStatus(urlParams)
            .then(() => {
              this.$message({
                message: `${title}成功`,
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

<style lang="scss" scoped>
</style>
