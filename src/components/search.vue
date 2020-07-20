<template>
  <!-- 搜索 -->
  <div class="search" :class="{focused: focused}">

    <!-- 搜索框 -->
    <div class="input-wrap" @click="goSearch">
      <input type="text" :placeholder="placeholder" @input="input" v-model="query" @confirm="confirm">
      <span class="cancle" @click.stop="cancleSearch">取消</span>
    </div>


    <!-- 搜索结果 -->
    <div class="content">
      <div class="title">搜索历史
        <span class="clear" @tap="del"></span>
      </div>


      <div class="history">
        <navigator :url="'/pages/list/index?query='+item" v-for="(item,index) in history" :key="index">{{item}}</navigator>
      </div>



      <!-- 结果 出现：什么情况才要出现？queryList.length有长度 -->
      <!-- 建议列表： -->
      <scroll-view scroll-y class="result" v-if="queryList.length">
        <navigator :url="'/pages/goods/index?id='+item.goods_id" v-for="item in queryList" :key="item.goods_id">{{item.goods_name}}</navigator>
      </scroll-view>




    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        focused: false,
        placeholder: '',
        // 默认值是啥？""
        query:"",

        queryList:[],


        // 历史记录：1.直接获取本地数据，看本地数据是否有数据
        // 可以写API方法：但是写同步的API
        // uni.getStorageSync("history") 方法同步：最终会有一个结果
        // 结果 || []
        // 比较：Boolean是false,继续往后走
        history:uni.getStorageSync("history")||[]
      }
    },
    methods: {
      // 聚焦状态的执行函数
      goSearch (ev) {
        this.focused = true;
        this.placeholder = '请输入您要搜索的内容';
        
        // 触发父组件自定义事件
        this.$emit('search', {
          pageHeight: uni.getSystemInfoSync().windowHeight
        });

        // 隐藏tabBar
        uni.hideTabBar();
      },

      // 取消点击
      cancleSearch () {
        this.focused = false;
        this.placeholder = '';

        // 触发父组件自定义事件
        this.$emit('search', {
          pageHeight: 'auto'
        });

        // 显示tabBar
        uni.showTabBar();


        // 取消的时候？查询重置
        this.query = "";
        this.queryList = [];
      },
      // 1.在输入的时候，执行函数
      async input(){
        // 2.获取输入的数据？v-model语法 data初始化数据中准备属性 query

        // 3.做请求：uni-app支持 async await语法；
        const {message} =  await this.$request_95({
          url:"/api/public/v1/goods/qsearch",
          data:{
            query:this.query
          }
        });

        // 4.拿到数据，怎么办？data中准备个属性  console.log(message);
        this.queryList = message;

        // 5.点击取消的时候：重置 query queryList

        // 6.历史搜索记录和建议列表：刚开始搜索的时候，应该显示历史搜索记录，建议列表不出现（有数据的时候才出现）；
        
      },
      
      // 1.注册事件：原生组件上查事件
      confirm(){
        

        // 历史记录：2.需要把查询字段存入JS 数组中；去重；
        // 2.1 添加
        this.history.push(this.query);

        // 2.2 去重
        // 知识点：new Set(数组);---->对象，很像数组；不能直接用
        //         [...对象] 快速复制
        //        综合： [...new Set(数组)] ----->去重数组
        this.history = [...new Set(this.history)];

        // 2.3 数组在JS内部；[]---->["小米"]；
        // 存入：记得名字和前面一样，存入任何数据格式；
        uni.setStorageSync("history",this.history);



        // 2.JS方式进入新的页面，带着参数
        uni.navigateTo({
          url:"/pages/list/index?query="+this.query
        });
      },

      // 删除本地和JS内部的历史数据
      del(){
        // 1.本地
        uni.removeStorageSync("history");

        // 2.JS内初始化数组 重置
        this.history = [];

      }
    },
  }
</script>

<style lang="less" scoped>
  .search {
    display: flex;
    flex-direction: column;
    
    // 搜索框
    .input-wrap {
      display: flex;
      height: 100rpx;
      padding: 20rpx 30rpx;
      background-color: #ea4451;
      box-sizing: border-box;
      position: relative;

      &::before,
      &::after {
        height: 44rpx;
        line-height: 1;
        background-image: url(http://static.botue.com/ugo/images/icon_search%402x.png);
        background-size: 32rpx;
        background-position: 6rpx center;
        background-repeat: no-repeat;

        position: absolute;
        top: 28rpx;
        z-index: 9;
      }

      &::before {
        content: '搜索';
        display: block;

        width: 100rpx;
        padding: 11rpx 0 10rpx 44rpx;
        box-sizing: border-box;
        color: #666;
        font-size: 24rpx;
        left: 325rpx;
      }

      &::after {
        display: none;
        content: '';
        width: 44rpx;
        left: 40rpx;
      }

      input {
        flex: 1;
        height: 60rpx;
        padding: 0 20rpx 0 64rpx;
        background-color: #fff;
        border-radius: 8rpx;
        font-size: 24rpx;
        color: #666;
      }

      span.cancle {
        display: none;
        width: 80rpx;
        text-align: right;
        line-height: 60rpx;
        font-size: 27rpx;
        color: #666;
      }
    }

    // 搜索结果
    .content {
      display: none;
      flex: 1;
      padding: 27rpx;
      background-color: #fff;
      position: relative;

      .title {
        font-size: 27rpx;
        line-height: 1;
        color: #333;
      }

      .clear {
        display: block;
        width: 27rpx;
        height: 27rpx;
        float: right;
        background-image: url(http://static.botue.com/ugo/images/clear.png);
        background-size: cover;
      }

      .history {
        padding-top: 30rpx;

        navigator {
          display: inline-block;
          line-height: 1;
          padding: 15rpx 20rpx 12rpx;
          background-color: #ddd;
          font-size: 24rpx;
          margin-right: 20rpx;
          margin-bottom: 15rpx;
          color: #333;
        }
      }

      .result {
        // display: none;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: #fff;

        navigator {
          line-height: 1;
          padding: 20rpx 30rpx;
          font-size: 24rpx;
          color: #666;
          border-bottom: 1px solid #eee;

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
    
    // 获得焦点状态
    &.focused {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 9;

      .input-wrap {
        background-color: #eee;

        &::before {
          display: none;
        }

        &::after {
          display: block;
        }
      }

      span.cancle {
        display: block;
      }

      .content {
        display: block;
      }
    }
  }
</style>