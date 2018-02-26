const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function toThousands(num) {
  var num = (num || 0).toString(), result = '';
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) { result = num + result; }
  return result;
}
const app = getApp();
function post(url, headers, params, app) {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      header: headers,
      data: params,
      method: 'POST',
      success: function (res) {
        console.log('返回结果：')
        console.log(res.data)
        app.netWorkData.result = res.data
        resolve();
      }
    })
  });
  return promise;
}
function networkget(url, headers, params, app) {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      header: headers,
      data: params,
      method: 'GET',
      success: function (res) {
        console.log('返回结果：')
        console.log(res.data)
        app.netWorkData.result = res.data
        resolve();
      }
    })
  });
  return promise;
}
function getNowTime(app) {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: 'https://ma.bluemc.cn/time',
      data: {},
      method: 'GET',
      success: function (res) {
        console.log('返回服务器当前时间：')
        console.log(res.data)
        app.netWorkData.result = res.data
        resolve();
      }
    })
  });
  return promise;
}
module.exports = {
  formatTime: formatTime,
  toThousands: toThousands,
  post: post,
  networkget: networkget,
  getNowTime: getNowTime
}
