const request = require('../../utils/request')
const moment = require('../../libs/moment')
Page({
    data: {
        bookId: '',
        bookInfo: {},
        isInShelf: false
    },
    onLoad: function (options) {
        const time = moment.locale('zh-cn')
        this.getBooks().then(res => {
            if (res.data.indexOf(options.id) !== -1) {
                this.setData({
                    isInShelf: true
                })
            }
        })
        this.setData({
            bookId: options.id
        })
        this.getBookInfo(options.id).then(res => {
            const bookInfo = res.data
            this.setData({
                bookInfo: bookInfo
            })
            wx.setNavigationBarTitle({
                title: bookInfo.title
            })
        })
    },
    getBooks: function () {
        return request('GET', '/bookshelf')
    },
    getBookInfo: function (id) {
        return request('GET', '/book-info/' + id)
    },
    addToShelfOrDeleteFromShelf: function (e) {
        const id = e.target.dataset.id
        if (!this.data.isInShelf) {
            request('POST', '/bookshelf', { _id: id }).then(res => {
                if (res.code === 1) {
                    this.setData({
                        isInShelf: true
                    })
                    const books = wx.getStorageSync('books') || []
                    books.push({
                        id: id
                    })
                    wx.setStorageSync('books', books)
                }
            })
        } else {
            const id = this.data.bookId
            request('DELETE', '/bookshelf', { _id: id }).then(res => {
                if (res.code === 1) {
                    this.setData({
                        isInShelf: false
                    })
                }
            })
        }
    }
})