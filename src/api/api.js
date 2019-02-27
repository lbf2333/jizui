import axios from "axios";
import apiRoot from "./config";
import { Message } from "element-ui";

// 用promise封装请求方法
const $http = {
  get(url, params = {}, errors = []) {
    return new Promise((resolve, reject) => {
      if (url.indexOf("excel") != -1 || url.indexOf("zip") != -1) {
        axios
          .get(url, { responseType: "blob" })
          .then(res => {
            resolve(res.data);
          })
          .catch(error => {
            reject(error);
          });
        return;
      }
      axios
        .get(url, { params })
        .then(res => {
          // console.log(res)
          let { code, msg } = res.data;
          if (Number(code) !== 1) {
            if (Number(code) !== 4) {
              let error = errors.find(error => {
                return Number(code) === error.code;
              });
              console.log(error);
              msg = error ? error.msg : msg;
              Message({
                message: msg,
                type: "error"
              });
            }
            reject(res.data);
          } else {
            resolve(res.data);
          }
        })
        .catch(error => {
          // console.log(error)
          reject(error);
        });
    });
  },
  post(url, body, params = {}, errors = []) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, body, params)
        .then(res => {
          // console.log(res)
          let { code, msg } = res.data;
          if (Number(code) !== 1) {
            let error = errors.find(error => {
              return Number(code) === error.code;
            });
            msg = error ? error.msg : msg;
            Message({
              message: msg,
              type: "error"
            });
            reject(res);
          } else {
            resolve(res.data);
          }
        })
        .catch(error => {
          // console.log(error)
          reject(error);
        });
    });
  },
  put(url, body, params = {}, errors = []) {
    return new Promise((resolve, reject) => {
      axios
        .put(url, body, params)
        .then(res => {
          // console.log(res)
          let { code, msg } = res.data;
          if (Number(code) !== 1) {
            let error = errors.find(error => {
              return Number(code) === error.code;
            });
            msg = error ? error.msg : msg;
            Message({
              message: msg,
              type: "error"
            });
            reject(res);
          } else {
            resolve(res.data);
          }
        })
        .catch(error => {
          // console.log(error)
          reject(error);
        });
    });
  },
  delete(url, errors = []) {
    return new Promise((resolve, reject) => {
      axios
        .delete(url)
        .then(res => {
          // console.log(res)
          let { code, msg } = res.data;
          if (Number(code) !== 1) {
            let error = errors.find(error => {
              return Number(code) === error.code;
            });
            msg = error ? error.msg : msg;
            Message({
              message: msg,
              type: "error"
            });
            reject(res);
          } else {
            resolve(res.data);
          }
        })
        .catch(error => {
          // console.log(error)
          reject(error);
        });
    });
  }
};

console.log(apiRoot);
export const API_ROOT = apiRoot;

/*
 系统管理
*/
// 登录
export const login = body => {
  return $http.post(`/token/admin`, body);
};
// 修改密码
export const updatePwd = body => {
  return $http.put(`/admin/`, body);
};

/*
 省市区管理
*/
// 获取所有省份
export const getProvinces = () => {
  return $http.get(`/location/provinces`);
};
// 获取当前省份下的所有城市
export const getCitys = urlParams => {
  return $http.get(`/location/${urlParams.provinceId}/cities`);
};
// 获取当前省份下的所有城市
export const getDistricts = urlParams => {
  return $http.get(`/location/${urlParams.cityId}/district`);
};

/*
 分类管理
*/
// 获取全部分类跟标签
export const getCategorysAndTags = () => {
  return $http.get(`/category/filter`);
};
// 根据类型分页获取分类列表 parent=1：杂志，parent=2：教辅
export const getCategorys = params => {
  return $http.get(`/category`, params);
};
// 添加分类
export const addCategory = body => {
  return $http.post(`/category`, body);
};
// 编辑分类
export const editCategory = ({ urlParams, body }) => {
  return $http.put(`/category/${urlParams.categoryId}`, body);
};
// 删除分类
export const delCategory = urlParams => {
  return $http.delete(`/category/${urlParams.categoryId}`);
};

/*
 用户管理
*/
// 分页获取用户列表
export const getUsers = params => {
  return $http.get(`/user`, params);
};

