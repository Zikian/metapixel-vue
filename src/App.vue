<template>
  <div id="app" :style="[currentTool == 'hand' && {'cursor': 'grab'}]">
    <Toolbar/>

    <div id="editor">
      <SidebarLeft/>
      <div id="editor-center">
        <CanvasArea/>
        <Animator/>
      </div>
      <SidebarRight/>
    </div>

    <div>
      <WindowManager/>
      <HistoryManager/>
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
    currentTool(){ return this.$store.state.currentTool }
  },

  data(){
    return {
      fullscreen: false
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
  height: 100%;
  box-shadow: 0px 1px 0px 0px black inset;
}

#editor-center{
  display: grid;
  grid-template-rows: 1fr auto;
}
</style>


<style lang="scss">
  @import 'styles/common.css';
  @import 'styles/widgets.css';
  @import 'styles/window.css';
</style>
