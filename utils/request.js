const config = require('../config/config.default')
const Promise = require('../libs/promise')

module.exports = function (method, url, data) {
    return new Promise(function (resolve, reject) {
        wx.request({
          url: config.requestURL + url,
          data: data,
          method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {Authorization: 'Bearer ' + wx.getStorageSync('token')}, // 设置请求的 header
          success: function(res){
            resolve(res.data)
          },
          fail: function(res) {
            reject(res)
          }
        })
    })
}