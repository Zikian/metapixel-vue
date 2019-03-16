<template>
    <div></div>
</template>

<script>
import EventBus from '../EventBus'
import drawFunctions from '../../mixins/draw-functions'

export default {
    mixins: [drawFunctions],

    computed:{
        pixelPos(){ return this.$store.state.pixelPos },
    },

    data(){
        return{
            drawBuffer: []
        }
    },

    mounted(){
        EventBus.$on('eraser-tool-mouseleft', () => {
            this.mouseLeftActions()
        })

        EventBus.$on('eraser-tool-mousedrag', () => {
            this.mouseDragActions()
        })

        EventBus.$on('eraser-tool-mouseup', () => {
            this.mouseUpActions()
        })
    },

    methods: {
        mouseLeftActions(){
            this.drawBuffer.push(this.pixelPos)
            this.erasePixel(...this.pixelPos);

            EventBus.$emit('redraw-layers')
            EventBus.$emit('render-canvas')
        },
    
        mouseDragActions(){
            this.drawBuffer.push(this.pixelPos)
            if (this.drawBuffer.length == 2){
                this.drawLine(...this.drawBuffer[0], ...this.drawBuffer[1])
                this.drawBuffer.shift()
            }
            EventBus.$emit('redraw-layers')
            EventBus.$emit('render-canvas')
        },
    
        mouseUpActions(){
            this.drawBuffer = []
            EventBus.$emit('render-preview')
        },
    }
}
</script>

