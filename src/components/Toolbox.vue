<template>
    <div id="toolbox">
        <Tool id="draw-tool" :icon="drawIcon" :toolname="'draw'"/>
        <DrawTool/>
        <Tool id="eraser-tool" :icon="eraserIcon" :toolname="'eraser'"/>
        <Tool id="select-tool" :image="selectImage" :toolname="'select'"/>
        <Tool id="fill-tool" :icon="fillIcon" :toolname="'fill'"/>
        <Tool id="rectangle-tool" :icon="rectangleIcon" :toolname="'rectangle'"/>
        <Tool id="ellipse-tool" :image="ellipseImage" :toolname="'ellipse'"/>
        <Tool id="eyedropper-tool" :icon="eyedropperIcon" :toolname="'eyedropper'"/>
        <Tool id="hand-tool" :icon="handTool" :toolname="'hand'"/>
        <HandTool/>
        <Tool id="horizontal-mirror-tool" :image="mirrorTool" :toolname="'mirrorx'"/>
        <Tool id="vertical-mirror-tool" :image="mirrorTool" :toolname="'mirrory'"/>
        <Tool id="tile-placer-tool" :image="tilePlacerTool" :toolname="'tile-placer'"/>
        <Tool id="tile-remover-tool" :image="tileRemoverTool" :toolname="'tile-remover'"/>
        <Tool id="animation-tool" :image="animTool" :toolname="'animation'"/>
    </div>
</template>

<script>
import Tool from './Tool'
import DrawTool from './tools/DrawTool'
import HandTool from './tools/HandTool'
import EventBus from './EventBus'

export default {
    name: "Toolbox",

    computed:{
        space(){ return this.$store.state.keys.space },
        prevTool(){ return this.$store.state.prevTool },
        currentTool(){ return this.$store.state.currentTool }
    },

    watch:{
        space(){
            this.space ? this.switchTools('hand') : this.switchTools(this.prevTool)
        }
    },

    mounted(){
        EventBus.$on('switch-tools', newTool => {
            this.switchTools(newTool)
        })
    },

    methods:{
        switchTools(newTool){
            this.$store.state.prevTool = this.currentTool
            EventBus.$emit(this.currentTool+"-tool-exit")
            EventBus.$emit(newTool+"-tool-enter")
            this.$store.state.currentTool = newTool
        }
    },

    data(){
        return {
            drawIcon: 'fas fa-pencil-alt',
            eraserIcon: 'fas fa-eraser',
            selectImage: require('../assets/select-tool.png'),
            fillIcon: 'fas fa-fill-drip',
            rectangleIcon: 'fas fa-vector-square',
            ellipseImage: require('../assets/ellipse-tool.png'),
            eyedropperIcon: 'fas fa-eye-dropper',
            handTool: 'fas fa-hand-paper',
            mirrorTool: require('../assets/mirror-tool.png'),
            tilePlacerTool: require('../assets/tile-placer.svg'),
            tileRemoverTool: require('../assets/tile-remover.svg'),
            animTool: require('../assets/animbounds.svg')
        }
    },

    components:{
        Tool,
        DrawTool,
        HandTool
    }
}
</script>

<style scoped>
#toolbox{
    box-shadow: 0px 1px 0px 0px black inset;
    padding-top: 11px;
    padding-bottom: 10px;
    height: 300px;
}

#vertical-mirror-tool{
    transform: rotate(90deg);
}

#vertical-mirror-tool, #horizontal-mirror-tool{
    background-size: 60%;
}

#tile-placer-tool, #tile-remover-tool{
    background-size: 32px 32px;
    background-position: 5px 5px;
}

#animation-tool{
    background-size: 28px 28px;
    background-position: 8px 8px;
}
</style>


