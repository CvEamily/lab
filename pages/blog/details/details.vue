<template>
  <view class="bg">
    <div class="fun">+
      <input type="text" placeholder="输入评论..." @click="comments()"></input>
      <uni-popup ref="popup" type="bottom" v-if="write">
        <div class="comm">
          <textarea name="" id="" cols="30" rows="10" placeholder="快来发表评论吧~" class="comme" maxlength="1000" focus="true" @input="increaseNumber($event)"></textarea>
          <div class="uniIcon">
            <uni-icons type="heart" size="30"></uni-icons>
          </div>
          <div class="uniIcon">
            <uni-icons type="image" size="35"></uni-icons>
          </div>
          <div class="number">{{cursor}}/1000</div>
          <div class="but" @click="close()">
           <!-- <div class="but" @click="close();sendComment();"> -->
             发送
          </div>
        </div>
      </uni-popup>
      <div class="icon">
        <div class="uniIcon" @click="features()"><uni-icons type="list" size="25"></uni-icons></div>
        <uni-popup ref="popup" type="bottom" v-if="!write">
          <div class="box">
            <div class="item" @click="gotoWrite()">
              <div class="uniIcon">
                <uni-icons type="compose" size="25"></uni-icons>
              </div>
              <div class="wenzi">
                修改
              </div>
            </div>
            <div class="item"  @click="Delete()" v-if="user_info.username==blogdata.username">
              <div class="uniIcon">
                <uni-icons type="trash-filled" size="25"></uni-icons>
              </div>
              <div class="wenzi">
                删除
              </div>
            </div>
          </div>
          <div class="but" @click="close()">
            取消
          </div>
        </uni-popup>
        <div class="uniIcon" v-if="chat" @click="seeTop()"><uni-icons type="chat" size="25"></uni-icons></div>
        <div class="uniIcon" v-if="!chat" @click="seeChat()"><uni-icons type="top" size="25"></uni-icons></div>
        <div class="uniIcon" @click="like()"><uni-icons type="hand-up" size="25"></uni-icons></div>
        <div class="uniIcon" @click="collect()"><uni-icons type="star" size="25"></uni-icons></div>
      </div>
    </div>
    <div class="title">{{blogdata.title}}</div>
   <div class="author">
      <div class="user">
        <image src="https://tupian.qqw21.com/article/UploadPic/2021-8/20218152156870259.jpg" mode="aspectFill"></image>
      </div>
      <div class="nickname" v-if="this.blogdata.nickname">{{blogdata.nickname}}</div>
      <div class="nickname" v-if="!this.blogdata.nickname">{{blogdata.username}}</div>
      <div class="writeTime">{{createTime}} 阅读量{{blogdata.views}}</div>
  </div>
    <div class="body">{{blogdata.content}}</div>
    <div class="relative">
      <div class="top">相关文章</div>
      <div class="blog" v-for="(item,i) in recommend" :key="i">
          <div class="title">
            {{recommend[i][0]}}
          </div>
          <div class="sta">
            <text class="static">353点赞</text>
            <text class="static">108评论</text>
            <text class="static">KunMingX</text>
          </div>
      </div>
    </div>
    <div class="comments">
      <div class="top">热门评论</div>
      <div class="comment">
        <div class="author">
            <div class="user">
              <image src="https://tupian.qqw21.com/article/UploadPic/2021-8/20218152156870259.jpg" mode="aspectFill"></image>
            </div>
            <div class="nickname">nickname</div>
            <div class="writeTime">两星期前 阅读9338</div>
        </div>
        <div class="content">评论内容balalabalabala</div>
      </div>
    </div>
    <div class="comments">
      <div class="top">全部评论</div>
      <div class="comment">
        <div class="author">
            <div class="user">
              <image src="https://tupian.qqw21.com/article/UploadPic/2021-8/20218152156870259.jpg" mode="aspectFill"></image>
            </div>
            <div class="nickname">nickname</div>
            <div class="writeTime">两星期前 阅读9338</div>
        </div>
        <div class="content">评论内容balalabalabala</div>
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
        blogdata:[{comment_unm:0,content:'',create_time:'',filename:'',gttu:'',hot:'',id:'',nickname:'',outline:'',profile_photo:'',tag:'',title:'',username:'',views:''}],
        recommend:[[]],
        chat:1,
        write:true,
        cursor:0,
        user_info:[],
        id:'',
      };
    },
    computed:{
      createTime(){
        return this.blogdata.create_time? this.blogdata.create_time.slice(0,10):"00:00"
      }
    },
    async onLoad(){
      this.getToken()
      await this.getId()
      await this.getUser()
      await this.getComment()
    },
    methods:{
      async getComment(id) {
        console.log('id:'+id);
      	const params = {
          "setMyHeaderxxx": {
            "token":this.token
           }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.get(config.host+`/comment/${id}`, params);
      	if (res.code == 1) {
          console.log(res.data);
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
      increaseNumber(e){
        this.cursor=e.detail.cursor
      },
      getUser(){
       this.user_info=wx.getStorageSync("user_info")
      },
      async sendComment(e) {
        const params = {
          "setMyHeaderxxx": {
              'token': this.token,
              'content-type': 'application/x-www-form-urlencoded',
              "accept": "application/json"
           }
        };
        uni.showLoading({
          title:"Loading"
        })
        const {data: res} = await uni.$http.post(config.host+'/comment/add', params);
        if (res.code == 1) {
          console.log(res.message);
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
      async comments(){
         await this.changeWrite();
         await this.open();
      },
      async features(){
        await this.Write();
        await this.open();
      },
      changeWrite(){
        this.write=true
      },
      Write(){
        this.write=false
      },
      getId(option){
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit('acceptDataFromOpenedPage', {data: 'data from test page'});
        eventChannel.emit('someEvent', {data: 'data from test page for someEvent'});
        let _this=this
        eventChannel.on('acceptDataFromOpenerPage', function(data) {
          console.log(data);
          _this.see(data.id)
          _this.getComment(data.id)
        })
      },
      async Delete() {
      	const parmas  = {
          id: this.id,
          "setMyHeaderxxx": {
             "token":this.token
         }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.delete(config.host+`/blog/delete/${parmas.id}`,parmas);
      	if (res.code == 1) {
          console.log(res.message);               
      		return ;
      	} else {
          console.log(res.code);
      		uni.showToast({
      			title: '删除失败',
      			duration: 2000,
      			icon: 'none'
      		});    
      	}
      },
      gotoWrite(){
        uni.navigateTo({
          url:'../../user/myblog/write/write'
        })
      },
      close() {
        this.$refs.popup.close()
      },
      open(){
        this.$refs.popup.open('bottom')
      },
      async like() {
      	const params = {
          "setMyHeaderxxx": {
              'token': this.token,
              'content-type': 'application/x-www-form-urlencoded',
              "accept": "application/json"
           }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.post(config.host+`/likeblog/${this.id}`, params);
      	if (res.code == 1) {
          console.log(res.message);
      		return ;
      	} else {
          console.log(res.message);
      	}
      },
      async collect(e) {
      	const params = {
          'id':this.id,
          "setMyHeaderxxx": {
            "token":this.token
           }
      	};
        console.log(this.id);
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.get(config.host+`/collect/${this.id}`, params);
      	if (res.code == 1) {
          console.log(res.message);
      		return ;
      	} else if(res.code == 2){
          console.log(res.message);
      	}else{
          uni.showToast({
          	title: '加载失败',
          	duration: 2000,
          	icon: 'none'
          });    
        }
      },
      seeChat(){
        this.chat=1;
      },
      seeTop(){
        this.chat=0;
      },
      async commentList(e) {
      	const params = {
          "setMyHeaderxxx": {
            "token":this.token
           }
      	};
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.get(config.host+'/comment/commentList', params);
      	if (res.code == 1) {
          console.log(res.data);
      		return ;
      	} else {
          console.log(res.code);
      		uni.showToast({
      			title: 'commentList加载失败',
      			duration: 2000,
      			icon: 'none'
      		});    
      	}
      },
      getToken(){
        this.token=wx.getStorageSync("token")
      },
      async see(id) {
        this.id=id;
      	const params = {
          "id":id,
          "setMyHeaderxxx": {
            "token":this.token
           }
      	};
        console.log(id);
      	uni.showLoading({
      		title:"Loading"
      	})
        const {data: res} = await uni.$http.get(config.host+`/blog/see/${this.id}`, params);
      	if (res.code == 1) {
          this.blogdata=res.data.blogdata;
          this.recommend=res.data.recommend;
          console.log(this.recommend);
      		return ;
      	} else {
          console.log(res.code);
      		uni.showToast({
      			title: 'see加载失败',
      			duration: 2000,
      			icon: 'none'
      		});    
      	}
      }
    }
  }
</script>

<style lang="scss">
.bg{
  background-color: #f2f3f5;
  .fun{
    position: fixed;
    bottom: 0;
    height: 120rpx;
    padding-top: 10rpx;
    padding-left: 40rpx;
    border-top: 1rpx solid #fbfbfb;
    background-color: white;
    input{
      float:left;
      width: 400rpx;
      height: 80rpx;
      padding-left: 20rpx;
      background-color: #f2f3f5;
      border-radius: 10rpx;
    }
    uni-popup{
      .comm{
        height: 360rpx;
        padding-top: 40rpx;
        padding-left: 40rpx;
        background-color: #f7f8fa;
        .comme{
          float: left;
          width: 88%;
          height: 180rpx;
          padding: 20rpx;
          border-radius: 15rpx;
          background-color: #f2f3f5;
        }
        .uniIcon{
          float: left;
          margin-top: 40rpx;
          margin-right: 20rpx;
        }
        .number{
          float:left;
          width: 140rpx;
          height: 70rpx;
          color: #9a9a9a;
          margin-top: 55rpx;
          margin-left: 200rpx;
        }
        .but{
          float: right;
          width: 140rpx;
          height: 70rpx;
          color: white;
          font-size: 30rpx;
          text-align: center;
          line-height: 70rpx;
          margin-top: 40rpx;
          margin-right: 50rpx;
          border-radius: 80rpx;
          background-color: royalblue;
        }
      }
    }
    .icon{
      float:left;
      margin-left: 25rpx;
      padding-top: 15rpx;
      .uniIcon{
        float: left;
        color: #9a9a9a;
        margin-right: 14rpx;
      }
      uni-popup{
        .box{
          height: 250rpx;
          padding-top: 40rpx;
          padding-left: 40rpx;
          background-color: #f7f8fa;
          border-radius: 20rpx 20rpx 0 0;
          .item{
            float: left;
            width: 130rpx;
            margin-right: 40rpx;
            .uniIcon{
              width: 110rpx;
              height: 110rpx;
              text-align: center;
              line-height: 110rpx;
              margin-bottom: 10rpx;
              background-color: white;
              border-radius: 10rpx;
            }
            .wenzi{
              color: #9a9a9a;
              padding-left: 20rpx;
            }
          }
        }
        .but{
          width: 100%;
          height: 130rpx;
          text-align: center;
          line-height: 100rpx;
          background-color: white;
        }
      }
    }
    
  }
  .title{
    font-size: 50rpx;
    padding-left: 20rpx;
    padding-top: 10rpx;
    background-color: white;
  }
  .author{
    padding-top: 30rpx;
    background-color: white;
    .user{
      float: left;
      width: 100rpx;
      height: 100rpx;
      margin-left: 20rpx;
      margin-right: 20rpx;
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
    .nickname{
      font-size: 35rpx;
    }
    .writeTime{
      color: grey;
      font-size: 30rpx;
    }
  }
  .body{
    height: 400rpx;
    padding-top: 70rpx;
    padding-left: 20rpx;
    background-color: white;
  }
  .relative{
    margin-top: 20rpx;
    background-color: white;
    .top{
      padding-top: 20rpx;
      padding-left: 20rpx;
      font-size: 35rpx;
      font-weight: bold;
    }
    .blog{
      padding-top: 20rpx;
      padding-bottom: 40rpx;
      border-top: 1rpx solid #f1f1f1;
      .title{
        font-size: 35rpx;
      }
      .sta{
        padding-top: 15rpx;
        padding-left: 20rpx;
        .static{
          color: #9a9a9a;
          font-size: 30rpx;
          margin-right: 30rpx;
        }
      }
    }
  }
  .comments{
    padding-left: 20rpx;
    margin-top: 20rpx;
    background-color: white;
    .top{
      padding-top: 20rpx;
      font-size: 35rpx;
      font-weight: bold;
    }
    .comment{
      .author{
        .user{
          width: 70rpx;
          height: 70rpx;
          margin-top: 10rpx;
        }
        .nickname{
          font-size: 30rpx;
        }
        .writeTime{
          font-size: 30rpx;
        }
      }
      .content{
        height: 200rpx;
        font-size: 30rpx;
        padding-left: 90rpx;
        padding-top: 20rpx;
      }
    }
  }
}
</style>
