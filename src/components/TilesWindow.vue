<template>
    <div id="tiles-window" class="sidebar-window" :key="componentKey">
        <div class="sidebar-window-header">
            <span class="sidebar-window-title">Tiles</span>
            <div class="button fas fa-plus" id="add-tile" @click="emitEvent('add-tile')"></div>
            <div class="button far fa-trash-alt " id="delete-tile" @click="emitEvent('delete-tile')"></div>
            <div class="button far fa-clone" id="duplicate-tile" @click="emitEvent('duplicate-tile')"></div>
            <div class="button fas fa-search-minus" id="tiles-zoom-in" @click="emitEvent('tiles-zoom-in')"></div>
            <div class="button fas fa-search-plus" id="tiles-zoom-out" @click="emitEvent('tiles-zoom-out')"></div>
            <div class="button fas fa-cog" id="tile-settings" @click="emitEvent('open-tile-settings')"></div>
        </div>

        <div class="sidebar-window-body" :style="{ height: windowHeight + 'px' }" ref="windowBody">
            <canvas 
                v-for="tile in tiles" 
                :key="tile.id"
                :id="'tile-'+tile.id"
                class="tile"
                :style="[
                    selectedTile === tile.id ? {'outline': '2px solid black'} : {},
                    { 
                        'width': tileWidth * tilesetZoom,
                        'height': tileHeight * tilesetZoom,
                        'left': tile.id % tilesetWidth * tileWidth  * tilesetZoom + 'px',
                        'top':  Math.floor(tile.id / tilesetWidth) * tileWidth * tilesetZoom + 'px'
                    },
                ]"
                :width="tileWidth"
                :height="tileHeight"
                @click="selectTile(tile.id)"
                @mouseenter="targetTileID = tile.id"
                @mouseleave="targetTileID = null"
                @mousedown="setTileActiveElement(tile.id)"
            />
        </div>
        
        <div class="vertical-resizer" ref="resizer">
            <i class="fas fa-bars"></i>
        </div>
    </div>
</template>

<script>
import EventBus from './EventBus'

export default {
    name: 'TilesWindow',

    computed:{
        tiles(){ return this.$store.getters.document.tiles },
        totalTiles(){ return this.tiles.length },
        tileWidth(){ return this.$store.getters.document.tileWidth },
        tileHeight(){ return this.$store.getters.document.tileHeight } ,
        tilesetWidth(){ return this.$store.getters.document.tilesetWidth },

        selectedTile:{
            get(){ return this.$store.getters.document.selectedTile },
            set(val){ this.$store.state.document.selectedTile = val },
        },

        activeElement:{
            get(){ return this.$store.state.elems.activeElement },
            set(val){ this.$store.state.elems.activeElement = val }
        }
    },

    watch:{

    },

    data(){
        return {
            tilesetZoom: 1,
            mouseOffsetY: 0,
            mouseOffsetX: 0,
            windowHeight: 150,
            targetTileID: null,
            movingTileID: null,
            componentKey: 0,
        }
    },

    mounted(){
        this.$refs.resizer.onmousedown = () => {
            this.mouseOffsetY = event.clientY - this.$refs.resizer.offsetTop
            this.activeElement = this.$refs.resizer
        }

        this.$refs.resizer.mousemoveActions = () => {
            var windowHeight = event.clientY - this.$refs.windowBody.offsetTop - this.mouseOffsetY
            this.windowHeight = windowHeight < 0 ? 0 : windowHeight
        }

        EventBus.$on('move-tile', () => {
            this.activeElement.style.boxShadow = "rgba(0, 0, 0, 0.75) 0px 0px 14px 2px"
            this.activeElement.style.pointerEvents = "none"
            this.activeElement.style.zIndex = 10
            this.activeElement.style.left = event.clientX - this.$refs.windowBody.getBoundingClientRect().x - this.mouseOffsetX + "px";
            this.activeElement.style.top = event.clientY - this.$refs.windowBody.getBoundingClientRect().y - this.mouseOffsetY + "px";
        })

        EventBus.$on('release-tile', () => {
            if(this.movingTileID == this.targetTileID) return

            this.activeElement.style.boxShadow = "none"
            this.activeElement.style.pointerEvents = "all"
            this.activeElement.style.zIndex = 1
            
            //Reset the position of the tile if no tile was swapped
            if(this.targetTileID == null){
                this.activeElement.style.left = this.movingTileID % this.tilesetWidth * this.tileWidth  * this.tilesetZoom + 'px',
                this.activeElement.style.top =  Math.floor(this.movingTileID / this.tilesetWidth) * this.tileWidth * this.tilesetZoom + 'px'
            } else {
                this.selectedTile = this.targetTileID
                EventBus.$emit('swap-tiles', this.movingTileID, this.targetTileID)
                this.forceRender()
            }

            this.targetTileID = null
            this.movingTileID = null
        })
    },

    beforeDestroy(){
        EventBus.$off('move-tile')
        EventBus.$off('release-tile')
    },

    methods:{
        emitEvent(event){
            EventBus.$emit(event)
        },

        setTileActiveElement(id){
            this.mouseOffsetX = event.clientX - event.target.getBoundingClientRect().x
            this.mouseOffsetY = event.clientY - event.target.getBoundingClientRect().y

            this.activeElement = event.target
            this.movingTileID = id
        },

        selectTile(id){
            EventBus.$emit('switch-tools', 'tile-placer')
            this.selectedTile = id
        },

        forceRender(){
            this.componentKey += 1
        }
    }
}
</script>

<style scoped>
.button{
    position: absolute;
}

.sidebar-window-body{
    position: relative;
    overflow: hidden;
}

#add-tile{
    left: 0
}

#delete-tile{
    left: 27px;
}

#duplicate-tile{
    left: 54px;
}

#tiles-zoom-in{
    right: 54px;
}

#tiles-zoom-out{
    right: 27px;
}

#tile-settings{
    right:0;
}

.tile{
    position: absolute;
    margin: 1px;
    background: repeating-linear-gradient(135deg,#ffffff,#ffffff 3px,#ededed 3px,#ededed 6px);
    outline-offset: -4px;
}

</style>


