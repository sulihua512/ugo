// 用vue中JS作为模块，导出的时候，如何导出？

// 1.导出语法：export default
// 2.导出函数：最终被谁通过什么语法使用？Vue.use()
// 3.函数内部：Vue形参?
// 4.把昨天：在main.js写这个函数，完全替换在这

export default function(Vue) {
  // 上面设置一些东西；有什么用？所有的实例都可以用；

  // 封装函数，把uni-app请求再次做一个封装


  // ********************************************************************
  // 解决问题？1形成一个配置项；基础路径

  // 直接就这。解决1
  var baseUrl = "https://api-ugo-web.itheima.net";

  // 小细节问题：
  // 1 requset行不行？实例中调用 this.request("实参接口路径")和 uni.request 单词有没有关系？没有关系
  // 2 基础路径写好了，接口路径在哪？在我们调用那个地方！
  // 3.如何在调用那个地方接口路径  拼在 函数内部？封装的时候形参，调用的时候传递的就是实参
  // 

  // ********************************************************************
  // 解决问题？2 简单化处理返回的数据

  // 小细节问题：
  // 1.都是支持一个 async await语法：能不能在这用下？可以
  // 2.怎么用？写？函数前 ：async
  // 3.res 拿到返回的数据，做什么处理呢？res下面数据格式复杂；需要某个地方数据
  // 4.也是async await 函数里面可以使用 return;
  // 5.如何调用这个 await this.requset_95()
  // 6.未来会传入 接口路径，POST、data、修改形参为？对象；内部需要调用对象下属性；

  Vue.prototype.$request_95 = async function(opt) {

    // 思考：
    //   拦截器，来自于axios vue-cli自带做请求。
    //   为什么不用axios？不是构建npm，小程序不支持axios；ajax   只认wx.request();


    // 请求前：showLoading  wxapp API 
    uni.showLoading({
      title: "加载中...",
      mask: true, // 不让用户继续触摸屏幕；网速一般的话，用这个方法体验不好；
    });


    // 请求的封装:
    // url:组成：基础路径+接口路径
    const [err, res] = await uni.request({
      url: baseUrl + opt.url,
      header: opt.header,
      data: opt.data,
      method: opt.method
    });


    // 请求后：hideLoading;
    uni.hideLoading();


    return res.data;

  }
}