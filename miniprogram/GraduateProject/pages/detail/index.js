const { request } = require("../../utils/request")

Page({
  data: {
    id: null,
    detail: null,
    commentList: [],
    commentContent: "",
    parentId: null,
    replyPlaceholder: "写下你的留言…"
  },

  onLoad(options) {
    const id = options.id
    this.setData({ id })
    this.getDetail()
    this.getCommentList()
  },

  async getDetail() {
    try {
      const res = await request({
        url: `/lostfound/${this.data.id}`,
        method: "GET"
      })
      this.setData({
        detail: res.data
      })
    } catch (e) {
      console.error("获取详情失败", e)
    }
  },

  async getCommentList() {
    try {
      const res = await request({
        url: "/comment/list",
        method: "GET",
        data: {
          infoId: this.data.id
        }
      })
      this.setData({
        commentList: res.data || []
      })
    } catch (e) {
      console.error("获取评论失败", e)
    }
  },

  onCommentInput(e) {
    this.setData({
      commentContent: e.detail.value
    })
  },

  replyComment(e) {
    const id = e.currentTarget.dataset.id
    this.setData({
      parentId: id,
      replyPlaceholder: "回复这条评论…"
    })
  },

  cancelReply() {
    this.setData({
      parentId: null,
      replyPlaceholder: "写下你的留言…"
    })
  },

  async submitComment() {
    if (!this.data.commentContent.trim()) {
      wx.showToast({
        title: "请输入评论内容",
        icon: "none"
      })
      return
    }

    try {
      await request({
        url: "/comment",
        method: "POST",
        data: {
          infoId: Number(this.data.id),
          parentId: this.data.parentId,
          content: this.data.commentContent.trim()
        }
      })

      wx.showToast({
        title: "评论成功",
        icon: "success"
      })

      this.setData({
        commentContent: "",
        parentId: null,
        replyPlaceholder: "写下你的留言…"
      })

      this.getCommentList()
    } catch (e) {
      console.error("评论失败", e)
    }
  },

  previewImage() {
    const image = this.data.detail?.image
    if (!image) return

    wx.previewImage({
      urls: [image],
      current: image
    })
  },

  callPhone() {
    const phone = this.data.detail?.contactPhone
    if (!phone) {
      wx.showToast({
        title: "暂无联系电话",
        icon: "none"
      })
      return
    }

    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  copyWechat() {
    const wechat = this.data.detail?.contactWechat
    if (!wechat) {
      wx.showToast({
        title: "暂无微信号",
        icon: "none"
      })
      return
    }

    wx.setClipboardData({
      data: wechat,
      success: () => {
        wx.showToast({
          title: "微信号已复制",
          icon: "none"
        })
      }
    })
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