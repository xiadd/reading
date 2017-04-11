const request = require('../../../utils/request')

Page({
    data: {
        categoryTag: [
            { name: '热门', value: 'hot' },
            { name: '新书', value: 'new' },
            { name: '好评', value: 'reputation' },
            { name: '完结', value: 'over' },
        ],
        subCategories: {},
        selectedTag: 'hot',
        selectedMin: '全部',
        bookList: []
    },
    onLoad: function (options) {
        var that = this
        this.setData({
            options: options
        })
        request('GET', '/sub-categories').then(function (res) {
            const mins = res.data[options.type].filter(v => v.major === options.category)[0].mins
            mins.unshift('全部')
            that.setData({
                subCategories: mins
            })

        }).catch(function (err) {
            console.error(err)
        })
        this.getCategoryInfo().then(res => {
            this.setData({
                bookList: res.data.books
            })
        })
        wx.setNavigationBarTitle({
            title: options.category
        })
    },
    getCategoryInfo: function (start) {
        const queryString = {
            gender: this.data.options.type,
            type: this.data.selectedTag,
            major: this.data.options.category,
            minor: this.data.selectedMin === '全部' ? '' : this.data.selectedMin,
            start: start || 0,
            limit: 20
        }
        return request('GET', '/category-info', queryString)
    },
    changeTag: function (e) {
        const data = e.currentTarget.dataset
        this.setData({
            selectedTag: data.value
        })
        this.getCategoryInfo().then(res => {
            this.setData({
                bookList: res.data.books
            })
        })
    },
    changeMin: function (e) {
        const data = e.currentTarget.dataset
        this.setData({
            selectedMin: data.value
        })
        this.getCategoryInfo().then(res => {
            this.setData({
                bookList: res.data.books
            })
        })
    },
    loadMore: function (e) {
        this.getCategoryInfo(this.data.bookList.length).then(res => {
            const bookList = this.data.bookList
            this.setData({
                bookList: bookList.concat(res.data.books)
            })
        })
    }
})