const app = getApp();
const network = require('../../utils/util.js');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    success_hidden: true,
    failure_hidden: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    minUserTime: -1,
    bonus: 0,
    bestBones: 0,
    timeDiff: 0,
    thisTime: 0,
    currentMeetingId:''
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    var that = this;
    if (options.showPage == 1) {
      this.setData({
        success_hidden: false,
        failure_hidden: true
      })
    } else if (options.showPage == 0) {
      this.setData({
        success_hidden: true,
        failure_hidden: false
      })
    }
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
    var ansObj = wx.getStorageSync('ansResultObj');
    this.setData({
      thisTime: (parseInt(ansObj.time)/1000).toFixed(2) 
    })
    var users = wx.getStorageSync('users');
    var currentMeeting = wx.getStorageSync('currentMeeting');
    this.setData({
      currentMeetingId: currentMeeting.id
    })
    var url = "https://ma.bluemc.cn/meets/" + currentMeeting.id + "/rank/" + users.openId;
    var header = {
      session: users.sessionId
    };
    var params = {};
    network.networkget(url, header, params, app).then(() => {
      //请求成功的操作
      var user_data = app.netWorkData.result;
      user_data.data.meetingId = currentMeeting.id;

      wx.setStorage({
        key: 'MeetRank',
        data: user_data.data,
      });
      console.log("user_data:");
      console.log("ffffffffffff:");
      console.log(user_data);
      if (user_data.data.final == false) {
        wx.getStorage({
          key: 'currentMeeting',
          success: function (res) {
            that.setData({
              bestBones: res.data.maxBonus
            })
          }
        })

        if (user_data.data.userBestTime != -1) {
          that.setData({
            timeDiff: ((parseInt(user_data.data.userBestTime) - parseInt(user_data.data.bestTime)) / 1000).toFixed(2),
            bonus: parseInt(user_data.data.bonus),
            minUserTime: (parseInt(user_data.data.userBestTime) / 1000).toFixed(2)
          })
        }
      }

    }
    )

  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  answerAgain: function () {
    wx.redirectTo({
      url: '../tostart/tostart',
    })
  },
  toRule: function () {
    wx.navigateTo({
      url: '../introduce/introduce',
    })
  },
  onShareAppMessage: function (res) {
    var users = wx.getStorageSync('users');
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    var titleTxt, imageUrl;
    if (this.data.minUserTime != -1 ) {
      titleTxt = '我最快' + this.data.minUserTime +'秒完成答题！最高可得10000元，速来！ '
    } else if (this.data.minUserTime == -1) {
      titleTxt = '我正在答题，最高可得10000元，速来！'
    }
    return {
      title: titleTxt ,
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
