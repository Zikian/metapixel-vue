<template>
    <div id="sidebar-right" :style="{ 'width': sidebarWidth + 'px' }">
        <div id="sidebar-windows">
            <PreviewWindow/>
            <LayersWindow/>
            <TilesWindow/>
            <PaletteWindow/>
        </div>
        <div class="horizontal-resizer" id="sidebar-right-resizer" ref="resizer">
            <i class="fas fa-bars"></i>
        </div>
    </div>
</template>

<script>
import PreviewWindow from './PreviewWindow'
import LayersWindow from './LayersWindow'
import TilesWindow from './TilesWindow'
import PaletteWindow from './PaletteWindow'

import EventBus from './EventBus'

export default {
    components: {
        PreviewWindow,
        LayersWindow,
        TilesWindow,
        PaletteWindow
    },

    computed:{
        minSidebarRightWidth(){ return this.$store.state.constants.minSidebarRightWidth },
        maxSidebarRightWidth(){ return this.$store.state.constants.maxSidebarRightWidth }
    },

    data(){
        return {
            mouseOffset: 0,
            sidebarWidth: 279,
        }
    },

    mounted(){
        this.$refs.resizer.onmousedown = () => {
            this.mouseOffset = this.$refs.resizer.offsetLeft - event.clientX
            this.$store.state.elems.activeElement = this.$refs.resizer
        }

        this.$refs.resizer.mousemoveActions = () => {
            var sidebarWidth = document.body.offsetWidth - event.clientX - this.mouseOffset
            this.sidebarWidth = this.clamp(sidebarWidth, this.minSidebarRightWidth, this.maxSidebarRightWidth)

            EventBus.$emit('center-preview-canvas')
            EventBus.$emit('update-visible-rect')
        }
    }
}
</script>

<style>
#sidebar-right{
    display: grid;
    grid-template-columns: 9px 1fr;
    grid-column: 3;
    width: 279px;
    overflow: hidden;
}

#sidebar-windows{
    grid-column: 2;
    height: 100%;
}

.sidebar-window{
    display: grid;
    grid-template-rows: 27px auto;
}

.sidebar-window-header{
    height: 27px;
    text-align: center;
    position: relative;
}

.sidebar-window-title{
    line-height: 27px;
    font-size: 9pt;
    color: white;
}

.sidebar-window-body{
    height: auto;
    background-color: rgb(85, 85, 92);
}

#sidebar-right-resizer{
    grid-column: 1;
    grid-row: 1;
}

#sidebar-right-resizer i{
    font-size: 9pt;
}
</style>


