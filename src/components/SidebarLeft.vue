<template>
    <div id="sidebar-left">
        <ColorPreview/>
        <Toolbox/>
    </div>
</template>

<script>
import ColorPreview from "./ColorPreview"
import Toolbox from "./Toolbox"

export default {
    name: 'SidebarLeft',
    data(){
        return {

        }
    },
    components: {
        ColorPreview,
        Toolbox
    }
}
</script>

<style>
#sidebar-left{
    grid-column: 1;
    height: 100%;
}
</style>

