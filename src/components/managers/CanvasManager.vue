<template><div></div></template>

<script>
import EventBus from '../EventBus'
import drawFunctions from '../../mixins/draw-functions'

export default {
    name: 'CanvasManager',

    mixins:[drawFunctions],

    computed:{
        layers(){ return this.$store.getters.document.layers },
        selectedLayer(){ return this.$store.getters.document.selectedLayer },
        ctx(){ return this.$store.state.ctx },
        currentTool(){ return this.$store.state.currentTool },
        docSize(){ return this.$store.getters.docSize },
        canvasWidth(){ return this.docSize.width * this.zoom },
        canvasHeight(){ return this.docSize.height * this.zoom },
        tileHeight() { return this.$store.getters.tileHeight  },
        tileWidth() { return this.$store.getters.tileWidth  },
        xTiles() { return this.$store.getters.xTiles },
        yTiles() { return this.$store.getters.yTiles },
        canvasArea(){ return this.$store.state.elems.canvasArea },
        pixelPos(){ return this.$store.state.pixelPos },
        clippedSize(){ return this.$store.state.clippedSize } ,
        brushSize(){ return this.$store.state.brushSize },
        pixelSize(){ return this.brushSize * this.zoom },
        minSidebarRightWidth(){ return this.$store.state.constants.minSidebarRightWidth },
        canvasAreaPos(){ return this.$store.state.constants.canvasAreaPos },
        currentLayer(){ return this.$store.getters.currentLayer },
        selectionExists(){ return this.selection.w && this.selection.h },
        document() { return this.$store.getters.document },

        pasteCanvas:{
            get(){ return this.$store.state.elems.pasteCanvas },
            set(val){ this.$store.state.elems.pasteCanvas = val }
        },
        canvasPos:{ 
            get(){ return this.$store.state.canvasPos; } ,
            set(val){ this.$store.state.canvasPos = val }
        },
        zoom:{ 
            get(){ return this.$store.state.zoom },
            set(val){ this.$store.state.zoom = val }
        },
    },

    data(){
        return {
            zoomStages: [0.125, 0.250, 0.333, 0.5, 1, 2, 3, 4, 5, 6, 8, 12, 18, 28, 38, 50, 70, 200],

            canvas: null,

            fgCanvas: document.createElement('canvas'),
            fgCtx: null,

            bgCanvas: document.createElement('canvas'),
            bgCtx: null,

            copyCanvas: document.createElement('canvas'),
            copyCtx: null,

            pasteCtx: null,

            maxCanvasWidth: null,
            maxCanvasHeigth: null
        }
    },

    mounted(){
        this.$store.state.elems.canvasArea = document.querySelector('#canvas-area')

        this.maxCanvasWidth = document.body.offsetWidth - this.minSidebarRightWidth - this.canvasAreaPos.x,
        this.maxCanvasHeigth = document.body.offsetHeight - this.canvasAreaPos.y

        //Set up the canvases
        this.canvas = document.querySelector('#draw-canvas')
        this.$store.state.ctx = this.canvas.getContext('2d')
        this.canvas.clear = () => { this.ctx.clearRect(0, 0, this.docSize.width, this.docSize.height); }

        this.fgCanvas.clear = function(){ this.width = this.width }
        this.fgCtx = this.fgCanvas.getContext('2d')

        this.bgCanvas.clear = function(){ this.width = this.width }
        this.bgCtx = this.bgCanvas.getContext('2d')

        this.copyCanvas.clear = function(){ this.width = this.width }
        this.copyCtx = this.copyCanvas.getContext('2d')

        this.pasteCanvas = document.createElement('canvas'),
        this.pasteCanvas.clear = function(){ this.width = this.width }
        this.pasteCtx = this.pasteCanvas.getContext('2d')

        this.calculateInitialZoom()
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
            this.render()
        },

        intersectCanvas(){
            // Get intersection between max-canvas-size rect and canvas rect
            var canvasRect = { 
                x: this.canvasPos.x,
                y: this.canvasPos.y,
                w: this.canvasWidth,
                h: this.canvasHeight
            }

            var maxSizeRect = {
                x: 0,
                y: 0,
                w: this.maxCanvasWidth,
                h: this.maxCanvasHeigth
            }
            
            var intersection = this.intersectRects(canvasRect, maxSizeRect)

            this.canvas.width = intersection.w > 0 ? intersection.w : 0
            this.canvas.height = intersection.h > 0 ? intersection.h : 0
            this.ctx.scale(this.zoom, this.zoom)

            this.render();
        },

        initCanvas(){
            //Change canvas sizes
            this.canvas.width = this.canvasWidth
            this.canvas.height = this.canvasHeight
            this.ctx.scale(this.zoom, this.zoom)

            this.fgCanvas.width = this.docSize.width
            this.fgCanvas.height = this.docSize.height
            
            this.bgCanvas.width = this.docSize.width
            this.bgCanvas.height = this.docSize.height

            //Position the canvas in the middle of the canvas area
            var canvasX = (this.canvasArea.offsetWidth - this.canvasWidth) / 2
            var canvasY = (this.canvasArea.offsetHeight - this.canvasHeight) / 2
            this.canvasPos = { x: canvasX, y: canvasY }

            this.renderTileGrid()
        },

        resizeCanvas(anchor, width, height) {
            this.canvas.width = width * this.zoom
            this.canvas.height = height * this.zoom
            this.ctx.scale(this.zoom, this.zoom)

            this.fgCanvas.width = width
            this.fgCanvas.height = height
            
            this.bgCanvas.width = width
            this.bgCanvas.height = height

            EventBus.$emit("resize-layers", anchor, width, height)

            this.document.width = width;
            this.document.height = height;

            this.redrawBackground()
            this.redrawForeground()
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

            this.$store.state.clippedSize = [hiddenX, hiddenY]
        },

        render(){
            this.canvas.clear()
            this.ctx.imageSmoothingEnabled = false
            this.ctx.drawImage(this.bgCanvas, ...this.clippedSize)
            this.ctx.drawImage(this.pasteCanvas, this.selection.x + this.clippedSize[0], this.selection.y + this.clippedSize[1]);
            this.ctx.drawImage(this.fgCanvas, ...this.clippedSize)
            this.renderTileGrid()
        },

        renderForeground(){
            this.ctx.imageSmoothingEnabled = false
            this.ctx.drawImage(this.fgCanvas, ...this.clippedSize)
            this.renderTileGrid()
        },

        renderBackground(){
            this.canvas.clear()
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.drawImage(this.bgCanvas, ...this.clippedSize);
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

        drawPasteCanvas(){
            if(!this.selectionExists) { return; }
            this.pasteCanvas.width = this.selection.w;      
            this.pasteCanvas.height = this.selection.h;
            this.pasteCtx.imageSmoothingEnabled = false;
            this.pasteCtx.drawImage(this.copyCanvas, 0, 0, this.selection.w, this.selection.h);
        },

        resizePasteCanvas(){
            if(!this.selectionExists) { return; }

            var selection = this.selection

            this.pasteCanvas.width = selection.w;
            this.pasteCanvas.height = selection.h;

            this.pasteCtx.translate(selection.flipX * selection.w, selection.flipY * selection.h)
            this.pasteCtx.scale(selection.flipX? -1 : 1, selection.flipY? -1 : 1);
            
            this.pasteCtx.imageSmoothingEnabled = false;
            this.pasteCtx.drawImage(this.copyCanvas, 0, 0, selection.w, selection.h);
        },

        detachSelection(){
            this.copyCanvas.width = this.selection.w;
            this.copyCanvas.height = this.selection.h;

            var sourceRect = [this.selection.x, this.selection.y, this.selection.w, this.selection.h]
            var targetRect = [0, 0, this.selection.w, this.selection.h]
            this.copyCtx.drawImage(this.currentLayer.canvas, ...sourceRect, ...targetRect);

            this.drawPasteCanvas();
            this.clearSelectionContents()

            this.render()
        },

        commitSelection(){
            this.pasteSelection();
            this.copyCanvas.clear()
            this.pasteCanvas.clear()
        },

        pasteSelection(){
            this.currentLayer.ctx.drawImage(this.pasteCanvas, this.selection.x, this.selection.y);

            this.redrawBackground();
            this.render();
            EventBus.$emit('render-preview')
        },

        clearSelectionContents(){
            this.erasePixel(this.selection.x, this.selection.y, this.selection.w, this.selection.h)

            this.redrawBackground()
            this.redrawForeground()
            this.render()
            EventBus.$emit('render-preview')
        },

        renderTileGrid() {
            if(this.document.type == "single-image") return
            if(this.tileWidth * this.zoom < 32 || this.tileHeight * this.zoom < 32) return

            this.ctx.beginPath()

            this.ctx.strokeStyle = "rgb(160, 160, 160)"
            this.ctx.lineWidth = 1 / this.zoom;
            var x = this.xTiles;
            var y = this.yTiles;
            var lineOffset = 0

            while(x--){
                this.ctx.moveTo(x * this.tileWidth + this.clippedSize[0] + lineOffset, 0)
                this.ctx.lineTo(x * this.tileWidth + this.clippedSize[0] + lineOffset, this.canvasHeight)
            }

            while(y--){
                this.ctx.moveTo(0, y * this.tileHeight + this.clippedSize[1] + lineOffset);
                this.ctx.lineTo(this.canvasWidth, y * this.tileHeight - this.clippedSize[1] + lineOffset);
            }

            this.ctx.stroke();
        },

        setUpEvents(){
            this.canvasArea.onmousedown = () => {
                var invalidTool = this.currentTool === 'eyedropper'

                if(!invalidTool){
                    EventBus.$emit('current-tool-mouseleft')
                    this.$store.state.elems.activeElement = this.canvas
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
                this.$store.state.keys.mouseDown = true //Window eventlistener will not register mousedown because stopPropagation
                event.stopPropagation()
                
                EventBus.$emit('current-tool-mouseleft')
                this.$store.state.elems.activeElement = this.canvas
            }

            this.canvas.mousemoveActions = () => {
                EventBus.$emit('current-tool-mousedrag')
            }

            this.canvas.mouseupActions = () => {
                EventBus.$emit('current-tool-mouseup')
            }

            EventBus.$on('zoom-canvas', direction => {
                this.zoomCanvas(direction)
            })

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

            EventBus.$on('clear-drawing', () => {
                this.canvas.clear()
                this.fgCanvas.clear()
                this.bgCanvas.clear()
            })

            EventBus.$on('new-document', () => {
                this.calculateInitialZoom()
                this.initCanvas()
            })

            EventBus.$on('detach-selection', () => {
                this.detachSelection()
            })

            EventBus.$on('commit-selection', () => {
                this.commitSelection()
            })

            EventBus.$on('paste-selection', () => {
                this.pasteSelection()
            })

            EventBus.$on('resize-paste-canvas', () => {
                this.resizePasteCanvas()
            })

            EventBus.$on('clear-selection-contents', () => {
                this.clearSelectionContents()
            })

            EventBus.$on('resize-document', (anchor, width, height) => {
                this.resizeCanvas(anchor, width, height)
            })
        },

        calculateInitialZoom(){
            var zoom = Math.floor(Math.min(this.canvasArea.offsetWidth / this.docSize.width, 
                                       this.canvasArea.offsetHeight / this.docSize.height))
            //Get zoom stage closest to the calculated zoom
            this.zoom = this.zoomStages.reduce(function(prev, curr) {
                return Math.abs(curr - zoom) < Math.abs(prev - zoom) ? curr : prev;
            })
        }
    }
}
</script>

