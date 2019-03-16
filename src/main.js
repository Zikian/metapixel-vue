import Vue from 'vue'
import App from './App.vue'
import store from './store'
import EventBus from './components/EventBus'

import utils from './mixins/utils' 

//Global mixins
Vue.mixin(utils)

Vue.config.productionTip = false

//Get a nested property by string. eg: 'color.hue'
Object.getByString = function(o, s){
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, '');           // strip a leading dot
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
          o = o[k];
      } else {
          return;
      }
  }
  return o;
}

Number.prototype.isBetween = function(a, b){
  return this >= a && this <= b
}

Array.prototype.swapItems = function(a, b){
  this[a] = this.splice(b, 1, this[a])[0];
  return this;
}

new Vue({
  render: h => h(App),
  store,

  computed:{
    activeElement(){ return this.$store.state.activeElement },

    zoom(){ return this.$store.state.zoom },
    brushSize(){ return this.$store.state.brushSize },

    canvasPos(){ return this.$store.state.canvasPos },
    pixelPos(){ return this.$store.state.pixelPos },
    hiddenSize(){ return this.$store.state.hiddenSize },

    currentTool(){ return this.$store.state.currentTool },
    keys(){ return this.$store.state.keys },

    canvasAreaPos(){ return this.$store.state.constants.canvasAreaPos },
  },

  mounted(){
    EventBus.$on('update-pixel-pos', () => {
      this.updatePixelPos()
    })

    window.addEventListener('mousemove', () => {
      if(this.activeElement){
        this.activeElement.mousemoveActions()
      }

      this.updateMousePos()
      this.updatePixelPos()
    })

    window.addEventListener('mousedown', () => {
      if(this.activeElement && this.activeElement.hasOwnProperty('mousedownActions')){
        this.activeElement.mousedownActions()
      }
    })

    window.addEventListener('mouseup', () => {
      if(this.activeElement && this.activeElement.hasOwnProperty('mouseupActions')){
        this.activeElement.mouseupActions()
      }

      this.$store.state.activeElement = null
    })

    window.addEventListener('keydown', () => {
      switch(event.keyCode){
        case 67: //C key
          if(!this.keys.ctrl){
            EventBus.$emit('toggle-color-picker');
          }
          break
        case 68: //D key
          EventBus.$emit('switch-tools', 'draw')
          break
        case 69: //E key
          EventBus.$emit('switch-tools', 'eraser')
          break
        case 70: //F key
          EventBus.$emit('switch-tools', 'fill')
          break
        case 81: //Q key
          EventBus.$emit('switch-tools', 'ellipse')
          break
        case 82: //R key
          EventBus.$emit('switch-tools', 'rectangle')
          break
        case 83: //S key
          EventBus.$emit('switch-tools', 'select')
          break
        case 88: //X key
          EventBus.$emit('switch-colors');
          break
        case 32: //Space key
          this.$store.state.keys.space = true
          break
        case 17: //Ctrl key
          this.$store.state.keys.ctrl = true
          break
        case 16: //Shift key
          this.$store.state.keys.shift = true
          break
        case 18: //Alt key
          this.$store.state.keys.alt = true
          break
      }
    })

    window.addEventListener('keyup', () => {
      switch(event.keyCode){
        case 32: //Space key
          this.$store.state.keys.space = false
          break
        case 17: //Ctrl key
          this.$store.state.keys.ctrl = false
          break
        case 16: //Shift key
          this.$store.state.keys.shift = false
          break
        case 18: //Alt key
          this.$store.state.keys.alt = false
          break
      }
    })
  },

  methods:{
    updatePixelPos(){
      this.$store.state.prevPixelPos = this.pixelPos.slice()
      var x = Math.round((event.clientX - this.canvasAreaPos.x - this.canvasPos.x) / this.zoom - this.brushSize / 2)
      var y = Math.round((event.clientY - this.canvasAreaPos.y - this.canvasPos.y) / this.zoom - this.brushSize / 2)
      this.$store.state.pixelPos = [x, y]
    },

    updateMousePos(){
      this.$store.state.mousePos = [event.clientX, event.clientY]
    }
  }
}).$mount('#app')

