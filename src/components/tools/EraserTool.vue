<template>
    <div></div>
</template>

<script>
import EventBus from '../EventBus'
import drawFunctions from '../../mixins/draw-functions'
import baseTool from '../../mixins/baseTool'

export default {
    mixins: [drawFunctions, baseTool],

    computed:{
        pixelPos(){ return this.$store.state.pixelPos },
        shiftKey(){ return this.$store.state.keys.shift }
    },

    data(){
        return{
            drawBuffer: [],
            isDrawingLine: false
        }
    },

    methods: {
        onMouseLeft(){
            // this.isDrawingLine = this.shiftKey
            // this.mouseStart = this.pixelPos
            // this.mouseEnd = this.pixelPos

            this.drawBuffer = []
            this.drawBuffer.push(this.pixelPos)

            this.erasePixel(...this.pixelPos);

            EventBus.$emit('redraw-layers')
            EventBus.$emit('render-canvas')
        },
    
        onMouseDrag(){
            if(this.isDrawingLine){
                EventBus.$emit('render-background')
                this.drawPreviewLine(...this.mouseStart, ...this.pixelPos)
                this.mouseEnd = this.pixelPos
                EventBus.$emit('render-foreground')
            } else {
                this.drawBuffer.push(this.pixelPos)
                if (this.drawBuffer.length == 2){
                    this.drawLine(...this.drawBuffer[0], ...this.drawBuffer[1])
                    this.drawBuffer.shift()
                }
                EventBus.$emit('render-canvas')
            }

        },
    
        onMouseUp(){
            if(this.isDrawingLine){
                this.drawLine(...this.mouseStart, ...this.mouseEnd)
                EventBus.$emit('render-foreground')
                this.isDrawingLine = this.shiftKey
            }

            EventBus.$emit('redraw-layers')
            EventBus.$emit('render-preview')
        },
    }
}
</script>

