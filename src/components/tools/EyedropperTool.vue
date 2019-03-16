<template><div></div></template>

<script>
import EventBus from '../EventBus'

export default {
    computed:{
        pixelPos(){ return this.$store.state.pixelPos },
        ctx(){ return this.$store.state.ctx },
        zoom(){ return this.$store.state.zoom },
        hiddenSize(){ return this.$store.state.hiddenSize }
    },

    mounted(){
        EventBus.$on('eyedropper-tool-mouseleft', () => {
            this.pickColor()
        })

        EventBus.$on('eyedropper-tool-mousedrag', () => {
            this.pickColor()
        })
    },

    methods: {
        pickColor(){
            var targetX = (this.pixelPos[0] + this.hiddenSize[0]) * this.zoom
            var targetY = (this.pixelPos[1] + this.hiddenSize[1]) * this.zoom
            var color = this.ctx.getImageData(targetX, targetY, 1, 1).data;

            //Don't update color if alpha is equal to 0
            if(color[3] != 0){
                EventBus.$emit('update-color-from-eyedropper', color)
            }
        }
    }
}
</script>

