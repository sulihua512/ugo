<template>
  <view>
    <!-- 搜索 -->
    <search />


    <!-- 分类 -->
    <view class="category">



      <!-- 顶级分类 -->
      <view class="sup">

        
        <scroll-view scroll-y>  
          <!-- active?怎么加 -->
          <!-- 下标：0;第一项 -->


          <!-- 需求：点击一级导航的时候，切换 -->
          <!-- 问：我怎么知道自己点击是谁？ vue语法，注册事件=函数（参数index） 原生：不行 -->
          <text 
            :class="{'active':index==ac_index}" 
            v-for="(item,index) in arr" 
            :key="item.cat_id"
            @tap="tap(index)">{{item.cat_name}}
          </text>
          
        </scroll-view>


      </view>


      <!-- 子级分类 -->
      <view class="sub">
        <scroll-view scroll-y>
          <!-- 封面图 -->
          <image src="http://static.botue.com/ugo/uploads/category.png" class="thumb"></image>

          <!-- 二级导航 -->
          <view class="children" v-for="item in arr[ac_index].children" :key="item.cat_id">
            <view class="title">{{item.cat_name}}</view>
            <!-- 三级导航 -->
            <view class="brands">

              <navigator :url="'/pages/list/index?query='+product.cat_name" v-for="product in item.children" :key="product.cat_id">
                <image :src="product.cat_icon"></image>
                <text>{{product.cat_name}}</text>
              </navigator>



            </view>
          </view>



        </scroll-view>


      </view>

      


    </view>
  </view>
</template>

<script>
  import search from '@/components/search';

  export default {
    data(){
      return {
        arr:[],
        // 默认下标
        ac_index:0
      }
    },
    components: {
      search
    },
    methods:{
      async get_data(){
        const {message} =  await this.$request_95({
          url:"/api/public/v1/categories"
        });


        // console.log(message);
        this.arr = message;
        
      },
      tap(index){
        // 拿到下标有啥用？为什么要拿下标？  拿到下标，就是为了判断现在点击是哪个一级菜单

        // 前面：
        // 一级：active类名添加；index== 0
        // 二三级：默认是第一项 arr[0].children

        // 怎么做？如何把获取到的数据替换到上面自己写的0位置
        //    1.需要在data数据中  初始化 默认下标的属性ac_index 0; 【修改？wxml的0】
        //    2.赋值；
        this.ac_index = index;
      }
    },
    onLoad(){
      this.get_data();
    }
  }
</script>

<style scoped lang="less">
  scroll-view {
    height: 100%;
  }

  .category {
    display: flex;
    width: 100%;
    position: absolute;
    top: 100rpx;
    bottom: 0;

    .sup {
      width: 196rpx;
      background-color: #f4f4f4;

      text {
        display: block;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        font-size: 27rpx;
        color: #333;
        border-bottom: 1rpx solid #eee;

        &:last-child {
          border-bottom: none;
        }
        
        &.active {
          background-color: #FFF;
          color: #ea4451;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 8rpx;
            height: 60rpx;
            transform: translateY(-50%);
            background-color: #ea4451;

            position: absolute;
            left: 0;
            top: 50%;
          }
        }
      }
    }

    .sub {
      flex: 1;
      padding: 20rpx 18rpx;

      .thumb {
        width: 100%;
        height: 180rpx;
      }

      .children {
        text-align: center;
        color: #333;

        .title {
          display: inline-block;
          margin: 40rpx 0 20rpx;
          font-size: 30rpx;

          &::before {
            content: '/';
            margin-right: 20rpx;
            color: #666;
          }

          &::after {
            content: '/';
            margin-left: 20rpx;
            color: #666;
          }
        }
      }

      .brands {
        display: flex;
        flex-wrap: wrap;

        navigator {
          width: 33%;
          margin-bottom: 20rpx;
        }

        image {
          width: 120rpx;
          height: 120rpx;
        }

        text {
          display: block;
          font-size: 24rpx;
        }
      }
    }
  }
</style>
