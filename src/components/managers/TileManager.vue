<template><div></div></template>

<script>
import EventBus from '../EventBus'

export default {
    doneSettingUp: false,

    computed:{
        currentTile(){ return this.$store.getters.currentTile },

        tiles:{
            get(){ return this.$store.state.tiles },
            set(val){ this.$store.state.tiles = val }
        }
    },

    mounted(){
        EventBus.$on('new-document', () => {
            this.tiles = []
            this.addTile(this.tiles.length)
        })

        EventBus.$on('add-tile', () => {
            this.addTile(this.tiles.length)
        })

        EventBus.$on('swap-tiles', (tileA, tileB) => {
            this.swapTiles(tileA, tileB)
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
                newTile.ctx = document.querySelector('#tile-'+id).getContext('2d')
            })
        },

        swapTiles(tileA, tileB){
            this.$set(this.tiles[tileA], 'id', tileB)
            this.$set(this.tiles[tileB], 'id', tileA)
            this.tiles.swapItems(tileA, tileB)
        }
    }
}
</script>

