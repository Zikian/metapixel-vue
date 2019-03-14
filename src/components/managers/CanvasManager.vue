<template><div></div></template>

<script>
import EventBus from '../EventBus'

export default {
    name: 'CanvasManager',

    computed:{
        layers(){ return this.$store.state.layers },
        selectedLayer(){ return this.$store.state.selectedLayer },
        
        ctx(){ return this.$store.state.ctx },

        zoom:{ 
            get(){ return this.$store.state.zoom },
            set(val){ this.$store.state.zoom = val }
        },
        currentTool(){ return this.$store.state.currentTool },

        docWidth(){ return this.$store.getters.currentDocument.width },
        docHeight(){ return this.$store.getters.currentDocument.height },

        canvasWidth(){ return this.docWidth * this.zoom },
        canvasHeight(){ return this.docHeight * this.zoom },

        canvasArea(){ return this.$store.state.canvasArea },
        canvasAreaWidth(){ return this.canvasArea.offsetWidth },
        canvasAreaHeight(){ return this.canvasArea.offsetHeight },

        pixelPos(){ return this.$store.state.pixelPos },
        canvasPos:{ 
            get(){ return this.$store.state.canvasPos} ,
            set(val){ this.$store.state.canvasPos = val }
        },
        hiddenSize(){ return this.$store.state.hiddenSize } ,

        brushSize(){ return this.$store.state.brushSize },
        pixelSize(){ return this.brushSize * this.zoom },
    },

    data(){
        return {
            zoomStages: [0.125, 0.250, 0.333, 0.5, 1, 2, 3, 4, 5, 6, 8, 12, 18, 28, 38, 50, 70, 200],

            canvas: null,

            fgCanvas: document.createElement('canvas'),
            fgCtx: null,

            bgCanvas: document.createElement('canvas'),
            bgCtx: null,
        }
    },

    mounted(){
        this.$store.state.canvasArea = document.querySelector('#canvas-area')

        var zoom = Math.floor(Math.min(this.canvasAreaWidth / this.docWidth, this.canvasAreaHeight / this.docHeight))
        //Get zoom stage closest to calculated zoom
        this.zoom = this.zoomStages.reduce(function(prev, curr) {
            return Math.abs(curr - zoom) < Math.abs(prev - zoom) ? curr : prev;
        });

        //Set up the Draw-Canvas
        this.canvas = document.querySelector('#draw-canvas')
        this.$store.state.ctx = this.canvas.getContext('2d')
        this.canvas.clear = () => { this.ctx.clearRect(0, 0, this.docWidth, this.docHeight); }
        this.canvas.width = this.canvasWidth
        this.canvas.height = this.canvasHeight
        this.ctx.scale(this.zoom, this.zoom)

        //Set up the foreground canvas
        this.fgCanvas.clear = function(){ this.width = this.width }
        this.fgCtx = this.fgCanvas.getContext('2d')

        //Set up the background canvas
        this.bgCanvas.clear = function(){ this.width = this.width }
        this.bgCtx = this.bgCanvas.getContext('2d')
        
        //Position the canvas in the middle of the screen
        var canvasX = (this.canvasAreaWidth - this.canvasWidth) / 2
        var canvasY = (this.canvasAreaHeight - this.canvasHeight) / 2
        this.canvasPos = { x: canvasX, y: canvasY }

        this.setUpEvents()
    },

    methods: {
        intersectCanvas(){
            // Get intersection between canvas area rect and canvas rect
            var x = Math.max(this.canvasPos.x, 0);
            var y = Math.max(this.canvasPos.y, 0);
            var w = Math.min(this.canvasPos.x + this.canvasWidth, this.canvasAreaWidth) - x;
            var h = Math.min(this.canvasPos.y + this.canvasHeight, this.canvasAreaHeight) - y;

            this.canvas.width = w > 0 ? w : 0
            this.canvas.height = h > 0 ? h : 0

            this.scaleContext()
            this.render()
        },

        scaleContext(){
            this.ctx.scale(this.zoom, this.zoom)
        },

        render(){
            this.canvas.clear()
            this.ctx.imageSmoothingEnabled = false
            this.ctx.drawImage(this.bgCanvas, ...this.hiddenSize)
            this.ctx.drawImage(this.fgCanvas, ...this.hiddenSize)
        },

        renderForeground(){
            this.ctx.imageSmoothingEnabled = false
            this.ctx.drawImage(this.fgCanvas, ...this.hiddenSize)
        },

        redrawBackground(){
            this.bgCanvas.clear()
            var bgLayers = this.layers.slice(this.selectedLayer, this.layers.length)
            bgLayers.reverse().forEach(layer => {
                if(layer.visible){
                    this.bgCtx.globalAlpha = layer.opacity / 255
                    this.bgCtx.drawImage(layer.canvas, 0, 0)
                }
            })
        },

        redrawForeground(){
            this.fgCanvas.clear()
            var fgLayers = this.layers.slice(0, this.selectedLayer)
            fgLayers.reverse().forEach(layer => {
                if(layer.visible){
                    this.fgCtx.globalAlpha = layer.opacity / 255
                    this.fgCtx.drawImage(layer.canvas, 0, 0)
                }
            })
        },

        setUpEvents(){
            this.canvasArea.onmousedown = () => {
                var tool = this.currentTool
                var validTool = (tool === 'hand' || 
                                 tool === 'select' ||
                                 tool === 'rectangle' ||
                                 tool === 'ellipse')
                if(validTool){
                    EventBus.$emit(this.currentTool+'-tool-mouseleft')
                }
                this.$store.state.activeElement = this.canvas
            }

            this.canvas.onmousedown = () => { 
                event.stopPropagation()
                EventBus.$emit(this.currentTool+'-tool-mouseleft')
                this.$store.state.activeElement = this.canvas
            }
            this.canvas.mousemoveActions = () => {
                EventBus.$emit(this.currentTool+'-tool-mousedrag')
            }
            this.canvas.mouseupActions = () => {
                EventBus.$emit(this.currentTool+'-tool-mouseup')
            }

            EventBus.$on('render-canvas', () => {
                this.render()
            })

            EventBus.$on('render-foreground', () => {
                this.renderForeground()
            })

            EventBus.$on('redraw-background', () => {
                this.redrawBackground()
            })

            EventBus.$on('redraw-layers', () => {
                this.redrawForeground()
                this.redrawBackground()
            })

            EventBus.$on('intersect-canvas', () => {
                this.intersectCanvas()
            })
        }
    }
}
</script>

