<template>
    <div id="color-preview">
        <div id="color-preview-colors">
            <div id="primary-alpha"></div>
            <div id="primary-color" @click="openColorPicker('primary')" 
                 :style="{ backgroundColor: `rgba(${primaryColor})` }">
            </div>
            
            <div id="secondary-alpha"></div>
            <div id="secondary-color"  @click="openColorPicker('secondary')"
                 :style="{ backgroundColor: `rgba(${secondaryColor})` }">
            </div>
        </div>

        <div id="color-preview-buttons">
            <div class="button" id="button-switch-colors" @click="switchColors()">
                <i class="fas fa-arrows-alt-h"></i>
            </div>
            <div class="button" id="button-reset-colors" @click="resetColors()"></div>
        </div>
    </div>
</template>

<script>
import EventBus from './EventBus'

export default {
    name: 'ColorPreview',

    computed: {
        primaryColor(){ 
            return this.$store.state.color.primary.join() 
        },
        secondaryColor(){ 
            return this.$store.state.color.secondary.join()
        }
    },

    methods:{
        openColorPicker(selectedColor){
            EventBus.$emit('open-color-picker', selectedColor)
        },

        switchColors(){
            EventBus.$emit('switch-colors')
        },

        resetColors(){
            EventBus.$emit('reset-colors')
        }
    }
}
</script>

<style scoped>
#color-preview{
    position: relative;
    height: auto;
}

#color-preview-colors{
    height: 81px;
}

#color-preview-buttons{
    height: 27px;
    width: 58px;
    margin: 0 auto 0 auto; 
}

#primary-color, #secondary-color{
    position:absolute;
    width: 45px;
    height: 45px; 
    border-radius: 5px;
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.73);
}

#primary-alpha, #secondary-alpha{
    position: absolute;
    width: 45px;
    height: 45px;
    background-image: url('../assets/alpha-triangle.png');
    background-size: 45px 45px;
    border-radius: 5px;
    z-index: 0;
}

#primary-color{
    top: 14px;
    left: 14px;
    z-index: 3;
}

#primary-alpha{
    top: 14px;
    left: 14px;
    z-index: 2;
}

#secondary-color{
    right: 14px;
    top: 29px;
    z-index: 1;
}

#secondary-alpha{
    right: 14px;
    top: 29px;
    z-index: 0;
}

@keyframes hover-anim{
    from{box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.73);}
    to{box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.73);}
}

/* FIX */
#primary-color:hover{
    cursor: pointer;
    animation: hover-anim 0.3s;
    -webkit-animation-fill-mode: forwards;
    -moz-animation-fill-mode: forwards;
    -ms-animation-fill-mode: forwards;
    -o-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
}

#secondary-color:hover{
    cursor: pointer;
    animation: hover-anim 0.3s;
    -webkit-animation-fill-mode: forwards;
    -moz-animation-fill-mode: forwards;
    -ms-animation-fill-mode: forwards;
    -o-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
}

#button-switch-colors, #button-reset-colors{
    float: left;
}

#button-reset-colors{
    margin-left: 4px;
    background-image: url(../assets/reset-colors-icon.png);
    background-size: 60%;
    background-repeat: no-repeat;
    background-position: center center;
}

#button-switch-colors i{
    font-size: 14pt;
}
</style>

