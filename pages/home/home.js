//logs.js
var util = require('../../utils/util.js')
var sliderWidth = 190// 需要设置slider的宽度，用于计算中间位置
// 最大行数
var max_row_height = 5;
// 行高
var food_row_height = 50;
// 底部栏偏移量
var cart_offset = 90;

var app = getApp();

Page({


  feedback: function () {
    wx.showActionSheet({
      itemList: ['保存电话号码', '呼叫该用户', '添加好友>_<'],
      success(res) {
        if (res.tapIndex == 0) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1500
          });
        }
        if (res.tapIndex == 1) {
          wx.makePhoneCall({

            phoneNumber: '18527300760',

          });
        }
        if (res.tapIndex == 2) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1500
          });
        }
      },
        })
  },


  data: {
    text: "任你吃四年，全天大减价，进价9块9，现在只卖99！！ 任你吃四年，全天大减价，进价9块9，现在只卖99！！ ",
    marqueePace: 0.6,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 30,
    size: 14,
    interval: 20 ,// 时间间隔
    logs: [],
    tabs: ["今日菜单", "我的订单"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    sliderWidth: 0.5,
    address: "正在获取你的定位.....",
    // 右菜单
    menu_list: [],
    // 左菜单
    foodList: [],//展示菜品
    allFoodList: [],//所有获取到的菜品
    //我的订单列表
    orderList: [],

    candan:[],
    // 购物车
    cartList: [],
    hasList: false,// 列表是否有数据
    totalPrice: 0,// 总价，初始为0
    totalNum: 0,  //总数，初始为0
    // 购物车动画
    animationData: {},
    animationMask: {},
    maskVisual: "hidden",
    maskFlag: true,
    // 左右两侧菜单的初始显示次序
    curNav: 0,

    //判断是否登录会员
    loginFlag: true,
    //判断是否已经发送验证码
    sendingF: false,
    // 倒计时时间
    second: 60,

  },
  onShow: function () {
    var that = this;
    var length = that.data.text.length * that.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    //console.log(length,windowWidth);
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    that.scrolltxt();// 第一个字消失后立即从右边出现
  },

  scrolltxt: function () {
    var that = this;
    var length = that.data.length;//滚动文字的宽度
    var windowWidth = that.data.windowWidth;//屏幕宽度
    if (length > windowWidth) {
      var interval = setInterval(function () {
        var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentleft = that.data.marqueeDistance;
        if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
          that.setData({
            marqueeDistance: crentleft + that.data.marqueePace
          })
        }
        else {
          //console.log("替换");
          that.setData({
            marqueeDistance: 0 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.interval);
    }
    else {
      that.setData({ marquee_margin: "1000" });//只显示一条不滚动右边间距加大，防止重复显示
    }
  },
  onLoad: function (options) {
    
    var that = this
    // 获取购物车缓存数据
    var arr = wx.getStorageSync('cart') || [];
    // 左分类菜单
    var menu_list = this.data.menu_list;
    // 获取左侧分类菜单数据
    var categories = [
      {
        "id": 0,
        "name": "全部"
      },
      {
        "id": 9,
        "name": "活动品"
      },
      {
        "id": 1,
        "name": "汤·粥"
      },
      {
        "id": 2,
        "name": "热菜"
      },
      {
        "id": 5,
        "name": "面点"
      },
      {
        "id": 6,
        "name": "特色"
      },
      {
        "id": 7,
        "name": "小吃"
      },
      {
        "id": 8,
        "name": "水吧"
      }
    ]
    // 右菜品菜单
    var foodList = this.data.foodList;
    var allFoodList = this.data.allFoodList;
    // 购物车总量、总价
    var totalPrice = this.data.totalPrice
    var totalNum = this.data.totalNum
    // 获取右侧菜品列表数据
    console.log(that.data.candan)
     var resFood = this.data.candan
     console.log(resFood)
     //[
    //   {
    //     "id": 6,
    //     "name": "美地麻辣小龙虾",
    //     "thumb": "",
    //     "imageUrl": "../../image/1.jpg",
    //     "price": "98.00",
    //     "unit": "份",
    //     "catid": 6,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 7,
    //     "name": "水吧鸡尾酒",
    //     "thumb": "",
    //     "imageUrl": "../../image/2.jpg",
    //     "price": "39.00",
    //     "unit": "杯",
    //     "catid": 8,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 9,
    //     "name": "九塔香辣子鸡",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "68.00",
    //     "unit": "份",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 10,
    //     "name": "跳舞茄盒",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "40.00",
    //     "unit": "份",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 12,
    //     "name": "土匪猪肝",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "40.00",
    //     "unit": "份",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 13,
    //     "name": "小炒黄牛肉",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "58.00",
    //     "unit": "份",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 14,
    //     "name": "小酥肉",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "19.00",
    //     "unit": "份",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 15,
    //     "name": "橄榄油腊鲜有机花菜\t",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "28.00",
    //     "unit": "份",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 19,
    //     "name": "榴莲面包",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "29.80",
    //     "unit": "份",
    //     "catid": 5,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 20,
    //     "name": "泡芙",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "6.00",
    //     "unit": "斤",
    //     "catid": 5,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 21,
    //     "name": "手撕包菜",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "19.00",
    //     "unit": "份",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 22,
    //     "name": "糖醋里脊",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "97.90",
    //     "unit": "份",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 24,
    //     "name": "我是热菜区的new菜",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "25.00",
    //     "unit": "份",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 25,
    //     "name": "美地麻辣小龙虾",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "125.00",
    //     "unit": "份",
    //     "catid": 6,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 26,
    //     "name": "美地甜点",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "20.00",
    //     "unit": "15",
    //     "catid": 7,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 27,
    //     "name": "特色小龙虾",
    //     "thumb": "/uploads/20178/201708311002557FPpnEyE.jpg",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "89.90",
    //     "unit": "份",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 28,
    //     "name": "雕黄醉蟹钳",
    //     "thumb": "/uploads/20178/20170831165625IyWlwdFM.jpg",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "48.00",
    //     "unit": "份",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 29,
    //     "name": "雕黄醉蟹钳1",
    //     "thumb": "/uploads/20178/20170831165711bLN478bK.jpg",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "48.00",
    //     "unit": "份",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 30,
    //     "name": "百合莲子红豆露",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "32.00",
    //     "unit": "扎",
    //     "catid": 8,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 31,
    //     "name": "屈臣氏香草苏打水",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "15.00",
    //     "unit": "瓶",
    //     "catid": 8,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 32,
    //     "name": "赫默父子夏瑟尼蒙哈榭干白",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "1888.00",
    //     "unit": "瓶",
    //     "catid": 8,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 33,
    //     "name": "美地特殊热菜",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "35.00",
    //     "unit": "20",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 34,
    //     "name": "醋溜白菜",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "15.00",
    //     "unit": "12",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 35,
    //     "name": "东北乱炖",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "38.00",
    //     "unit": "30",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 36,
    //     "name": "信用小炒",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "28.00",
    //     "unit": "份",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 37,
    //     "name": "清炒花菜",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "23.00",
    //     "unit": "份",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 38,
    //     "name": "炒苦瓜",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "20.00",
    //     "unit": "份",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 1,
    //     "name": "味增烤晴鱼",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "158.00",
    //     "unit": "份",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 2,
    //     "name": "铁板脆皮豆腐",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "48.00",
    //     "unit": "份",
    //     "catid": 2,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   },
    //   {
    //     "id": 3,
    //     "name": "石斛养生菌汤",
    //     "thumb": "",
    //     "imageUrl": "../../image/3.jpg",
    //     "price": "28.00",
    //     "unit": "份",
    //     "catid": 1,
    //     "sales": 0,
    //     "note": "",
    //     "quantity": 0
    //   }
   // ]

    // 进入页面后判断购物车是否有数据，如果有，将菜单与购物车quantity数据统一
    if (arr.length > 0) {
      for (var i in arr) {
        for (var j in resFood) {
          if (resFood[j].id == arr[i].id) {
            resFood[j].quantity = arr[i].quantity;
          }
        }
      }
    }
 
    // 进入页面计算购物车总价、总数
    if (arr.length > 0) {
      for (var i in arr) {
        totalPrice += arr[i].price * arr[i].quantity;
        totalNum += Number(arr[i].quantity);
      }
    }
    // 赋值数据
    this.setData({
      hasList: true,
      cartList: arr,
      foodList: resFood,
      allFoodList: resFood,
      payFlag: this.data.payFlag,
      totalPrice: totalPrice.toFixed(2),
      totalNum: totalNum
    })


    wx.request({
      url: 'http://10.136.24.29:8080/sell/buyer/product/listcategory',
      data: {
        x: '',
        y: ''
      },
      success(res) {
        console.log(res.data),
          that.setData({ menu_list: res.data.data })
      }
    })

    wx.request({
      url: 'http://10.136.24.29:8080/sell/buyer/product/caidan',
      data: {
        x: '',
        y: ''
      },
      success(res) {
        console.log(res.data),
          that.setData({ foodList: res.data.data, allFoodList: res.data.data })
      }
    })


    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - res.windowWidth / 2) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
        });
      }
    });
  },
  // 点击切换tab
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  // 点击切换右侧数据
  changeRightMenu: function (e) {
    var classify = e.target.dataset.id;// 获取点击项的id
    var foodList = this.data.foodList;
    var allFoodList = this.data.allFoodList;
    var newFoodList = [];
    if (classify == 0) {//选择了全部选项
      this.setData({
        curNav: classify,
        foodList: allFoodList
      })
    } else { //选择了其他选项
      for (var i in allFoodList) {
        if (allFoodList[i].catid == classify) {
          newFoodList.push(allFoodList[i])
        }
      }
      this.setData({
        // 右侧菜单当前显示第curNav项
        curNav: classify,
        foodList: newFoodList
      })
    }
  },
  // 购物车增加数量
  addCount: function (e) {
    var id = e.currentTarget.dataset.id;
    var arr = wx.getStorageSync('cart') || [];
    var f = false;
    for (var i in this.data.foodList) {// 遍历菜单找到被点击的菜品，数量加1
      if (this.data.foodList[i].id == id) {
        this.data.foodList[i].quantity += 1;
        if (arr.length > 0) {
          for (var j in arr) {// 遍历购物车找到被点击的菜品，数量加1
            if (arr[j].id == id) {
              arr[j].quantity += 1;
              f = true;
              try {
                wx.setStorageSync('cart', arr)
              } catch (e) {
                console.log(e)
              }
              break;
            }
          }
          if (!f) {
            arr.push(this.data.foodList[i]);
          }
        } else {
          arr.push(this.data.foodList[i]);
        }
        try {
          wx.setStorageSync('cart', arr)
        } catch (e) {
          console.log(e)
        }
        break;
      }
    }

    this.setData({
      cartList: arr,
      foodList: this.data.foodList
    })
    this.getTotalPrice();
  },
  // 定义根据id删除数组的方法
  removeByValue: function (array, val) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].id == val) {
        array.splice(i, 1);
        break;
      }
    }
  },
  // 购物车减少数量
  minusCount: function (e) {
    var id = e.currentTarget.dataset.id;
    var arr = wx.getStorageSync('cart') || [];
    for (var i in this.data.foodList) {
      if (this.data.foodList[i].id == id) {
        this.data.foodList[i].quantity -= 1;
        if (this.data.foodList[i].quantity <= 0) {
          this.data.foodList[i].quantity = 0;
        }
        if (arr.length > 0) {
          for (var j in arr) {
            if (arr[j].id == id) {
              arr[j].quantity -= 1;
              if (arr[j].quantity <= 0) {
                this.removeByValue(arr, id)
              }
              if (arr.length <= 0) {
                this.setData({
                  foodList: this.data.foodList,
                  cartList: [],
                  totalNum: 0,
                  totalPrice: 0,
                })
                this.cascadeDismiss()
              }
              try {
                wx.setStorageSync('cart', arr)
              } catch (e) {
                console.log(e)
              }
            }
          }
        }
      }
    }
    this.setData({
      cartList: arr,
      foodList: this.data.foodList
    })
    this.getTotalPrice();
  },
  // 获取购物车总价、总数
  getTotalPrice: function () {
    var cartList = this.data.cartList;                  // 获取购物车列表
    var totalP = 0;
    var totalN = 0
    for (var i in cartList) {                           // 循环列表得到每个数据
      totalP += cartList[i].quantity * cartList[i].price;    // 所有价格加起来     
      totalN += cartList[i].quantity
    }
    this.setData({                                      // 最后赋值到data中渲染到页面
      cartList: cartList,
      totalNum: totalN,
      totalPrice: totalP.toFixed(2)
    });
  },
  // 清空购物车
  cleanList: function (e) {
    for (var i in this.data.foodList) {
      this.data.foodList[i].quantity = 0;
    }
    try {
      wx.setStorageSync('cart', "")
    } catch (e) {
      console.log(e)
    }
    this.setData({
      foodList: this.data.foodList,
      cartList: [],
      cartFlag: false,
      totalNum: 0,
      totalPrice: 0,
    })
    this.cascadeDismiss()
  },

  //删除购物车单项
  deleteOne: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var arr = wx.getStorageSync('cart')
    for (var i in this.data.foodList) {
      if (this.data.foodList[i].id == id) {
        this.data.foodList[i].quantity = 0;
      }
    }
    arr.splice(index, 1);
    if (arr.length <= 0) {
      this.setData({
        foodList: this.data.foodList,
        cartList: [],
        cartFlag: false,
        totalNum: 0,
        totalPrice: 0,
      })
      this.cascadeDismiss()
    }
    try {
      wx.setStorageSync('cart', arr)
    } catch (e) {
      console.log(e)
    }


    this.setData({
      cartList: arr,
      foodList: this.data.foodList
    })
    this.getTotalPrice()
  },
  //切换购物车开与关
  cascadeToggle: function () {
    var that = this;
    var arr = this.data.cartList
    if (arr.length > 0) {
      if (that.data.maskVisual == "hidden") {
        that.cascadePopup()
      } else {
        that.cascadeDismiss()
      }
    } else {
      that.cascadeDismiss()
    }

  },
  // 打开购物车方法
  cascadePopup: function () {
    var that = this;
    // 购物车打开动画
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in-out',
      delay: 0
    });
    that.animation = animation;
    animation.translate(0, -285).step();
    that.setData({
      animationData: that.animation.export(),
    });
    // 遮罩渐变动画
    var animationMask = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
    });
    that.animationMask = animationMask;
    animationMask.opacity(0.8).step();
    that.setData({
      animationMask: that.animationMask.export(),
      maskVisual: "show",
      maskFlag: false,
    });
  },
  // 关闭购物车方法
  cascadeDismiss: function () {
    var that = this
    // 购物车关闭动画
    that.animation.translate(0, 285).step();
    that.setData({
      animationData: that.animation.export()
    });
    // 遮罩渐变动画
    that.animationMask.opacity(0).step();
    that.setData({
      animationMask: that.animationMask.export(),
    });
    // 隐藏遮罩层
    that.setData({
      maskVisual: "hidden",
      maskFlag: true
    });
  },
  // 跳转确认订单页面
  gotoOrder: function () {
    if (this.data.totalPrice == 0) {
      wx.showToast({
        title: '请添加商品',
        icon: 'none',
        duration: 1500
      });
    } else {
      wx.navigateTo({
        url: '../confirmOrder/confirmOrder'
      });
    }
  },
  GetQueryString: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
  },
   btnClick: function () {
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
              that.setData({ address: res.name })
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
  }

})
