<template>
    <div id="preview-window" class="sidebar-window">
        <div class="sidebar-window-header">
            <span id="preview-zoom">{{ '(' + zoom + 'x)' }}</span>
            <span class="sidebar-window-title">Preview</span>
            <div class="button fas fa-search-minus" id="preview-zoom-out"></div>
            <div class="button fas fa-search-plus" id="preview-zoom-in"></div>
        </div>
        <div class="sidebar-window-body"></div>
        <div class="horizontal-resizer">
            <i class="fas fa-bars"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PreviewWindow',
    data(){
        return {
            zoom: 1
        }
    }
}
</script>

<style>
#preview-window .button{
    position: absolute;
}

#preview-window .button:hover{
    box-shadow: 0px 1px 0px 0px black inset;
}

#preview-zoom{
    color: white;
    font-size: 9pt;
    line-height: 27px;
    float: left;
    position: absolute;
    left: 7px;
}

#preview-zoom-in{
    right: 27px;
}

#preview-zoom-out{
    right: 0;
}
</style>


