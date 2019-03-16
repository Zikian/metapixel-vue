<template>
    <div id="hue-slider" ref="hueSlider">
        <div id="hue-slider-selector" ref="hueSliderSelector" 
             :style="{ 'top': sliderHeight, 
                       'background-color': sliderColor }">
        </div>
    </div>
</template>

<script>
import EventBus from './EventBus'

export default {
    name: 'HueSlider',
    
    mounted(){
        this.$refs.hueSliderSelector.onmousedown = () => {
            this.$store.state.activeElement = this.$refs.hueSliderSelector
        }
        this.$refs.hueSliderSelector.mousemoveActions = this.updateSlider
        

        this.$refs.hueSlider.addEventListener('mousedown', () => {
            this.$store.state.activeElement = this.$refs.hueSliderSelector
            this.updateSlider()
        })
    },

    computed:{
        sliderColor(){ return `hsl(${this.$store.state.color.hue},100%,50%` },
        sliderHeight(){ return 245 - this.$store.state.color.hue * 256/360 + 'px' }
    },

    methods: {   
        updateSlider(){
            var sliderY = this.$refs.hueSlider.getBoundingClientRect().y
            var selectorY = this.clamp(event.clientY - sliderY - 10, -10, 246)
            
            var hue = 360 - Math.round((selectorY + 10) * 360/256)

            EventBus.$emit('update-hue', hue)
        }
    }
}
</script>


<style>
#hue-slider{
    position: relative;

    background: linear-gradient(to top,  #ff3232 0%,#fff130 20%,#45ff30 35%,#28fff0 52%,#282cff 71%,#ff28fb 88%,#ff0094 100%);
    background-clip: content-box;
    
    width: 10px;
    height: 256px;
    border-radius: 5px;

    margin-left: 15px;
}

#hue-slider-selector{
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    box-shadow: 0 0 0 2px white inset;

    top: -10px;
    left: -5px;
}
</style>

