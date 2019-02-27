import store from "./store";
import "babel-polyfill";
import Vue from "vue";
import App from "./App";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueRouter from "vue-router";
import router from "./router";
import "font-awesome/css/font-awesome.min.css";
// import filters from "./filters";
import api from "./api";
import defaultImg from "@/assets/images/default.jpg";
Vue.use(ElementUI);
Vue.use(VueRouter);

Vue.config.productionTip = false;

// 全局注册自定义过滤器
// Object.keys(filters).forEach(key => {
//     Vue.filter(key, filters[key])
// })

// 接口地址
// console.log(api.API_ROOT);

// 网络图片前缀
Vue.prototype.imgUrlPre =
  "https://heysenior.oss-cn-shenzhen.aliyuncs.com/images";

// 本地图片前缀
Vue.prototype.imgUrlPreLocal = api.API_ROOT + "/images";

// 默认头像图片
Vue.prototype.$defaultImg = defaultImg;

// 引入全局的api接口
Vue.prototype.$api = api;

// 引入Promise对象有一个finally方法
require("promise.prototype.finally").shim();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
