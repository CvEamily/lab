<template>
  <view class="bg">
    <div class="tit">
      <text>创作</text>
      <div class="publish" @click="addBlog();">发布</div>
    </div>
    <textarea name="" id="" cols="30" rows="10" placeholder="请输入标题" placeholder-style="title" class="Title" maxlength="17" v-model="title"></textarea>
    <textarea name="" id="" cols="30" rows="10" placeholder="请输入正文" placeholder-style="title" class="body" maxlength="-1" v-model="content"></textarea>
    <view class="function">
      <uni-icons type="font" size="30" color="#9a9a9a" @click="changeFont();" v-if="font"></uni-icons>
      <uni-icons type="font" size="30" color="#056de8" v-if="!font"></uni-icons>
      <uni-icons type="image" size="30" color="#9a9a9a" @click="open()"></uni-icons>
      <uni-popup ref="popup" type="bottom" :mask-click="true">
        <div class="picture">拍照</div>        
        <div class="picture">图片 / 视频</div>
      </uni-popup>   
      <uni-icons type="plus" size="30" color="#9a9a9a" @click="changePlus();" v-if="plus"></uni-icons>
      <uni-icons type="plus" size="30" color="#056de8" v-if="!plus"></uni-icons>
      <uni-icons type="arrow-left" size="30" color="#9a9a9a"></uni-icons>
      <uni-icons type="arrow-right" size="30" color="#9a9a9a"></uni-icons>
      <uni-icons type="gear-filled" size="30" color="#242424"></uni-icons>
    </view>
    <div class="fontBox" v-if="!font">
      <div class="item">
        <div class="uniIcon">
          一级标题
        </div>
      </div>
      <div class="item">
        <div class="uniIcon">
          二级标题
        </div>
      </div>
      <div class="item">
        <div class="uniIcon">
          <uni-icons custom-prefix="iconfont" type="icon-B" size="25"></uni-icons>
        </div>
      </div>
      <div class="item">
        <div class="uniIcon">
           <uni-icons custom-prefix="iconfont" type="icon-italic" size="25"></uni-icons>
        </div>
      </div>
    </div>
    <div class="plusBox" v-if="!plus">
      <div class="item" v-if="!add">
        <div class="uniIcon" @click="addTag()">
          <uni-icons type="flag" size="25"></uni-icons>
        </div>
        <div class="wenzi">
          添加标签
        </div>
      </div>
      <div class="item" v-if="!add">
        <div class="uniIcon">
          <uni-icons type="paperclip" size="25"></uni-icons>
        </div>
        <div class="wenzi">
          添加链接
        </div>
      </div>
      <div class="addTag"  v-if="add">
        <div  v-for="(item, i) in tabs" @click="()=>chooseTag(item)" :key="i" class="txt">
          <text>{{item}}</text>
        </div>
      </div>
    </div>
  </view>
</template>

<script>
  import config from '../../../../utils/config.js'
  export default {
    data() {
      return {
        token:'',
        url:config.host+'/blog/add',
        title:'',
        content:'',
        filename:'',
        tag:'Node.js',
        plus:true,
        font:true,
        add:true,
        tabs: [],
      };
    },
    async onLoad(){
      this.getToken()
      await this.getTag()
      // this.addBlog()
    },
    methods:{
      chooseTag(item){
        console.log(item); 
      },
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
          // this.tabs.push("All")
          for(let i=0;i<res.data.length-1;i++){
            this.tabs.push(res.data[i].tagname)
          }
          console.log(this.tabs);
      		return ;
      	} 
        console.log(res.code);
        uni.showToast({
          title: '加载失败',
          duration: 2000,
          icon: 'none'
        });    
      },
      addTag(){
        console.log('addTag');
      },
      //弹出框
      open(){
        this.$refs.popup.open('bottom')
      },
      close() {
        this.$refs.popup.close()
      },
      changeFont(){
        this.font=false
        this.plus=true
      },
      changePlus(){
        this.plus=false
        this.font=true
      },
      getToken(){
        this.token=wx.getStorageSync("token")
      },
      async addBlog() {
      	const params = {
      		"title": this.title,
          "content": this.content,
          // "filename":this.filename,
          "tag":this.tag,
           "setMyHeaderxxx": { 
             "token":this.token,
              'content-type': 'application/x-www-form-urlencoded',
              "accept": "application/json"
            }
      	};
        // 开启loading
      	uni.showLoading({
      		title:"Loading"
      	})
        //发送请求
        const {data: res} = await uni.$http.post(this.url, params);
      	if (res.code == '1') {
      		console.log(res.message);
          uni.showToast({
          	title: '发布博客成功',
          	duration: 2000,
          	icon: 'none'
          });
           uni.navigateTo({
             url:'../myblog'
           })
      	} else {
      		uni.showToast({
      			title: '失败',
      			duration: 2000,
      			icon: 'none'
      		});    
      	}
      }
    }
  }
