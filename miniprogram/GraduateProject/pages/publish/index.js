const { request } = require("../../utils/request")
const { BASE_URL } = require("../../utils/api")
const { getToken } = require("../../utils/auth")
const { requireLogin } = require("../../utils/guard")

Page({
  data: {
    typeOptions: [
      { label: "寻物启事", value: 1 },
      { label: "招领启事", value: 2 }
    ],
    categoryList: [],
    categoryNames: [],
    categoryIndex: -1,
    submitting: false,
    eventDate: "",
    eventClock: "",
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

  async onLoad() {
    try {
      await requireLogin()
      this.getCategoryList()
    } catch (e) {
      console.error("进入发布页时登录校验失败", e)
    }
  },

  async getCategoryList() {
    try {
      const res = await request({
        url: "/category/list"
      })
      const list = res.data || []
      this.setData({
        categoryList: list,
        categoryNames: list.map(item => item.name)
      })
    } catch (e) {
      console.error(e)
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
    const list = this.data.categoryList || []
    const category = list[index]
  
    if (!category) {
      wx.showToast({
        title: "分类数据异常",
        icon: "none"
      })
      return
    }
  
    this.setData({
      categoryIndex: index,
      "form.categoryId": category.id
    })
  },

  trimForm(form) {
    const result = {}
    Object.keys(form).forEach((key) => {
      const value = form[key]
      result[key] = typeof value === "string" ? value.trim() : value
    })
    return result
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
      header: {},
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
  validateForm() {
    const form = this.trimForm(this.data.form)
  
    // 标题
    if (!form.title) return "请输入标题"
    if (form.title.length < 2) return "标题至少2个字"
    if (form.title.length > 30) return "标题不能超过30个字"
  
    // 物品名称
    if (!form.itemName) return "请输入物品名称"
    if (form.itemName.length < 2) return "物品名称至少2个字"
    if (form.itemName.length > 20) return "物品名称不能超过20个字"
  
    // 分类
    if (!form.categoryId) return "请选择分类"
  
    // 品牌
    if (form.brand && form.brand.length > 20) return "品牌不能超过20个字"
  
    // 颜色
    if (form.color && form.color.length > 20) return "颜色不能超过20个字"
  
    // 地点
    if (!form.eventPlace) return "请输入事件地点"
    if (form.eventPlace.length < 2) return "事件地点至少2个字"
    if (form.eventPlace.length > 50) return "事件地点不能超过50个字"
  
    // 时间
    if (!form.eventTime) return "请输入事件时间"
  
    // 不能只填纯数字小时，比如 11
    const simpleNumberReg = /^\d+$/
    if (simpleNumberReg.test(form.eventTime)) {
      return "事件时间格式不正确，请填写完整时间"
    }
  
    // 推荐格式：2026-04-03 14:30:00 或 2026-04-03 14:30
    const dateTimeReg = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/
    if (!dateTimeReg.test(form.eventTime)) {
      return "请通过日期和时间选择器填写完整时间"
    }
  
    // 描述
    if (!form.description) return "请输入详细描述"
    if (form.description.length < 5) return "详细描述至少5个字"
    if (form.description.length > 500) return "详细描述不能超过500个字"
  
    // 联系人
    if (!form.contactName) return "请输入联系人"
    if (form.contactName.length < 2) return "联系人至少2个字"
    if (form.contactName.length > 20) return "联系人不能超过20个字"
  
    // 手机号
    if (!form.contactPhone) return "请输入联系电话"
    if (!/^1\d{10}$/.test(form.contactPhone)) return "请输入正确的11位手机号"
  
    // 微信号，可选
    if (form.contactWechat) {
      if (form.contactWechat.length < 6 || form.contactWechat.length > 20) {
        return "微信号长度应为6到20位"
      }
    }
  
    return ""
  },
  async submit() {
    try {
      await requireLogin()
    } catch (e) {
      return
    }
  
    if (this.data.submitting) return
  
    const errorMsg = this.validateForm()
    if (errorMsg) {
      wx.showToast({
        title: errorMsg,
        icon: "none"
      })
      return
    }
  
    const submitForm = this.trimForm(this.data.form)
  
    this.setData({ submitting: true })
  
    try {
      await request({
        url: "/lostfound",
        method: "POST",
        data: submitForm
      })
  
      wx.showToast({
        title: "发布成功",
        icon: "success"
      })
  
      this.setData({
        categoryIndex: -1,
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
      })
  
      setTimeout(() => {
        wx.switchTab({
          url: "/pages/home/index"
        })
      }, 1200)
    } catch (e) {
      console.error(e)
      wx.showToast({
        title: e?.message || "发布失败",
        icon: "none"
      })
    } finally {
      this.setData({ submitting: false })
    }
  },
  formatNumber(n) {
    return n < 10 ? `0${n}` : `${n}`
  },

  getTodayDate() {
    const now = new Date()
    const y = now.getFullYear()
    const m = this.formatNumber(now.getMonth() + 1)
    const d = this.formatNumber(now.getDate())
    return `${y}-${m}-${d}`
  },

  getCurrentTime() {
    const now = new Date()
    const h = this.formatNumber(now.getHours())
    const m = this.formatNumber(now.getMinutes())
    return `${h}:${m}`
  },

  buildEventTime(date, time) {
    if (!date || !time) return ""
    return `${date}T${time}:00`
  },

  onDateChange(e) {
    const date = e.detail.value
    const time = this.data.eventClock || this.getCurrentTime()

    this.setData({
      eventDate: date,
      "form.eventTime": this.buildEventTime(date, time)
    })
  },

  onTimeChange(e) {
    const time = e.detail.value
    const date = this.data.eventDate || this.getTodayDate()

    this.setData({
      eventClock: time,
      "form.eventTime": this.buildEventTime(date, time)
    })
  }
})