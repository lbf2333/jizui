// 验证手机号码
var validatePhone = (rule, value, callback) => {
  value = value + "";
  if (value.trim().length === 0) {
    callback(new Error("请输入手机号码"));
  } else if (value.trim().length !== 11) {
    callback(new Error("手机号码格式错误"));
  } else {
    callback();
  }
};
// 验证身份证
var validateIdCard = (rule, value, callback) => {
  value = value + "";
  if (value.trim().length === 0) {
    callback(new Error("请输入身份证"));
  } else if (value.trim().length > 0) {
    if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17})(\d|X|x)$/.test(value.trim())) {
      callback(new Error("身份证格式错误"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};
// 表单验证广告位置
var validatePosition = (rule, value, callback) => {
  if (!value || value.length === 0) {
    callback(new Error("输入不能为空"));
  } else if (!/^\d*$/.test(value)) {
    callback(new Error("必须输入自然数"));
  } else if (Number(value) < 1) {
    callback(new Error("广告位置输入错误"));
  } else {
    callback();
  }
};

// 表单验证输入价格
var validatePrice = (rule, value, callback) => {
  if (value.length === 0) {
    callback(new Error("输入不能为空"));
  } else if (Number(value) === 0) {
    callback(new Error("金额不能为0"));
  } else if (
    /(^0\.\d{1,2}$)|(^[1-9](\d+)?(\.\d{1,2})?$)/.test(value) === false
  ) {
    callback(new Error("请输入正确的金额"));
  } else {
    callback();
  }
};

// 表单验证输入id
var validateId = (rule, value, callback) => {
  if (value.length === 0) {
    callback(new Error("输入不能为空"));
  } else if (Number(value) === 0) {
    callback(new Error("id不能为0"));
  } else if (/(^[1-9](\d+)?$)/.test(value) === false) {
    callback(new Error("请输入正确的id"));
  } else {
    callback();
  }
};

export {
  validatePhone,
  validateIdCard,
  validatePosition,
  validatePrice,
  validateId
};
