const request = require('../../utils/request')

Page({
    data: {
        categoriesWithBookCount: {}
    },
    onLoad: function () {
        var that = this
        request('GET', '/categories')
        .then(function (res) {
            that.setData({
                categoriesWithBookCount: res.data
            })
        })
        .catch(function (err) {
            console.log(err)
        })
    }
})