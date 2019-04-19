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
        primaryColor(){ return this.$store.state.color.primary },
        pixelPos(){ return this.$store.state.pixelPos },
        prevPixelPos(){ return this.$store.state.prevPixelPos },
        shiftKey(){ return this.$store.state.keys.shift },

        mouseStart:{
            get(){ return this.$store.state.mouseStart },
            set(val){ this.$store.state.mouseStart = val }
        },
    },

    data(){
        return {
            drawBuffer: [],
            mouseEnd: [],
            isDrawingLine: false,
        }
    },

    methods: {
        onMouseLeft(){
            this.isDrawingLine = this.shiftKey
            this.mouseStart = this.pixelPos.slice()
            this.mouseEnd = this.pixelPos.slice()

            this.drawBuffer.push(this.pixelPos)
            this.drawPixel(this.primaryColor, ...this.pixelPos)
            
            EventBus.$emit('render-foreground')
        },
    
        onMouseDrag(){
            if(this.isDrawingLine){
                EventBus.$emit('render-background')
                
                this.drawPreviewLine(...this.mouseStart, ...this.pixelPos, this.primaryColor)
                this.mouseEnd = this.pixelPos.slice()
            } else {
                this.drawBuffer.push(this.pixelPos)
                this.drawLine(...this.drawBuffer[0], ...this.drawBuffer[1], this.primaryColor)
                this.drawBuffer.shift()
            }
            
            EventBus.$emit('render-foreground')
        },
    
        onMouseUp(){
            if(this.isDrawingLine){
                this.drawLine(...this.mouseStart, ...this.mouseEnd, this.primaryColor)
                EventBus.$emit('render-foreground')
                this.isDrawingLine = this.shiftKey
            }

            this.drawBuffer = []

            EventBus.$emit('redraw-background')
            EventBus.$emit('render-preview')
        }
    }
}
</script>

