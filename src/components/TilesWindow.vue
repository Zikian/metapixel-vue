<template>
    <div id="tiles-window" class="sidebar-window">
        <div class="sidebar-window-header">
            <span class="sidebar-window-title">Tiles</span>
            <div class="button fas fa-plus" id="add-tile"></div>
            <div class="button far fa-trash-alt " id="delete-tile"></div>
            <div class="button far fa-clone" id="duplicate-tile"></div>
            <div class="button fas fa-search-minus" id="tiles-zoom-in"></div>
            <div class="button fas fa-search-plus" id="tiles-zoom-out"></div>
            <div class="button fas fa-cog" id="tile-settings"></div>
        </div>
        <div class="sidebar-window-body"></div>
        <div class="horizontal-resizer">
            <i class="fas fa-bars"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TilesWindow',
    data(){
        return {
            zoom: 1
        }
    }
}
</script>

<style>
#tiles-window .button{
    position: absolute;
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

</style>

