<template>
    <div id="canvas-area">
        <div 
            id="selection-rect" 
            :style="selectionStyle" 
        >
            <div
                v-for="resizer in selectionResizers"
                :key="resizer.key"
                :id="resizer.id"
                :data-resize-state="`[${resizer.resizeState.join()}]`"
                class="selection-resizer"
                :style="selectionResizerStyle" 
            />
        </div>

        <canvas id="draw-canvas" :style="canvasStyle"/>
        <CanvasManager/>

        <div 
            id="mouse-pixel" 
            :style="mousePixelStyle" 
            v-if="displayMousePixel"
        />
    </div>
</template>

<script>
import CanvasManager from './managers/CanvasManager'

export default {
    name: 'CanvasArea',

    mounted(){
        var selectionResizers = document.getElementsByClassName('selection-resizer')

        for(var i = 0; i < 8; i++){
            var componentInstance = this
            selectionResizers[i].onmousedown = function() {
                var resizeState = JSON.parse(this.getAttribute('data-resize-state'))

                componentInstance.selection.clampX = resizeState[0]
                componentInstance.selection.clampY = resizeState[1]
                componentInstance.selection.resizeX = resizeState[2]
                componentInstance.selection.resizeY = resizeState[3]
            }
        }
    },

    data(){
        return{
            //Resize state describes: clampX, clampY, resizeX, resizeY
            selectionResizers:[
                { key: 0, id: 'tl-resizer', resizeState: [false, false, true, true] },
                { key: 1, id: 'tm-resizer', resizeState: [true, false, false, true] },
                { key: 2, id: 'tr-resizer', resizeState: [true, false, true, true] },
                { key: 3, id: 'lm-resizer', resizeState: [false, true, true, false] },
                { key: 4, id: 'rm-resizer', resizeState: [true, true, true, false] },
                { key: 5, id: 'bl-resizer', resizeState: [false, true, true, true] },
                { key: 6, id: 'bm-resizer', resizeState: [true, true, false, true] },
                { key: 7, id: 'br-resizer', resizeState: [true, true, true, true] },
            ]
        }
    },

    computed:{
        pixelPos(){ return this.$store.state.pixelPos },
        canvasPos(){ return this.$store.state.canvasPos },
        docSize(){ return this.$store.getters.docSize },
        zoom(){ return this.$store.state.zoom },
        brushSize(){ return this.$store.state.brushSize },
        pixelSize(){ return this.brushSize * this.zoom },
        currentTool(){ return this.$store.state.currentTool },
        clippedSize(){ return this.$store.state.clippedSize },
        primaryColor(){ return this.$store.state.color.primary },
        selection:{ 
            get(){ return this.$store.state.selection },
            set(val){ this.$store.state.selection = val }
        },

        activeElement: {
            get(){ return this.$store.state.elems.activeElement },
            set(val){ this.$store.state.elems.activeElement = val }
        },

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
        },

        selectionStyle(){
            var selection = this.selection
            var zoom = this.zoom
            var canvasPos = this.canvasPos

            return {
                'left': selection.x * zoom + canvasPos.x + 'px',
                'top': selection.y * zoom + canvasPos.y + 'px',
                'width': selection.w * zoom + 'px',
                'height': selection.h * zoom + 'px',
                'outline': `1px solid ${selection.detached ? 'black' : 'red'}`,
                'display': selection.w && selection.h ? 'block' : 'none'
            }
        },

        selectionResizerStyle(){
            return {
                display: this.selection.detached ? 'block': 'none'
            }
        }
    },

    components:{
        CanvasManager,
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

#selection-rect{
    position: absolute;
    z-index: 1000;
    outline: 1px solid red;
    width: 10px;
    height: 10px;
}

/* RESIZERS */
.selection-resizer{
    position: absolute;
    width: 7px;
    height: 7px;
    outline: 3px solid lightgray;
    background-color: rgba(0, 0, 0, 0.603);
}

.selection-resizer:hover{
    outline: 3px solid rgb(36, 36, 36);
}

#tl-resizer{
    top: -5px;
    left: -5px;
}

#tm-resizer{
    top: -5px;
    left: 49%
}

#tr-resizer{
    top: -5px;
    right: -5px;
}

#lm-resizer{
    top: 49%;
    left: -5px;
}

#rm-resizer{
    top: 49%;
    right: -5px;
}

#bl-resizer{
    bottom: -5px;
    left: -5px;
}

#bm-resizer{
    bottom: -5px;
    left: 49%;
}

#br-resizer{
    bottom: -5px;
    right: -5px;
}

</style>

