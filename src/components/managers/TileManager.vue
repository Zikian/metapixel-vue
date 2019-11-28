<template><div></div></template>

<script>
import EventBus from '../EventBus'

export default {
    doneSettingUp: false,

    computed:{
        currentTile(){ return this.$store.getters.currentTile },
        docSize() { return this.$store.getters.docSize },
        tileWidth() { return this.$store.getters.tileWidth },
        tileHeight() { return this.$store.getters.tileHeight },
        document() { return this.$store.getters.document },

        tiles:{
            get(){ return this.$store.getters.document.tiles },
            set(val){ this.$store.state.document.tiles = val }
        }
    },

    mounted(){
        EventBus.$on('new-document', () => {
            this.tiles = []
            this.addTile(this.tiles.length)

            this.$nextTick(() => {
                this.resizeTiles(0, this.tileWidth, this.tileHeight)
            })
        })

        EventBus.$on('add-tile', () => {
            this.addTile(this.tiles.length)
        })

        EventBus.$on('swap-tiles', (tileA, tileB) => {
            this.swapTiles(tileA, tileB)
        })

        EventBus.$on('resize-tiles', (anchor, width, height) => {
            this.resizeTiles(anchor, width, height)
        })
    },

    methods:{
        addTile(id){
            var newTile = {
                id: id,
                paintedPositions: [],
                ctx: null
            }

            this.tiles.push(newTile)

            //Wait for a new tile element to be added to the dom
            this.$nextTick(() => {
                
                newTile.ctx = this.getTileCanvas(id).getContext('2d')
            })
        },

        getTileCanvas(id) {
            return document.querySelector('#tile-'+id)
        },

        swapTiles(tileA, tileB){
            this.$set(this.tiles[tileA], 'id', tileB)
            this.$set(this.tiles[tileB], 'id', tileA)
            this.tiles.swapItems(tileA, tileB)
        },

        resizeTiles(anchor, width, height) {
            let currentWidth = this.docSize.width
            let currentHeight = this.docSize.height
            let newPos = this.calculateAnchoredPosition(anchor, currentWidth, currentWidth, width, height)

            this.tiles.forEach(tile => {
                let tileData = tile.ctx.getImageData(0, 0, currentWidth, currentHeight)
                let canvas = this.getTileCanvas(tile.id)

                canvas.width = width
                canvas.height = height
                tile.ctx = canvas.getContext('2d')
                tile.ctx.putImageData(tileData, newPos.x, newPos.y)
            })
            
            this.document.tileWidth = width;
            this.document.tileHeight = height;
        }
    }
}
</script>

