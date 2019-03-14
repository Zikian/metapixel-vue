<template>
    <div></div>
</template>

<script>
import EventBus from '../EventBus'

export default {
    name: 'DrawTool',

    computed:{
        primaryColor(){ return this.$store.state.color.primary },
        pixelPos(){ return this.$store.state.pixelPos },
        hiddenSize(){ return this.$store.state.hiddenSize },
        
        drawBuffer:{ 
            get(){ return this.$store.state.drawBuffer },
            set(val){ this.$store.state.drawBuffer = val }
        }
    },

    mounted(){
        EventBus.$on('draw-tool-mouseleft', () => {
            this.mouseLeftActions()
        })

        EventBus.$on('draw-tool-mousedrag', () => {
            this.mouseDragActions()
        })

        EventBus.$on('draw-tool-mouseup', () => {
            this.mouseUpActions()
        })

        EventBus.$on('draw-tool-exit', () => {
            this.onExit()   
        })
    },

    methods: {
        mouseLeftActions(){
            this.drawBuffer.push(this.pixelPos)
            this.drawPixel(this.primaryColor, this.pixelPos.x, this.pixelPos.y);

            EventBus.$emit('render-foreground')
        },
    
        mouseDragActions(){
            this.drawBuffer.push(this.pixelPos)
            if (this.drawBuffer.length == 2){
                this.drawLine(this.primaryColor, this.drawBuffer[0].x, this.drawBuffer[0].y, this.drawBuffer[1].x, this.drawBuffer[1].y)
                this.drawBuffer.shift()
            }
            EventBus.$emit('render-foreground')
        },
    
        mouseUpActions(){
            this.drawBuffer = []

            EventBus.$emit('redraw-background')
        },

        onExit(){
            this.drawBuffer = []
        }
    }
}
</script>

