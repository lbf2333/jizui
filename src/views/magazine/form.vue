<template>
	<div class="form" ref="form">
		<div style="overflow:hidden">
			<el-col :span="24" class="toolbar" style="margin-bottom: 20px;padding-bottom: 0">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="info" @click="back">返回</el-button>
				</el-form-item>
			</el-form>
    </el-col>
		</div>
    <template>
			<div>
				<el-form ref="form" :model="currentForm" label-width="150px" style="width:80%;min-width:600px;padding-right: 40px;"  :rules="formRules" v-loading="formLoading">
					<el-form-item label="标题" prop="name" >
						<el-input v-model.trim="currentForm.magazine.name" :disabled="type==2"></el-input>
					</el-form-item>
          <el-form-item label="封面(7:9)" ref="imageUrlV" class="logo" >
            <ul class="cover-list">
              <li v-for="(item,index) in currentForm.magazine.coverUrls" :key="index">
                <el-card :body-style="{ padding: '0px' }">
                  <img :src="item" alt="">
                  <div  class="clearfix">
                    <el-button v-if="index != 0" style="padding: 3px 0" type="text" @click="setCover(index)">设为封面</el-button>
                    <el-button style=" padding: 3px 0" type="text" @click="delCover(index)">删除</el-button>
                  </div>
                </el-card>
              </li>
              <li v-loading="uploadImgLoading"> 
                <upload-img :imageUrl.sync="imageUrl" @getImgFd="(res)=>{return getImgFd(res,0)}"></upload-img>
              </li>
            </ul>
          </el-form-item>
          <!-- <el-form-item label="类别" prop="title">
            <template>
              <el-radio v-model="currentForm.magazine.type" v-for="type in types" :key="type.value" :label="type.value" @change="changeType">{{type.label}}</el-radio>
            </template>
          </el-form-item> -->
          <el-form-item label="分类" prop="title">
            <template>
              <el-select v-model="currentForm.magazine.categoryId" placeholder="请选择分类">
                <el-option
                  v-for="item in categories[currentForm.magazine.type-1].subCategories"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="适用年级">
            <el-checkbox-group v-model="currentForm.magazine.tags">
              <el-checkbox v-for="tag in tags"  :label="tag.id" :key="tag.id">{{tag.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="详情" prop="detail">
            <!-- 这个input是来解决不触发校验规则 -->
            <el-input v-model="currentForm.magazine.detail" style="display: none;" ></el-input>
					  <div v-show="currentAction==0"> <tinymce ref="tinymce" :uploadContextImg="uploadEditImg" :height="300"  v-model="currentForm.magazine.detail"/></div >
						<div v-show="currentAction!=0">
							<el-input class="editor-see"  type="textarea" disabled v-html="currentForm.magazine.detail"></el-input>
						</div>
					</el-form-item>
          <el-form-item label="出版计划" v-if="type != 2">
            <el-button type="primary" @click="toEditPublishPlan">编辑出版计划</el-button>
          </el-form-item>
          <el-form-item label="最近一次出版时间" v-if="type != 2">
            <el-input :value="`${currentForm.magazine.baseYear}年${currentForm.magazine.baseMonth}月${currentForm.magazine.baseDay}日`" disabled></el-input>
          </el-form-item>
          <el-form-item label="这一天出版的期数" v-if="type != 2">
             <el-input-number v-model="currentForm.magazine.basePublishTimes" :precision="0" :min="1" ></el-input-number>
          </el-form-item>
          <el-form-item label="订阅方案" v-if="type != 2">
            <el-button type="primary" @click="toEditSubscribePlan">编辑订阅方案</el-button>
          </el-form-item>
				</el-form>
        <div style="text-align:center;margin:30px;">
          <el-button type="warning" @click="save" v-show="currentAction==0">保存</el-button>
        </div>
			</div>
    </template>
     <!--编辑出版计划界面-->
    <el-dialog title="编辑出版计划" class="dialog-70-width dialog-5-top" :visible.sync="publishPlanVisible" :close-on-click-modal="false">
      <el-form label-width="100px" >
        <el-form-item label="类型：">
          <el-radio v-model="publishPlan.type"  @change="changePublishType" v-for="type in publishPlanTypes" :key="type.value" :label="type.value">{{type.label}}</el-radio>
        </el-form-item>
        <el-card shadow="never">
          <template v-if="publishPlan.type == 1">
            <el-form-item label="出版时间：">
              <el-radio v-model="publishPlan.items[0].day" v-for="week in weeks" :key="week.value" :label="week.value">{{week.label}}</el-radio>
            </el-form-item>
            <el-form-item label="价格￥：">
              <el-input-number v-model="publishPlan.items[0].price" :precision="2" :min="0" ></el-input-number>
            </el-form-item>
          </template>
          <template v-if="publishPlan.type == 2">
            <el-form-item label="发行日期：">
              <div v-for="(plan, index) in publishPlan.items" :key="index" style="margin-bottom:20px;">
                <span>{{index == 0?"上半月":"下半月"}}</span>
                <el-select v-model="publishPlan.items[index].day" placeholder="请选择" style="margin: 0 20px;">
                  <el-option
                    v-for="item in 28"
                    :key="item"
                    :label="item"
                    :value="item"
                    v-if="item <= (index+1) * 15 && item >= (index)* 15">
                  </el-option>
                </el-select>
                <span>价格￥：</span>
                <el-input-number v-model="publishPlan.items[index].price" :precision="2" :min="0" ></el-input-number>
              </div>
            </el-form-item>
          </template>
          <template v-if="publishPlan.type == 3">
            <el-form-item label="发行时间：">
               <el-select v-model="publishPlan.items[0].day" placeholder="请选择">
                  <el-option
                    v-for="item in 28"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                &nbsp;日
            </el-form-item>
            <el-form-item label="价格￥：">
              <el-input-number v-model="publishPlan.items[0].price" :precision="2" :min="0" ></el-input-number>
            </el-form-item>
          </template>
          <template v-if="publishPlan.type == 5">
            <el-col :span="24" class="toolbar" >
              <el-button type="primary" @click="addPublish(1)">增加</el-button>
            </el-col>
            <el-table :data="publishPlan.items" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center'}" border style="width: 100%">
              <el-table-column prop="day" label="天">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.day" placeholder="请选择">
                    <el-option
                      v-for="item in 28"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="价格￥" width="220">
                 <template slot-scope="scope">
                    <el-input-number v-model="scope.row.price" :precision="2" :min="0" ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作" sortable >
                <template slot-scope="scope">
                  <el-button type="danger" @click="delPublish(scope.$index , 1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template v-if="publishPlan.type == 4">
            <el-col :span="24" class="toolbar">
              <el-button type="primary" @click="addPublish(1)">增加</el-button>
              <el-button type="primary" style="float:right;" @click="addhalfMoonPublish">基于月出版计划</el-button>
            </el-col>
            <el-table :data="publishPlan.items" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center'}" border style="width: 100%">
              <el-table-column prop="day" label="月份">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.month" placeholder="请选择">
                    <el-option
                      v-for="item in months"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="day" label="天">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.day" v-if="months[scope.row.month-1]" placeholder="请选择">
                    <el-option
                      v-for="item in months[scope.row.month-1].day"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="价格￥" width="220">
                 <template slot-scope="scope">
                    <el-input-number v-model="scope.row.price" :precision="2" :min="0" ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作" sortable >
                <template slot-scope="scope">
                  <el-button type="danger" @click="delPublish(scope.$index,1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="publishPlanVisible = false">关闭</el-button>
        <el-button type="primary" @click.native="savePlan">保存</el-button>
      </div>
    </el-dialog>

    <!--基于月出版计划界面-->
    <el-dialog title="基于月出版计划" class="dialog-70-width dialog-5-top" :visible.sync="basePublishVisible" :close-on-click-modal="false">
      <el-col :span="24" class="toolbar" >
        <el-button type="primary" @click="addPublish(2)">增加</el-button>
      </el-col>
      <el-table :data="basePublish" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center'}" border style="width: 100%">
        <el-table-column prop="day" label="天">
          <template slot-scope="scope">
            <el-select v-model="scope.row.day" placeholder="请选择">
              <el-option
                v-for="item in 28"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格￥" width="220">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.price" :precision="2" :min="0" ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable >
          <template slot-scope="scope">
            <el-button type="danger" @click="delPublish(scope.$index ,2)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="basePublishVisible = false">取消</el-button>
        <el-button type="primary" @click.native="surePlan">确定</el-button>
      </div>
    </el-dialog>

    <!--编辑订阅方案界面-->
    <el-dialog title="编辑订阅方案" class="dialog-70-width dialog-5-top" :visible.sync="subscribePlanVisible" :close-on-click-modal="false">
      <el-col :span="24" class="toolbar" >
        <el-button type="primary" @click="addSubscribe">增加</el-button>
      </el-col>
      <el-table :data="currentForm.subscribePlans" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center'}" border style="width: 100%">
        <el-table-column prop="name" label="订阅方案名称">
        </el-table-column>
        <el-table-column prop="subscribeType" label="订阅方案模式" :formatter="formatSubscribeType">
        </el-table-column>
        <el-table-column prop="months" label="订阅时长" min-width="120" :formatter="formatMonth">
        </el-table-column>
        <el-table-column prop="price" label="订阅价格￥" :formatter="formatMoney">
        </el-table-column>
        <el-table-column label="操作" sortable width="200">
          <template slot-scope="scope">
            <el-button type="info" @click="seeSubscribe(scope.row)">查看</el-button>
            <el-button type="danger" @click="delSubscribe(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="subscribePlanVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!--订阅方案-->
    <el-dialog title="订阅方案" class="dialog-70-width dialog-5-top" :visible.sync="addSubscribeVisible" :close-on-click-modal="false">
      <el-form label-width="200px" >
        <el-form-item label="名称：" prop="name">
            <el-input v-model.trim="subscribePlan.name"></el-input>
          </el-form-item>
        <el-form-item label="订阅模式：">
          <el-radio v-model="subscribePlan.subscribeType"  v-for="type in subscribeTypes" :key="type.value" :label="type.value">{{type.label}}</el-radio>
        </el-form-item>
        <template v-if="subscribePlan.subscribeType == 1">
          <el-form-item label="每期订阅截止时间：">
            在发行的前
            <el-input-number v-model="subscribePlan.subscribeDeadlineBefore" :precision="0" :min="0" ></el-input-number>
            天
          </el-form-item>
          <el-form-item label="订阅时长：">
            <el-radio v-model="subscribeMonth"  @change="monthChange" v-for="month in subscribeMonths" :key="month.value" :label="month.value">{{month.label}}
            <template v-if="month.value == -1">
              <el-input-number v-model="inputMonth" @change="monthInputChange" :disabled="subscribeMonth!=-1" size="mini" :precision="0" :controls="false" :min="1" :max="48"></el-input-number>月
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
               value-format="yyyy/MM/dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="开始时间：">
            <el-date-picker
              v-model="subscribePlan.subscribeBegin"
              type="date"
              placeholder="选择日期"
               value-format="yyyy/MM/dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：">
            <el-date-picker
              v-model="subscribePlan.subscribeEnd"
              type="date"
              placeholder="选择日期"
               value-format="yyyy/MM/dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </template>
        <el-form-item label="订阅价格：">
            <el-radio v-model="subscribePlan.priceMode" v-for="mode in priceModes" :key="mode.value" :label="mode.value">{{mode.label}}
            <template v-if="mode.value == 2">
              <el-input-number v-model="subscribePlan.price" :disabled="subscribePlan.priceMode!=2" size="mini" :precision="2" :controls="false" :min="0" ></el-input-number>元
            </template>
            </el-radio>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addSubscribeVisible = false">关闭</el-button>
        <el-button type="primary" @click.native="saveSubscribe">保存</el-button>
      </div>
    </el-dialog>

	</div>
</template>
<script>
import uploadImg from "@/components/uploadImg";
import filters from "@/filters";
import Tinymce from "@/components/Tinymce";
export default {
  data() {
    return {
      magazineId: 0,
      type: 1,
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
      categories: [
        {
          subCategories: []
        },
        {
          subCategories: []
        }
      ],
      tags: [],
      formLoading: false,
      currentAction: 0,
      currentForm: {
        magazine: {
          baseDay: "",
          baseMonth: "",
          basePublishTimes: 1,
          baseYear: "",
          categoryId: null,
          coverUrls: [],
          detail: "",
          name: "",
          tags: [],
          type: 1
        },
        publishPlan: {
          items: [
            {
              day: 7,
              price: 0
            }
          ],
          type: 1
        },
        subscribePlans: []
      },
      formRules: {},
      imageUrl: "",
      uploadImgLoading: false,
      newImg: new Date().getTime(), //解决图片请求会有缓存
      fd: {}, //添加或编辑时上传图片对象
      contentFd: {}, //添加或编辑文章内容时上传图片对象
      publishPlanVisible: false,
      publishPlan: {
        items: [
          {
            day: 7,
            price: 0
          }
        ],
        type: 1
      },
      publishPlanTypes: [
        {
          value: 1,
          label: "周刊"
        },
        {
          value: 2,
          label: "半月刊"
        },
        {
          value: 3,
          label: "月刊"
        },
        {
          value: 5,
          label: "自定义月份出版计划"
        },
        {
          value: 4,
          label: "自定义年度出版计划"
        }
      ],
      weeks: [
        {
          value: 7,
          label: "周日"
        },
        {
          value: 1,
          label: "周一"
        },
        {
          value: 2,
          label: "周二"
        },
        {
          value: 3,
          label: "周三"
        },
        {
          value: 4,
          label: "周四"
        },
        {
          value: 5,
          label: "周五"
        },
        {
          value: 6,
          label: "周六"
        }
      ],
      months: [
        {
          value: 1,
          label: "1月",
          day: 31
        },
        {
          value: 2,
          label: "2月",
          day: 28
        },
        {
          value: 3,
          label: "3月",
          day: 31
        },
        {
          value: 4,
          label: "4月",
          day: 30
        },
        {
          value: 5,
          label: "5月",
          day: 31
        },
        {
          value: 6,
          label: "6月",
          day: 30
        },
        {
          value: 7,
          label: "7月",
          day: 31
        },
        {
          value: 8,
          label: "8月",
          day: 31
        },
        {
          value: 9,
          label: "9月",
          day: 30
        },
        {
          value: 10,
          label: "10月",
          day: 31
        },
        {
          value: 11,
          label: "11月",
          day: 30
        },
        {
          value: 12,
          label: "12月",
          day: 31
        }
      ],
      basePublishVisible: false,
      basePublish: [
        {
          day: 1,
          price: 0
        }
      ],
      subscribePlanVisible: false,
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
      addSubscribeVisible: false,
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
      ],
      subscribePlanId: 0
    };
  },
  mounted() {
    this.getCategories();
    let magazineId = this.$route.query.magazineId || 0;
    if (magazineId) {
      this.magazineId = magazineId;
      this.getMagazine();
      this.type = 2;
    }
  },
  beforeRouteEnter(to, from, next) {
    // console.log(to, from);
    let title = !to.query.magazineId ? "新增杂志" : "编辑杂志";
    to.meta.title = title;
    next();
  },
  components: {
    uploadImg,
    Tinymce
  },
  watch: {},
  methods: {
    formatSubscribeType(row, column, value) {
      return this.subscribeTypes[value - 1].label;
    },
    formatMonth(row, column, value) {
      if (row.subscribeType == 2) {
        let start = filters.formatTime(row.subscribeBegin, "yyyy-MM-dd");
        let end = filters.formatTime(row.subscribeEnd, "yyyy-MM-dd");
        return start + "至" + end;
      }
      let month = value;
      switch (month) {
        case 6:
          return "半年";
        case 12:
          return "一年";
        case 18:
          return "一年半";
        case 24:
          return "两年";
        case 30:
          return "两年半";
        case 36:
          return "三年";
        case 42:
          return "三年半";
        case 48:
          return "四年";
        default:
          return month + "个月";
      }
    },
    // 金额转化
    formatMoney(row, column, value) {
      //console.log(row)
      if (row.priceMode == 1) {
        return "自动计算";
      } else {
        return filters.formatMoney(value);
      }
    },
    getMagazine() {
      let urlParams = {
        magazineId: this.magazineId
      };
      this.formLoading = true;
      this.$api
        .getMagazine(urlParams)
        .then(res => {
          let detail = res.params.magazine;
          let currentForm = {
            magazine: {
              categoryId: detail.categoryId,
              coverUrls: detail.coverUrls,
              detail: detail.detail,
              name: detail.name,
              tags: detail.tags,
              type: detail.type
            }
          };
          this.currentForm = JSON.parse(JSON.stringify(currentForm));
          console.log(this.currentForm);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.formLoading = false;
        });
    },
    getCategories() {
      this.$api
        .getCategorysAndTags()
        .then(res => {
          this.categories = res.params.categories;
          for (let i = 0; i < res.params.tags.length; i++) {
            this.tags.push(...res.params.tags[i].subCategories);
          }
          console.log(this.tags);
        })
        .catch(error => {
          console.log(error);
        });
    },
    back() {
      this.$router.go(-1);
    },
    cancel() {
      this.currentAction = 1;
      this.currentForm = JSON.parse(JSON.stringify(this.lastForm));
      this.$refs.tinymce.destroyTinymce(); // 销毁编辑器
    },
    save() {
      console.log(this.currentForm);
      this.$confirm("确认提交吗？", "提示", {}).then(() => {
        if (this.type == 1) {
          this.add();
        } else if (this.type == 2) {
          this.edit();
        }
      });
    },
    add() {
      let magazine = JSON.parse(JSON.stringify(this.currentForm.magazine));
      let publishPlan = JSON.parse(
        JSON.stringify(this.currentForm.publishPlan)
      );
      publishPlan.items = publishPlan.items.map(item => {
        item.price *= 100;
        return item;
      });
      let subscribePlans = JSON.parse(
        JSON.stringify(this.currentForm.subscribePlans)
      );
      // subscribePlans = subscribePlans.map(item => {
      //   item.price *= 100;
      //   return item;
      // });
      let body = {
        magazine,
        publishPlan,
        subscribePlans
      };
      console.log(body);
      this.$api
        .addMagazine(body)
        .then(res => {
          console.log(res);
          this.$message({
            message: "新增成功",
            type: "success"
          });
          this.$router.go(-1);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {});
    },
    edit() {
      let magazine = JSON.parse(JSON.stringify(this.currentForm.magazine));
      let body = {
        ...magazine,
        id: this.magazineId
      };
      console.log(body);
      this.$api
        .editMagazine(body)
        .then(res => {
          console.log(res);
          this.$message({
            message: "编辑成功",
            type: "success"
          });
          this.$refs.form.scrollIntoView();
          this.getMagazine();
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {});
    },
    // 上传图片
    uploadImg() {
      let body = {
        fd: this.fd
      };
      this.$api
        .uploadMagazineCover(body)
        .then(res => {
          this.currentForm.magazine.coverUrls.push(res.params.url);
          this.imageUrl = "";
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.uploadImgLoading = false;
        });
    },
    uploadEditImg(fd, callback) {
      let body = {
        fd: fd
      };
      this.$api
        .uploadMagazineCover(body)
        .then(res => {
          console.log(res);
          callback(res.params.url);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {});
    },
    select(type) {
      if (this.currentAction == 1) {
        return;
      }
      if (type == 0) {
        this.studentVisible = true;
      } else if (type == 1) {
        this.carBrandVisible = true;
      }
    },
    getImgFd(fd) {
      console.log(fd);
      this.fd = fd;
      this.uploadImgLoading = true;
      this.uploadImg();
    },
    delCover(index) {
      this.currentForm.magazine.coverUrls.splice(index, 1);
    },
    setCover(index) {
      this.currentForm.magazine.coverUrls.unshift(
        this.currentForm.magazine.coverUrls.splice(index, 1)[0]
      );
    },
    changeType() {
      this.currentForm.magazine.categoryId = null;
    },
    toEditPublishPlan() {
      this.publishPlan = JSON.parse(
        JSON.stringify(this.currentForm.publishPlan)
      );
      this.publishPlanVisible = true;
    },
    changePublishType(value) {
      console.log(value);
      let items = [];
      switch (value) {
        case 1:
          items = [
            {
              day: 7,
              price: 0
            }
          ];
          break;
        case 2:
          items = [
            {
              day: 1,
              price: 0
            },
            {
              day: 15,
              price: 0
            }
          ];
          break;
        case 3:
          items = [
            {
              day: 1,
              price: 0
            }
          ];
          break;
        case 5:
          items = [
            {
              day: 1,
              price: 0
            }
          ];
          break;
        case 4:
          items = [
            {
              day: 1,
              month: 1,
              price: 0
            }
          ];
          break;
      }
      this.publishPlan.items = items;
    },
    addPublish(type) {
      if (type == 1) {
        this.publishPlan.items.push({
          month: 1,
          day: 1,
          price: 0
        });
      } else {
        this.basePublish.push({
          day: 1,
          price: 0
        });
      }
    },
    delPublish(index, type) {
      if (type == 1) {
        this.publishPlan.items.splice(index, 1);
      } else {
        this.basePublish.splice(index, 1);
      }
    },
    savePlan() {
      console.log(this.publishPlan);
      this.currentForm.publishPlan = this.publishPlan;
      this.publishPlanVisible = false;
      this.getMagazinePublishDate();
    },
    getMagazinePublishDate() {
      let body = {
        publishPlan: this.currentForm.publishPlan
      };
      this.$api
        .getMagazinePublishDate(body)
        .then(res => {
          console.log(res);
          let timeString = filters.formatTime(res.params.date, "yyyy-M-d");
          let [year, month, day] = timeString.split("-");
          console.log(year, month, day);
          this.currentForm.magazine.baseYear = Number(year);
          this.currentForm.magazine.baseMonth = Number(month);
          this.currentForm.magazine.baseDay = Number(day);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {});
    },
    addhalfMoonPublish() {
      this.basePublishVisible = true;
    },
    surePlan() {
      this.publishPlan.items = [];
      for (let i = 1; i <= 12; i++) {
        for (let j = 0; j < this.basePublish.length; j++) {
          this.publishPlan.items.push({
            month: i,
            ...this.basePublish[j]
          });
        }
      }
      this.basePublishVisible = false;
    },
    toEditSubscribePlan() {
      this.subscribePlanVisible = true;
    },
    addSubscribe() {
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
      this.addSubscribeVisible = true;
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
    saveSubscribe() {
      console.log(this.subscribePlan);
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
      this.subscribePlan.price *= 100;
      if (!this.subscribePlan.id) {
        this.currentForm.subscribePlans.push({
          id: ++this.subscribePlanId,
          ...this.subscribePlan
        });
      } else {
        this.currentForm.subscribePlans = this.currentForm.subscribePlans.map(
          item => {
            if (item.id == this.subscribePlan.id) {
              item = this.subscribePlan;
            }
            return item;
          }
        );
      }
      this.addSubscribeVisible = false;
    },
    seeSubscribe(row) {
      this.addSubscribeVisible = true;
      this.subscribePlan = JSON.parse(JSON.stringify(row));
      this.subscribePlan.price /= 100;
      let months = this.subscribePlan.months;
      this.subscribeMonth = months;
      this.inputMonth = 1;
      if (months != 3 && months != 6 && months != 12) {
        this.subscribeMonth = -1;
        this.inputMonth = months;
      }
    },
    delSubscribe(index) {
      this.currentForm.subscribePlans.splice(index, 1);
    }
  }
};
</script>

<style lang='scss'>
.form {
  .logo {
    .avatar-uploader-icon {
      width: 140px;
      height: 180px;
      line-height: 180px !important;
    }
    .avatar {
      width: 140px;
      height: 180px;
      display: block;
    }
  }
  .editor-see {
    height: 300px;
    border: 1px solid #ccc;
    line-height: 1.3;
    overflow-y: scroll;
  }
  .el-checkbox + .el-checkbox {
    margin-left: 0px;
  }
  .el-checkbox {
    margin-right: 25px;
  }

  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .cover-list {
    margin-bottom: -10px;
    line-height: 1;
    overflow: hidden;
    //margin-right: 10px;
    // margin-bottom: 20px;
    li {
      float: left;
      text-align: center;
      margin-bottom: 10px;
      margin-right: 10px;
      img {
        // margin: 10px;
        // border: 1px solid #ccc;
        width: 140px;
        height: 180px;
        display: block;
      }
      .clearfix {
        // margin-top: 10px;
        padding: 5px;
      }
    }
  }
}
</style>
