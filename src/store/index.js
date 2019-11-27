import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
      alt: false,
      mouseDown: false,
    },

    selectedDocument: 0,
    documents:[
      {
        name: 'Untitled',
        type: 'single-image',
        width: 100,
        height: 100,
        xTiles: 1,
        yTiles: 1,
        tileWidth: 100,
        tileHeight: 100,
        tilesetWidth: 4,
        transparency: true
      }
    ],

    selectedLayer: 0,
    layers:[
      { 
        id: 0, 
        name: "Layer 0",
        opacity: 255,
        visible: true,
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D
      }
    ],

    selectedTile: 0,
    tiles: [
      {
        id: 0,
        paintedPositions : [], //Array with positions where the particular tile is painted
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D
      }
    ],
    //Tilemaps correspond with the currently selected layer
    tilemaps: [],

    canvasPos: { x: 0, y: 0 },
    clippedSize: [0, 0],   //The amount by which the canvas is clipped by the canvas area on the top and left
    ctx: null,
    
    mouseStart: [0, 0],   //Initial position of the mouse when drawing a rectangle/ellipse/selection
    hoveredTilePos: [0, 0], //The tile in the canvas that currently has mouse over
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
      activeElement: null,
      pasteCanvas: null
    },

    selection:{
      x: 0,
      y: 0,
      w: 0,
      h: 0,

      detached: false,
      drawingSelection: false,
      
      //Bools relating to resizing the selection
      clampX: false,
      clampY: false,
      resizeX: false,
      resizeY: false,
      flipX: false,
      flipY: false
    }
},

  getters: {
    currentDocument: state => {
      return state.documents[state.selectedDocument]
    },

    currentLayer: state => {
      return state.layers[state.selectedLayer]
    },

    currentTile: state => {
      return state.tiles[state.selectedTile]
    },

    currentTilemap: state => {
      return state.tilemaps[state.selectedLayer]
    },

    docSize: state => {
      var document = state.documents[state.selectedDocument]
      return { width: document.width, height: document.height }
    }
  }
})
