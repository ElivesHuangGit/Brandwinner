//index.js
//获取应用实例
const app = getApp()
const network = require('../../utils/util.js');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function (options) {
    var that = this;
    app.globalData.inviter=options.id;
    if (typeof (options.scene) != 'undefined') {
      var str = decodeURIComponent(options.scene).split(';');
      var publicId = str[1].split(':')[1];
      console.log('publicId='+publicId);
      app.globalData.publicId = publicId;
    }
    app.globalData.scene = options.scene;
    console.log('scene='+decodeURIComponent(options.scene))
    console.log("inviter=" + app.globalData.inviter);
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
    }
    wx.getSetting({
        success(res) {
            if (!res.authSetting['scope.userInfo']) {
            	//获取用户授权
                wx.authorize({
                  scope: 'scope.userInfo',
                  success() {
                    wx.getUserInfo({
                      success: res => {
                        console.log(111111111)
                        console.log(res);
                        app.globalData.dataInfo = res;
                        app.globalData.userInfo = res.userInfo;
                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (app.userInfoReadyCallback) {
                          app.userInfoReadyCallback(res)
                        }
                        that.login();
                      }
                    })

                  },
                  fail() {
                    that.alertUserInfo();
                  }
                })
            }else {
              that.getCurrentMeeting();
            }
        }
    })
    
  },
  login: function () {
    // 登录
    var that = this;
    wx.login({
      success: res => {
        console.log('code=' + res.code)
        app.globalData.code = res.code;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var url = "https://ma.bluemc.cn/user/login";
        var header = {};
        var params = {
          code: res.code
        };
        network.networkget(url, header, params, app).then(() => {
          //请求成功的操作
          var user_data = app.netWorkData.result;
          var users = wx.getStorageSync('users');
          if (users != '' && typeof (users) != 'undefined') {
            app.globalData.users = users;
          } else {
            app.saveUsers(user_data.data.openid, user_data.data.sessionId);
          }
          //获取到openId后提交用户信息
          users = {
            openId: user_data.data.openid,
            sessionId: user_data.data.sessionId
          }
          that.submitUser(app.globalData.dataInfo, users, app.globalData.inviter);
          that.getCurrentMeeting();
        });
      }
    })
  },
  //获取场次信息
  getCurrentMeeting:function() {
    //获取场次信息
    var that = this;
    var url = "https://ma.bluemc.cn/meets/info";
    var users = wx.getStorageSync('users');
    var header = {
      session: users.sessionId
    };
    var params = {};
    network.networkget(url, header, params, app).then(() => {
      //请求成功的操作
      var user_data = app.netWorkData.result;
      if (typeof (user_data.data) == 'undefined') {
        console.log('未获取到当前场次');
      } else {
        wx.setStorage({
          key: 'currentMeeting',
          data: user_data.data,
        });
        app.globalData.currentMeeting = user_data.data;
        that.jumpPage(user_data.data);
      }

    });
  },
  jumpPage:function(meeting) {
    var currentMeetingEnd = meeting.end;
    var endDate = new Date(Date.parse(currentMeetingEnd.replace(/-/g, "/"))).getTime();
    var now = new Date().getTime();
    if (now < endDate) {
      wx.redirectTo({
        url: '../tostart/tostart'
      })
    }
    if (now > endDate) {
      wx.redirectTo({
        url: '../waitResult/waitResult'
      })
    }
  },
  //用户信息提交服务器
  submitUser: function (data, users, inviter) {
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var url = "https://ma.bluemc.cn/user/" + users.openId;
    var header = {
      session: users.sessionId
    };
    var params = {
      "avatarUrl": data.userInfo.avatarUrl,
      "city": data.userInfo.city,
      "country": data.userInfo.country,
      "gender": data.userInfo.gender,
      "openid": users.openId,
      "inviter": inviter,
      "nickName": data.userInfo.nickName,
      "province": data.userInfo.province,
      "publicno": app.globalData.publicId,
      "encryptedData": data.encryptedData,
      "iv":data.iv,
      "signature": data.signature
    }
    network.post(url, header, params, app).then(() => {
      //请求成功的操作
      var result = app.netWorkData.result;
      console.log(result);
    });
  },
  getUserInfo: function (e) {
    console.log(e)
    if (e.detail.errMsg != 'getUserInfo:ok') {
      this.alertUserInfo();
    }else {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      this.login();
    }
    
  },
  alertUserInfo:function () {
    wx.showModal({
      content: '请允许授权小程序获取您的用户信息，否则无法进行答题！',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    });
  },
  into: function () {
    wx.navigateTo({
      url: '../tostart/tostart'
    })
  }
})
