const { BASE_URL } = require("./api")
const { getToken, clearToken, clearUserInfo } = require("./auth")

function request({ url, method = "GET", data = {}, header = {} }) {
  return new Promise((resolve, reject) => {
    const token = getToken()

    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...header
      },
      success(res) {
        const result = res.data

        if (res.statusCode === 401) {
          clearToken()
          clearUserInfo()
          wx.showToast({
            title: "登录已失效",
            icon: "none"
          })
          reject(result)
          return
        }

        if (result.code === 200) {
          resolve(result)
        } else {
          wx.showToast({
            title: result.message || "请求失败",
            icon: "none"
          })
          reject(result)
        }
      },
      fail(err) {
        wx.showToast({
          title: "网络异常",
          icon: "none"
        })
        reject(err)
      }
    })
  })
}

module.exports = {
  request
}