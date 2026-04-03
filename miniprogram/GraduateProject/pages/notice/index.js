const { request } = require("../../utils/request")

Page({
  data: {
    list: []
  },

  onShow() {
    this.getNoticeList()
  },

  async getNoticeList() {
    try {
      const res = await request({
        url: "/notice/public/list",
        method: "GET"
      })

      const list = res.data || []

      list.sort((a, b) => {
        if (Number(a.isTop) !== Number(b.isTop)) {
          return Number(b.isTop) - Number(a.isTop)
        }
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      })

      this.setData({ list })
    } catch (e) {
      console.error("获取公告列表失败", e)
    }
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/notice-detail/index?id=${id}`
    })
  }
})