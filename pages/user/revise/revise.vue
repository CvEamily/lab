<template>
  <view class="bg">
    <div class="infor">
      <view class="user" @click="addAvatar()">
        <image :src="img" mode="aspectFill"></image>
      </view>
      <form @submit="formSubmit" @reset="formReset">
        <input type="text" placeholder="账号 " class="username">
        <input type="text" placeholder="姓名 ">
        <input type="text" placeholder="年级 " v-if="user_info.grade">
        <view class="grade" v-if="!user_info.grade">
          <view class="uni-list">
            <view class="uni-list-cell">
              <view class="uni-list-cell-left">
              </view>
              <view class="uni-list-cell-db">
                <picker @change="bindPickerChange" :value="index" :range="array">
                  <view class="uni-input,placeholderClass">{{array[index]}}</view>
                </picker>
              </view>
            </view>
          </view>
        </view>
        <input type="text" placeholder="专业 ">
        <input type="text" placeholder="手机 ">
        <input type="text" placeholder="邮箱 ">
        <textarea name="" id="" cols="30" rows="5" placeholder="个性签名：">
        </textarea>
        <button class="save" form-type="submit">
          Save
        </button>
      </form>
    </div>
  </view>
</template>

<script>
  import config from '../../../utils/config.js'
  export default {
    data() {
      return {
        token:'',
        img:'https://ts1.cn.mm.bing.net/th/id/R-C.20dc03ef0ee10f50f8ccba5c38e6ac7d?rik=7dzyx%2bhMuJu73g&riu=http%3a%2f%2fwww.gx8899.com%2fuploads%2fallimg%2f2018040709%2frhilmrbilow.jpg&ehk=V9Dt0TaIN2I%2fhzL3NDXhpRzfZ7eNx8lLv6f1iw9AjG0%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1',
        title: 'picker',
        array: ['——请选择年级——','2019', '2020', '2021', '2022'],
        index: 0,
        grade:'',
        user_info:[],
      }
    },
    onLoad(){
      this.getToken()
      this.getUser()
    },
    methods:{
      getUser(){
       this.user_info=wx.getStorageSync("user_info")
       console.log(this.user_info);
      },
      getToken(){
        this.token=wx.getStorageSync("token")
      },
      //下拉框
      bindPickerChange: function(e) {
        this.index = e.detail.value
        this.grade=this.array[this.index]
      },
      //添加头像
      addAvatar(){
        uni.chooseImage({
        	success: (chooseImageRes) => {
        		const tempFilePaths = chooseImageRes.tempFilePaths;
        		const uploadTask = uni.uploadFile({
        			url: 'http://106.54.177.78:9111/user/uploadpp',
        			filePath: tempFilePaths[0],
        			name: 'file',
        			// formData: {
        			// 	'user': 'test'
        			// },
        			success: (uploadFileRes) => {
        				console.log(uploadFileRes.data);
        			}
        		});
        		uploadTask.onProgressUpdate((res) => {
        			console.log('上传进度' + res.progress);
        			console.log('已经上传的数据长度' + res.totalBytesSent);
        			console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
        			// 测试条件，取消上传任务。
        			if (res.progress > 50) {
        				uploadTask.abort();
        			}
        		});
        	}
        });
      }
    }
  }
</script>

<style lang="scss">
.bg{
  height: 2000rpx;
  background-color: #ebedee;
  .infor{
    padding-top: 100rpx;
    padding-bottom: 50rpx;
    background-color: #f2f2f2;
    .user{
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      width: 150rpx;
      height: 150rpx;
      margin-left: 300rpx;
      border: 8rpx solid white;
      border-radius: 150rpx;
      image{
        height: 100%;
        width: 100%;
      }
    }
    form{
      input{
        width:600rpx;
        height: 100rpx;
        padding-left: 50rpx;
        margin-top: 20rpx;
        margin-left: 50rpx;
        line-height: 100rpx;
        border-radius: 50rpx;
        background-color: white;
      }
      .username{
        margin-top: 50rpx;
      }
      .grade{
        width:600rpx;
        height: 100rpx;
        padding-left: 50rpx;
        margin-top: 20rpx;
        margin-left: 50rpx;
        line-height: 100rpx;
        text-align: center;
        border-radius: 50rpx;
        background-color: white;
      }
      textarea{
        width: 580rpx;
        height: 200rpx;
        margin-top: 40rpx;
        margin-bottom: 70rpx;
        margin-left: 45rpx;
        padding: 40rpx;
        border-radius: 50rpx;
        background-color: white;
      }
      .save{
        width: 200rpx;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        color: white;
        font-size: 30rpx;
        font-weight: 900;
        background-color: #827ffe;
        border-radius: 50rpx;
      }
    }
  }
}
</style>
