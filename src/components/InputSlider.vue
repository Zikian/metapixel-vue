<template>
    <div class="input-slider" :id="id">
        <span class="input-slider-title">{{ title+':' }}</span>
        
        <div class="input-slider-wrapper" :ref="`${id}-input-wrapper`">
            
            <input 
                type="number" 
                :value="getValue()"
                :ref="`${id}-input`" 
                onkeydown="return event.keyCode !== 69"
                @input="inputValidation()">
            
            <i class="fas fa-caret-down" @mousedown="showSlider()"></i>
            
            <div 
                class="input-slider-slider" 
                :ref="`${id}-input-slider`"
                :style="[
                    sliderActive ? { 'display': 'block' } : { 'display': 'none' }, 
                    { 'top': sliderY+'px' }
                ]">
                
                <div 
                    class="input-slider-selector" 
                    :ref="`${id}-selector`"
                    :style="{ 'top': selectorY+'px' }">
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import EventBus from './EventBus'

export default {
    name: 'InputSlider',
    props: {
        'title': String, 
        'startVal': Number, 
        "id": String, 
        'maxValue': Number, 
        'affectedValPath': String,
    },

    mounted(){
        this.selector.mousemoveActions = this.updateSlider
        this.selector.mouseupActions = this.hideSlider

        //Set the initial value of the state value this component affects
        this.updateValue(this.startVal)
    },

    computed: {
        wrapper(){ return this.$refs[`${this.id}-input-wrapper`] },
        
        slider(){ return this.$refs[`${this.id}-input-slider`] },
        
        selector(){ return this.$refs[`${this.id}-selector`] },
        
        input(){ return this.$refs[`${this.id}-input`] },

        value(){ return this.getValue() }
    },

    data(){
        return {
            sliderActive: false,
            sliderY: null,
            selectorY: 95 - this.startVal * 100 / this.maxValue
        }
    },

    methods:{
        showSlider(){
            this.sliderActive = true
            this.$store.state.activeElement = this.selector

            var mouseOffset = event.clientY - this.wrapper.getBoundingClientRect().y;

            this.sliderY = mouseOffset - 100 + this.value * 100 / this.maxValue;
            this.selectorY = 94 - this.value * 100 / this.maxValue
        },

        updateSlider(){
            var mouseOffset = event.clientY -this.slider.getBoundingClientRect().y
            var offsetClamped = this.clamp(mouseOffset, 0, 100)

            this.updateValue(Math.round(this.maxValue - offsetClamped * this.maxValue / 100))
            this.selectorY = offsetClamped - 6
        },

        hideSlider(){
            this.sliderActive = false
        },

        inputValidation(){
            var value = this.clamp(this.input.value, 0, this.maxValue)
            this.updateValue(value)
            this.input.value = value
        },

        getValue(){
            return Object.getByString(this.$store.state, this.affectedValPath)
        },

        updateValue(value){
            EventBus.$emit(`update-${this.id}`, value)
        }
    }
}
</script>

<style>
.input-slider{
    color: white;
    font-size: 12pt;
    line-height: 24px;
    height: 24px;
}

.input-slider-title{
    float: left;
    margin-right: 8px;
}

.input-slider-wrapper{
    position: relative;
    height: 24px;
    width: 60px;
    float: left;
}

.input-slider input{
    position: absolute;
    top: 0;
    left: 0;
    height: inherit;
    width: inherit;
    background-color: rgb(23, 23, 23);
    border-radius: 4px;
    border: 0;
    color: white;
    font-size: 12pt;
    padding: 0 0 0 5px;
    outline: none;
    float: left;
}

.input-slider input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.input-slider i{
    position: absolute;
    line-height: 24px;
    color: white;
    right: 0;
    font-size: 15pt;
}

.input-slider-slider{
    z-index: 1000;
    position: absolute;
    height: 100px;
    width: 6px;
    border-radius: 3px;
    background-color: rgb(40, 40, 40);
    right: 3px;
    top: 0;
    box-shadow: 4px 4px 13px 0px rgba(0, 0, 0, 0.56);
}

.input-slider-selector{
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: gray;
    border-radius: 5px;
    box-shadow: 0px 0px 0px 2px white inset;
    left: -2px;
}
</style>

