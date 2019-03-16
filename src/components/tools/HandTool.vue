<template>
    <div></div>
</template>

<script>
import EventBus from '../EventBus'

export default {
    name: 'HandTool',

    computed:{
        canvasPos(){ return this.$store.state.canvasPos },
        zoom(){ return this.$store.state.zoom }
    },

    mounted(){
        EventBus.$on('hand-tool-mouseleft', () => {
            this.mouseDownActions()
        })

        EventBus.$on('hand-tool-mousedrag', () => {
            this.mouseDragActions()
        })

        EventBus.$on('hand-tool-exit', () => {
            this.onExit()
        })
    },

    data(){
        return {
            mouseOffset: { x: 0, y: 0}
        }
    },

    methods: {
        mouseDownActions(){
            var offsetX = event.clientX - this.canvasPos.x
            var offsetY = event.clientY - this.canvasPos.y
            this.mouseOffset = { x: offsetX, y: offsetY }
        },

        mouseDragActions(){
            this.canvasPos.x = event.clientX - this.mouseOffset.x
            this.canvasPos.y = event.clientY - this.mouseOffset.y

            var hiddenX = Math.min(0, this.canvasPos.x) / this.zoom
            var hiddenY = Math.min(0, this.canvasPos.y) / this.zoom
            this.$store.state.hiddenSize = [hiddenX, hiddenY]
            EventBus.$emit('intersect-canvas')
        },

        onExit(){
            EventBus.$emit('correct-canvas-position')
            EventBus.$emit('intersect-canvas')
        }
    }
}
</script>

