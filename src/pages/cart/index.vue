<template lang="wxml">
  <view class="wrapper">
    <!-- 收货信息 -->
    <view class="shipment">


      <block v-if="addr">
        <view class="dt">收货人: </view>
        <view class="dd meta">
          <text class="name">{{addr.userName}}</text>
          <text class="phone">{{addr.telNumber}}</text>
        </view>
        <view class="dt">收货地址:</view>
        <view class="dd">{{addr.detail}}</view>
      </block>
      
      <!-- 没地址，点击后，获取地址后才有展示 -->
      <button v-else type="primary" @tap="get_addr">获取收货地址</button>


    </view>



    <!-- 购物车 -->
    <view class="carts">
      <view class="item">
        <!-- 店铺名称 -->
        <view class="shopname">优购生活馆</view>


        <view class="goods" v-for="(item,index) in list" :key="item.goods_id">
          <!-- 商品图片 -->
          <image class="pic" :src="item.goods_small_logo"></image>
          <!-- 商品信息 -->
          <view class="meta">
            <view class="name">{{item.goods_name}}</view>
            <view class="price">
              <text>￥</text>{{item.goods_price}}<text>.00</text>
            </view>
            <!-- 加减 -->
            <view class="amount">
              <text class="reduce" @tap="change_numb(-1,index)">-</text>
              <input type="number" :value="item.goods_number" class="number">
              <text class="plus"  @tap="change_numb(1,index)">+</text>
            </view>
          </view>
          <!-- 选框 -->
          <view class="checkbox">
            <!-- icon 图标组件 -->
            <icon type="success" size="20" :color="item.goods_checked?'#ea4451':'#ccc'" @tap="change_ck(index)"></icon>
          </view>
        </view>




      </view>
    </view>


    <!-- 其它 -->
    <view class="extra">
      <label class="checkall">
        <icon type="success" :color="is?'#ea4451':'#ccc'" size="20" @tap="change_all"></icon>
        全选
      </label>
      <view class="total">
        合计: <text>￥</text><label>{{sum}}</label><text>.00</text>
      </view>
      <view class="pay" @tap="creat_order">结算(3)</view>
    </view>



  </view>
</template>

<script>
  export default {
    data(){
      // 1.读取本地数据
      return {
        list:[],
        addr:null,
      }
    },
    computed:{
      // 1.筛选出：要买的商品数组
      ck_list() { 
        var arr = [];

        // 筛选出要买的数据：
        this.list.forEach(function (item) { 
          if (item.goods_checked) {
            arr.push(item);
          }
        });

        return arr;
      },
      // 2.解决uniapp bug:三元表达式，判断问题;不是业务问题；Vue/cli写PC 没有问题；
      is() { 
        return this.ck_list.length==this.list.length;
      },
      // 选中商品的总价
      sum(){
        // 1.选中商品，初始化总价变量
        var zongjia = 0;

        // 2.计算总价：数量 * 单价
        this.ck_list.forEach(function (item) {
          zongjia += item.goods_number * item.goods_price;
        });

        // 3.返回总价
        return zongjia;
      }
    },
    onShow(){
      // onShow ：页面再出出现的时候，会执行函数；
      // 发现：data上数据也是加载一次就不再重新加载了！
      // 如何解决？在onShow 重新读取
      this.list = uni.getStorageSync("cc")||[];
      

      // 2.渲染：
    },
    methods:{
      // 单独改变数据
      change_numb(step,index){
        // step：点击-，传入是-1;
        // index:点击商品对应的下标


        // 边界判断：
        // 上限：点+，1千万件？商家库存（自己模拟上限10）；
        if (step==1&&this.list[index].goods_number==10) {
          return;
        }

        // 下限：点-，不能点到0；点到1让继续点击了；
        if (step==-1&&this.list[index].goods_number==1) {
          return;
        }

      

        // 让商品数量发生改变：简写
        this.list[index].goods_number += step;

        // 存回去
        uni.setStorageSync("cc",this.list);
      },
      // 单选
      change_ck(index){
        // index:点击商品的下标；
        // 拿到：商品属性；

        // 取反：
        this.list[index].goods_checked = !this.list[index].goods_checked;

        // 代码？存入本地？为什么要存入本地？修改了数据 
        uni.setStorageSync("cc",this.list);
      },
      // 全选
      change_all(){
        // 1.拿到现在状态 this.is

        // 2.点击之后；!is;
        var key = !this.is;

        // 3.同步给所有商品数据
        this.list.forEach(function (item) {  
          item.goods_checked = key;
        });


        // 4.存回本地；
        uni.setStorageSync("cc",this.list);
      },
      // API :获取地址
      get_addr(){
        uni.chooseAddress({
          success:(res)=>{
            this.addr = res;

            this.addr.detail = res.provinceName + res.cityName + res.countyName + res.detailInfo;
          }
        });
      },

      // 结算：
      async creat_order(){
        // 业务上：三个校验


        // 1.收货地址：
        if (!this.addr) {
          uni.showToast({title:"没有收货地址！",icon:"none"});
          return;
        }


        // 2.购买商品：看哪个属性？0取反true
        if (!this.ck_list.length) {
          uni.showToast({title:"没有购买的商品！",icon:"none"});
          return;
        }


        // 3.是否有token：是否为登录状态？
        if (!uni.getStorageSync("token")) {
          // 让用户去获取，去哪里获取？去一个专门登录页面；
          // JS内部：从当前这个页面去登录页面
          uni.navigateTo({
            url:"/pages/auth/index"
          });

          return;
        
        }



        // 上面信息都有，执行下面的代码：
        // 请求：uni-app 
        const {message,meta} = await this.$request_95({
          url:"/api/public/v1/my/orders/create",
          header:{
            Authorization:uni.getStorageSync("token")
          },
          method:"POST",
          data:{
            order_price:this.sum,
            consignee_addr:this.addr.detail,
            goods:this.ck_list
          }
        });

        // 订单创建成功
        if (meta.status==200) {
          // 3.1 
          // 清除本地购物商品数据：
          uni.removeStorageSync("cc");

          // 3.2 
          // 转跳订单页面：tabBar页面？
          uni.navigateTo({
            url:"/pages/order/index"
          });

        }
        
        




      }
    }
  }
