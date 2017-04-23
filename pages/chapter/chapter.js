const request = require('../../utils/request')
Page({
    data: {
        bookId: '',
        options: '',
        bookInfo: {},
        chapters: [],
        bookSources: [],
        sourceId: '',
        chapterContent: '',
        chapterTitle: ''
    },

    onLoad: function (options) {
        const id = options.id
        this.setData({
            bookId: options.id,
            options: options
        })
        this.getBookInfo(id).then(res => {
            this.setData({
                bookInfo: res.data
            })
        })

        // 获取书源
        this.getBookSources(id).then(res => {
            this.setData({
                bookSources: res.data
            })
            this.setData({
                sourceId: res.data[0]._id
            })
            return res.data[0]._id
        }).then(sourceId => {
            if (!sourceId) throw new Error('something went wrong!!!')
            return this.getChapters(sourceId)
        }).then(res => {
            // 设置阅读进度
            const books = wx.getStorageSync('books')
            if (!books) {
                wx.setStorageSync('books', [])
            }
            if (res.code === 1 && !books.filter(v => v.id === this.data.bookId)[0].reading) {
                books.forEach(book => {
                    if (book.id === this.data.bookId) {
                        book.reading = res.data.chapters[0].link
                        book.sourceId = this.data.sourceId
                    }
                })
                this.getChapterContent(res.data.chapters[0].link).then(content => {
                    if (content.code === 1) {
                        wx.setNavigationBarTitle({
                            title: content.data.chapter.title
                        })
                        this.setData({
                            chapterContent: content.data.chapter.cpContent,
                            chapterTitle: content.data.chapter.title
                        })
                    }
                })
                wx.setStorageSync('books', books)
            } else {
                const contentLink = options.link 
                                    ? options.link
                                    : wx.getStorageSync('books').filter(v => v.id === this.data.bookId)[0].reading
                this.getChapterContent(contentLink).then(content => {
                    if (content.code === 1) {
                        wx.setNavigationBarTitle({
                            title: content.data.chapter.title
                        })
                        this.setData({
                            chapterContent: content.data.chapter.cpContent,
                            chapterTitle: content.data.chapter.title
                        })
                    }
                })
            }
            this.setData({
                chapters: res.data.chapters
            })
        }).catch(e => {
            wx.showModal({
                title: 'error',
                content: e.message
            })
        })
    },

    getBookInfo: function (id) {
        return request('GET', '/book-info/' + id)
    },

    getChapters: function (soruceId) {
        return request('GET', '/book-chapters/' + soruceId)
    },
    // 获取书源
    getBookSources: function (id) {
        return request('GET', '/book-sources', { view: 'summary', book: this.data.bookId })
    },

    // 获取章节内容
    getChapterContent: function (link) {
        return request('GET', '/chapters/' + encodeURIComponent(link))
    },
    // 中心点击事件
    showContentAndOtherEvents: function (e) {
        console.log(e)
    }
})