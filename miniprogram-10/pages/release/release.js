// pages/release/release.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    circlePictureArr: [], //数组转字符串存放到数据库，然后展示时将字符串再转为数组展示
    Ctext: '',
    Cvideo: '',
    Caddress: ["广东省", "东莞市", "寮步镇"]
  },

  //图片选择
  img_tpic() {
    let that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          circlePictureArr: tempFilePaths
        })
      }
    })
  },

  // 文本输入
  getValue(e) {
    this.setData({
      Ctext: e.detail.value
    })
  },

  // 视频选择
  getvideoPath() {
    let that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        that.setData({
          Cvideo: res.tempFilePath
        })
      }
    })
  },

  // 更新省,市,区信息
  regionChange: function (e) {
    this.setData({
      Caddress: e.detail.value
    });
  },

  // 提交
  submitContent() {
    let d=new Date()
    let Ctime =  `${d.getFullYear()}-${d.getMonth()}-${d.getDate()-1} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`

    let that = this
    let cp = that.data.circlePictureArr.join(',')
    // 服务器请求
    wx.request({
      url: 'http://localhost:7001/api/comment',
      method: 'POST',
      data: {
        Ctime,
        Cpicture: cp,
        Ctext: that.data.Ctext,
        Cvideo: that.data.Cvideo,
        Caddress: that.data.Caddress.join(',')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
})