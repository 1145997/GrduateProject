const { request } = require("./utils/request")
const { setToken, setUserInfo } = require("./utils/auth")

App({
  globalData: {
    userInfo: null
  },

  onLaunch() {
    this.login()
  },

  async login() {
    try {
      const openid = "test_openid_mini_001"

      const res = await request({
        url: "/auth/user/login",
        method: "POST",
        data: {
          openid,
          nickname: "微信用户",
          avatar: ""
        }
      })

      const userInfo = res.data
      setToken(userInfo.token)
      setUserInfo(userInfo)
      this.globalData.userInfo = userInfo
    } catch (err) {
      console.error("小程序登录失败", err)
    }
  }
})