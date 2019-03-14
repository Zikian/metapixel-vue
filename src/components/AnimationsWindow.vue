<template>
    <div id="animations" class="animator-window">
        <div class="animator-window-header"><span>Animations</span></div>
        <div class="animator-window-body" :style="{ 'width': width }"></div>
        <div class="animator-window-footer">
                <div class="button" id="add-anim"><i class="fas fa-plus"></i></div>
                <div class="button" id="delete-anim"><i class="far fa-trash-alt"></i></div>
        </div>
        <div class="vertical-resizer" 
             @mousedown="resizing = true"
             @mouseup="resizing= false">
            <i class="fas fa-bars"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AnimationsWindow',
    data(){
        return{
            width: '250px',
            resizing: false
        }
    },
    watch:{
        resizing(){
            if(this.resizing){
                this.width = event.clientX + 'px'
            }
        }
    }
}
</script>

<style scoped>
#animations{
    grid-template-columns: auto 7px;
}

#animations .vertical-resizer{
    grid-column: 2;
    grid-row-start: 1;
    grid-row-end: 4;
}

#animations .vertical-resizer i{
    font-size: 7pt;
}
</style>


