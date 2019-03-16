<template>
    <div></div>
</template>

<script>
import EventBus from '../EventBus'
import drawFunctions from '../../mixins/draw-functions'

export default {
    mixins: [drawFunctions],

    computed:{
        primaryColor(){ return this.$store.state.color.primary },
        pixelPos(){ return this.$store.state.pixelPos },
        prevPixelPos(){ return this.$store.state.prevPixelPos },
        shiftKey(){ return this.$store.state.keys.shift },
        docSize(){ return this.$store.getters.docSize },
        currentTool(){ return this.$store.state.currentTool },

        mouseStart:{
            get(){ return this.$store.state.mouseStart },
            set(val){ this.$store.state.mouseStart = val }
        }
    },

    data(){
        return {
            drawBuffer: [],
            isDrawingLine: false,
            mouseEnd: []
        }
    },

    mounted(){
        EventBus.$on('mirrorx-tool-mouseleft', () => {
            this.mouseLeftActions()
        })

        EventBus.$on('mirrorx-tool-mousedrag', () => {
            this.mouseDragActions()
        })

        EventBus.$on('mirrorx-tool-mouseup', () => {
            this.mouseUpActions()
        })

        EventBus.$on('mirrorx-tool-exit', () => {
            this.onExit()   
        })

        EventBus.$on('mirrory-tool-mouseleft', () => {
            this.mouseLeftActions()
        })

        EventBus.$on('mirrory-tool-mousedrag', () => {
            this.mouseDragActions()
        })

        EventBus.$on('mirrory-tool-mouseup', () => {
            this.mouseUpActions()
        })

        EventBus.$on('mirrory-tool-exit', () => {
            this.onExit()   
        })
    },

    methods: {
        mouseLeftActions(){
            this.isDrawingLine = this.shiftKey
            this.mouseStart = this.pixelPos.slice()
            this.mouseEnd = this.pixelPos.slice()

            this.drawBuffer.push(this.pixelPos)
            this.drawPixel(this.primaryColor, ...this.pixelPos)
            this.drawPixel(this.primaryColor, ...this.mirror(this.pixelPos))
            
            EventBus.$emit('render-foreground')
        },
    
        mouseDragActions(){
            if(this.isDrawingLine){
                EventBus.$emit('render-background')
                
                this.drawPreviewLine(...this.mouseStart, ...this.pixelPos, this.primaryColor)
                this.drawPreviewLine(...this.mirror(this.mouseStart), ...this.mirror(this.pixelPos), this.primaryColor)
                this.mouseEnd = this.pixelPos.slice()
            } else {
                this.drawBuffer.push(this.pixelPos)

                this.drawLine(...this.drawBuffer[0], ...this.drawBuffer[1], this.primaryColor)
                this.drawLine(...this.mirror(this.drawBuffer[0]), ...this.mirror(this.drawBuffer[1]), this.primaryColor)

                this.drawBuffer.shift()
            }
            
            EventBus.$emit('render-foreground')
        },
    
        mouseUpActions(){
            if(this.isDrawingLine){
                this.drawLine(...this.mouseStart, ...this.mouseEnd, this.primaryColor)
                this.drawLine(...this.mirror(this.mouseStart), ...this.mirror(this.mouseEnd), this.primaryColor)
                EventBus.$emit('render-foreground')
                this.isDrawingLine = this.shiftKey
            }

            this.drawBuffer = []

            EventBus.$emit('redraw-background')
            EventBus.$emit('render-preview')
        },

        onExit(){
            this.drawBuffer = []
        },

        mirror(pos){
            if(this.currentTool === 'mirrorx'){
                return [this.docSize.width - pos[0], pos[1]]
            } else {
                return [pos[0], this.docSize.height - pos[1]]
            }
        }
    }
}
</script>

