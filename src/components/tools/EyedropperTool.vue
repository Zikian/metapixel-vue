<template><div></div></template>

<script>
import EventBus from '../EventBus'
import baseTool from '../../mixins/baseTool'

export default {
    mixins: [baseTool],

    computed:{
        pixelPos(){ return this.$store.state.pixelPos },
        ctx(){ return this.$store.state.ctx },
        zoom(){ return this.$store.state.zoom },
        clippedSize(){ return this.$store.state.clippedSize }
    },

    methods: {
        onMouseLeft(){
            var targetX = (this.pixelPos[0] + this.clippedSize[0]) * this.zoom
            var targetY = (this.pixelPos[1] + this.clippedSize[1]) * this.zoom
            var color = this.ctx.getImageData(targetX, targetY, 1, 1).data;

            //Don't update color if alpha is equal to 0
            if(color[3] != 0){
                EventBus.$emit('update-color-from-eyedropper', color)
            }
        },

        onMouseDrag(){
            this.onMouseLeft()
        },
    }
}
</script>

