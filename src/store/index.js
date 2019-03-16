import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeElement: null,

    currentTool: 'draw',

    color:{
      primary: [0,0,0,1],
      secondary: [255,255,255,1],
      hue: 360,
      saturation: 0,
      lightness: 0,
      alpha: 0,
      rgb: [0,0,0],
      hex: '000000'
    },

    keys:{
      space: false,
      ctrl: false,
      shift: false,
      alt: false
    },

    selectedDocument: 0,
    documents:[
      { name: 'Untitled', type: 'single-image', width: 100, height: 100, transparent: true }
    ],

    selectedLayer: 0,
    layers:[],

    canvasPos: { x: 0, y: 0 },
    hiddenSize: [0, 0],   //The amount by which the canvas is clipped by the canvas area on the top and left
    ctx: null,
    
    mouseStart: [0, 0],   //Initial position of the mouse when drawing a rectangle/ellipse/selection
    showDrawRectInfo: false,

    mousePos: [0, 0],
    prevPixelPos: [0, 0],
    pixelPos: [0, 0],     //Position of the mouse in unzoomed pixels, relative to the canvas
    zoom: 0,
    brushSize: 1,
    
    constants: {
      canvasAreaPos: { x: 92, y: 29},
      minSidebarRightWidth: 250,
      maxSidebarRightWidth: 500,
      maxAnimatorHeight: 600
    },

    elems: {
      canvasArea: null,
    }
},

  getters: {
    currentDocument: state => {
      return state.documents[state.selectedDocument]
    },

    currentLayer: state => {
      return state.layers[state.selectedLayer]
    },

    docSize: state => {
      var document = state.documents[state.selectedDocument]
      return { width: document.width, height: document.height }
    }
  }
})
