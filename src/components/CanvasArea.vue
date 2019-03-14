<template>
    <div id="canvas-area">
        <canvas id="draw-canvas" :style="canvasStyle"></canvas>
        <div id="mouse-pixel" :style="mousePixelStyle" v-if="displayMousePixel"></div>
        <CanvasManager/>
    </div>
</template>

<script>
import CanvasManager from './managers/CanvasManager'

export default {
    name: 'CanvasArea',

    computed:{
        pixelPos(){ return this.$store.state.pixelPos },
        canvasPos(){ return this.$store.state.canvasPos },
        docWidth(){ return this.$store.getters.currentDocument.width },
        docHeight(){ return this.$store.getters.currentDocument.height },
        zoom(){ return this.$store.state.zoom },
        pixelSize(){ return this.brushSize * this.zoom },
        currentTool(){ return this.$store.state.currentTool },
        hiddenSize(){ return this.$store.state.hiddenSize },

        canvasStyle(){
            return { 
                'left': Math.max(0, this.canvasPos.x) + 'px', 
                'top': Math.max(0, this.canvasPos.y) + 'px' 
            }
        },

        mousePixelStyle(){
            return { 
                'left': this.canvasPos.x + this.pixelPos.x * this.zoom + 'px', 
                'top':  this.canvasPos.y + this.pixelPos.y * this.zoom + 'px', 
                'width': this.pixelSize + 'px', 
                'height': this.pixelSize + 'px',
            }
        },

        displayMousePixel(){
            var mouseOverCanvas = (this.pixelPos.x.isBetween(0, this.docWidth - 1) &&
                                   this.pixelPos.y.isBetween(0, this.docHeight - 1))
            
            var tool = this.currentTool
            var validTool = (tool === 'draw' ||
                             tool === 'erase' ||
                             tool === 'mirrorx' ||
                             tool === 'mirrory' ||
                             tool === 'eyedropper' ||
                             tool === 'rectangle' ||
                             tool === 'ellipse')

            return mouseOverCanvas && validTool
        }
    },

    components:{
        CanvasManager
    }
}
</script>

<style>
#canvas-area{
    position: relative;
    grid-row: 1;
    background-color: rgb(26, 27, 32);
    height: 100%;
    box-shadow: inset 0px 0px 0px 2px black;
}

#draw-canvas{
    position: absolute;
    background: repeating-linear-gradient(135deg,#ffffff,#ffffff 3px,#ededed 3px,#ededed 6px);
}

#mouse-pixel{
    position: absolute;
    background-color:black;
    pointer-events: none;
}
</style>

