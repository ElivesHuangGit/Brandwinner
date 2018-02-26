//app.js
const network = require('./utils/util.js');
App({
  globalData: {
    userInfo: null,
    publicId:null,
    currentMeeting: null,
    libs: {},//题库
    item: [],//当前做的题
    answer: [],//答案
    time: 0,
    rescards: 0//复活卡次数
  },
  netWorkData: {
    result: { code: -1, msg: '发起请求失败' }
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    //wx.clearStorageSync();
    //读取本地题库，赋值到全局变量
    var that = this;
    var libs = wx.getStorageSync('libs');
    if (libs != '' && typeof (libs) != 'undefined') {
      this.globalData.libs = libs;
    }
    else {
      //第一次启动，设置默认题库
      
      console.log(2222)
      that.setDefaultData();
    }
    

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //设置默认科目和题库排序
  setDefaultData: function () {
    var defaultLibs = require('./utils/qa').defaultLibs;
    this.globalData.libs = defaultLibs;

    wx.clearStorageSync()
    wx.setStorage({
      key: 'libs',
      data: defaultLibs,
    });
  },
  onHide:function() {
    
  },
  //保存用户登录信息
  saveUsers: function (openId, sessionId) {
    var users = {
      openId: openId,
      sessionId: sessionId
    }
    this.globalData.users = users;
    wx.setStorage({
      key: 'users',
      data: users,
    });
  }
})