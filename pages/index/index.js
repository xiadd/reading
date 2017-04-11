//index.js
//获取应用实例
const request = require('../../utils/request')
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    books: []
  },
  onShow: function () {
    this.getBooks().then(res => {
      this.setData({
        books: res.data
      })
    })
  },
  //事件处理函数
  bindViewTap: function() {
    
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getBooks().then(res => {
      this.setData({
        books: res.data
      })
    })
  },

  getBooks: function () {
    return request('GET', '/bookshelf')
  }
})
