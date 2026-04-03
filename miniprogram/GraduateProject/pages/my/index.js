const { getUserInfo } = require("../../utils/auth")

Page({
  data: {
    userInfo: null
  },

  onShow() {
    this.setData({
      userInfo: getUserInfo()
    })
  },

  goMyPublish() {
    wx.navigateTo({
      url: "/pages/my-publish/index"
    })
  }
})