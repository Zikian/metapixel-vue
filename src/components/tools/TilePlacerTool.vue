<template><div></div></template>

<script>
import EventBus from '../EventBus'
import drawFunctions from '../../mixins/draw-functions'
import baseTool from '../../mixins/baseTool'

export default {
    mixins: [drawFunctions, baseTool],

    computed:{
        hoveredTilePos(){ return this.$store.state.hoveredTilePos },
        currentTile(){ return this.$store.getters.currentTile },
    },

    data(){
        return {
            mouseEnd: [],
        }
    },

    methods: {
        onMouseLeft(){
            this.paintTile(...this.hoveredTilePos, this.currentTile)
        },
    
        onMouseDrag(){

        },
    
        onMouseUp(){

        }
    }
}
</script>

