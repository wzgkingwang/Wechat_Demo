// pages/CircleFriends/CircleFriends.js
var app = getApp()
var that
let count = 0
let nowPage = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    DataSource: [],
    zanSource: ['张三', '李四', '王五', '赵六', '孙七', '周八'],
    contnet: [{
        'firstname': '张三',
        'content': '确实！！'
      },
      {
        'firstname': '李四',
        'content': '俺也一样！！'
      },
      {
        'firstname': '王五',
        'content': '这话确实说的很这话！！'
      },
      {
        'firstname': '周八',
        'content': '听君一席话，如听一席话！！'
      }
    ],
    photoWidth: wx.getSystemInfoSync().windowWidth / 5,
    popTop: 0, //弹出点赞评论框的位置
    popWidth: 0, //弹出框宽度
    isShow: false, //判断是否显示弹出框
    bgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcnews.chinadaily.com.cn%2Fimg%2Fattachement%2Fjpg%2Fsite1%2F20170125%2Fa41f726b573a19f225971e.jpg&refer=http%3A%2F%2Fcnews.chinadaily.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640916956&t=23507a1f4db431f794ce84d7315f3feb',
    idShow: ''
  },

  // 发表跳转 发布页面
  release_r() {
    wx.navigateTo({
      url: '../release/release',
    })
  },

  //跳转详细页面
  turn_detailed(e) {
    wx.navigateTo({
      url: `../detailed/detailed?id=${e.currentTarget.dataset.id}`,
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
    let that = this
    that.getResouce(that)
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({
          userInfo: res.data
        })
      }
    })
  },
  onReachBottom: function () {
    nowPage++
    this.getResouce(this)
  },
  // 点击图片进行大图查看
  LookPhoto: function (e) {
    console.log(e.currentTarget.dataset.photurl);
    wx.previewImage({
      current: e.currentTarget.dataset.photurl,
      urls: e.currentTarget.dataset.resouce,
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
          that.setData({
            DataSource: [...that.data.DataSource, ...dataList]
          })
        }
      })

    } else {
      console.log('没有更多数据了。。。');
    }

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
        console.log();
        that.setData({
          DataSource: that.data.DataSource.splice(1, that.data.DataSource.length - 1)
        })
      }
    })

  },

  // 、时间
  TouchDiscuss: function (e) {
    this.setData({
      isShow: !this.data.isShow,
      idShow: e.currentTarget.dataset.id
    })
  }
})