/*
 学校管理
*/
// 分页获取学校列表
export const getSchools = params => {
  return $http.post(`/common/school/search`, params);
};
// 根据id获取学校
export const getSchool = urlParams => {
  return $http.get(`/common/school/${urlParams.schoolId}`);
};
// 新增学校
export const addSchool = body => {
  return $http.post(`/common/school`, body);
};
// 编辑学校
export const editSchool = ({ urlParams, body }) => {
  return $http.put(`/common/school/${urlParams.schoolId}`, body);
};
// 删除学校
export const delSchool = urlParams => {
  return $http.delete(`/common/school/${urlParams.schoolId}`);
};

/*
 订单管理
*/
// 多条件分页获取订单列表
export const getOrders = params => {
  return $http.get(`/order`, params);
};
// 根据id获取订单
export const getOrder = urlParams => {
  return $http.get(`/order/${urlParams.orderNo}`);
};
// 编辑学校
export const editOrder = ({ urlParams, body }) => {
  return $http.put(`/order/${urlParams.orderNo}`, body);
};

/*
 杂志管理
*/
// 根据类型分页获取杂志列表
export const getMagazines = params => {
  return $http.get(`/magazine`, params);
};
// 根据id获取杂志
export const getMagazine = urlParams => {
  return $http.get(`/magazine/${urlParams.magazineId}`);
};
// 新增杂志
export const addMagazine = body => {
  return $http.post(`/magazine`, body);
};
// 编辑杂志
export const editMagazine = body => {
  return $http.put(`/magazine`, body);
};
// 获取出版时间
export const getMagazinePublishDate = body => {
  return $http.post(`/magazine/closestPublishDate`, body);
};
// 上传杂志的封面图片
export const uploadMagazineCover = body => {
  return $http.post(`/magazine/cover`, body.fd);
};
// 根据杂志id获取出版计划
export const getPublishPlan = urlParams => {
  return $http.get(`/magazine/${urlParams.magazineId}/publishPlan`);
};
// 上下架杂志
// 根据杂志id获取出版计划
export const updateMagazineStatus = urlParams => {
  return $http.put(`/magazine/${urlParams.magazineId}/${urlParams.enabled}`);
};

/*
 订阅方案管理
*/
// 根据杂志id获取订阅方案列表
export const getSubscribePlans = params => {
  return $http.get(`/subscribePlan/subscribePlan`, params);
};
// 根据id获取订阅方案
export const getSubscribePlan = urlParams => {
  return $http.get(`/subscribePlan/${urlParams.subscribePlanId}`);
};
// 新增订阅方案
export const addSubscribePlan = body => {
  return $http.post(`/subscribePlan`, body);
};
// 删除订阅方案
export const delSubscribePlan = urlParams => {
  return $http.delete(`/subscribePlan/${urlParams.subscribePlanId}`);
};
// 恢复删除订阅方案
export const recoverSubscribePlan = urlParams => {
  return $http.delete(`/subscribePlan/${urlParams.subscribePlanId}/restore`);
};

/*
 评论管理
*/
// 根据评论类型获取评论列表  //evaluate:评价 0：所有 1：好评 2：中评 3：差评
export const getComments = params => {
  return $http.get(`/comment`, params);
};

/*
 出版计划管理
*/
// 查出版计划的学校列表
export const getSchoolsByPlanId = ({ urlParams, params }) => {
  return $http.get(`/publishPlan/${urlParams.planId}/school`, params);
};
//发货
export const execution = ({ urlParams, params }) => {
  return $http.post(`/publishPlan/${urlParams.planId}/execution`, params);
};
//已完成出版计划
export const getPlanfinish = params => {
  return $http.get(`/publishPlan/finish`, params);
};
//未完成出版计划
export const getPlannotfinish = params => {
  return $http.get(`/publishPlan/notFinish`, params);
};
//导出某一出版计划所有数据
export const excelPlan = urlParams => {
  return $http.get(`excel/publishPlan/${urlParams.planId}`);
};
//导出某一出版计划的某一学校
export const excelSchool = urlParams => {
  return $http.get(
    `excel/publishPlan/${urlParams.planId}/${urlParams.schoolId}`
  );
};
//导出某一出版计划的某一学校压缩包
export const zipSchool = urlParams => {
  return $http.get(`zip/publishPlan/${urlParams.planId}/${urlParams.schoolId}`);
};

/*
 钱包记录管理
*/
export const getRecords = params => {
  return $http.get(`/moneyRecord/find`, params);
};
//导出表格
export const excelRecord = () => {
  return $http.get(`excel/moneyRecord`);
};
