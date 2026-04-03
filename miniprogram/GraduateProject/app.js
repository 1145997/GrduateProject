const { login, logout } = require("./utils/login")

App({
  globalData: {
    userInfo: null
  },

  async onLaunch() {
    await this.restoreLogin()
  },

  async restoreLogin() {
    try {
      const userInfo = await login(false)
      this.globalData.userInfo = userInfo
      return userInfo
    } catch (e) {
      console.error("恢复登录失败", e)
      this.globalData.userInfo = null
      return null
    }
  },

  async relogin() {
    try {
      const userInfo = await login(true)
      this.globalData.userInfo = userInfo
      return userInfo
    } catch (e) {
      console.error("重新登录失败", e)
      this.globalData.userInfo = null
      throw e
    }
  },

  clearLogin() {
    logout()
    this.globalData.userInfo = null
  }
})