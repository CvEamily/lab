<template>
  <view class="bg">
    <view class="content">
      <div>Face recognition</div>
        <button form-type="submit" class="send" @click="gotoLog()"> 
          <box class="icon">
            <uni-icons type="paperplane" size="15" color="white"></uni-icons>
          </box>
          登录
        </button>
        <button form-type="submit" class="send" @click="gotoReg()">
          <box class="icon">
            <uni-icons type="paperplane" size="15" color="white"></uni-icons>
          </box>
          注册
        </button>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        
      };
    },
    methods:{
      gotoLog(){
        uni.navigateTo({
          url:'../faceLogin/faceLogin'
        })
      },
      gotoReg(){
        uni.navigateTo({
          url:'../faceReg/faceReg'
        })
      }
    }
  }
</script>

<style lang="scss">
.bg{
    display: table-cell;
    vertical-align: middle;
    width: 800rpx;
    height: 1206rpx;
    background-color: #ebedee;
    .content{
      width: 800rpx;
      height: 600rpx;
      text-align: center;
      background-color: #f2f2f2;
      padding-top: 50rpx;
      div{
        display: flex;
        justify-content: center;
        align-item: center;
        flex-direction: column;
        width: 800rpx;
        height: 100rpx;
        font-size: 40rpx;
        font-weight: 700;
      }
      button{
        width: 240rpx;
        height: 80rpx;
        font-size: 35rpx;
        text-align: center;
        line-height: 80rpx;
        color: #827ffe;
      }
      .send{
        width: 180rpx;
        height: 80rpx;
        color: white;
        font-size: 25rpx;
        font-weight: 700;
        margin-top: 60rpx;
        background-color: #827ffe;
        border-radius: 100rpx;
        .icon{
          margin-right: 10rpx;
          font-weight: 400;
        }
      }
    }
  }
</style>
