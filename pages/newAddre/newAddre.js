var index = 0;
Page({
  data: {
    name: "请填写您的姓名",
    tel: "请填写您的联系方式",
    addreValue: "请选择所在区域",
    addreRange: ['　　　　　　　　　　', '宜昌', '黄冈', '岳阳', '襄阳', '鹤壁', '长沙'],
    door: "街道门牌信息",
    areaValue: 0,
    areaRange: ['　　', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  },
  areaPickerBindchange: function (e) {
    this.setData({
      areaValue: e.detail.value
    })
  },
  addrePickerBindchange: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {

        var latitude = res.latitude
        var longitude = res.longitude

        wx.chooseLocation({
          latitude: latitude,
          longitude: longitude,
          success: function (res) {
            console.log(res),
              that.setData({ addreValue: res.address + res.name })
          },
          fail: function () {
            // fail
          },
          complete: function () {
            // complete
          }
        })




      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  formSubmit: function (e) {
    var warn = "";
    var that = this;
    var flag = false;
    if (e.detail.value.name == "") {
      warn = "请填写您的姓名！";
    } else if (e.detail.value.tel == "") {
      warn = "请填写您的手机号！";
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.tel))) {
      warn = "手机号格式不正确";
    } else if (e.detail.value.addre == '0') {
      warn = "请选择您的所在区域";
    } else if (e.detail.value.door == "") {
      warn = "请输入您的具体地址";
    } else if (e.detail.value.area == '0') {
      warn = "请输入您的用餐人数";
    } else {
      flag = true;
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
      wx.redirectTo({
        url: '../chooseAddre/chooseAddre?tel=' + e.detail.value.tel + "&addre=" + that.data.addreValue + "&door=" + e.detail.value.door + "&name=" + e.detail.value.name + "&area=" + that.data.areaRange[e.detail.value.area] + "&flag=" + flag + "&areavalue=" + e.detail.value.area + "&addrevalue=" + e.detail.value.addre + "&door=" + e.detail.value.door
        //？后面跟的是需要传递到下一个页面的参数

      });
      console.log("传过去的地址下标是多少？" + e.detail.value.addre)
    }
    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }

  },

})