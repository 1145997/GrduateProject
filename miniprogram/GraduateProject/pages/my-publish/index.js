const { request } = require("../../utils/request")

Page({
  data: {
    list: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    finished: false
  },

  onShow() {
    this.getList(true)
  },

  onPullDownRefresh() {
    this.getList(true)
  },

  onReachBottom() {
    this.getList(false)
  },

  async getList(reset = false) {
    if (this.data.loading) return
    if (!reset && this.data.finished) return

    this.setData({ loading: true })

    const pageNum = reset ? 1 : this.data.pageNum

    try {
      const res = await request({
        url: "/lostfound/my",
        method: "GET",
        data: {
          pageNum,
          pageSize: this.data.pageSize
        }
      })

      const data = res.data
      const newList = reset ? data.list : this.data.list.concat(data.list)

      this.setData({
        list: newList,
        total: data.total,
        pageNum: pageNum + 1,
        finished: newList.length >= data.total
      })
    } catch (e) {
      console.error("获取我的发布失败", e)
    } finally {
      this.setData({ loading: false })
      wx.stopPullDownRefresh()
    }
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  },

  deleteItem(e) {
    const id = e.currentTarget.dataset.id

    wx.showModal({
      title: "提示",
      content: "确认删除这条发布信息吗？",
      success: async (res) => {
        if (!res.confirm) return

        try {
          await request({
            url: `/lostfound/${id}`,
            method: "DELETE"
          })

          wx.showToast({
            title: "删除成功",
            icon: "success"
          })

          this.getList(true)
        } catch (e) {
          console.error("删除失败", e)
        }
      }
    })
  },

  getTypeText(type) {
    return Number(type) === 1 ? "寻物" : "招领"
  },

  getStatusText(status) {
    const map = {
      0: "待审核",
      1: "已发布",
      2: "已驳回",
      3: "已完结"
    }
    return map[status] || "未知状态"
  }
})