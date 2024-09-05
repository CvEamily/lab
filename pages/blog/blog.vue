<template>
  <view class="bg">
    <div class="search" @click="gotoSearch()">
      <input type="text" placeholder="搜索blog内容"></input>
      <uni-icons type="search" size="20" color="#8a8e99"></uni-icons>
    </div> 
    <v-tabs v-model="current" :tabs="tabs" @change="changeTab" color="grey" activeColor="" fontSize="35rpx" bold="false" scroll="false" lineHeight="10rpx" padding="0rpx"></v-tabs>
    <div class="article">
      <div class="blog _myTheme1" v-for="(item, i) in blog_info" :key="item.id" @click="gotoDetails($event,item.id)">
        <div class="left">
          <image src="https://tse4-mm.cn.bing.net/th/id/OIP-C.sCgU_kBpXCCIIE77R_tuUAHaNK?pid=ImgDet&rs=1" mode="aspectFill"></image>
        </div>
        <div class="right"> 
          <div class="headline">{{blog_info[i].title}}</div>
          <div class="author">
            <div class="user">
                <image src="https://p.qqan.com/up/2021-6/16246735796128385.png" mode="aspectFill"></image>
            </div>
            <text v-if="blog_info[i].nickname">{{blog_info[i].nickname}}</text>
            <text v-if="!blog_info[i].nickname">{{blog_info[i].username}}</text>
          </div>
          <!-- <div class="body">{{blog_info[i].content}}</div> -->
          <div class="icon">
            <div class="uniIcon"><uni-icons type="eye" size="20"></uni-icons>{{blog_info[i].views}}</div>
            <div class="uniIcon"><uni-icons type="hand-up" size="20"></uni-icons>{{blog_info[i].gttu}}</div>
            <div class="uniIcon"><uni-icons type="chatbubble" size="20"></uni-icons>{{blog_info[i].comment_num}}</div>
          </div>
        </div>
      </div>
      </div>
  </div>
  </view>
</template>

<script>
  import config from '../../utils/config'
  export default {
    data() {
      return {
        token:'',
        blog_info:[{title:'加载中',username:'加载中',nickname:'加载中',content:'加载中',outline:'',views:'',gttu:'',create_time:'',comment_num:'',filename:'',tag:'',id:''}],
        current: 0,
        tabs: [],
      };
    },
    async onLoad(){
      this.getToken()
      await this.allBlog()
      await this.getTag()
    },
    methods:{
      async getTag(e) {
      	const params = {
          "setMyHeaderxxx": {
            "token":this.token
           }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.get(config.host+'/tag', params);
      	if (res.code == 1) {
          this.tabs.push("All")
          for(let i=0;i<res.data.length-1;i++){
            this.tabs.push(res.data[i].tagname)
          }
      		return ;
      	} else {
          console.log(res.code);
      		uni.showToast({
      			title: '加载失败',
      			duration: 2000,
      			icon: 'none'
      		});    
      	}
      },
      async tag(index) {
      	const params = {
          'tag':this.tabs[index],
          "setMyHeaderxxx": {
              'token': this.token,
              'content-type': 'application/x-www-form-urlencoded',
              "accept": "application/json"
           }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.post(config.host+'/blog/tag', params);
      	if (res.code == 1) {
          this.blog_info=res.data;
      		return ;
      	} else {
          console.log(res.code);
      		uni.showToast({
      			title: '加载失败',
      			duration: 2000,
      			icon: 'none'
      		});    
      	}
      },
      changeTab(index) {
        if(index==0){
          this.allBlog();
        }else{
          this.tag(index);
        }
      },
      getToken(){
        this.token=wx.getStorageSync("token")
      },
      async allBlog(e) {
      	const params = {
          "setMyHeaderxxx": {
            "token":this.token
           }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.get(config.host+'/blog/wxgetallblog', params);
      	if (res.code == 1) {
          this.blog_info=res.data;
          console.log(this.blog_info);
      		return ;
      	} else {
          console.log(res.code);
      		uni.showToast({
      			title: '加载失败',
      			duration: 2000,
      			icon: 'none'
      		});    
      	}
      },
      gotoSearch(){
        uni.navigateTo({
          url:'./search/search'
        })
      },
      gotoDetails(e,id){
        uni.navigateTo({
          url:'./details/details',
          events:{
            acceptDataFromOpenedPage: function(data) {
              console.log(data)
            },
            someEvent: function(data) {
              console.log(data)
            }
          },
          success: function(res) {
              res.eventChannel.emit('acceptDataFromOpenerPage', { id: id})
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .bg{
    .search{
      display: flex;
      padding-top: 40rpx;
      height: 120rpx;
      background-color: white;
      input{
        width: 600rpx;
        height: 80rpx;
        padding-left: 80rpx;
        margin-left: 25rpx;
        margin-right: 30rpx;
        border-radius: 15rpx;
        background-color: #eeeeee;
      }
      .sea{
        color: #b9bec2;
      }
      uni-icons{
        position: absolute;
        top: 60rpx;
        left: 50rpx;
      }
      .sear{
        width: 80rpx;
        height: 50rpx;
        color: #007afd;
        padding-top: 20rpx;
      }
    }
    v-tabs{
    }
    .article{
      float: left;
      margin-top: 20rpx;
      .blog{
        width: 700rpx;
        height: 350rpx;
        padding-left: 40rpx;
        padding-top: 40rpx;
        margin-bottom: 20rpx;
        .left{
          float: left;
          width: 220rpx;
          height: 300rpx;
          padding-bottom: 30rpx;
          image{
            width: 100%;
            height: 100%;
          }
        }
        .right{
          float: right;
          width: 450rpx;
          height: 300rpx;
          .headline{
            width: 100%;
            height: 45rpx;
            padding-top: 10rpx;
            padding-left: 20rpx;
            padding-bottom: 10rpx;
            font-size: 35rpx;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
          }
          .author{
            .user{
              float: left;
              width: 50rpx;
              height: 50rpx;
              justify-content: center;
              align-items: center;
              overflow: hidden;
              box-shadow: 0 0 2rpx 2rpx white;
              border-radius: 50rpx;
              image{
                height: 100%;
                width: 100%;
              }
            }
            text{
              overflow: hidden;
            }
          }
          .body{
            height: 50rpx;
            margin-top: 15rpx;
            height: 150rpx;
            font-size: 30rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
            color: #a4a4a4;
          }
          .icon{
            .uniIcon{
              float: left;
              margin-right: 30rpx;
            }
          }
        }
      }
    }
  }
</style>
