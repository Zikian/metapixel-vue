<template>
    <div id="preview-window" class="sidebar-window">
        <div class="sidebar-window-header">
            <span id="preview-zoom">{{ '(' + previewZoom + 'x)' }}</span>
            <span class="sidebar-window-title">Preview</span>
            <div class="button fas fa-search-minus" id="preview-zoom-out" @click="zoomCanvas('out')"></div>
            <div class="button fas fa-search-plus" id="preview-zoom-in" @click="zoomCanvas('in')"></div>
        </div>
        <div class="sidebar-window-body" :style="{ 'height': this.windowHeight + 'px' }" ref="windowBody">
            <canvas id="preview-canvas" ref="canvas"></canvas>
            <div id="preview-visible-rect" :style="visibleRectStyle"></div>
        </div>
        <div class="vertical-resizer" ref="resizer">
            <i class="fas fa-bars"></i>
        </div>

    </div>
</template>

<script>
import EventBus from './EventBus'

export default {
    name: 'PreviewWindow',

    computed:{
        zoom(){ return this.$store.state.zoom },
        docSize(){ return this.$store.getters.docSize },
        canvasArea(){ return this.$store.state.elems.canvasArea },
        canvasPos(){ return this.$store.state.canvasPos },
        layers(){ return this.$store.state.layers },
        currentLayer(){ return this.$store.getters.currentLayer },
        selection(){ return this.$store.state.selection },
        pasteCanvas(){ return this.$store.state.elems.pasteCanvas },

        visibleRectStyle(){
            return {
                'left': this.visibleRect.x + 'px',
                'top': this.visibleRect.y + 'px',
                'width': this.visibleRect.w + 'px',
                'height': this.visibleRect.h + 'px'
            }
        },
    },

    watch:{
        zoom(){ this.updateVisibleRect() },
        previewZoom(){ this.updateVisibleRect() },

        canvasPos:{ 
            handler(){ this.updateVisibleRect() },
            deep: true
        },

        docSize() {
            this.resizeCanvas(this.docSize.width, this.docSize.height)
            this.render()
            this.updateVisibleRect()
        }
    },

    data(){
        return {
            canvas: null,
            ctx: null,

            previewZoom: 1,
            zoomStages: [1, 2, 3, 4, 5, 6, 8, 12, 18],
            mouseOffset: 0,
            windowHeight: 150,
            previewCanvasPos: { x: 0, y: 0 },
            visibleRect: {x: 0, y: 0, w: 0, h: 0}
        }
    },

    mounted(){
        this.canvas = this.$refs.canvas
        this.ctx = this.canvas.getContext('2d')
        
        this.canvas.clear = () => { this.ctx.clearRect(0, 0, this.docSize.width, this.docSize.height) }

        this.resizeCanvas(this.docSize.width, this.docSize.height)
        this.updateVisibleRect()
        this.setUpEvents()
    },

    methods:{
        resizeCanvas(){
            this.canvas.width = this.docSize.width * this.previewZoom
            this.canvas.height = this.docSize.height * this.previewZoom
            this.ctx.scale(this.previewZoom, this.previewZoom)
        },

        zoomCanvas(direction){
            var zoomIndex = this.zoomStages.indexOf(this.previewZoom) + (direction === 'in' ? 1 : -1)
            if(!zoomIndex.isBetween(0, this.zoomStages.length)){ return }

            this.previewZoom = this.zoomStages[zoomIndex]
            this.canvas.width = this.previewZoom * this.docSize.width
            this.canvas.height = this.previewZoom * this.docSize.height
            this.ctx.scale(this.previewZoom, this.previewZoom)
        },

        render(){
            this.canvas.clear();
            this.ctx.imageSmoothingEnabled = false;

            var layers = this.layers.slice();
            layers.reverse().forEach(layer => {
                if(layer.visible){
                    this.ctx.globalAlpha = layer.opacity;
                    this.ctx.drawImage(layer.canvas, 0, 0);
                }

                if(layer == this.currentLayer){
                    this.ctx.drawImage(this.pasteCanvas, this.selection.x * this.previewZoom, this.selection.y * this.previewZoom);
                }
            })
        },

        setUpEvents(){
            EventBus.$on('render-preview', () => {
                this.render()
            })

            EventBus.$on('update-visible-rect', () => {
                this.updateVisibleRect()
            })

            EventBus.$on('clear-drawing', () => {
                this.canvas.clear() 
            })

            EventBus.$on('new-document', () => {
                this.resizeCanvas(this.docSize.width, this.docSize.height)
            })

            this.$refs.resizer.onmousedown = () => {
                this.mouseOffset = event.clientY - this.$refs.resizer.offsetTop
                this.$store.state.elems.activeElement = this.$refs.resizer
            }

            this.$refs.resizer.mousemoveActions = () => {
                var windowHeight = event.clientY - this.$refs.windowBody.offsetTop - this.mouseOffset
                this.windowHeight = windowHeight < 0 ? 0 : windowHeight

                this.updateVisibleRect()
            }
        },

        updateVisibleRect(){
            var canvasAreaWidth = this.canvasArea.offsetWidth
            var canvasAreaHeight = this.canvasArea.offsetHeight

            var proportionalZoom = this.previewZoom / this.zoom

            var x = this.canvas.offsetLeft - this.canvasPos.x * proportionalZoom
            var y = this.canvas.offsetTop - this.canvasPos.y * proportionalZoom
            var w = (canvasAreaWidth / this.zoom) * this.previewZoom
            var h = (canvasAreaHeight / this.zoom) * this.previewZoom

            this.visibleRect = {x: x, y: y, w: w, h: h}
        },
    }
}
</script>

<style>
#preview-window .button{
    position: absolute;
}

#preview-window .button:hover{
    box-shadow: 0px 1px 0px 0px black inset;
}

#preview-zoom{
    color: white;
    font-size: 9pt;
    line-height: 27px;
    float: left;
    position: absolute;
    left: 7px;
}

#preview-zoom-in{
    right: 27px;
}

#preview-zoom-out{
    right: 0;
}

#preview-window .sidebar-window-body{
    display: grid;
    position: relative;
    grid-template-rows: 1fr;
    overflow: hidden;
}

#preview-canvas{
    align-self: center;
    justify-self: center;
    grid-row: 1;
    position: absolute;
    image-rendering: pixelated;
    background: repeating-linear-gradient(135deg,#ffffff,#ffffff 3px,#ededed 3px,#ededed 6px);
}

#preview-visible-rect{
    position: absolute;
    border: 1px solid red;
}
</style>


