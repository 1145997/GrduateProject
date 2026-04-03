const { ensureLogin } = require("./login")

async function requireLogin() {
  try {
    return await ensureLogin()
  } catch (e) {
    wx.showToast({
      title: "请先登录",
      icon: "none"
    })
    throw e
  }
}

module.exports = {
  requireLogin
}