</script>

<style lang="scss">
  @import "@/static/iconfont.css";
.bg{
  background-color: #ffffff;
  .tit{
    display: flex;
    padding-top: 30rpx;
    padding-left: 300rpx;
    height: 50rpx;
    text-align: center;
    font-size: 40rpx;
    font-weight: 800;
    .publish{
      width: 150rpx;
      height: 70rpx;
      color: white;
      text-align: center;
      line-height: 70rpx;
      border-radius: 50rpx;
      background-color: #056de8;
      font-weight: 500;
      margin-left: 200rpx;
      z-index: 2;
      font-size: 30rpx;
    }
  }
  .Title{
    width: 680rpx;
    height: 70rpx;
    margin: 35rpx;
    margin-bottom: 0;
    padding-top: 20rpx;
    font-size: 40rpx;
    font-weight: 500;
    border-bottom: 5rpx solid #c0c0c0;
  }
  .title{
    color: lightgrey;
  }
  .body{
    overflow-y: scroll;
    width: 680rpx;
    height: 69vh;
    padding: 35rpx;
    z-index: 1;
  }
  .function{
    width: 707rpx;
    height: 60rpx;
    padding: 20rpx;
    margin-top: 0;
    border-top: 1rpx solid #d8d8d8;
    border-bottom: 1rpx solid #d8d8d8;
    z-index: 1;
    uni-icons{
      padding: 30rpx;
    }
    .picture{
      width: 100%;
      height: 130rpx;
      text-align: center;
      line-height: 130rpx;
      background-color: white;
      border: 0;
    }
  }
  .fontBox{
    height: 250rpx;
    padding-top: 40rpx;
    padding-left: 40rpx;
    border-radius: 20rpx 20rpx 0 0;
    .item{
      float: left;
      width: 340rpx;
      .uniIcon{
        width: 340rpx;
        height: 90rpx;
        text-align: center;
        line-height: 90rpx;
        margin-bottom: 10rpx;
        background-color: #f9f9f9;
      }
    }
    .item:nth-child(1){
      font-weight: 600;
      font-size: 35rpx;
    }
  }
  .plusBox{
    height: 250rpx;
    padding-top: 40rpx;
    border-radius: 20rpx 20rpx 0 0;
    .item{
      float: left;
      width: 100rpx;
      margin-right: 40rpx;
      .uniIcon{
        width: 90rpx;
        height: 90rpx;
        text-align: center;
        line-height: 90rpx;
        margin-bottom: 10rpx;
        background-color: #f9f9f9;
        border-radius: 10rpx;
      }
      .wenzi{
        color: #696969;
        font-size: 25rpx;
      }
    }
  }
  .addTag{
    display: flex;
    flex-wrap: wrap;
    padding-left: 40rpx;
    background-color: white;
    .txt{
      display: flex;
      flex-wrap: wrap;
      background-color: white;
      text{
        margin: 1rem;
        margin-left: 0;
        margin-top: .5rem;
        padding-left: 1rem;
        padding-right: 1rem;
        height: 2rem;
        line-height: 2rem;
        background-color: #eeeeee;
        font-size: .8rem;
      }
    }
  }
}
</style>
