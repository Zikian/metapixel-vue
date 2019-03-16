<template>
    <div id="layers-window" class="sidebar-window">
        <div class="sidebar-window-header">
            <span class="sidebar-window-title">Layers</span>
            <div class="button fas fa-plus" id="add-layer" @click="emitEvent('add-layer')"></div>
            <div class="button far fa-trash-alt " id="delete-layer" @click="emitEvent('delete-layer', selectedLayer)"></div>
            <div class="button" id="merge-layer-down" @click="emitEvent('merge-layer-down', selectedLayer)"></div>
            <div class="button fas fa-arrow-up " id="move-layer-up" @click="emitEvent('move-layer-up', selectedLayer)"></div>
            <div class="button fas fa-arrow-down " id="move-layer-down" @click="emitEvent('move-layer-down', selectedLayer)"></div>
        </div>
        <div class="sidebar-window-body" :style="{ height: windowHeight + 'px' }" ref="windowBody">
            <ul>
                <li 
                    v-for="layer in layers" 
                    :key="layer.id" 
                    :class="[(layer.id == selectedLayer ? 'selected' : '') + ' layer']"
                    @click="emitEvent('select-layer', layer.id)"
                >
                    <span>{{ layer.name }}</span>
                    <i 
                        :class="[(layer.visible ? 'fas fa-circle' : 'far fa-circle') + ' layer-visible-button']"
                        @click.stop="emitEvent('toggle-layer-visibility', layer.id)"
                    >
                    </i>
                    <div class="button" @click.stop="emitEvent('open-layer-settings', layer.id, layer.name, layer.opacity)"><i class="fas fa-cog"></i></div>
                </li>
            </ul>
        </div>
        <div class="vertical-resizer" ref="resizer">
            <i class="fas fa-bars"></i>
        </div>

        <LayerManager/>
    </div>
</template>

<script>
import LayerManager from './managers/LayerManager'
import EventBus from './EventBus'

export default {
    name: 'LayersWindow',

    computed:{
        selectedLayer(){ return this.$store.state.selectedLayer },
        layers(){ return this.$store.state.layers },
    },

    components:{
        LayerManager
    },

    data(){
        return {
            mouseOffset: 0,
            windowHeight: 150
        }
    },

    mounted(){
        this.$refs.resizer.onmousedown = () => {
            this.mouseOffset = event.clientY - this.$refs.resizer.offsetTop
            this.$store.state.activeElement = this.$refs.resizer
        }

        this.$refs.resizer.mousemoveActions = () => {
            var windowHeight = event.clientY - this.$refs.windowBody.offsetTop - this.mouseOffset
            this.windowHeight = windowHeight < 0 ? 0 : windowHeight
        }
    },

    methods:{
        emitEvent(event, ...args){
            EventBus.$emit(event, ...args)
        }
    }
}
</script>

<style>
#layers-window .button{
    position: absolute;
}

#layers-window .sidebar-window-body{
    overflow-y: scroll;
}

#add-layer{
    left: 0
}

#delete-layer{
    left: 27px;
}

#merge-layer-down{
    background-image: url('../assets/merge-down.svg');
    background-size: 20px 20px;
    background-position: 4px 4px;
    background-repeat: no-repeat;
    right: 54px;
    top: 0;
}

#move-layer-up{
    right: 27px;
}

#move-layer-down{
    right: 0;
}

.layer{
    position: relative;
    width: 100%;
    height: 27px;
    background-color: rgb(59, 59, 65);
    text-align: center;
    color: white;
}

.selected{
    background-color: rgb(38, 38, 43);
}

.layer .button{
    top: 0;
    right: 0;
}

.layer span{
    line-height: 27px;
    font-size: 9pt;
}

.layer .layer-visible-button{
    position: absolute;
    left: 0;
    line-height: 27px;
    padding: 0 8px 0 8px;
    font-size: 11pt;
}

</style>