</script>

<style scoped lang="less">
  .shipment {
    height: 100rpx;
    line-height: 2;
    padding: 30rpx 30rpx 40rpx 30rpx;
    font-size: 27rpx;
    color: #333;
    background-color: #fff;
    background-image: url(http://static.botue.com/ugo/images/cart_border%402x.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;

    .dt {
      width: 140rpx;
      float: left;
      clear: both;
    }

    .dd {
      padding-left: 160rpx;
    }

    .meta {
      padding-right: 50rpx;
    }

    text.phone {
      float: right;
    }
  }

  .carts {
    background-color: #f4f4f4;
    padding-bottom: 110rpx;
    overflow: hidden;

    .shopname {
      padding: 30rpx;
      margin-top: 20rpx;
      font-size: 30rpx;
      color: #333;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
    }

    .goods {
      display: flex;
      padding: 30rpx 20rpx 30rpx 0;
      margin-left: 100rpx;
      border-bottom: 1rpx solid #eee;
      background-color: #fff;
  
      position: relative;

      .checkbox {
        width: 101rpx;
        height: 100%;
        background-color: #fff;

        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        left: -100rpx;
        top: 0;
      }

      &:last-child {
        border-bottom: none;
      }

      .pic {
        width: 200rpx;
        height: 200rpx;
        margin-right: 30rpx;
      }

      .meta {
        flex: 1;
        font-size: 27rpx;
        color: #333;
        position: relative;
      }

      .name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .price {
        position: absolute;
        bottom: 0;

        color: #ea4451;
        font-size: 33rpx;

        text {
          font-size: 22rpx;
        }
      }

      .amount {
        position: absolute;
        bottom: 0;
        right: 20rpx;

        height: 48rpx;
        text-align: center;
        border: 1rpx solid #ddd;
        border-radius: 8rpx;

        display: flex;
        align-items: center;

        text {
          display: block;
          width: 60rpx;
          line-height: 48rpx;
          font-size: 36rpx;
          color: #ddd;
          text-align: center;
        }

        input {
          width: 60rpx;
          height: 48rpx;
          min-height: 48rpx;
          font-size: 27rpx;
          border-left: 1rpx solid #ddd;
          border-right: 1rpx solid #ddd;
        }
      }
    }
  }

  .extra {
    position: fixed;
    bottom: 0;
    /* #ifdef H5 */
    bottom: 50px;
    /* #endif */
    left: 0;
    z-index: 9;

    width: 750rpx;
    height: 96rpx;
    text-align: center;
    line-height: 96rpx;
    font-size: 36rpx;
    border-top: 1rpx solid #eee;
    background-color: #fff;
    color: #333;
    display: flex;

    .checkall {
      width: 140rpx;
      line-height: 1;
      margin-left: 25rpx;
      display: flex;
      align-items: center;

      icon {
        margin-right: 20rpx;
      }
    }

    .total {
      display: flex;
      justify-content: center;
      flex: 1;

      label, text {
        color: #ea4451;
        vertical-align: bottom;
        position: relative;
        bottom: -2rpx;
      }

      text {
        position: relative;
        bottom: -3rpx;
        font-size: 24rpx;

        &:first-child {
          margin-left: 10rpx;
        }
      }
    }

    .pay {
      width: 200rpx;
      background-color: #ea4451;
      color: #fff;
    }
  }
</style>

