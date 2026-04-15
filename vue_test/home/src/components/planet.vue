<template>
  <div class="shape" :style="GetColor()">
    <div class="img">
      <img :src="planetdata.img" alt="">
    </div>
    <div class="title">
      <span>
        {{planetdata.title}}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Planet',
  props: ['planetdata'],
  methods:{
    GetColor:function(){
      let R = Math.floor(Math.random() * 130+110);
      let G = Math.floor(Math.random() * 130+110);
      let B = Math.floor(Math.random() * 130+110);
      return {
        background: 'rgb(' + R + ',' + G + ',' + B + ')'
       };
    }
  }
}
</script>

<style scoped>
.shape{
  position: relative;
  background-color: bisque;
  border-radius: 50%;
  box-shadow: 0 0 20px #ffffff;
  text-align: center;
  overflow: hidden;
  height: 200px;
  width: 200px;
  margin: 10px;
}
.title{
  position: absolute;
  left: 50%;
  top: 65%;
  transform: translateX(-50%);
  font-size: 90%;
}
.title span{
  text-shadow: 0 0 2px #ffffff;
}
.img{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  height: 80%;
  width: 80%;
  border-radius: 50%;
  overflow: hidden;
}
.img img{
  height: 70%;
  width: 100%;
}
</style>
