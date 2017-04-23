//index.js
//获取应用实例
const request = require('../../utils/request')
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    books: [],
    booksDetail: []
  },
  onShow: function () {
    this.setData({
      booksDetail: [],
      books: []
    })
    this.getBooks().then(res => {
      this.setData({
        books: res.data
      })
      return res.data
    }).then(ids => {
      ids.forEach(id => {
        const booksDetail = this.data.booksDetail
        this.getBookInfo(id).then(result => {
          if (result.code === 1) {
            booksDetail.push(result.data)
            this.setData({
              booksDetail: booksDetail
            })
          }
        })
      })
    }).catch(e => { throw e })
  },
  //事件处理函数
  bindViewTap: function() {
    
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

  },
  getBookInfo: function (id) {
    return request('GET', '/book-info/' + id)
  },
  getBooks: function () {
    return request('GET', '/bookshelf')
  },
  deleteBook: function (id) {
    return request('DELETE', '/bookshelf', { _id: id })
  },
  deleteFromShelf: function (e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const booksDetail = this.data.booksDetail
    booksDetail[index].shake = true
    this.setData({
      booksDetail: booksDetail
    })
  },
  confirmDelete: function (e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const booksDetail = this.data.booksDetail
    this.deleteBook(id).then(res => {
      if (res.code === 1) {
        booksDetail.splice(index, 1)
        this.setData({
          booksDetail: booksDetail
        })
      }
    })
  },
  cancelAction: function (e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const booksDetail = this.data.booksDetail
    booksDetail[index].shake = false
    this.setData({
      booksDetail: booksDetail
    })
  }
})
