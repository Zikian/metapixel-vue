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

    canvasArea: null,
    canvasAreaPos: { x: 90, y: 27},
    canvas: null,
    canvasPos: { x: 0, y: 0 },
    hiddenSize: [0, 0], //The amount by which the canvas is clipped by the canvas area on the top and left
    ctx: null,

    brushSize: 1,
    drawBuffer: [],
    prevPixelPos: { x: 0, y: 0 },
    pixelPos: { x: 0, y: 0 }, //Position of the mouse in unzoomed pixels, relative to the canvas
    zoom: 0
},

  getters: {
    currentDocument: state => {
      return state.documents[state.selectedDocument]
    },

    currentLayer: state => {
      return state.layers[state.selectedLayer]
    }
  }
})
