<template>
    <div id="animator">
        <div class="vertical-resizer" id="animator-resizer" ref="resizer">
            <i class="fas fa-bars"></i>
        </div>
        <div id="animator-body" :style="{ 'height': animatorHeight + 'px' }" ref="animatorBody">
            <AnimationsWindow/>
            <FrameEditor/>
            <AnimationPreview/>
        </div>
    </div>
</template>

<script>
import AnimationsWindow from './AnimationsWindow'
import FrameEditor from './FrameEditor'
import AnimationPreview from './AnimationPreview'

import EventBus from './EventBus'

export default {
    name: 'Animator',
    components: {
        AnimationsWindow,
        FrameEditor,
        AnimationPreview
    },

    computed:{
        maxAnimatorHeight(){ return this.$store.state.constants.maxAnimatorHeight }
    },

    data(){
        return {
            mouseOffset: 0,
            animatorHeight: 225,
        }
    },

    mounted(){
        this.$refs.resizer.onmousedown = () => {
            this.mouseOffset = this.$refs.animatorBody.offsetTop - event.clientY
            this.$store.state.activeElement = this.$refs.resizer
        }

        this.$refs.resizer.mousemoveActions = () => {
            var animatorHeight = document.body.offsetHeight - event.clientY - this.mouseOffset
            this.animatorHeight = this.clamp(animatorHeight, 0, this.maxAnimatorHeight)

            EventBus.$emit('update-visible-rect')
        }
    }
}
</script>

<style>
#animator{
    display: grid;
    grid-template-rows: 18px auto;
    grid-row: 2;
    border-left: 1px solid black;
}

#animator-body{
    display: grid;
    grid-template-columns: auto 1fr auto;
}

#animator-resizer{
    height: 100%
}

#animator-resizer i{
    left: 49.5%;
    line-height: 20px;
}

.animator-window{
    display: grid;
    grid-template-rows: 18px 1fr 27px;
}

.animator-window-header{
    text-align: center;
}

.animator-window-header span{
    color: white;
    font-size: 9pt;
    line-height: 20px;
}

.animator-window-body{
    background-color:rgb(85, 85, 92);
}

.animator-window-footer .button{
    float:left
}
</style>


