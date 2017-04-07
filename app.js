//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
  },
  getUserInfo:function(cb){
    var that = this
    //调用登录接口
    wx.login({
      success: function (data) {
        if (data.code) {
          wx.request({
            url: 'https://dev.xiadd.me/api/authenticate',
            data: {
              code: data.code
            },
            success: function(res){
              if (res.data.data) {
                wx.setStorageSync('token', res.data.data)
              } 
            }
          })
        }
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo
            typeof cb == "function" && cb(that.globalData.userInfo)
          }
        })
      }
    })
    if(wx.getStorageSync('userInfo')){
      this.globalData.userInfo = wx.getStorageSync('userInfo')
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      wx.checkSession({
        fail: function () {
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
})