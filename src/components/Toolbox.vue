<template>
    <div id="toolbox">
        <ToolButton id="draw-tool" :icon="drawIcon" :toolname="'draw'"/>
        <DrawTool ref="draw"/>

        <ToolButton id="eraser-tool" :icon="eraserIcon" :toolname="'eraser'"/>
        <EraserTool ref="eraser"/>

        <ToolButton id="select-tool" :image="selectImage" :toolname="'select'"/>
        <SelectTool ref="select"/>

        <ToolButton id="fill-tool" :icon="fillIcon" :toolname="'fill'"/>
        <FillTool ref="fill"/>

        <ToolButton id="rectangle-tool" :icon="rectangleIcon" :toolname="'rectangle'"/>
        <RectangleTool ref="rectangle"/>

        <ToolButton id="ellipse-tool" :image="ellipseImage" :toolname="'ellipse'"/>
        <EllipseTool ref="ellipse"/>

        <ToolButton id="eyedropper-tool" :icon="eyedropperIcon" :toolname="'eyedropper'"/>
        <EyedropperTool ref="eyedropper"/>

        <ToolButton id="hand-tool" :icon="handTool" :toolname="'hand'"/>
        <HandTool ref="hand"/>

        <ToolButton id="horizontal-mirror-tool" :image="mirrorTool" :toolname="'mirrorx'"/>
        <MirrorTool ref="mirrory"/>

        <ToolButton id="vertical-mirror-tool" :image="mirrorTool" :toolname="'mirrory'"/>
        <MirrorTool ref="mirrorx"/>

        <ToolButton id="tile-placer-tool" :image="tilePlacerTool" :toolname="'tile-placer'"/>
        <TilePlacerTool ref="tile-placer"/>

        <ToolButton id="tile-remover-tool" :image="tileRemoverTool" :toolname="'tile-remover'"/>
        
        <ToolButton id="animation-tool" :image="animTool" :toolname="'animation'"/>
    </div>
</template>

<script>
import ToolButton from './ToolButton'
import DrawTool from './tools/DrawTool'
import EraserTool from './tools/EraserTool'
import HandTool from './tools/HandTool'
import RectangleTool from './tools/RectangleTool'
import EllipseTool from './tools/EllipseTool'
import FillTool from './tools/FillTool'
import EyedropperTool from './tools/EyedropperTool'
import MirrorTool from './tools/MirrorTool'
import SelectTool from './tools/SelectTool'
import TilePlacerTool from './tools/TilePlacerTool'

import EventBus from './EventBus'

export default {
    name: "Toolbox",

    computed:{
        space(){ return this.$store.state.keys.space },
        alt(){ return this.$store.state.keys.alt },
        prevTool(){ return this.$store.state.prevTool },
        currentTool(){ return this.$store.state.currentTool },
        mouseDown(){ return this.$store.state.keys.mouseDown },
    },

    watch:{
        space(){
            if(this.space){
                this.switchTools('hand')
            } else if(this.currentTool === 'hand') {
                this.switchTools(this.prevTool)
            }
        },

        alt(){
            if(this.currentTool == 'select') return

            if(this.alt){
                this.switchTools('eyedropper')
            } else if(this.currentTool === 'eyedropper') {
                this.switchTools(this.prevTool)
            }
        }
    },

    mounted(){
        EventBus.$on('switch-tools', newTool => {
            this.switchTools(newTool)
        })

        EventBus.$on('current-tool-mouseleft', () => {
            if (this.preventTool) return
            this.$refs[this.currentTool].onMouseLeft()
        })

        EventBus.$on('current-tool-mousedrag', () => {
            if (this.preventTool) return
            this.$refs[this.currentTool].onMouseDrag()
        })

        EventBus.$on('current-tool-mouseup', () => {
            if (this.preventTool) {
                this.preventTool = false
                return
            }
            this.$refs[this.currentTool].onMouseUp()
        })
    },

    methods:{
        switchTools(newTool){
            if(newTool === this.currentTool) { return }

            this.$store.state.prevTool = this.currentTool
            if(!this.preventTool && this.mouseDown){
                this.$refs[this.currentTool].onMouseUp()
            }
            this.$refs[this.currentTool].onExit()

            this.preventTool = this.mouseDown
        
            this.$store.state.currentTool = newTool
            this.$refs[newTool].onEnter()
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
            animTool: require('../assets/animbounds.svg'),

            preventTool: false
        }
    },

    components:{
        ToolButton,
        DrawTool,
        HandTool,
        EraserTool,
        RectangleTool,
        EllipseTool,
        FillTool,
        EyedropperTool,
        MirrorTool,
        SelectTool,
        TilePlacerTool
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


