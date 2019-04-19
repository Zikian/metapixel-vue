<template>
    <div id="color-slider" ref="colorSlider">
        <div 
            id="color-slider-selector" 
            ref="colorSliderSelector"
            :style="{ 'top': selectorY, 'left': selectorX, 'background-color': selectorColor }"></div>
    </div>
</template>

<script>
import EventBus from './EventBus'

export default {
    name: 'ColorSlider',

    mounted(){
        this.$refs.colorSliderSelector.addEventListener('mousedown', () => {
            this.$store.state.elems.activeElement = this.$refs.colorSliderSelector
        })
        this.$refs.colorSliderSelector.mousemoveActions = this.updateSlider
        

        this.$refs.colorSlider.addEventListener('mousedown', () => {
            this.$store.state.elems.activeElement = this.$refs.colorSliderSelector
            this.updateSlider()
        })
    },

    computed:{
        selectorX(){ return (this.$store.state.color.saturation * 255/100) - 10 + 'px' },
        selectorY(){ return 245 - this.$store.state.color.lightness * 255/100 + 'px' },
        selectorColor(){ 
            var color = this.$store.state.color
            return `hsl(${color.hue},${color.saturation}%,${color.lightness}%)`
        }
    },

    methods:{
        updateSlider(){
            var sliderX = this.$refs.colorSlider.getBoundingClientRect().x
            var sliderY = this.$refs.colorSlider.getBoundingClientRect().y

            var selectorX = this.clamp(event.clientX - sliderX, 0, 255)
            var selectorY = this.clamp(event.clientY - sliderY, 0, 255)
            
            var saturation = Math.round(selectorX * 100/255)
            var lightness = 100 - Math.round(selectorY * 100/255)

            EventBus.$emit('update-SL', saturation, lightness)
        }
    }
}
</script>

<style>
#color-slider{
    width: 256px;
    height: 256px;
    position: absolute;
    top: 0;
    left: 0;
}

#color-slider-selector{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    box-shadow: 0 0 0 2px white inset;
    z-index: 10;
}
</style>


