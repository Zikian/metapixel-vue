<template>
    <div id="palette-window" class="sidebar-window">
        <div class="sidebar-window-header">
            <span class="sidebar-window-title">Palette</span>
            <div class="button fas fa-plus" id="add-palette-color"></div>
            <div class="button far fa-trash-alt " id="delete-palette-color"></div>
            <div class="button fas fa-cog" id="palette-settings"></div>
        </div>
        <div class="sidebar-window-body"></div>
        <div class="horizontal-resizer">
            <i class="fas fa-bars"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PaletteWindow',
    data(){
        return {
            zoom: 1
        }
    }
}
</script>

<style>
#palette-window .button{
    position: absolute;
}

#add-palette-color{
    left: 0
}

#delete-palette-color{
    left: 27px;
}

#palette-settings{
    right:0;
}
</style>


