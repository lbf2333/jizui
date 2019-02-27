import axios from "axios";
import router from "../router";

// 设置超时时间
axios.defaults.timeout = 20000;
console.log(process.env.NODE_ENV);
const API_ROOT =
  process.env.NODE_ENV == "development"
    ? "http://192.168.2.202:8087"
    : "https://hljhouse.jizui.top/magazine";
// 导出接口地址
export default API_ROOT;
axios.defaults.baseURL = API_ROOT + "/api";
// http request 请求拦截器，axios请求时如果有token则携带token
axios.interceptors.request.use(
  config => {
    let token = sessionStorage.token;
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// http response 服务器响应拦截器
axios.interceptors.response.use(
  response => {
    console.log(response);
    // 授权失效，需要重新跳入登录页重新获取token
    switch (response.data.code + "") {
      case "18":
        response.data.msg = "登录超时，请重新登录";
        if (router.currentRoute.query.redirect) {
          return response;
        }
        router.replace({
          path: "/login",
          query: { redirect: router.currentRoute.fullPath } // 登录成功后跳入浏览的当前页面
        });
        break;
      case "6":
        response.data.msg = "请求频繁，请稍后重试。";
        break;
      case "4":
        response.data.msg = "查询结果为空";
        break;
      case "20":
        response.data.msg = "账号或密码错误";
        break;
      case "5":
        response.data.msg = "账号或密码错误";
        break;
      case "14":
        response.data.msg = "已存在";
        break;
      case "8":
        response.data.msg = "权限错误";
        break;
      case "10":
        response.data.msg = "请求参数错误";
        break;
      case "12":
        response.data.msg = "状态错误";
        break;
      case "0":
        response.data.msg = "请求错误";
        break;
    }
    return response;
  },
  error => {
    // console.log(error);
    // 请求超时处理
    var originalRequest = error.config;
    // console.log(error.code, error.message, originalRequest);
    if (
      error.message == "Network Error" ||
      (error.code == "ECONNABORTED" &&
        error.message.indexOf("timeout") != -1 &&
        !originalRequest._retry)
    ) {
      // console.log(error.config);
      router.push({
        path: "/timeOut"
      });
      // return;
    }
    if (error.response) {
      switch (error.response.status) {
        case 404: // 404状态，跳转到404处理页面
          // error.message = `请求地址出错: ${error.response.config.url}`;
          router.replace({
            path: "/404"
          });
          break;
      }
    }
    return Promise.reject(error);
    // return Promise.reject(error.response)
  }
);
