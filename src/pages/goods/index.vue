<template>
  <view class="wrapper">
    <!-- 商品图片 -->
    <swiper class="pics" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">

      <swiper-item v-for="item in goods.pics" :key="item.pics_id">
        <image :src="item.pics_big"></image>
      </swiper-item>

    </swiper>


    <!-- 基本信息 -->
    <view class="meta">
      <view class="price">￥{{goods.goods_price}}</view>
      <view class="name">{{goods.goods_name}}</view>
      <view class="shipment">快递: 免运费</view>
      <text class="collect icon-star">收藏</text>
    </view>



    <!-- 商品详情 -->
    <view class="detail">
      <rich-text :nodes="goods.goods_introduce"></rich-text>
    </view>


    <!-- 操作 -->
    <view class="action">
      <button open-type="contact" class="icon-handset">联系客服</button>
      <text class="cart icon-cart" @tap="goCart">购物车</text>
      <text class="add" @tap="add">加入购物车</text>
      <text class="buy" @click="createOrder">立即购买</text>
    </view>
  </view>
</template>

<script>
  export default {
    data(){
      return {
        // 对象
        goods:null,
        // 1.读取本地存商品信息
        list:uni.getStorageSync("cc")||[]
      }
    },
    methods: {
      goCart () {
        uni.switchTab({
          url: '/pages/cart/index'
        });
      },
      createOrder () {
        uni.navigateTo({
          url: '/pages/order/index'
        })
      },

      // 请求
      async get_data(id){
        
        const {message} = await this.$request_95({
          url: '/api/public/v1/goods/detail',
          data: {
            goods_id: id
          }
        });

        this.goods = message
        // console.log(message);
        
      },

      // 2.添加一条本地数据 add
      add(){
        // 准备一条 名字、图片、价格等
        var obj = {
          goods_id:this.goods.goods_id,
          goods_name:this.goods.goods_name,
          goods_price:this.goods.goods_price,
          goods_number:1,
          goods_small_logo:this.goods.goods_small_logo,
          // 默认就是买：
          goods_checked:true,
        };


        // 3.添加到this.list这里；
        // 需要：判断商品是否重复？

        // 3.1 假设该商品不重复：
        var key="未重复";

        // 3.2 验证：遍历数组this.list 到底有没有重复？
        for (var i = 0; i < this.list.length; i++) {
          // 商品重复；做什么事？商品重复number++ 
          if (this.list[i].goods_id == obj.goods_id) {
            this.list[i].goods_number++;
            key = "已重复";
            break;
          }
        }

        // 3.3 看此时key 已经经过验证后的 状态
        // 上面没有一个商品是重复过，这确实是一个新的商品
        // 新的商品？如何？怎么办？添加
        if (key=="未重复") {
          this.list.push(obj);
        }


        // 4.this.list  JS数组：已经发生改变了。要怎么办？存到本地
        // 名字：哪个？
        uni.setStorageSync("cc",this.list);
        // 


        // 5.友好提醒
        uni.showToast({title:"添加成功"});

      }
    },
    onLoad(e){

      // 1.获取传入的参数
      // console.log(e.id);


      // 2.获取数据
      this.get_data(e.id);
      
    }
  }
</script>

<style scoped lang="less">
  .wrapper {
    margin-bottom: 100rpx;
    background-color: #f4f4f4;
  }

  .pics {
    height: 640rpx;
  }
  
  .meta {
    height: 250rpx;
    line-height: 1;
    padding: 30rpx 180rpx 30rpx 20rpx;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;

    .price {
      font-size: 36rpx;
      color: #ea4451;
      margin-bottom: 20rpx;
    }

    .name {
      color: #333;
      line-height: 1.4;
      font-size: 33rpx;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .shipment {
      font-size: 27rpx;
      color: #999;
      position: absolute;
      bottom: 30rpx;
    }

    .collect {
      width: 140rpx;
      height: 88rpx;
      text-align: center;
      box-sizing: border-box;
      border-left: 1rpx solid #ddd;
      font-size: 24rpx;
      color: #999;

      position: absolute;
      right: 10rpx;
      top: 91rpx;
    }

    [class*="icon-"]::before {
      display: block;
      font-size: 45rpx;
      margin-bottom: 10rpx;
    }
  }

  .detail image {
    width: 100%;
    height: 480rpx;
    margin-top: 20rpx;
  }

  .action {
    width: 100%;
    height: 98rpx;
    background-color: #fff;

    position: fixed;
    left: 0;
    bottom: 0;

    display: flex;
    align-items: center;

    text {
      display: block;
    }

    .add, .buy {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 210rpx;
      text-align: center;
      font-size: 27rpx;
      color: #fff;
    }

    .add {
      background-color: #f4b73f;
    }

    .buy {
      background-color: #ea4451;
    }

    button {
      padding: 0;
      border-radius: 0;
      background-color: #fff;

      &::after {
        border: none;
      }
    }

    button, .cart {
      flex: 1;
      text-align: center;
      color: #989898;
      font-size: 24rpx;
      box-sizing: border-box;
    }

    [class*="icon"]::before {
      display: block;
      font-size: 45rpx;
      margin-bottom: 2rpx;
    }
  }
</style>
