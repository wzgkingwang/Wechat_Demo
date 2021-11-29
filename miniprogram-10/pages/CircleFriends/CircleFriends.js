// pages/CircleFriends/CircleFriends.js
var app = getApp()
var that

Page({
  /**
   * 页面的初始数据
   */
  data: {
    DataSource: [1, 1, 1, 1, 1],
    icon: 'http://bos.pgzs.com/rbpiczy/Wallpaper/2011/10/13/d8062bbad6e7467db0d22abf4de74ac0-6.jpg',
    content: '我大学毕业到一家集团公司的办公室当文员。办公室主任有一特长，即文章写得好，很有思想，公司董事长很器重他，董事长的讲话稿和企业的年终总结等一系列重大文章都是出自他的手笔。',
    resource: ['http://bos.pgzs.com/rbpiczy/Wallpaper/2011/10/13/d8062bbad6e7467db0d22abf4de74ac0-6.jpg',
      'http://bos.pgzs.com/rbpiczy/Wallpaper/2011/10/13/d8062bbad6e7467db0d22abf4de74ac0-6.jpg',
      'http://bos.pgzs.com/rbpiczy/Wallpaper/2011/10/13/d8062bbad6e7467db0d22abf4de74ac0-6.jpg',
      'http://bos.pgzs.com/rbpiczy/Wallpaper/2011/10/13/d8062bbad6e7467db0d22abf4de74ac0-6.jpg',
      'http://bos.pgzs.com/rbpiczy/Wallpaper/2011/10/13/d8062bbad6e7467db0d22abf4de74ac0-6.jpg'
    ],
    zanSource: ['张三', '李四', '王五', '找钱', '孙俪', '王宝'],
    contnet: [{
        'firstname': '张三',
        'content': '你好漂亮呀！！'
      },
      {
        'firstname': '李四',
        'content': '纳尼！！'
      },
      {
        'firstname': '王五',
        'content': '鬼扯咧'
      },
      {
        'firstname': '王宝',
        'content': '昨晚11点左右，一则郑爽胡彦斌疑似复合的消息刷爆各大论坛，微博在深夜11点热度高达200万直接爆掉，中国意难忘又开始了！！！'
      }
    ],
    photoWidth: wx.getSystemInfoSync().windowWidth / 5,

    popTop: 0, //弹出点赞评论框的位置
    popWidth: 0, //弹出框宽度
    isShow: false, //判断是否显示弹出框
    bgUrl: 'http://bos.pgzs.com/rbpiczy/Wallpaper/2011/10/13/d8062bbad6e7467db0d22abf4de74ac0-6.jpg',
  },

  // 发表跳转 发布页面
  release_r() {
    wx.navigateTo({
      url: '../release/release',
    })
  },

  // 修改背景
  changce_pic() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          bgUrl: tempFilePaths
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },
  // 点击图片进行大图查看
  LookPhoto: function (e) {
    // 服务器请求
    wx.request({
      url: 'http://localhost:7001/api/comment',
      method: 'GET',
      data: {
        skip: 2,
        limit: 5
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
      }
    })

    wx.previewImage({
      current: e.currentTarget.dataset.photurl,
      urls: this.data.resource,
    })
  },

  // 点击点赞的人
  TouchZanUser: function (e) {
    wx.showModal({
      title: e.currentTarget.dataset.name,
      showCancel: false
    })
  },

  // 删除朋友圈
  delete: function () {
    wx.showToast({
      title: '删除成功',
    })
  },

  // 点击了点赞评论
  TouchDiscuss: function (e) {
    that.setData({
      isShow: !this.data.isShow
    })
  }
})