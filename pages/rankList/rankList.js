const app = getApp()
const network = require('../../utils/util.js');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    userList:[],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    var currentMeeting = wx.getStorageSync('currentMeeting');
    var users = wx.getStorageSync('users');
    var url = "https://ma.bluemc.cn/meets/" + currentMeeting.id +"/charts";
    var header = {
      session: users.sessionId
    };
    var params = {
      offset:0,
      limit:100
    };
    network.networkget(url, header, params, app).then(() => {
      //请求成功的操作
      var user_data = app.netWorkData.result;
      this.setData({
        userList: user_data.data
      })
      console.log("user_data:");
      console.log("rrrrrrrrrrrrrrrrrrrr:");
      console.log(user_data);

    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function (res) {
      var users = wx.getStorageSync('users');
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '有人答题得了10000元！领取复活卡，下次就是你！',
      path: '/pages/index/index?id=' + users.openId,
      imageUrl: '',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
