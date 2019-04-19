<template><div></div></template>

<script>
import EventBus from '../EventBus'
import drawFunctions from '../../mixins/draw-functions'
import baseTool from '../../mixins/baseTool'

export default {
    mixins: [drawFunctions, baseTool],

    computed:{
        pixelPos(){ return this.$store.state.pixelPos },
        primaryColor(){ return this.$store.state.color.primary },
        mouseStart:{ 
            get(){ return this.$store.state.mouseStart },
            set(val){ this.$store.state.mouseStart = val }
        },
        shiftKey(){ return this.$store.state.keys.shift }
    },

    data(){
        return {
            mouseEnd: []
        }
    },

    methods: {
        onMouseLeft(){
            this.mouseStart = this.pixelPos
            this.mouseEnd = this.pixelPos
        },
    
        onMouseDrag(){
            EventBus.$emit('render-background')

            if(this.shiftKey){
                this.mouseEnd = this.rectToSquare(...this.mouseStart, ...this.pixelPos)
                this.drawPreviewRectangle(this.primaryColor, ...this.mouseStart, ...this.mouseEnd)
            } else {
                this.mouseEnd = this.pixelPos
                this.drawPreviewRectangle(this.primaryColor, ...this.mouseStart, ...this.mouseEnd)
            }

            EventBus.$emit('render-foreground')
        },
    
        onMouseUp(){
            this.drawRectangle(this.primaryColor, ...this.mouseStart, ...this.mouseEnd)
            EventBus.$emit('redraw-layers')
            EventBus.$emit('render-foreground')
            EventBus.$emit('render-preview')
        },
    }
}
</script>

