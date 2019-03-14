<template>
    <div id="animator">
        <div class="horizontal-resizer" id="animator-resizer">
            <i class="fas fa-bars"></i>
        </div>
        <div id="animator-body">
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

export default {
    name: 'Animator',
    components: {
        AnimationsWindow,
        FrameEditor,
        AnimationPreview
    }
}
</script>

<style>
#animator{
    display: grid;
    grid-template-rows: 18px auto;
    grid-row: 2;
    height: auto;
    border-left: 1px solid black;
}

#animator-body{
    height: 225px;
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


