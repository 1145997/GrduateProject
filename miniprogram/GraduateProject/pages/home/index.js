const { request } = require("../../utils/request")

Page({
  data: {
    tabs: [
      { label: "全部", value: "" },
      { label: "寻物", value: 1 },
      { label: "招领", value: 2 }
    ],
    currentType: "",
    keyword: "",
    list: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    finished: false
  },

  onLoad() {
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
        url: "/lostfound/list",
        method: "GET",
        data: {
          pageNum,
          pageSize: this.data.pageSize,
          keyword: this.data.keyword,
          type: this.data.currentType,
          status: 1
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
      console.error(e)
    } finally {
      this.setData({ loading: false })
      wx.stopPullDownRefresh()
    }
  },

  onKeywordInput(e) {
    this.setData({
      keyword: e.detail.value
    })
  },

  onSearch() {
    this.getList(true)
  },

  changeTab(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      currentType: type
    })
    this.getList(true)
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  },

  getTypeText(type) {
    return Number(type) === 1 ? "寻物" : "招领"
  }
})