<template>
    <div class="home">
      <div class="guidline textcontainer">
        <h2 class="particletext confetti random">
            涛仔的镜花水月
        </h2>
      </div>
      <div id="scrolldown" class="scrolldown">
        <div class="container">
          <div class="chevron"></div>
          <div class="chevron"></div>
          <div class="chevron"></div>
          <span class="text">Scroll down</span>
        </div>
      </div>
      <div class="starsbody">
        <div class="stars"></div>  <!--背景层，不要删除，不然没有作用-->
        <div class="table content">
          <div class="planets">
            <planet-com v-for="(item,index) in planet_list" :key="'planet'+index" :planetdata="item">
            </planet-com>
          </div>
        </div>
      </div>
      
      <!-- <div class="content">
        <planet-com v-for="(item,index) in planet_list" :key="'planet'+index" :planetdata="item">
        </planet-com>
      </div> -->
    </div>
</template>

<script>
import PlanetCom from '../components/planet.vue'
import random from '../assets/js/random'
import particletext from '../assets/js/particletext'
import $ from 'jquery'

export default {
  name: 'Home',
  components: {
    PlanetCom
  },
  data:function(){
    return {
      planet_list:[
        {
          title:"名字",
          img:require("../assets/image/1552443760077.png")
        },
        {
          title:"名字",
          img:require("../assets/image/1552443760077.png")
        }
      ]
    }
  },
  methods:{
    starsshow:function(){
        var stars=800;  /*星星的密集程度，数字越大越多*/
        var $stars=$(".stars");
        var r=800;   /*星星的看起来的距离,值越大越远,可自行调制到自己满意的样子*/
        for(var i=0;i<stars;i++){
          var $star=$("<div/>").addClass("star");
          $stars.append($star);
        }
        $(".star").each(function(){
          var cur=$(this);
          var s=0.2+(Math.random()*1);
          var curR=r+(Math.random()*300);
          cur.css({ 
            transformOrigin:"0 0 "+curR+"px",
            transform:" translate3d(0,0,-"+curR+"px) rotateY("+(Math.random()*360)+"deg) rotateX("+(Math.random()*-50)+"deg) scale("+s+","+s+")"
            
          })
        })
    },
    Scrollchange:function(e){
      $("#scrolldown").css("bottom", document.body.clientHeight + 100 - $(e)[0].target.scrollTop)
      let opacity = parseFloat((1-($(e)[0].target.scrollTop/(document.body.clientHeight/3))))
      if(opacity<0)opacity=0
      $("#scrolldown").css("opacity",opacity)
      if(opacity==0){
        let val = $(".home")[0].scrollHeight-document.body.clientHeight
        $($(e)[0].target).animate({'scrollTop':val},1000)
      }
    }
  },
  mounted: function () {
    random.initrandom()
    particletext.confetti()
    window.addEventListener('scroll', this.Scrollchange, true)
    this.starsshow()
  }
}
</script>

<style scoped>
@import '../assets/css/particletext.css';
@import '../assets/css/random.css';
@import '../assets/css/scroll-down.css';
@import '../assets/css/stars.css';
.home{
  position: absolute;
  overflow: scroll;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}
.guidline{
  background-image: url("../assets/image/02084.png");
  background-size: auto 100%;
  background-position: 50%;
  height: calc( 100vh + 100vh );
  width: 100vw;
}
.guidline h2{
  position: absolute;
  left: 50%;
  top: 10%;
  color: rgba(59, 66, 66, 0.767);
  transform: translateX(-50%);
  margin: 0;
}
.content{
  height: 100vh;
  width: 100vw;
}
.planets{
  position: fixed;
  left: 20px;
  bottom: -300px;
}
.home::-webkit-scrollbar {
  display: none;
}
.scrolldown{
  display: flex;
  bottom: calc( 100vh + 100px );
  justify-content: center;
  align-items: center;
  position: relative;
  height: 0.01px;
  width: 100%;
}
</style>