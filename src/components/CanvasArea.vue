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
        docSize(){ return this.$store.getters.docSize },
        zoom(){ return this.$store.state.zoom },
        brushSize(){ return this.$store.state.brushSize },
        pixelSize(){ return this.brushSize * this.zoom },
        currentTool(){ return this.$store.state.currentTool },
        hiddenSize(){ return this.$store.state.hiddenSize },
        primaryColor(){ return this.$store.state.color.primary },

        canvasStyle(){
            return { 
                'left': Math.max(0, this.canvasPos.x) + 'px', 
                'top': Math.max(0, this.canvasPos.y) + 'px' 
            }
        },

        mousePixelStyle(){
            return { 
                'left': this.canvasPos.x + this.pixelPos[0] * this.zoom + 'px', 
                'top':  this.canvasPos.y + this.pixelPos[1] * this.zoom + 'px', 
                'width': this.pixelSize + 'px', 
                'height': this.pixelSize + 'px',
                'background-color': this.currentTool != 'eraser' ? `rgba(${this.primaryColor.join()})`
                                                                 : 'rgba(255,255,255,0.5)'
            }
        },

        displayMousePixel(){
            var mouseOverCanvas = (this.pixelPos[0].isBetween(0, this.docSize.width - 1) &&
                                   this.pixelPos[1].isBetween(0, this.docSize.height - 1))
            
            var tool = this.currentTool
            var validTool = (tool === 'draw' ||
                             tool === 'eraser' ||
                             tool === 'mirrorx' ||
                             tool === 'mirrory' ||
                             tool === 'eyedropper' ||
                             tool === 'rectangle' ||
                             tool === 'ellipse' ||
                             tool === 'fill')

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
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    grid-row: 1;
    background-color: rgb(26, 27, 32);
    border: 2px solid black;
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

