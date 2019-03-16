<template>
    <div id="anim-preview" class="animator-window">
        <div class="animator-window-header"><span>Animation Preview</span></div>
        <div class="animator-window-body"></div>
        <div class="animator-window-footer">
            <div class="button" id="anim-preview-play"><i class="fas fa-caret-right"></i></div>
            <div class="button" id="anim-preview-repeat"><i class="fas fa-redo"></i></div>
            <div class="button" id="anim-preview-zoom-in"><i class="fas fa-search-plus"></i></div>
            <div class="button" id="anim-preview-zoom-out"><i class="fas fa-search-minus"></i></div>
        </div>
        <div class="horizontal-resizer">
            <i class="fas fa-bars"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AmimationPreview'
}
</script>

<style scoped>
#anim-preview{
    grid-template-columns: 7px auto;
}

#anim-preview .animator-window-body{
    width: 250px;
}

#anim-preview .horizontal-resizer{
    grid-column: 1;
    grid-row-start: 1;
    grid-row-end: 4;
}

#anim-preview .horizontal-resizer i{
    font-size: 7pt;
}

#anim-preview button{
    position: absolute;
}

#anim-preview-play{
    left: 0;
    font-size: 21pt;
}

#anim-preview-repeat{
    left: 27px;
}

#anim-preview-zoom-in{
    left: 54px; 
}

#anim-preview-zoom-out{
    left: 81px;
}
</style>


