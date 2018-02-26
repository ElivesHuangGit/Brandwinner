/* pages/tostart/tostart.js */
const app = getApp();
const network = require('../../utils/util.js');
/** 
 * 需要一个目标日期，初始化时，先得出到当前时间还有剩余多少秒
 * 1.将秒数换成格式化输出为XX天XX小时XX分钟XX秒 XX
 * 2.提供一个时钟，每10ms运行一次，渲染时钟，再总ms数自减10
 * 3.剩余的秒次为零时，return，给出tips提示说，已经截止
 */
// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数



/* 毫秒级倒计时 */
function count_down(that) {
  // 渲染倒计时时钟
  that.setData({
    clock: date_format(that.total_micro_second)
  });

  if (that.total_micro_second <= 0) {
    that.setData({
      clock: "",
      tostart_hidden: true,
      into_hidden: false,
    });
    // timeout则跳出递归
    return;
  }
  setTimeout(function () {
    // 放在最后--
    that.total_micro_second -= 100;
    count_down(that);
  }
    , 100)
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

  return hr + ":" + min + ":" + sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    clock: '',
    cardnum: '',
    tostart_hidden: false,
    into_hidden: true,
    short_time: '--',
    rank: '--',//7688883
    bonus: '--',
    questxt: '进入答题',
    formtxt: '开场提醒',
    endTime: '',
    total_micro_second: 1 * 5 * 1000,
    currentMeeting: {},
    currentMeetingStart: 0,
    currentMeetingEnd: 0,
    currentMeetingId: '',
    startDate: 0,
    now: 0,
    hideArrow:'show',
    hideFlag:true,
    getDate: null,
    getDateFo: null,
    endDate: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload------------"  );
    // console.log(wx.getSystemInfoSync());
    var that = this;
    var systemInfo = wx.getSystemInfoSync();
    //请求成功的操作
    var meeting = wx.getStorageSync('currentMeeting');
    that.currentMeeting = meeting;
    that.currentMeetingId = that.currentMeeting.id;
    count_down(that);
  },
  onShow: function () {
    var that = this;
    var users = wx.getStorageSync('users');
    network.getNowTime(app).then(() => {
      var result = app.netWorkData.result;
      console.log('当前时间='+result);
      app.globalData.now = result;
      that.showPage();
      that.getCards(users);
    });
    if (app.globalData.subForm) {
      this.setData({
        formtxt: '预约成功'
      })
    }
  },
  //根据场次信息判断页面显示
  showPage: function (callback) {
    var that = this;
    var users = wx.getStorageSync('users');
    var MeetRank = wx.getStorageSync('MeetRank');
    //请求成功的操作
    var meeting = wx.getStorageSync('currentMeeting');
    that.currentMeeting = meeting;
    that.setData({
      currentMeetingId: that.currentMeeting.id
    })
    that.currentMeetingStart = that.currentMeeting.start;
    that.currentMeetingEnd = that.currentMeeting.end;
    that.startDate = new Date(Date.parse(that.currentMeetingStart.replace(/-/g, "/"))).getTime();
    that.currentMeetingId = that.currentMeeting.id;
    that.now = app.globalData.now;
    that.getDate = new Date(Date.parse(that.currentMeetingEnd.replace(/-/g, "/")));
    that.getDateFo = ((that.getDate.getHours()) < 10 ? ('0' + that.getDate.getHours()) : (that.getDate.getHours())) + ':' + ((that.getDate.getMinutes()) < 10 ? ('0' + that.getDate.getMinutes()) : (that.getDate.getMinutes()));
    that.endDate = new Date(Date.parse(that.currentMeetingEnd.replace(/-/g, "/"))).getTime();
    if (that.startDate > that.now) {
      that.total_micro_second = that.startDate - that.now;
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        endTime: that.getDateFo
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          endTime: getDateFo
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            endTime: that.getDateFo
          })
        }
      })
    }
    if (that.startDate < that.now && that.endDate > that.now) {
      that.setData({
        tostart_hidden: true,
        into_hidden: false,
      })
    } else if (that.startDate > that.now) {
      that.setData({
        tostart_hidden: false,
        into_hidden: true,
      })
    } else if (that.endDate < that.now) {
      that.tonotans();
    }
    
    if (MeetRank) {
      if (MeetRank.rank != -1 && MeetRank.meetingId == meeting.id) {
        that.setData({
          questxt: '再次答题',
          rank: network.toThousands (MeetRank.rank),
          bonus: parseInt(MeetRank.bonus) + '元',
          short_time: ((MeetRank.userBestTime) / 1000).toFixed(2) + '秒'
        })
      } else {
        that.setData({
          questxt: '进入答题',
          rank: that.data.rank,
          bonus: that.data.bonus,
          short_time: that.data.short_time
        })
      }
    } else {
      that.setData({
        questxt: '进入答题',
        rank: that.data.rank,
        bonus: that.data.bonus,
        short_time: that.data.short_time
      })
    }
  },
  refreshCards:function() {
    var that = this;
    var users = wx.getStorageSync('users');
    that.setData({
      hideArrow:'hide',
      hideFlag:false
    })
    that.getCards(users);
    setTimeout(function () {
      if (that.data.hideArrow == 'hide') {
        that.setData({
          hideArrow: 'show',
          hideFlag:true
        });
      }
      console.log('显示箭头')
    }, 2000)
  },
  //获取复活卡
  getCards: function (users) {
    var that = this;
    //获取复活卡
    var userId = users.openId;
    var url = "https://ma.bluemc.cn/user/" + userId + "/cards";
    var header = {
      session: users.sessionId
    };
    var params = {};
    console.log("请求复活卡数量----openId=" + userId);
    network.networkget(url, header, params, app).then(() => {
      //请求成功的操作
      var result = app.netWorkData.result;
      wx.setStorage({
        key: 'cards',
        data: result.data.cards,
      });
      that.setData({
        cardnum: result.data.cards
      });
      that.getQuestions();
    });
  },
  getQuestions: function () {
    //重新获取题库
    var users = wx.getStorageSync('users');
    var url = "https://ma.bluemc.cn/meets/" + this.currentMeetingId + "/qa";
    var header = {
      session: users.sessionId
    };
    var params = {};
    network.networkget(url, header, params, app).then(() => {
      //请求成功的操作
      var result = app.netWorkData.result;
      app.globalData.libs = result.data;
      wx.setStorage({
        key: 'libs',
        data: result.data,
      });
    })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //进入准备答题页面
  toqaReady: function () {
    var that = this;
    network.getNowTime(app).then(() => {
      var result = app.netWorkData.result;
      if (that.startDate < result && that.endDate > result) {
        wx.redirectTo({
          url: '../anspage_ready/anspage_ready'
        })
      } else if (that.endDate < result) {
        that.tonotans();
      }
    });
    
  },
  tonotans: function () {
    wx.redirectTo({
      url: '../waitResult/waitResult'
    })
  },
  torules: function () {
    wx.navigateTo({
      url: '../introduce/introduce'
    })
  },
  formSubmit: function (e) {
    if (!app.globalData.subForm) {
      console.log('form发生了submit事件,携带数据为：', e)
      app.globalData.subForm = true;
      wx.setStorage({
        key: 'subForm',
        data: true,
      });
      this.setData({
        formtxt: '预约成功'
      })
      this.booking(e.detail.formId);
    }else {
      console.log('pppppppppppppppp')
      return false;
    }
  },
  //提交formId用来预约通知
  booking:function(formId) {
    //重新获取题库
    var users = wx.getStorageSync('users');
    var url = "https://ma.bluemc.cn/user/" + users.openId + "/booking";
    var header = {
      session: users.sessionId
    };
    var params = {formid:formId};
    console.log('url='+url);
    console.log('openid='+ users.openId);
    console.log('formId='+formId);
    network.networkget(url, header, params, app).then(() => {
      //请求成功的操作
      var result = app.netWorkData.result;
      console.log("formId已提交");
      console.log(result);
    })
  },
  onShareAppMessage: function (res) {
    var users = wx.getStorageSync('users');
    console.log(users.openId)
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    var titleTxt;
    if (this.startDate < this.now && this.endDate > this.now) {
      titleTxt = '我正在答题，最高可得10000元，速来！'
    } else if (this.startDate > this.now) {
      titleTxt = '答题即将开始，最高可得10000元，速来！'
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