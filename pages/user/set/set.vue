<template>
  <view>
    <button @click="gotoFace">人脸识别注册</button>
    <button @click="gotoFaceMod">人脸识别修改</button>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        
      };
    },
    methods:{
      gotoFaceMod(){
        uni.navigateTo({
          url:'../../login/faceReg/faceReg'
        })
      },
      gotoFace(){
        uni.navigateTo({
          url:'../../login/faceReg/faceReg'
        })
      }
    }
  }
</script>

<style lang="scss">

</style>
