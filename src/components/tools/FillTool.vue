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
        currentLayer(){ return this.$store.getters.currentLayer }
    },

    methods: {
        onMouseLeft(){
            var oldColor = this.currentLayer.ctx.getImageData(...this.pixelPos, 1, 1).data;
            this.currentLayer.ctx.fillStyle = this.primaryColor;
            
            //getImagedata returns alpha between [0, 255]
            var newColor = this.primaryColor.slice()
            newColor[3] *= 255
            if(newColor.join() === oldColor.join()){return}

            this.floodFill(...this.pixelPos, this.primaryColor, oldColor);

            EventBus.$emit('redraw-layers')
            EventBus.$emit('render-canvas')
            EventBus.$emit('render-preview')
        },
    }
}
</script>

