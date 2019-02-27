//不足10补0
let formatNumber = function(n) {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

// 将时间戳格式化成基本格式时间(yyyy-MM-dd hh:mm:ss q S)
let formatTime = (date, fmt = "yyyy-MM-dd hh:mm:ss") => {
  if (!date) {
    return;
  }
  let time = new Date(date);
  var o = {
    "M+": time.getMonth() + 1, // 月份
    "d+": time.getDate(), // 日
    "h+": time.getHours(), // 小时
    "m+": time.getMinutes(), // 分
    "s+": time.getSeconds(), // 秒
    "q+": Math.floor((time.getMonth() + 3) / 3), // 季度
    S: time.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (time.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : formatNumber(o[k])
      );
    }
  }
  return fmt;
};

// 格式化金额
let formatMoney = data => {
  if (!data && data != 0) {
    return "0.00";
  } else {
    return (data / 100).toFixed(2);
  }
};

// 格式化性别
let formatSex = data => {
  switch (data) {
    case 1:
      return "男";
    case 2:
      return "女";
    default:
      return "未知";
  }
};

let formatLocked = data => {
  return data ? "禁用" : "正常";
};

let formatType = data => {
  switch (data) {
    case 1:
      return "杂志";
    default:
      return "教辅";
  }
};

// 格式化出版计划状态
let formatPlanstatus = data => {
  switch (data) {
    case 0:
      return "未执行";
    case 1:
      return "正在执行";
    case 2:
      return "等待签收";
    case 3:
      return "执行完成";
    default:
      return "未知";
  }
};

let filters = {
  formatTime,
  formatMoney,
  formatSex,
  formatLocked,
  formatType,
  formatPlanstatus
};
export default filters;
