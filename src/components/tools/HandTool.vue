<template>
    <div></div>
</template>

<script>
import EventBus from '../EventBus'
import baseTool from '../../mixins/baseTool'

export default {
    mixins: [baseTool],

    computed:{
        canvasPos(){ return this.$store.state.canvasPos },
        zoom(){ return this.$store.state.zoom }
    },

    data(){
        return {
            mouseOffset: { x: 0, y: 0}
        }
    },

    methods: {
        onMouseLeft(){
            var offsetX = event.clientX - this.canvasPos.x
            var offsetY = event.clientY - this.canvasPos.y
            this.mouseOffset = { x: offsetX, y: offsetY }
        },

        onMouseDrag(){
            this.canvasPos.x = event.clientX - this.mouseOffset.x
            this.canvasPos.y = event.clientY - this.mouseOffset.y

            var hiddenX = Math.min(0, this.canvasPos.x) / this.zoom
            var hiddenY = Math.min(0, this.canvasPos.y) / this.zoom
            this.$store.state.clippedSize = [hiddenX, hiddenY]
            EventBus.$emit('intersect-canvas')
            EventBus.$emit('render-canvas')
        },

        onExit(){
            EventBus.$emit('correct-canvas-position')
            EventBus.$emit('intersect-canvas')
            EventBus.$emit('render-canvas')
        }
    }
}
</script>

