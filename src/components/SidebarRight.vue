<template>
    <div id="sidebar-right">
        <div id="sidebar-windows">
            <PreviewWindow/>
            <LayersWindow/>
            <TilesWindow/>
            <PaletteWindow/>
        </div>
        <div class="vertical-resizer" id="sidebar-right-resizer">
            <i class="fas fa-bars"></i>
        </div>
    </div>
</template>

<script>
import PreviewWindow from './PreviewWindow'
import LayersWindow from './LayersWindow'
import TilesWindow from './TilesWindow'
import PaletteWindow from './PaletteWindow'

export default {
    components: {
        PreviewWindow,
        LayersWindow,
        TilesWindow,
        PaletteWindow
    }
}
</script>

<style>
#sidebar-right{
    display: grid;
    grid-template-columns: 9px 1fr;
    grid-column: 3;
    width: 279px;
}

#sidebar-windows{
    grid-column: 2;
}

.sidebar-window{
    display: grid;
    grid-template-rows: 27px 153px;
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


