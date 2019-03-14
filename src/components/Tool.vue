<template>
    <div 
        class="tool" 
        :class="{ 'image-tool': image, 'icon-tool': icon}" 
        :style="[
            currentTool == toolname ? { 'box-shadow': 'yellow 0px 0px 0px 3px inset' } : {},
            { 'background-image': `url('${this.image}')` }   
        ]"
        @click="switchTools()">
        <i :class="icon"></i>
    </div>
</template>

<script>
import EventBus from './EventBus'

export default {
    name: 'Tool',

    computed:{
        currentTool(){ return this.$store.state.currentTool },
        dynamicStyle(){
            return {
                'background-image': `url('${this.image}')`,
                'box-shadow': this.currentTool === this.toolname && 'yellow 0px 0px 0px 3px inset'
            }
        }
    },

    props: [
        "icon",
        "image",
        "toolname"
    ],

    methods:{
        switchTools(){
            EventBus.$emit('switch-tools', this.toolname)
        }
    }
}
</script>

<style>
.tool{
    float: left;
    width: 45px;
    height: 45px;
}

.icon-tool{
    text-align: center;
}

.image-tool{
    background-size: 66%;
    background-repeat: no-repeat;
    background-position: center center;
}

.tool:hover{
    background-color: rgb(82, 82, 87)
}

.tool i{
    color: white;
    font-size: 26px;
    line-height: 45px;
}
</style>




