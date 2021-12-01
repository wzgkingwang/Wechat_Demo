// pages/CircleFriends/CircleFriends.js
var app = getApp()
var that
let count = 0
let nowPage = 0
let id = -1
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    DataSource: [],
    // zanSource: ['张三', '李四', '王五', '赵六', '孙七', '周八'],
    // contnet: [{
    //     'firstname': '张三',
    //     'content': '确实！！'
    //   },
    //   {
    //     'firstname': '李四',
    //     'content': '俺也一样！！'
    //   },
    //   {
    //     'firstname': '王五',
    //     'content': '这话确实说的很这话！！'
    //   },
    //   {
    //     'firstname': '周八',
    //     'content': '听君一席话，如听一席话！！'
    //   }
    // ],
    photoWidth: wx.getSystemInfoSync().windowWidth / 5,

    popTop: 0, //弹出点赞评论框的位置
    popWidth: 0, //弹出框宽度
    isShow: false, //判断是否显示弹出框
    bgUrl: 'http://bos.pgzs.com/rbpiczy/Wallpaper/2011/10/13/d8062bbad6e7467db0d22abf4de74ac0-6.jpg',
    idShow: '',
    clickList: {}, //文章点赞存储对象
    contnetList: {} //评论储存
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options.id
    let that = this

    that.getResouce(that)
    // 得到点赞数据
    wx.getStorage({
      key: 'click',
      success(res) {
        that.setData({
          clickList: res.data
        })
      }
    })
    // 得到评论数据
    wx.getStorage({
      key: 'comment',
      success(res) {
        console.log(res.data);
        that.setData({
          contnetList: res.data
        })
      }
    })
    // 得到用户信息
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({
          userInfo: res.data
        })
      }
    })
  },
  // 点击图片进行大图查看
  LookPhoto: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.photurl,
      urls: this.data.resource,
    })
  },
  getResouce(that) {
    if (nowPage * 5 <= count) {
      // 服务器请求
      wx.request({
        url: 'http://localhost:7001/api/comment',
        method: 'GET',
        data: {
          skip: nowPage * 5,
          limit: 5
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          let dataList = res.data.data.arr;
          dataList.forEach((item) => {
            if (item.Cpicture.length !== 0) {
              item.Cpicture = item.Cpicture.split(',')
            } else {
              item.Cpicture = []
            }
          })
          count = res.data.data.count[0]['count(id)']
          let arr = [...that.data.DataSource, ...dataList];
          let arrList = []
          arr.forEach((item) => {
            if (item.id + '' === id) {
              arrList = [item]
              return
            }
          })
          that.setData({
            DataSource: arrList
          })
        }
      })

    }

  },
  //点赞功能
  click(e) {
    let obj = {}
    if (this.data.clickList[e.currentTarget.dataset.id] &&this.data.clickList[e.currentTarget.dataset.id].includes(this.data.userInfo.nickName)) {
      obj = {
        ...this.data.clickList,
        [e.currentTarget.dataset.id]: []
      }
    } else {
      obj = {
        ...this.data.clickList,
        [e.currentTarget.dataset.id]: [this.data.userInfo.nickName]
      }
    }

    wx.setStorage({
      data: obj,
      key: 'click',
    })
    this.setData({
      clickList: obj
    })
  },
  //评论功能
  comment(e) {
    let obj = {}
    obj = {
      ...this.data.contnetList,
      [e.currentTarget.dataset.id]: [{
        'firstname': this.data.userInfo.nickName,
        'content': '听君一席话，如听一席话！！'
      }]
    }

    wx.setStorage({
      data: obj,
      key: 'comment',
    })
    this.setData({
      contnetList: obj
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
  delete: function (e) {
    let that = this
    wx.showToast({
      title: '删除成功',
    })
    wx.request({
      url: `http://localhost:7001/api/comment/delete/${e.currentTarget.dataset.id}`,
      method: 'DELETE',
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

  // 点击了点赞评论
  TouchDiscuss: function (e) {
    this.setData({
      isShow: !this.data.isShow,
      idShow: e.currentTarget.dataset.id
    })
  }
})