const { request } = require("../../utils/request")

Page({
  data: {
    id: null,
    detail: null
  },

  onLoad(options) {
    this.setData({
      id: options.id
    })
    this.getDetail()
  },

  async getDetail() {
    try {
      const res = await request({
        url: `/notice/public/${this.data.id}`,
        method: "GET"
      })

      this.setData({
        detail: res.data
      })
    } catch (e) {
      console.error("获取公告详情失败", e)
    }
  }
})