<template>
  <view>
    <button type="primary" open-type="getUserInfo" @getuserinfo="btn_userInfo">微信登录</button>
  </view>
</template>

<script>
  export default {
    // 终极目标：为了获取token
    // 发出请求：
    //   用户信息：通过JS API方法获取 也可以用户主动点击；
    //   code：wx.login():

    // 过去获取用户信息：只有一个方式JS API（不需要经过用户同意）；
    // 获取人家用户信息，从体验上来讲，现在增了一个方式（需要用户点击才能获取用户信息）

    // 现在获取用户信息：
    // 1.加载页面的时候，先用JS方法获取用户信息；（如果能，意味着：之前点击过）看能不能获取到；
    // 2.如果获取不到用户的信息。需要用户主动点击按钮，进行获取（特性：只要用户点击授权后，那么下次可以直接通过JSapi 方式进行获取；）；


    // 步骤：
    // 1.加载页面的时候 onLoad API先获取用户信息；
    methods:{
      // 为了获取用户信息：
      async api_userInfo(){
        // API 方法：
        // wxapi: 异步；uni-app 对大部分的API做了封装；可以使用async await;
        // 返回：[错误对象，数据对象]
        const [err,res] = await uni.getUserInfo();

        // res: undefined 没有点击过。等待用户自己动手指去点击就行了；
        // 2.如果获取不到用户的信息。需要用户主动点击按钮，进行获取（特性：只要用户点击后，那么下次可以直接通过JSapi 方式进行获取；）；

        // res存在，意味着曾经授权过；；
        if (res) {
          this.get_token(res);
        }
        
        
      },


      // 2.点击获取；改名字，为了大家更好理解；
      // 从哪获取用户信息？肯定是事件对象；
      // 经过用户点击第二步，下一次，就可以通过JS 第一步可以直接获取 用户信息；
      btn_userInfo(e){
        // console.log(e);
        // 用户信息
        // console.log(e.detail);

        // 
        this.get_token(e.detail);
        
      },



      // 无论是通过JS方式获取还是btn? 把拿到用户信息--->统一的传入一个函数（用于获取token）
      // 形参：用于干啥？接受用户信息；
      // 两个途径：这个get_token 函数应该在两个地方都应该调用下；
      async get_token(data){
        // 1.用户信息：data  console.log(data);

        // 2.code：JS api 直接进行获取  uni.login() 异步；
        // 怎么写；
        const [err,codeRes] =  await uni.login();
        // console.log(codeRes.code);
        

        // 3.接下来怎么办？发请求 异步；
        const {message} =  await this.$request_95({
          url:"/api/public/v1/users/wxlogin",
          method:"POST",
          data:{
            encryptedData:data.encryptedData,
            iv:data.iv,
            rawData:data.rawData,
            signature:data.signature,
            code:codeRes.code,
          }
        });

        // message：null？
        // 用户可以获取token的话，需要后台配置；
        // 需要小程序申请（选择组织：）的时候：（企业才是可以）支持做订单业务，支付的业务；
        // 需要：企业的小程序；
        // 个人:没有做支付订单（需要token;）
        // console.log(message);

        // wxappID:wx38d8faffac4d34d2  黑马的企业小程序的ID；大家到了公司：用企业公司小程序ID；
        // 下去练习的时候：黑马的企业小程序的ID大家能不能用？
        // 为什么不能用？大家不是我们学校添加开发人员；

        // 本地设置；
        uni.setStorageSync("token",message.token);
        
        // 需要回到 购物车：需要token;
        uni.navigateBack();
      }




    },
    onLoad(){

      // 1 API获取；
      this.api_userInfo();
    }


  }
</script>

<style lang="less" scoped>
  button {
    width: 600rpx;
    margin: 200rpx auto 0;
  }
</style>