<template><div></div></template>

<script>
import EventBus from '../EventBus'

export default {
    computed:{
        layers(){ return this.$store.state.layers },
        docWidth(){ return this.$store.getters.currentDocument.width },
        docHeight(){ return this.$store.getters.currentDocument.height },

        selectedLayer:{ 
            get(){ return this.$store.state.selectedLayer },
            set(id){ this.$store.state.selectedLayer = id }
        }
    },

    mounted(){
        EventBus.$on('select-layer', id => {
            this.selectLayer(id)
        })

        EventBus.$on('add-layer', () => {
            this.addLayer(0, `Layer ${this.layers.length}`)
        })

        EventBus.$on('delete-layer', () => {
            this.deleteLayer(this.selectLayer)
        })

        EventBus.$on('toggle-layer-visibility', id => {
            this.toggleVisibility(id)
        })

        EventBus.$on('move-layer-down', id => {
            this.swapLayers(id, ++id)
        })

        EventBus.$on('move-layer-up', id => {
            this.swapLayers(id, --id)
        })

        EventBus.$on('merge-layer-down', id => {
            this.mergeLayerDown(id)
        })

        this.addLayer(0, 'Layer 0')
    },

    methods:{
        toggleVisibility(id){
            this.layers[id].visible = !this.layers[id].visible
            EventBus.$emit('redraw-layers')
            EventBus.$emit('render-canvas')
        },

        selectLayer(id){
            this.selectedLayer = id
            EventBus.$emit('redraw-layers')
        },

        addLayer(id, name, opacity = 255, visible = true){
            var newLayer = { 
                id: id, 
                name: `Layer ${this.layers.length}`,
                opacity: opacity,
                visible: visible,
                canvas: document.createElement('canvas')
            }

            newLayer.ctx = newLayer.canvas.getContext('2d')
            newLayer.canvas.width = this.docWidth
            newLayer.canvas.height = this.docHeight
            
            this.layers.unshift(newLayer)
            this.updateLayerIndices()
            this.selectLayer(0)
        },

        deleteLayer(id){
            if(this.layers.length == 1) { return }

            this.layers.splice(id, 1)
            this.updateLayerIndices()
            this.selectLayer(0)

            EventBus.$emit('render-canvas')
        },

        swapLayers(idA, idB){
            if(idB < 0  || idB === this.layers.length){ return }

            this.layers.swapItems(idA, idB)
            this.updateLayerIndices()
            this.selectLayer(idB)

            EventBus.$emit('render-canvas')
        },

        updateLayerIndices(){
            this.layers.forEach((layer, i) => { layer.id = i })
        },

        mergeLayerDown(id){
            if(id == this.layers.length){ return }

            this.layers[id+1].ctx.drawImage(this.layers[id].canvas, 0, 0)
            this.layers.splice(id, 1)
            this.updateLayerIndices()
            this.selectLayer(id)
        }
    }
}
</script>

