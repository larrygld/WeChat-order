
var index = 0;
var li=[
  {
    "index": "0",
    "name": "小白",
    "tel": "18527300760",
    "addre": "宜昌三峡大学欣苑3栋414",
    "area": "4",
    "image": "/image/check.jpg"
  },
  {
    "index": "1",
    "name": "吴楚",
    "tel": "18527300760",
    "addre": "宜昌三峡大学欣苑三栋414",
    "area": "4",
    "image": "/image/uncheck.png"
  },
  {
    "index": "2",
    "name": "张岩珂",
    "tel": "15172225222",
    "addre": "宜昌三峡大学欣苑二栋414",
    "area": "4",
    "image": "/image/uncheck.png"
  }
  ];

Page({
  data:{
    list:li,
},
addAddre:function(e){
  	wx.navigateTo({
       url: '../newAddre/newAddre'
    })
  },
toModifyAddre:function(e){
  console.log("选中的电话"+e.currentTarget.dataset.addrevalue);
  console.log("选中的index"+e.currentTarget.dataset.index)
  wx.navigateTo({
    url: '../modifyAddre/modifyAddre?name='+ e.currentTarget.dataset.name+"&tel="+e.currentTarget.dataset.tel+"&addrevalue="+e.currentTarget.dataset.addrevalue+"&areavalue="+e.currentTarget.dataset.areavalue+"&door="+e.currentTarget.dataset.door+"&index="+e.currentTarget.dataset.index
  })
  },
toCleanOrder:function(e){
  for(var i = 0;i<this.data.list.length;i++){
    if(i==e.currentTarget.dataset.index){
  li[e.currentTarget.dataset.index].image = "/image/check.jpg"}
  else{
    li[i].image = "/image/uncheck.png"
  }
}
	wx.navigateTo({
        url: '../confirmOrder/confirmOrder?name='+ e.currentTarget.dataset.name+"&tel="+e.currentTarget.dataset.tel+"&area="+e.currentTarget.dataset.area+"&addre="+e.currentTarget.dataset.addre+"&areavalue="+e.currentTarget.dataset.areavalue+"&flag="+true
      });
     console.log("姓名为："+e.currentTarget.dataset.name+"，手机是："+e.currentTarget.dataset.tel+"，地址是："+e.currentTarget.dataset.addre+"，用餐人数："+e.currentTarget.dataset.area+"，是否选择是："+e.currentTarget.dataset.index);
},

  onLoad: function(options) {
    var flag=false;//判断是从哪个页面跳转过来
    var sign = 0//判断从修改页面中的保存还是删除按钮过来，保存为1，删除为2
  	flag =options.flag;
    sign = options.sign;
    if (flag) {
    	 li.push({
      "index":index++,
    	"name":options.name,
    	"tel":options.tel,
    	"addre":options.addre+options.door,
    	"area":options.area,
      "image":"/image/uncheck.png",
      "addrevalue":options.addrevalue,
      "areavalue":options.areavalue,
      "door":options.door
    	})
        this.setData({
        	list:li
        })
    };
    if(sign=='1'){
      console.log("我是从修改页面过来的"+options.addrevalue)
      li[options.index].name=options.name;
      li[options.index].tel=options.tel;
      li[options.index].addre=options.addre+options.door;
      li[options.index].area=options.area;
      li[options.index].addrevalue=options.addrevalue;
      li[options.index].areavalue=options.areavalue;
      li[options.index].door=options.door;
      this.setData({
          list:li
        })
    };
    if(sign=='2'){
        li.splice(options.index, 1);
        this.setData({
          list:li
        })
      }
}
})