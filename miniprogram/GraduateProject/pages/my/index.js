const { getUserInfo } = require("../../utils/auth")
const { logout, login } = require("../../utils/login")

Page({
  data: {
    userInfo: null
  },

  onShow() {
    this.refreshUserInfo()
  },

  refreshUserInfo() {
    this.setData({
      userInfo: getUserInfo()
    })
  },

  goMyPublish() {
    wx.navigateTo({
      url: "/pages/my-publish/index"
    })
  },

  handleLogout() {
    wx.showModal({
      title: "提示",
      content: "确认退出登录吗？",
      success: (res) => {
        if (!res.confirm) return

        logout()
        const app = getApp()
        app.globalData.userInfo = null

        wx.showToast({
          title: "已退出登录",
          icon: "success"
        })

        this.refreshUserInfo()
      }
    })
  },

  async handleRelogin() {
    try {
      const userInfo = await login(true)
      const app = getApp()
      app.globalData.userInfo = userInfo
      this.refreshUserInfo()

      wx.showToast({
        title: "重新登录成功",
        icon: "success"
      })
    } catch (e) {
      console.error("重新登录失败", e)
    }
  }
})