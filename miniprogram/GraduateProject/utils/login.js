const { request } = require("./request")
const { USE_MOCK_LOGIN } = require("./api")
const {
  getToken,
  getUserInfo,
  setToken,
  setUserInfo,
  clearLoginState
} = require("./auth")

let loginPromise = null

const DEFAULT_PROFILE = {
  nickname: "小程序用户A",
  avatar: ""
}

function saveLoginResult(userInfo) {
  if (!userInfo || !userInfo.token) {
    throw new Error("登录成功但未返回 token")
  }

  setToken(userInfo.token)
  setUserInfo(userInfo)
  return userInfo
}

// mock 登录
async function mockLogin() {
  const res = await request({
    url: "/auth/user/login",
    method: "POST",
    data: {
      openid: "test_openid_mini_001",
      nickname: DEFAULT_PROFILE.nickname,
      avatar: DEFAULT_PROFILE.avatar
    }
  })

  return saveLoginResult(res.data)
}

// 微信真实登录
function wxCodeLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: async (wxRes) => {
        if (!wxRes.code) {
          reject(new Error("wx.login 未获取到 code"))
          return
        }

        try {
          const res = await request({
            url: "/auth/user/wx-login",
            method: "POST",
            data: {
              code: wxRes.code,
              nickname: DEFAULT_PROFILE.nickname,
              avatar: DEFAULT_PROFILE.avatar
            }
          })

          resolve(saveLoginResult(res.data))
        } catch (err) {
          reject(err)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

async function doLogin() {
  return USE_MOCK_LOGIN ? mockLogin() : wxCodeLogin()
}

function login(force = false) {
  if (!force) {
    const token = getToken()
    const userInfo = getUserInfo()

    if (token && userInfo) {
      return Promise.resolve(userInfo)
    }
  }

  if (loginPromise) {
    return loginPromise
  }

  loginPromise = doLogin()
    .then((userInfo) => {
      loginPromise = null
      return userInfo
    })
    .catch((err) => {
      loginPromise = null
      clearLoginState()
      throw err
    })

  return loginPromise
}

function logout() {
  clearLoginState()
}

function ensureLogin() {
  const token = getToken()
  const userInfo = getUserInfo()

  if (token && userInfo) {
    return Promise.resolve(userInfo)
  }

  return login()
}

module.exports = {
  login,
  logout,
  ensureLogin
}