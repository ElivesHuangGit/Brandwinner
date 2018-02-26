// pages/anspage_ready/anspage_ready.js
var total_second = 1 * 3 * 1;

/* 毫秒级倒计时 */
function countDown(that) {
  // 渲染倒计时时钟
  that.setData({
    clock: total_second
  });

  if (total_second < 1) {
    that.setData({ });
    total_second = 1 * 3 * 1;
    that.toqa();
    // timeout则跳出递归
    return;
  }
  setTimeout(function () {
    // 放在最后--
    total_second -= 1;
    countDown(that);
  }
    , 1000)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clock:'3',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var that = this;
    countDown(that);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
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
  
  },
  /**
   * 跳转到答题页面
   */
  toqa: function () {
    wx.redirectTo({
      url: '../questions/questions'
    })
  }
})