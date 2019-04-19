<template>
  <div 
    id="app" 
    :style="[currentTool === 'hand' && {'cursor': 'grab'}]"
  >
    <Toolbar/>

    <div id="editor">
      <SidebarLeft/>
      <div id="editor-center">
        <Animator/>
        <CanvasArea/>
      </div>
      <SidebarRight/>
    </div>

    <div>
      <WindowManager/>
      <HistoryManager/>
    </div>

    <div 
      id="draw-rect-info" 
      :style="{ 'left': mousePos[0] + 20 + 'px', 'top': mousePos[1] + 20 + 'px' }" 
      v-if="showDrawRectInfo"
    >
      <span>{{ `W: ${drawRectWidth} H: ${drawRectHeight}` }}</span>
    </div>
  </div>
</template>

<script>
import Toolbar from './components/Toolbar'
import SidebarLeft from './components/SidebarLeft'
import CanvasArea from './components/CanvasArea'
import Animator from './components/Animator'
import SidebarRight from './components/SidebarRight'
import EventBus from './components/EventBus'

import WindowManager from './components/managers/WindowManager'
import HistoryManager from './components/managers/HistoryManager'

export default {
  name: 'app',
  
  components: {
    Toolbar,
    SidebarLeft,
    CanvasArea,
    SidebarRight,
    Animator,

    WindowManager,
    HistoryManager,
  },

  computed:{
    currentTool(){ return this.$store.state.currentTool },
    pixelPos(){ return this.$store.state.pixelPos },
    mouseStart(){ return this.$store.state.mouseStart },
    mousePos(){ return this.$store.state.mousePos },
    drawRectWidth(){ return Math.abs(this.mouseStart[0] - this.pixelPos[0]) + 1 },
    drawRectHeight(){ return Math.abs(this.mouseStart[1] - this.pixelPos[1]) + 1 },
    selection(){ return this.$store.state.selection },
    mouseDown(){ return this.$store.state.keys.mouseDown },

    showDrawRectInfo(){ 
      var validTool = (this.currentTool === 'rectangle' ||
                       this.currentTool === 'ellipse')

      return (this.mouseDown && validTool || 
                (this.selection.drawingSelection &&
                 this.drawRectWidth > 1 && 
                 this.drawRectHeight > 1))
    },
  },

  data(){
    return {
      fullscreen: false,
    }
  },

  mounted(){
    EventBus.$on('toggle-fullscreen', () => {
      this.fullscreen = !this.fullscreen
      this.fullscreen ? document.body.requestFullscreen() : document.exitFullscreen()
    })
  }
}
</script>

<style>
@font-face {
  font-family: Montserrat;
  src: url(./assets/fonts/Montserrat-Regular.ttf);
}

#app {
  display: grid;
  grid-template-rows: 27px 1fr;
  font-family: Montserrat;
  height: 100%;
}

#editor{
  grid-row: 2;
  display: grid;
  grid-template-columns: 90px 1fr auto;
  box-shadow: 0px 1px 0px 0px black inset;
  overflow: hidden;
}

#editor-center{
  display: grid;
  grid-template-rows: 1fr auto;
}

#draw-rect-info{
    position: absolute;
    height: 27px;
    background-color: rgba(26, 27, 32, 0.7);
    border: 1px solid white;
    border-radius: 5px;
    z-index: 10;
}

#draw-rect-info span{
    margin-left: 4px;
    margin-right: 4px;
    line-height: 27px;
    font-size: 9pt;
    color: white;
}
</style>


<style lang="scss">
  @import 'styles/common.css';
  @import 'styles/widgets.css';
  @import 'styles/window.css';
</style>
