<template><div></div></template>

<script>
import EventBus from '../EventBus'
import drawFunctions from '../../mixins/draw-functions'

export default {
    mixins: [drawFunctions],

    computed:{
        pixelPos(){ return this.$store.state.pixelPos },
        primaryColor(){ return this.$store.state.color.primary },
        mouseStart:{ 
            get(){ return this.$store.state.mouseStart },
            set(val){ this.$store.state.mouseStart = val }
        },
        shiftKey(){ return this.$store.state.keys.shift }
    },

    mounted(){
        EventBus.$on('rectangle-tool-mouseleft', () => {
            this.mouseLeftActions()
        })

        EventBus.$on('rectangle-tool-mousedrag', () => {
            this.mouseDragActions()
        })

        EventBus.$on('rectangle-tool-mouseup', () => {
            this.mouseUpActions()
        })
    },

    data(){
        return {
            mouseEnd: []
        }
    },

    methods: {
        mouseLeftActions(){
            this.mouseStart = this.pixelPos.slice()
            this.$store.state.showDrawRectInfo = true
        },
    
        mouseDragActions(){
            EventBus.$emit('render-background')

            if(this.shiftKey){
                this.mouseEnd = this.rectToSquare(...this.mouseStart, ...this.pixelPos)
                this.drawPreviewRectangle(this.primaryColor, ...this.mouseStart, ...this.mouseEnd)
            } else {
                this.mouseEnd = this.pixelPos.slice()
                this.drawPreviewRectangle(this.primaryColor, ...this.mouseStart, ...this.mouseEnd)
            }

            EventBus.$emit('render-foreground')
        },
    
        mouseUpActions(){
            this.drawRectangle(this.primaryColor, ...this.mouseStart, ...this.mouseEnd)
            this.$store.state.showDrawRectInfo = false
            EventBus.$emit('redraw-layers')
            EventBus.$emit('render-foreground')
            EventBus.$emit('render-preview')
        },
    }
}
</script>

