const { request } = require("../../utils/request")
const { BASE_URL } = require("../../utils/api")

Page({
  data: {
    id: null,
    typeOptions: [
      { label: "寻物启事", value: 1 },
      { label: "招领启事", value: 2 }
    ],
    categoryList: [],
    categoryNames: [],
    categoryIndex: -1,
    submitting: false,
    form: {
      type: 1,
      title: "",
      itemName: "",
      categoryId: "",
      brand: "",
      color: "",
      description: "",
      image: "",
      eventTime: "",
      eventPlace: "",
      contactName: "",
      contactPhone: "",
      contactWechat: ""
    }
  },

  async onLoad(options) {
    this.setData({
      id: options.id
    })

    await this.getCategoryList()
    await this.getDetail()
  },

  async getCategoryList() {
    try {
      const res = await request({
        url: "/category/list",
        method: "GET"
      })

      const list = res.data || []
      this.setData({
        categoryList: list,
        categoryNames: list.map(item => item.name)
      })
    } catch (e) {
      console.error("获取分类失败", e)
    }
  },

  async getDetail() {
    try {
      const res = await request({
        url: `/lostfound/${this.data.id}`,
        method: "GET"
      })

      const detail = res.data || {}
      let categoryIndex = -1

      if (detail.categoryId && this.data.categoryList.length) {
        categoryIndex = this.data.categoryList.findIndex(
          item => Number(item.id) === Number(detail.categoryId)
        )
      }

      this.setData({
        categoryIndex,
        form: {
          type: Number(detail.type) || 1,
          title: detail.title || "",
          itemName: detail.itemName || "",
          categoryId: detail.categoryId || "",
          brand: detail.brand || "",
          color: detail.color || "",
          description: detail.description || "",
          image: detail.image || "",
          eventTime: detail.eventTime || "",
          eventPlace: detail.eventPlace || "",
          contactName: detail.contactName || "",
          contactPhone: detail.contactPhone || "",
          contactWechat: detail.contactWechat || ""
        }
      })
    } catch (e) {
      console.error("获取详情失败", e)
    }
  },

  onTypeChange(e) {
    const value = Number(e.currentTarget.dataset.value)
    this.setData({
      "form.type": value
    })
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`form.${field}`]: e.detail.value
    })
  },

  onCategoryChange(e) {
    const index = Number(e.detail.value)
    const category = this.data.categoryList[index]

    this.setData({
      categoryIndex: index,
      "form.categoryId": category.id
    })
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      success: (res) => {
        const filePath = res.tempFiles[0].tempFilePath
        this.uploadImage(filePath)
      }
    })
  },

  uploadImage(filePath) {
    wx.showLoading({ title: "上传中" })

    wx.uploadFile({
      url: `${BASE_URL}/file/upload`,
      filePath,
      name: "file",
      success: (res) => {
        const data = JSON.parse(res.data)

        if (data.code === 200) {
          this.setData({
            "form.image": data.data.url
          })

          wx.showToast({
            title: "上传成功",
            icon: "success"
          })
        } else {
          wx.showToast({
            title: data.message || "上传失败",
            icon: "none"
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: "上传失败",
          icon: "none"
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  previewImage() {
    const image = this.data.form.image
    if (!image) return

    wx.previewImage({
      urls: [image],
      current: image
    })
  },

  validateForm() {
    const form = this.data.form

    if (!form.title) return "请输入标题"
    if (!form.itemName) return "请输入物品名称"
    if (!form.categoryId) return "请选择分类"
    if (!form.description) return "请输入详细描述"
    if (!form.eventPlace) return "请输入地点"
    if (!form.contactName) return "请输入联系人"
    if (!form.contactPhone) return "请输入联系电话"

    return ""
  },

  async submit() {
    if (this.data.submitting) return

    const errorMsg = this.validateForm()
    if (errorMsg) {
      wx.showToast({
        title: errorMsg,
        icon: "none"
      })
      return
    }

    this.setData({ submitting: true })

    try {
      await request({
        url: `/lostfound/${this.data.id}`,
        method: "PUT",
        data: this.data.form
      })

      wx.showToast({
        title: "修改成功",
        icon: "success"
      })

      setTimeout(() => {
        wx.navigateBack()
      }, 1200)
    } catch (e) {
      console.error("修改失败", e)
    } finally {
      this.setData({ submitting: false })
    }
  }
})