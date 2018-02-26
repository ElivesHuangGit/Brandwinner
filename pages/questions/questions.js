// pages/main/single/single.js
var app = getApp();
const network = require('../../utils/util.js');
// var currentMeeting = app.getCurrentMeeting();
var startTime;
var total_micro_second = 30;
var nextQuestionTime = 1;
var qaNum = 0;//答错次数
var setNQTime;
var setTime;
var onConfirmTime;
var countTime;
// 倒计时
function setTm(that) {
  setTime = setInterval(function () {
    total_micro_second -= 1;
    that.setData({
      totalMicroSecond: total_micro_second
    })
    // console.log(total_micro_second)
    if (total_micro_second == 0) {
      that.setData({
        tipTxtHid: true,
        tipsimgsrc: that.data.timeoutsrc
      });
      if (that.data.item.answer == 'a') {
        that.setData({ bcA: that.data.bc_right, ansiconsrca: that.data.succicon });
      }
      else if (that.data.item.answer == 'b') {
        that.setData({ bcB: that.data.bc_right, ansiconsrcb: that.data.succicon });
      }
      else if (that.data.item.answer == 'c') {
        that.setData({ bcC: that.data.bc_right, ansiconsrcc: that.data.succicon });
      }
      let ansReslut = { "q": that.data.item.id, "c": 2 }
      that.data.ansArray.push(ansReslut);
      if (that.data.index < that.data.tishu - 1) {
        if (that.data.cardnum > 0 && that.data.deaths < 1) {
          clearTimeout(setNQTime)
          setNextQTime(that, 3)
          onConfirmTm(that);
        } else if (that.data.cardnum <= 0 || that.data.deaths >= 1) {
          clearTimeout(setNQTime)
          setNextQTime(that, 4)
          clearInterval(countTime);
        }
      } else if (that.data.index == that.data.tishu - 1) {
        if (that.data.cardnum > 0 && that.data.deaths < 1) {
          // that.postCards();
          clearInterval(setTime);
          let ansData = 'resultObj.data';
          let finishedData = 'resultObj.finished';
          let passData = 'resultObj.pass';
          let retryData = 'resultObj.retry';
          let useTimeData = 'resultObj.time';
          let deathsData = 'resultObj.usecard';
          // let endTime = new Date().getTime();
          let useTime = new Date().getTime() - startTime;
          that.setData({ [ansData]: that.data.ansArray, [finishedData]: new Date().getTime(), [passData]: 1, [retryData]: 0, [useTimeData]: useTime, [deathsData]: that.data.deaths });
          that.setAnsResult(that.data.resultObj);
          that.postAnsRusult(that.data.currentMeetingId, that.data.resultObj);
          clearTimeout(setNQTime)
          setNextQTime(that, 5)
        } else if (that.data.cardnum <= 0 || that.data.deaths >= 1) {
          clearTimeout(setNQTime)
          setNextQTime(that, 4)
          clearInterval(countTime);
        }
      }
      clearsetTm();
    }
  }, 1000);
}
function clearsetTm() {
  clearInterval(setTime);
  total_micro_second = 30;
}

function setNextQTime(that, ele) {
  setNQTime = setTimeout(function () {
    switch (ele) {
      case 1: //答题正确进入下一题
        that.nextQuestion();
        break;
      case 2://最后一题正确进入答题成功页面
        that.toAnsResultPage(1);
        break;
      case 3://答题错误一次弹出复活框
        that.showDialogBtn();
        break;
      case 4://最后答题错误进入答题错误页面
        that.toAnsResultPage(0);
        break;
      case 5://前面题全对但是最后题错误弹出复活卡进入答题成功页面
        that.showDialogBtn();
        setNextQTime(that,2);
        break;
    }

  }, 1000);
}
function onConfirmTm(that) {
  onConfirmTime = setTimeout(function () {
    that.onConfirm();
  }, 3000)
}

var displayTime = function (that) {
  startTime = new Date().getTime();
  var currentTime = 0; // 60秒
  countTime = setInterval(function () {
    currentTime++;
    that.setData({
      currentUseTime: parseFloat(currentTime)
    });
  }, 1000);
}



