<template lang="wxml">
  <view :style="{height: pageHeight, overflow: 'hidden'}">
    <search @search="disableScroll" />


    <!-- 焦点图 -->
    <swiper class="banner" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">

      <swiper-item v-for="item in banner" :key="item.goods_id">
        <navigator :url="'/pages/goods/index?id='+item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>


    </swiper>


    <!-- 导航条 -->
    <view class="navs">

      <navigator open-type="switchTab" url="/pages/category/index" v-for="item in nav" :key="item.name">
        <image :src="item.image_src"></image>
      </navigator>


    </view>


    <!-- 楼层 -->
    <view class="floors">



      <view class="floor" v-for="(item,index) in floors" :key="index">
        <view class="title">
          <image :src="item.floor_title.image_src"></image>
        </view>

        <view class="items">

          <navigator :url="'/pages/list/index?query='+product.name" v-for="product in item.product_list" :key="product.name">
            <image :src="product.image_src"></image>
          </navigator>

        </view>


      </view>






    </view>

    <!-- 回到顶部 -->
    <!-- <view class="goTop icon-top" @tap="goTop" v-if="isShow"></view> -->
    <view class="goTop icon-top" @tap="goTop" v-show="scrollTop>200?true:false"></view>
  </view>
</template>

<script>
  import search from '@/components/search';

  export default {
    // 需求：index加载的时候，请求轮播图数据
    data () {
      return {
        pageHeight: 'auto',
        banner:[],
        nav:[],
        floors:[],
        // 按钮不出现
        // isShow:false,

        scrollTop:0

      }
    },

    components: {
      search
    },
    
    methods: {
      disableScroll (ev) {
        this.pageHeight = ev.pageHeight + 'px';
      },
      // 1.请求轮播图数据
      //   uniapp对API都已经做了promise，支持async await
      async get_banner(){
        // const [err,res] = await uni.request({
        //   url:"https://api-ugo-web.itheima.net/api/public/v1/home/swiperdata",
        //   // method:如果是get请求方式 ，可以写或者不写；如果是POST必须写；
        // });


        // 
        // 1.使用自己刚才封装插件，问题：如何用？代码 await this.$request_95
        // 2.调用的时候？传入啥？谁是实参？接口路径，未来：POST，data; 解决：传入对象；回去修改插件
        // 3.封装函数内部：return，接受这个return; 调用this.$request_95 方法的时候，使用async await语法 :res已经是简单化的结果

    
        const {message} =  await this.$request_95({
          url:"/api/public/v1/home/swiperdata",
        });

    
        // 拿到数据怎么办？
        //   1.data 需要初始化一个数组
        //   2.视图中渲染；
        this.banner = message;
      
      },

      // 2.导航数据
      async get_nav(){

        // 开始传入的是url地址，后来我们说：一定有data/POST 传递，需要改为对象参数；
        // message属性
        const {message} =  await this.$request_95({
          url:"/api/public/v1/home/catitems"
        });

        // 拿到数据怎么办？
        // 1.data准备个初始化数据
        // 2.赋值
        this.nav = message;
      },

      // 3.楼层数据
      async get_floors(){

        // 开始传入的是url地址，后来我们说：一定有data/POST 传递，需要改为对象参数；
        // message属性
        const {message} =  await this.$request_95({
          url:"/api/public/v1/home/floordata"
        });
        
        // 拿到数据怎么办？
        // 1.data准备个初始化数据
        // 2.赋值
        this.floors = message;
      },

      // 
      goTop(){
        // API：回到顶部
        uni.pageScrollTo({
          scrollTop:0
        });
      }


    },
    // 不写业务逻辑，写调用，
    onLoad(){
      // 
      this.get_banner();

      // 
      this.get_nav();

      // 
      this.get_floors();

      
      // index 可以有转发的功能！一般不用;
      // uni.showShareMenu();
    },
    // 小程序生命周期函数
    async onPullDownRefresh(){
      // 用户下拉的时候执行，里面写什么？
      // 需求：1.更新数据？做请求？onLoad 函数再次调用；
      //       2.请求完毕的时候，关闭下拉刷新效果；API；函数在uni-app支持 async await 语法糖
      // 
      await this.get_banner();

      // 
      await this.get_nav();

      // 
      await this.get_floors();

      // 关闭效果：应该什么时候才去执行这个方法？上面这些方法异步的；
      // 异步执行：异步代码写在前面，也是在执行机制：同步后面会执行异步；
      uni.stopPullDownRefresh();

    },
    // 滚动的时候会执行
    onPageScroll(e){
      // 判断：当卷入高度 超过一定值(自己定)的时候，应该怎么？让 btn 显示
      // 核心：卷入高度 如何获取？
      // if (e.scrollTop>200) {
      //   this.isShow = true;
      // }
      // else {
      //   this.isShow = false;
      // }


      //获取值，存在data初始化数据里
      this.scrollTop = e.scrollTop;
    
    },
    // 自定义转发
    onShareAppMessage () {
      return {
          title: '山未动，心已远!一起和我旅游吧！',
          imageUrl: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3823400770,3555259268&fm=26&gp=0.jpg',
          path: '/pages/index/index'
      }
    }
  }
</script>

<style scoped lang="less">
  .banner {
    width: 100%;
    height: 340rpx;

    image {
      width: 100%;
      height: 340rpx;
    }
  }

  .navs {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 44rpx;

    image {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor {

    .title {
      width: 750rpx;
      height: 60rpx;
      padding: 20rpx 0 0 8rpx;
      background-color: #f4f4f4;
    }

    .items {
      padding: 20rpx 16rpx;
      overflow: hidden;

      navigator {
        width: 193rpx;
        height: 188rpx;
        margin-left: 10rpx;
        margin-bottom: 10rpx;
        float: left;
      }

      navigator:first-child {
        width: 232rpx;
        height: 386rpx;
        margin-left: 0rpx;
      }

      navigator:nth-child(2),
      navigator:nth-child(5) {
        width: 273rpx;
      }
    }

    &:first-child {

      .items {

        navigator {
          width: 233rpx;
        }
      }
    }
  }

  .goTop {
    position: fixed;
    bottom: 30rpx;
    /* #ifdef H5 */
    bottom: 65px;
    /* #endif */
    right: 30rpx;
  
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    font-size: 48rpx;
    color: #666;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>