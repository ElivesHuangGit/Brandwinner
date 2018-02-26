// pages/introduce/introduce.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeCon:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var currentMeeting = wx.getStorageSync('currentMeeting');
    this.setData({
      startTime: currentMeeting.start,
      endTime: currentMeeting.end
    })
    var start = new Date();
    var end = new Date();
    var resultStr = "";
    start = new Date(currentMeeting.start.replace(/-/g, "/"));
    end = new Date(currentMeeting.end.replace(/-/g, "/"));
    start.setMinutes(start.getMinutes());
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
    resultStr = start.getFullYear() + "年" + (start.getMonth() + 1) + "月" + start.getDate() + "日" + dateFormat(start.getHours()) + ":" + dateFormat(start.getMinutes()) + " - " + dateFormat(end.getHours()) + ":" + dateFormat(end.getMinutes());
    this.setData({
      timeCon:resultStr
    })


  },

goAgreement:function(){
  wx.navigateTo({
    url: '../agreement/agreement',
  })
},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})