Page({
  data: {
    userInfo: '',
    currentMeetingId: '',
    cardnum: '',
    deaths: 0,
    totalMicroSecond: 30,
    tipTxtHid: false,
    showModal: false,
    btn_disabled: false,
    ansiconsrca: '',
    ansiconsrcb: '',
    tipsimgsrc: '',
    ansiconsrcc: '',
    awaitsrc: '../../images/await.png',
    timeoutsrc: '../../images/timeout.png',
    correctsrc: '../../images/correct.png',
    errorsrc: '../../images/error.png',
    eccicon: '../../images/erricon.png',
    succicon: '../../images/succicon.png',
    heartSrc:'',
    redheartSrc:'../../images/redheart.png',
    grayheartSrc:'../../images/grayheart.png',
    items: [],
    tishu: 0,
    index: 0,
    item: [],
    bc_default: 'background-color:#fff;color:#000',
    bc_right: 'background-color:#44AE64;color:#FFF',
    bc_wrong: 'background-color:#F6635F;color:#FFF',
    imgwh: 'width: 670rpx;height: 234rpx;',
    default_imgwh: 'width: 670rpx;height: 234rpx;',
    qus_imgwh:'width: 670rpx;height: 260rpx;',
    ques_img:'',
    // ques_top_img:'../../images/ques_top.png',
    ques_default_img:'../../images/ques_top.png',
    ques_media_img:'',
    videoHid:true,
    imgHid:false,
    ques_video:'',
    bcA: '',
    bcB: '',
    bcC: '',
    resultArray: [],
    resultObj: {},
    ansArray: [],
    currentUseTime: '0'
  },
  setQuestion: function () {
    var that = this;
    var i = that.data.index
    clearsetTm();
    setTm(this)
    this.setData({
      item: that.data.items[i],
      bcA: that.data.bc_default,
      bcB: that.data.bc_default,
      bcC: that.data.bc_default,
      tipsimgsrc: that.data.awaitsrc,
      ansiconsrca: '',
      ansiconsrcb: '',
      ansiconsrcc: '',
      totalMicroSecond: 30,
      tipTxtHid: false,
      btn_disabled: false,
    })
    if (this.data.item.media){
      let mediaindex = (this.data.item.media).lastIndexOf('.');
      let mediatype = (this.data.item.media).substring(mediaindex + 1).toLowerCase(); 
      if (mediatype == 'mp4' || mediatype == 'flv' || mediatype == '3gp' || mediatype == 'm4a' || mediatype == 'wmv'){
        this.setData({
          videoHid: false,
          imgHid: true,
          ques_video: that.data.item.media,
        })
      } else if (mediatype == 'gif' || mediatype == 'png' || mediatype == 'jpeg' || mediatype == 'jpg'){
        this.setData({
          videoHid: true,
          imgHid: false,
          imgwh: that.data.qus_imgwh,
          ques_img: that.data.item.media,
        })
      }
      
    }else{
      this.setData({
        videoHid: true,
        imgHid: false,
        imgwh: that.data.default_imgwh,
        ques_img: that.data.ques_default_img,
      })
    }
  },
  btnOpClick: function (e) {
    // clearInterval(setTime)
    var that = this;
    var select = e.currentTarget.id;
    if (select == that.data.item.answer) {
      let ansReslut = { "q": that.data.item.id, "c": 1 }
      that.data.ansArray.push(ansReslut);
      if (select == 'a') {
        this.setData({ bcA: that.data.bc_right, ansiconsrca: that.data.succicon, btn_disabled: true, });
      }
      else if (select == 'b') {
        this.setData({ bcB: that.data.bc_right, ansiconsrcb: that.data.succicon, btn_disabled: true,});
      }
      else if (select == 'c') {
        this.setData({ bcC: that.data.bc_right, ansiconsrcc: that.data.succicon, btn_disabled: true,});
      }
      if (that.data.index < that.data.tishu - 1) {
        // if (that.data.index <  1) {
        clearsetTm()
        this.setData({ tipsimgsrc: that.data.correctsrc, tipTxtHid: true });
        // this.nextQuestion();
        clearTimeout(setNQTime)
        setNextQTime(that, 1)
      } else if (that.data.index == that.data.tishu - 1) {
        clearInterval(setTime);
        let ansData = 'resultObj.data';
        let finishedData = 'resultObj.finished';
        let passData = 'resultObj.pass';
        let retryData = 'resultObj.retry';
        let useTimeData = 'resultObj.time';
        let deathsData = 'resultObj.usecard';
        // let endTime = new Date().getTime();
        let useTime = new Date().getTime() - startTime;
        this.setData({ [ansData]: that.data.ansArray, [finishedData]: new Date().getTime(), [passData]: 1, [retryData]: 0, [useTimeData]: useTime, [deathsData]: that.data.deaths });
        // let currKey = (that.data.userInfo.nickName).replace(/\./g, '') + '&' + that.data.currentMeetingId;
        // this.data.resultArray.push({ [currKey]:that.data.resultObj})
        // let currentMeetingData = `resultArray[${that.data.resultObj.retry - 1}].${currKey}`;
        // this.setData({ [currentMeetingData]: that.data.resultObj })
        this.setAnsResult(that.data.resultObj);
        this.postAnsRusult(that.data.currentMeetingId, that.data.resultObj);
        clearTimeout(setNQTime)
        setNextQTime(that, 2)

        // console.log(new Date().getTime())
        console.log(that.data.resultObj)
      }

    } else {
      if (select == 'a') {
        this.setData({ bcA: that.data.bc_wrong, ansiconsrca: that.data.eccicon, btn_disabled: true,  });
      }
      else if (select == 'b') {
        this.setData({ bcB: that.data.bc_wrong, ansiconsrcb: that.data.eccicon, btn_disabled: true, });
      }
      else if (select == 'c') {
        this.setData({ bcC: that.data.bc_wrong, ansiconsrcc: that.data.eccicon, btn_disabled: true,  });
      }
      if (that.data.item.answer == 'a') {
        this.setData({ bcA: that.data.bc_right, ansiconsrca: that.data.succicon });
      }
      else if (that.data.item.answer == 'b') {
        this.setData({ bcB: that.data.bc_right, ansiconsrcb: that.data.succicon });
      }
      else if (that.data.item.answer == 'c') {
        this.setData({ bcC: that.data.bc_right, ansiconsrcc: that.data.succicon });
      }
      let ansReslut = { "q": that.data.item.id, "c": 0 }
      that.data.ansArray.push(ansReslut);
      this.setData({ tipsimgsrc: that.data.errorsrc, deaths: qaNum, tipTxtHid: true });
      if (that.data.index < that.data.tishu - 1) {
        if (this.data.cardnum > 0 && this.data.deaths < 1) {
          clearsetTm()
          clearTimeout(setNQTime)
          setNextQTime(that, 3)
          clearTimeout(onConfirmTime);
          onConfirmTm(that);
        } else if (this.data.cardnum <= 0 || this.data.deaths >= 1) {
          clearInterval(setTime);
          let ansData = 'resultObj.data';
          let finishedData = 'resultObj.finished';
          let passData = 'resultObj.pass';
          let retryData = 'resultObj.retry';
          let useTimeData = 'resultObj.time';
          let deathsData = 'resultObj.usecard';
          let endTime = new Date().getTime();
          let useTime = endTime - startTime;
          this.setData({ [ansData]: that.data.ansArray, [finishedData]: endTime, [passData]: 0, [retryData]: 0, [useTimeData]: useTime, [deathsData]: that.data.deaths });
          // let currKey = (that.data.userInfo.nickName).replace(/\./g, '') + '&' + that.data.currentMeetingId;
          // this.data.resultArray.push({ [currKey]: that.data.resultObj })
          // let currentMeetingData = `resultArray[${that.data.resultObj.retry - 1}].${currKey}`;
          // this.setData({ [currentMeetingData]: that.data.resultObj })
          this.setAnsResult(that.data.resultObj);
          this.postAnsRusult(that.data.currentMeetingId, that.data.resultObj);
          clearTimeout(setNQTime)
          setNextQTime(that, 4)
          // console.log(startTime + ':' + endTime + ':' + useTime)
        }
      } else if (that.data.index == that.data.tishu - 1) {
        if (this.data.cardnum > 0 && this.data.deaths < 1) {
          clearInterval(setTime);
          let ansData = 'resultObj.data';
          let finishedData = 'resultObj.finished';
          let passData = 'resultObj.pass';
          let retryData = 'resultObj.retry';
          let useTimeData = 'resultObj.time';
          let deathsData = 'resultObj.usecard';
          let endTime = new Date().getTime();
          let useTime = endTime - startTime;
          this.setData({ [ansData]: that.data.ansArray, [finishedData]: endTime, [passData]: 0, [retryData]: 0, [useTimeData]: useTime, [deathsData]: that.data.deaths });
          // let currKey = (that.data.userInfo.nickName).replace(/\./g, '') + '&' + that.data.currentMeetingId;
          // this.data.resultArray.push({ [currKey]: that.data.resultObj })
          // let currentMeetingData = `resultArray[${that.data.resultObj.retry - 1}].${currKey}`;
          // this.setData({ [currentMeetingData]: that.data.resultObj })
          this.setAnsResult(that.data.resultObj);
          this.postAnsRusult(that.data.currentMeetingId, that.data.resultObj);
          clearTimeout(setNQTime)
          setNextQTime(that, 5)
          // console.log(startTime + ':' + endTime + ':' + useTime)
        } else if (this.data.cardnum <= 0 || this.data.deaths >= 1) {
          clearsetTm()
          clearTimeout(setNQTime)
          setNextQTime(that, 4)
          clearTimeout(onConfirmTime);
          onConfirmTm(that);
        }
      }
    }
  },
  nextQuestion: function () {
    var that = this;
    clearsetTm();
    setTm(that);
    if (that.data.index < that.data.tishu - 1) {
      this.setData({ index: that.data.index + 1 });
      that.setQuestion();
    }
  },
  lastQuestion: function () {
    var that = this;
    if (that.data.index > 0) {
      this.setData({ index: that.data.index - 1 });
      that.setQuestion();
    }
  },
  showRight: function () {
    var that = this;
    if (that.data.item[0] == 'A') {
      this.setData({ bcA: that.data.bc_right });
    }
    else if (that.data.item[0] == 'B') {
      this.setData({ bcB: that.data.bc_right });
    }
    else if (that.data.item[0] == 'C') {
      this.setData({ bcC: that.data.bc_right });
    }
  },
  bindPickerChange: function (e) {
    this.setData({ index: parseInt(e.detail.value) })
    var that = this;
    that.setQuestion();
  },
  onLoad: function (options) {
    var aa = getCurrentPages();
    var that = this;
    qaNum = 0;
    this.getAnsResult(that);
    var len = app.globalData.libs.length;
    var cards = wx.getStorageSync('cards');
    var meeting = wx.getStorageSync('currentMeeting');
    if (cards <= 0 ){
      this.setData({
        heartSrc: that.data.grayheartSrc
      })
    }else{
      this.setData({
        heartSrc: that.data.redheartSrc
      })
    }
    this.setData({
      userInfo: app.globalData.userInfo,
      currentMeetingId: meeting.id,
      items: app.globalData.libs,
      tishu: len,
      cardnum: cards,
    });
    this.setQuestion();
    displayTime(this);
  },
  onHide: function () {
    wx.redirectTo({
      url: '../tostart/tostart'
    })
    var that = this;
    this.setResu(that);
    this.postCards();
  },
  setResu:function(that){
    let ansReslut = { "q": that.data.item.id, "c": 0 }
    that.data.ansArray.push(ansReslut);
    clearInterval(setTime);
    clearsetTm();
    let ansData = 'resultObj.data';
    let finishedData = 'resultObj.finished';
    let passData = 'resultObj.pass';
    let retryData = 'resultObj.retry';
    let useTimeData = 'resultObj.time';
    let deathsData = 'resultObj.usecard';
    let useTime = new Date().getTime() - startTime;
    that.setData({ [ansData]: that.data.ansArray, [finishedData]: new Date().getTime(), [passData]: 0, [retryData]: 0, [useTimeData]: useTime, [deathsData]: that.data.deaths });
    that.setAnsResult(that.data.resultObj);
    that.postAnsRusult(that.data.currentMeetingId, that.data.resultObj);
    clearTimeout(setNQTime)
  },
  /**
   * 跳转到答题失败页面
   */
  toAnsResultPage: function (ele) {
    wx.redirectTo({
      url: '../answerSuccess/answerSuccess?showPage=' + ele
    })
  },

  /**
    * 弹窗
    */
  showDialogBtn: function () {
    this.postCards();
    qaNum += 1;
    this.setData({
      showModal: true,
      heartSrc: this.data.grayheartSrc
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
    this.nextQuestion();
    clearTimeout(onConfirmTime);
    let cardnums = this.data.cardnum - 1;
    this.setData({
      cardnum: cardnums,
      deaths: qaNum
    });
  },
  setAnsResult: function (param) {
    wx.setStorage({
      key: "ansResultObj",
      data: param
    });
  },
  //从缓存得到结果
  getAnsResult: function (that) {
    wx.getStorage({
      key: 'ansResultObj',
      success: function (res) {
        if (res.data) {
          that.setData({
            resultObj: res.data
          })
        }
      },
      // fail: function (that) {  //失败 第一次存入
      //   that.setAnsResult(that)
      // }
    })
  },
  //提交答题结果
  postAnsRusult: function (meetingid, params) {
    var users = wx.getStorageSync('users');
    var url = "https://ma.bluemc.cn/meets/" + meetingid + "/rank/" + users.openId;
    var header = {
      session: users.sessionId,
      'content-type': 'application/json'
    };
    // var params = {};
    network.post(url, header, params, app).then(() => {
      console.log("答题结果提交成功")
      // console.log(app.netWorkData.result)
    })
  },
  //修改复活卡数量
  postCards: function () {
    var users = wx.getStorageSync('users');
    var url = "https://ma.bluemc.cn/user/" + users.openId + "/cards";
    var header = {
      session: users.sessionId,
      'content-type': 'application/json'
    };
    var params = { "incr": -1 };
    network.post(url, header, params, app).then(() => {
      console.log("修改复活卡数量成功")
      // console.log(app.netWorkData.result)
    })
  }

})


