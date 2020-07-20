<template>
  <view>
    <!-- 布局：顶部盒子，下面scroll-view（区域滚动，盒子自己内部有滚动条） 列表，单独盒子： -->


    <!-- 筛选 -->
    <view class="filter">
      <text class="active">综合</text>
      <text>销量</text>
      <text>价格</text>
    </view>


    <!-- 商品列表 -->
    <scroll-view class="goods" scroll-y @scrolltolower="scrolltolower">


      <view class="item" @tap="goDetail(item.goods_id)" v-for="item in list" :key="item.goods_id">
        <!-- 商品图片 -->
        <image class="pic" :src="item.goods_small_logo"></image>
        <!-- 商品信息 -->
        <view class="meta">
          <view class="name">{{item.goods_name}}</view>
          <view class="price">
            <text>￥</text>{{item.goods_price}}<text>.00</text>
          </view>
        </view>
      </view>







    </scroll-view>


  </view>
</template>

<script>
  export default {
    data(){
      return {
        query:"",
        pagenum:1,
        pagesize:5,

        list:[],

        // 
        flag:"请求完成"
      }
    },
    methods: {
      goDetail (id) {
        // 页面转跳  普通页
        uni.navigateTo({
          url: '/pages/goods/index?id='+id
        });
      },
      async get_data(){
        // 请求：初始化在data上；Vue:一般默认值，初始化在data;   pagenum：1   pagesize：5

        // 请求没有完成
        if (this.flag=="请求未完") {
          return;
        }

        // 执行这个函数的时候：
        this.flag = "请求未完";
        // console.log(this.flag);
        

        const {message}  = await this.$request_95({
          url:"/api/public/v1/goods/search",
          data:{
            query:this.query,
            pagenum:this.pagenum,
            pagesize:this.pagesize,
          }
        });

        this.flag = "请求完成";
        // console.log(this.flag);

        // 插件封装：调用的时候每次都是解构出 message；是后台约定的么？
        // 所有的接口：后台给的；
        // 接口返回数据格式：所有的接口格式都是一样；是后台约定；
        // 
        // this.list = message.goods;
        this.list = this.list.concat(message.goods);
        
      },
      // 触底的时候执行：
      scrolltolower(){

        // 1. pagenum++;
        this.pagenum++;
        // 2. 请求：重新写一次？不需要
        // 调用函数：需要参数？如何解决？query查询字段一开始就应该存起来；实例内使用方法都可以用；
        // 回去修改：初始化query存起来；
        //          获取数据函数get_data内部参数；

        // 请求：应该是没有问题；
        this.get_data();


        // 问题：调用成功，把以前旧数据覆盖掉了；
        // 为什么：因为this.list = message；
        // 解决：应该是push吧?concat

      }
    },
    onLoad(e){
      // 1.获取数据
      this.query = e.query;

      // 2.请求：
      this.get_data();
    
    }
  }
</script>

<style scoped lang="less">
  .filter {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    border-bottom: 1rpx solid #ddd;

    /* #ifdef H5 */
    position: relative;
    z-index: 99;
    /* #endif */

    text {
      flex: 1;
      text-align: center;
      font-size: 30rpx;
      color: #333;

      &.active {
        color: #ea4451;
      }
    }
  }
  
  .goods {
    position: absolute;
    width: 100%;
    top: 97rpx;
    bottom: 0;
  }

  .item {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 20rpx;
    border-bottom: 1rpx solid #eee;

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
  }
</style>
