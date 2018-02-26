const app = getApp()
const network = require('../../utils/util.js');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    resultTime: '00:00',
    isFinal: false,
    finialUserBestTime: 0,
    finialRank: -1,
    bonusRank: 0,
    finialBones: 0,
    currentMeetingId:''
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
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

    var now = new Date();
    var resultStr = "";
    var currentMeeting = wx.getStorageSync('currentMeeting');
    this.setData({
      currentMeetingId: currentMeeting.id
    })
    now = new Date(currentMeeting.end.replace(/-/g, "/"));
    now.setMinutes(now.getMinutes() + 30);
    function dateFormat(num) {
      var str;
      if (num < 10) {
        str = "0" + num.toString();
      }
      else {
        str = num.toString();
      }
      return str;
    }
    resultStr = dateFormat(now.getHours()) + ":" + dateFormat(now.getMinutes());
    this.setData({
      resultTime: resultStr
    });
    var users = wx.getStorageSync('users');
    var url = "https://ma.bluemc.cn/meets/" + currentMeeting.id + "/rank/" + users.openId;
    var header = {
      session: users.sessionId
    };
    var params = {};
    that.getResult(url, header, params, app);
    if (users !='' && users!=undefined) {
      var countTime = setInterval(function () {     
        that.getResult(url, header, params, app);
        if (that.data.isFinal ==true){
          clearInterval(countTime);
        }       
      }, 30000)
    } else {
      console.log("未获取到用户");
    }

  },
  getResult: function (url, header, params, app){
    network.networkget(url, header, params, app).then(() => {
      //请求成功的操作
      var user_data = app.netWorkData.result;
      console.log("请求最终结果数据:");
      console.log(user_data);
      if (user_data.data.final == true) {
        this.setData({
          isFinal: user_data.data.final,
          finialBones: parseInt(user_data.data.bonus),
          finialUserBestTime: (parseInt(user_data.data.userBestTime) / 1000).toFixed(2),
          finialRank: user_data.data.rank
        })
      }
    });
  },
  getUserInfo: function (e) {
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  goRank: function (e) {
    wx.navigateTo({
      url: '../rankList/rankList',
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
    var titleTxt;
    if (this.data.isFinal == true && this.data.finialBones != 0){
      titleTxt = '我答题得了' + this.data.finialBones+ '元！领取复活卡，下次就是你！'
    } else if (this.data.finialRank != -1){
      titleTxt = '有人答题得了10000元！领取复活卡，下次就是你！' 
    }
    return {
      title: titleTxt,
      path: '/pages/index/index?id=' + users.openId,
      imageUrl: '/images/shareImg.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
