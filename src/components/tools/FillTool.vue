<template>
    <div></div>
</template>

<script>
import EventBus from '../EventBus'
import drawFunctions from '../../mixins/draw-functions'

export default {
    mixins: [drawFunctions],

    computed:{
        primaryColor(){ return this.$store.state.color.primary },
        pixelPos(){ return this.$store.state.pixelPos },
        currentLayer(){ return this.$store.getters.currentLayer }
    },

    mounted(){
        EventBus.$on('fill-tool-mouseleft', () => {
            this.mouseLeftActions()
        })
    },

    methods: {
        mouseLeftActions(){
            var oldColor = this.currentLayer.ctx.getImageData(...this.pixelPos, 1, 1).data;
            this.currentLayer.ctx.fillStyle = this.primaryColor;
            this.floodFill(...this.pixelPos, this.primaryColor, oldColor);

            EventBus.$emit('redraw-layers')
            EventBus.$emit('render-canvas')
            EventBus.$emit('render-preview')
        },
    }
}
</script>

