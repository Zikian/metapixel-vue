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

        docSize(){ return this.$store.getters.docSize },

        canvasWidth(){ return this.docSize.width * this.zoom },
        canvasHeight(){ return this.docSize.height * this.zoom },

        canvasArea(){ return this.$store.state.elems.canvasArea },

        pixelPos(){ return this.$store.state.pixelPos },
        canvasPos:{ 
            get(){ return this.$store.state.canvasPos} ,
            set(val){ this.$store.state.canvasPos = val }
        },
        hiddenSize(){ return this.$store.state.hiddenSize } ,

        brushSize(){ return this.$store.state.brushSize },
        pixelSize(){ return this.brushSize * this.zoom },

        minSidebarRightWidth(){ return this.$store.state.constants.minSidebarRightWidth },
        canvasAreaPos(){ return this.$store.state.constants.canvasAreaPos }
    },

    data(){
        return {
            zoomStages: [0.125, 0.250, 0.333, 0.5, 1, 2, 3, 4, 5, 6, 8, 12, 18, 28, 38, 50, 70, 200],

            canvas: null,

            fgCanvas: document.createElement('canvas'),
            fgCtx: null,

            bgCanvas: document.createElement('canvas'),
            bgCtx: null,

            maxCanvasWidth: null,
            maxCanvasHeigth: null
        }
    },

    mounted(){
        this.$store.state.elems.canvasArea = document.querySelector('#canvas-area')
        this.maxCanvasWidth = document.body.offsetWidth - this.minSidebarRightWidth - this.canvasAreaPos.x,
        this.maxCanvasHeigth = document.body.offsetHeight - this.canvasAreaPos.y

        this.calculateInitialZoom()

        //Set up the draw canvas
        this.canvas = document.querySelector('#draw-canvas')
        this.$store.state.ctx = this.canvas.getContext('2d')
        this.canvas.clear = () => { this.ctx.clearRect(0, 0, this.docSize.width, this.docSize.height); }
        this.canvas.width = this.canvasWidth
        this.canvas.height = this.canvasHeight
        this.ctx.scale(this.zoom, this.zoom)

        //Set up the foreground canvas
        this.fgCanvas.clear = function(){ this.width = this.width }
        this.fgCtx = this.fgCanvas.getContext('2d')

        //Set up the background canvas
        this.bgCanvas.clear = function(){ this.width = this.width }
        this.bgCtx = this.bgCanvas.getContext('2d')
        
        //Position the canvas in the middle of the canvas area
        var canvasX = (this.canvasArea.offsetWidth - this.canvasWidth) / 2
        var canvasY = (this.canvasArea.offsetHeight - this.canvasHeight) / 2
        this.canvasPos = { x: canvasX, y: canvasY }

        this.setUpEvents()
    },

    methods: {
        zoomCanvas(direction){
            var prevZoom = this.zoom
            var newZoomIndex = this.zoomStages.indexOf(this.zoom)
            newZoomIndex += direction === 'in' ? 1 : -1
            if(!newZoomIndex.isBetween(1, this.zoomStages.length - 1)) { return } 
            EventBus.$emit('update-pixel-pos')

            this.zoom = this.zoomStages[newZoomIndex]

            this.canvasPos.x += this.pixelPos[0] * (prevZoom - this.zoom);
            this.canvasPos.y += this.pixelPos[1] * (prevZoom - this.zoom);

            this.canvas.width = this.canvasWidth
            this.canvas.height = this.canvasHeight

            this.correctCanvasPosition()
            this.intersectCanvas()
        },

        intersectCanvas(){
            // Get intersection between max-canvas-size rect and canvas rect
            var x = Math.max(this.canvasPos.x, 0);
            var y = Math.max(this.canvasPos.y, 0);
            var w = Math.min(this.canvasPos.x + this.canvasWidth, this.maxCanvasWidth) - x;
            var h = Math.min(this.canvasPos.y + this.canvasHeight, this.maxCanvasHeigth) - y;

            this.canvas.width = w > 0 ? w : 0
            this.canvas.height = h > 0 ? h : 0

            this.scaleContext()
            this.render()
        },

        correctCanvasPosition(){
            //Make sure that canvas position is not defined by decimals (For drawing)
            var hiddenX = Math.round(Math.min(0, this.canvasPos.x) / this.zoom)
            var hiddenY = Math.round(Math.min(0, this.canvasPos.y) / this.zoom)
            
            if(hiddenX < 0){
                this.canvasPos.x = hiddenX * this.zoom
            }
            if(hiddenY < 0){
                this.canvasPos.y = hiddenY * this.zoom
            }

            this.$store.state.hiddenSize = [hiddenX, hiddenY]
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

        renderBackground(){
            this.canvas.clear()
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.drawImage(this.bgCanvas, ...this.hiddenSize);
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
                var invalidTool = this.currentTool === 'eyedropper'

                if(!invalidTool){
                    EventBus.$emit(this.currentTool+'-tool-mouseleft')
                    this.$store.state.activeElement = this.canvas
                }
            }

            this.canvasArea.addEventListener("wheel", () => {
                if (event.deltaY > 0){ 
                    this.zoomCanvas("out")
                } else { 
                    this.zoomCanvas("in")
                }
            })

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

            EventBus.$on('render-background', () => {
                this.renderBackground()
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

            EventBus.$on('correct-canvas-position', () => {
                this.correctCanvasPosition()
            })
        },

        calculateInitialZoom(){
            var zoom = Math.floor(Math.min(this.canvasArea.offsetWidth / this.docSize.width, 
                                       this.canvasArea.offsetHeight / this.docSize.height))

            //Get zoom stage closest to the calculated zoom
            this.zoom = this.zoomStages.reduce(function(prev, curr) {
                return Math.abs(curr - zoom) < Math.abs(prev - zoom) ? curr : prev;
            });
        }
    }
}
</script>

