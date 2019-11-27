<template>
    <div id="layer-settings" class="window" v-if="isOpen">
        <div class="window-header">
            <span>Layer Settings</span>
            <i class="fas fa-times" @click="isOpen = false"></i>
        </div>
        <div class="window-body">
            <form>
                <input 
                    type="text" 
                    class="window-input" 
                    id="layer-name-input"
                    ref="layerNameInput"
                    maxlength="50"
                    :value="startName"
                >
                <InputSlider
                    :id="'layer-opacity'"
                    :title="'Opacity'"
                    :startVal="startOpacity"
                    :maxValue="255"
                    :affectedValPath="`layers[${targetLayer}].opacity`"
                />
            </form>
        </div>
        <div class="window-buttons">
            <button class="window-button" @click="confirm()">OK</button>
            <button class="window-button" @click="cancel()">Cancel</button>
        </div>
        <div class="window-footer"></div>
    </div>
</template>

<script>
import InputSlider from './InputSlider'
import EventBus from './EventBus'

export default {
    name: 'LayerSettingsWindow',

    computed:{
        layers(){ return this.$store.state.layers }
    },

    data(){
        return {
            targetLayer: 0,
            startName: null,
            startOpacity: null,
            isOpen: false
        }
    },

    mounted(){
        EventBus.$on('open-layer-settings', (id, name, opacity) => {
            if(this.isOpen) { return }
            this.targetLayer = id
            this.startName = name
            this.startOpacity = opacity
            this.isOpen = true
        })

        EventBus.$on(`update-layer-opacity`, opacity => {
            this.layers[this.targetLayer].opacity = opacity
            EventBus.$emit('redraw-layers')
            EventBus.$emit('render-canvas')
            EventBus.$emit('render-preview')
        })
    },

    methods:{
        confirm(){
            var name = this.$refs.layerNameInput.value
            if(name.length > 0){
                this.layers[this.targetLayer].name = name
            }
            this.isOpen = false
        },

        cancel(){
            this.layers[this.targetLayer].opacity = this.startOpacity
            this.isOpen = false
            
            EventBus.$emit('redraw-layers')
            EventBus.$emit('render-canvas')
            EventBus.$emit('render-preview')
        }
    },

    components:{
        InputSlider
    },
}
</script>

<style>
#layer-settings{
    width: 200px;
    left: 808px;
    top: 241px;
}

#layer-settings .window-body{
    height: 62px;
}

#layer-settings .window-buttons{
    text-align: center;
    height: 33px;
}

#layer-name-input{
    width: 100%;
    margin-bottom: 10px
}

#layer-opacity{
    margin-left: 10px
}

#layer-opacity span{
    color: black;
    font-size: 9pt;
}
</style>


