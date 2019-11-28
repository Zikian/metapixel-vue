<template><div></div></template>

<script>
import EventBus from '../EventBus'

export default {
    computed:{
        currentLayer(){ return this.layers[this.selectedLayer] },
        docSize(){ return this.$store.getters.docSize },
        selection(){ return this.$store.state.selection },
        xTiles(){ return this.$store.getters.xTiles },
        yTiles(){ return this.$store.getters.yTiles },

        selectedLayer:{ 
            get(){ return this.$store.state.selectedLayer },
            set(id){ this.$store.state.selectedLayer = id }
        },

        layers:{ 
            get(){ return this.$store.getters.document.layers },
            set(val){ this.$store.state.document.layers = val }
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
            this.deleteLayer(this.selectedLayer)
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

        EventBus.$on('clear-drawing', () => {
            this.layers = []
            this.addLayer(0, 'Layer 0')
        })

        EventBus.$on('new-document', () => {
            this.layers = []
            this.addLayer(0, 'Layer 0')
        })

        EventBus.$on('resize-layers', (anchor, width, height) => {
            this.resizeLayers(anchor, width, height)
        })
    },

    methods:{
        resizeLayers(anchor, width, height) {
            let currentWidth = this.docSize.width
            let currentHeight = this.docSize.height
            let newPos = this.calculateAnchoredPosition(anchor, currentWidth, currentWidth, width, height)

            this.layers.forEach(layer => {
                let layerData = layer.ctx.getImageData(0, 0, currentWidth, currentHeight)
                
                layer.canvas.width = width
                layer.canvas.height = height
                layer.ctx = layer.canvas.getContext('2d')
                layer.ctx.putImageData(layerData, newPos.x, newPos.y)
            })
        },

        toggleVisibility(id){
            this.layers[id].visible = !this.layers[id].visible
            EventBus.$emit('redraw-layers')
            EventBus.$emit('render-canvas')
            EventBus.$emit('render-preview')
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
                canvas: document.createElement('canvas'),
                tilemap: Array(this.xTiles)
            }

            newLayer.ctx = newLayer.canvas.getContext('2d')
            newLayer.canvas.width = this.docSize.width
            newLayer.canvas.height = this.docSize.height

            // initialize tilemap
            for(var x = 0; x < this.yTiles; x++){
                newLayer.tilemap[x] = Array(this.yTiles)
            }

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
            EventBus.$emit('render-preview')
        },

        swapLayers(idA, idB){
            if(idB < 0  || idB === this.layers.length){ return }

            this.layers.swapItems(idA, idB)
            this.updateLayerIndices()
            this.selectLayer(idB)

            EventBus.$emit('render-canvas')
            EventBus.$emit('render-preview')
        },

        updateLayerIndices(){
            this.layers.forEach((layer, i) => { layer.id = i })
        },

        mergeLayerDown(id){
            if(id == this.layers.length - 1){ return }

            this.layers[id+1].ctx.drawImage(this.layers[id].canvas, 0, 0)
            this.layers.splice(id, 1)
            this.updateLayerIndices()
            this.selectLayer(id)
        }
    }
}
</script>

