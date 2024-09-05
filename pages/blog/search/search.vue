<template>
  <view class="bg">
    <div class="search">
      <input type="text" placeholder="Search..." placeholder-class="sea" v-model="search"></input>
      <uni-icons type="search" size="20" color="#989898"></uni-icons>
      <text class="sear" @click="searchInfo();gotoDetails($event,search);">搜索</text>
    </div>
    <div class="tab">
      <v-tabs v-model="current" :tabs="tabs" @change="changeTab" color="grey" activeColor="#1771e3" fontSize="35rpx" bold="false" scroll="false" lineHeight="10rpx" padding="0rpx" paddingItem="55rpx"></v-tabs>
    </div>
    <div class="rec">
      <div class="delete">
        <div class="uniIcon">
          <uni-icons type="trash" size="20" color="#a2a3a8"></uni-icons>
        </div>
      </div>
      <div class="box" v-for="(item,i) in his">
        <text class="tag" :key="i" @click="searchInfo();changeSearch(item);gotoDetails($event,item);">{{his[i]}}</text>
      </div>
    </div>
  </view>
</template>

<script>
  import config from '../../../utils/config'
  export default {
    data() {
      return {
        token:'',
        search_info:[{comment_num:'',content:'加载中',create_time:'',filename:'',gttu:'',hot:'',id:'-1',nickname:'加载中',outline:'',profile_photo:'',tag:'',title:'',username:'加载中',views:''}],
        search:'',
        his:[],
        current: 0,
        tabs:["综合","文章","标签","用户"],
      };
    },
    async onLoad(){
      this.getToken()
      await this.history()
    },
    methods:{
      changeSearch(item){
        this.search=item
        console.log('changeSearch');
      },
      changeTab(index) {
        console.log('当前选中的项：' + index)
      },
      gotoDetails(e,search){
        console.log('gotoDetails');
        uni.navigateTo({
          url:'./searchDetails/searchDetails',
          events:{
            acceptDataFromOpenedPage: function(data) {
              console.log(data)
            },
            someEvent: function(data) {
              console.log(data)
            }
          },
          success: function(res) {
            res.eventChannel.emit('acceptDataFromOpenerPage',{search: search})
            console.log('search:'+search);
          }
        })
      },
      async history(e) {
      	const params = {
          "setMyHeaderxxx": {
            "token":this.token
           }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.get(config.host+'/blog/history', params);
      	if (res.code == 1) {
          console.log(res.data);
          for(let i=0;i<res.data.length;i++){
            if(res.data[i]&&res.data[i]!="undefined"){
              this.his.push(res.data[i])
            }
          }
          console.log(this.his);
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
      async searchInfo(e) {
      	const params = {
          'search':this.search,
          'timeType': 0,
          'selectType': 0,
          'type': 0,
          "setMyHeaderxxx": {
            "token":this.token,
            'content-type': 'application/x-www-form-urlencoded',
            "accept": "application/json"
           }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.post(config.host+'/blog/wxsearch', params);
        console.log('searchInfo', res);
      	if (res.code == 1) {
          //
          this.blog_info=res.data;
      		return ;
      	}
        console.log(res.code);
        uni.showToast({
          title: '加载失败',
          duration: 2000,
          icon: 'none'
        });    
      },
      getToken(){
        this.token=wx.getStorageSync("token")
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
        width: 520rpx;
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
    .tab{
      width: 100%;
      height: 50rpx;
      padding-bottom: 20rpx;
      border-bottom: 1rpx solid #f0f0f0;
    }
    .rec{
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      height: 980rpx;
      .delete{
        width: 100%;
        height: 70rpx;
        .uniIcon{
          position: fixed;
          top: 250rpx;
          right: 20rpx;
        }
      }
      .box{
        display: flex;
        margin-top: 80rpx;
        .tag{
          font-size: 28rpx;
          height: 40rpx;
          color: #9fa4aa;
          padding: 15rpx;
          padding-left: 25rpx;
          padding-right: 25rpx;
          margin-top: -55rpx;
          margin-left: 20rpx;
          border-radius: 40rpx;
          background-color: #eeeeee;
        }
      }
    }
  }
</style>
