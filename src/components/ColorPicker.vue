<template>
    <div id="color-picker" :style="[opened ? { 'display': 'block' } : { 'display': 'none' }, { 'top': posY, 'left': posX }]">
        <div id="color-picker-header" ref="colorPickerHeader"><span>{{ `Color Picker (${capitalizeFirstLetter(selectedColor)})` }}</span></div>
        <div id="color-picker-body">
            <div id="color-picker-settings">
                <ColorSlider/>
                <canvas id="color-canvas" ref="colorPickerCanvas" width="256" height="256"></canvas>

                <HueSlider/>
                <div id="color-values">
                    <div id="new-color">
                        <span>NEW</span>
                        <div id="new-color-rect" :style="{ 'background-color': rgba }"><div></div></div>
                        <div id="new-alpha-rect"></div>
                    </div>
                    <div id="old-color">
                        <div id="old-color-rect" :style="{ 'background-color': `rgba(${this.oldColor.join()})` }"></div>
                        <div id="old-alpha-rect"></div>
                        <span>OLD</span>
                    </div>

                    <InputSlider
                        v-for="input in inputSliders"
                        :key="input.key"
                        :id="input.id"
                        :title="input.title"
                        :startVal="input.startVal"
                        :maxValue="input.maxValue"
                        :affectedValPath="input.affectedValPath"
                    />

                    <Input 
                        v-for="input in inputs"
                        :key="input.key"
                        :id="input.id"
                        :type="input.type"
                        :title="input.title"
                        :startVal="input.startVal"
                        :maxLen="input.maxLen"
                        :affectedValPath="input.affectedValPath"
                    />
                </div>
            </div>
            <div id="color-picker-buttons">
                <button class="window-button" id="color-picker-ok" @click="confirm()">OK</button>
                <button class="window-button" id="color-picker-cancel" @click="cancel()">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
import HueSlider from './HueSlider'
import InputSlider from './InputSlider'
import ColorSlider from './ColorSlider'
import Input from './Input'
import EventBus from './EventBus'

export default {
    name: 'ColorPicker',

    beforeMount(){
        EventBus.$on('update-red', value => {
            this.$store.state.color.rgb[0] = value
            this.updateFromRGB()
        })

        EventBus.$on('update-green', value => {
            this.$store.state.color.rgb[1]  = value
            this.updateFromRGB()
        })

        EventBus.$on('update-blue', value => {
            this.$store.state.color.rgb[2] = value
            this.updateFromRGB()
        })

        EventBus.$on('update-hue', value => {
            this.$store.state.color.hue = value
            this.updateFromHue()
        })

        EventBus.$on('update-saturation', saturation => {
            this.$store.state.color.saturation = saturation
            this.updateFromSL()
        })

        EventBus.$on('update-lightness', lightness => {
            this.$store.state.color.lightness = lightness
            this.updateFromSL()
        })

        EventBus.$on('update-SL', (saturation, lightness) => {
            this.$store.state.color.saturation = saturation
            this.$store.state.color.lightness = lightness
            this.updateFromSL()
        })

        EventBus.$on('update-alpha', value => {
            this.$store.state.color.alpha = value
            this.updateSelectedColor()
        })

        EventBus.$on('update-hex', value => {
            this.$store.state.color.hex = value
            this.updateFromHex()
        })
    },

    mounted(){
        this.canvasCtx = this.$refs.colorPickerCanvas.getContext('2d')
        this.drawColorSquare()

        this.$refs.colorPickerHeader.addEventListener('mousedown', () => {
            this.mouseOffsetX = event.clientX - this.$refs.colorPickerHeader.getBoundingClientRect().x
            this.mouseOffsetY = event.clientY - this.$refs.colorPickerHeader.getBoundingClientRect().y

            this.$store.state.activeElement = this.$refs.colorPickerHeader
        })
        this.$refs.colorPickerHeader.mousemoveActions = this.dragWindow

        EventBus.$on('toggle-color-picker', () => {
            this.opened = !this.opened
            this.oldColor = this[this.selectedColor]
        })

        EventBus.$on('open-color-picker', selectedColor => {
            this.opened = true
            this.selectedColor = selectedColor
            this.oldColor = this[selectedColor]
            
            this.updateFromRGB(this.oldColor)
            this.$store.state.color.alpha = this.oldColor[3] * 255
        })

        EventBus.$on('switch-colors', () => {
            var primary = this.$store.state.color.primary
            this.$store.state.color.primary = this.$store.state.color.secondary
            this.$store.state.color.secondary = primary

            this.oldColor = this[this.selectedColor]
            this.updateHSL(this.oldColor)
            this.updateHex(this.oldColor)
            this.updateRGB(this.oldColor)
        })
        
        EventBus.$on('reset-colors', () => {
            this.$store.state.color.primary = [0, 0, 0, 1]
            this.$store.state.color.secondary = [255, 255, 255, 1]

            this.oldColor = this[this.selectedColor]
            this.updateHSL(this.oldColor)
            this.updateHex(this.oldColor)
            this.updateRGB(this.oldColor)
        })

        this.mounted = true
    },

    computed:{
        primary(){ return this.$store.state.color.primary },
        secondary(){ return this.$store.state.color.secondary },
        hue(){ return this.$store.state.color.hue },
        saturation(){ return this.$store.state.color.saturation },
        lightness(){ return this.$store.state.color.lightness },
        alpha(){ return this.$store.state.color.alpha },
        rgb(){ return this.$store.state.color.rgb },
        hex(){ return this.$store.state.color.hex },
        rgba(){ return `rgba(${this[this.selectedColor].join()})` },
    },
    
    data(){
        return {
            inputSliders: [
                {key: 0, id: 'hue', title: 'H', startVal: 360, maxValue: 360, 'affectedValPath': 'color.hue'},
                {key: 1, id: 'red', title: 'R', startVal: 0, maxValue: 255, 'affectedValPath': 'color.rgb[0]'},
                {key: 2, id: 'saturation', title: 'S', startVal: 0, maxValue: 100, 'affectedValPath': 'color.saturation'},
                {key: 3, id: 'green', title: 'G', startVal: 0, maxValue: 255, 'affectedValPath': 'color.rgb[1]'},
                {key: 4, id: 'lightness', title: 'L', startVal: 0, maxValue: 100, 'affectedValPath': 'color.lightness'},
                {key: 5, id: 'blue', title: 'B', startVal: 0, maxValue: 255, 'affectedValPath': 'color.rgb[2]'},
                {key: 6, id: 'alpha', title: 'A', startVal: 255, maxValue: 255, 'affectedValPath': 'color.alpha'}
            ],

            inputs: [
                {key: 7, id: 'hex-input', title: 'Hex', startVal: '000000', maxLen: 6, type: 'hex', affectedValPath: 'color.hex'}
            ],

            mouseOffsetX: null,
            mouseOffsetY: null,
            posX: 200 + 'px',
            posY: 200 + 'px',

            opened: false,
            selectedColor: 'primary',
            oldColor: [0,0,0,1],

            //Prevent code that shouldn't run before mounted from running
            mounted: false
        }
    },
    
    methods:{
        dragWindow(){
            this.posX = event.clientX - this.mouseOffsetX + 'px'
            this.posY = event.clientY - this.mouseOffsetY + 'px'
        },

        confirm(){
            this.opened = false
        },

        cancel(){
            this.$store.state.color[this.selectedColor] = this.oldColor
            this.opened = false
        },

        drawColorSquare(){
            for(var row=0; row<256; row++){
                var grad = this.canvasCtx.createLinearGradient(1, 1, 256,1);
                grad.addColorStop(0, `hsl(${this.hue},0%,${100-row*100/256}%)`);
                grad.addColorStop(1, `hsl(${this.hue},100%,${100-row*100/256}%)`);
                this.canvasCtx.fillStyle = grad;
                this.canvasCtx.fillRect(0, row, 256, 1);
            }
        },

        updateFromHue(){
            if(this.mounted){ this.drawColorSquare() }
            var newRGB = this.HSLtoRGB(this.hue, this.saturation, this.lightness)
            this.updateRGB(newRGB)
            this.updateHex(newRGB)
            this.updateSelectedColor()
        },

        updateFromRGB(rgb){
            rgb = rgb ? rgb : this.rgb
            this.updateHSL(rgb)
            this.updateHex(rgb)
            this.updateSelectedColor()
            if(this.mounted){ this.drawColorSquare() }
        },

        updateFromSL(){
            var newRGB = this.HSLtoRGB(this.hue, this.saturation, this.lightness);
            this.updateRGB(newRGB)
            this.updateHex(newRGB)
            this.updateSelectedColor()
        },

        updateFromHex(){
            var newRGB = this.HEXtoRGB(this.hex)
            this.updateHSL(newRGB)
            this.updateRGB(newRGB)
            this.updateSelectedColor()
            if(this.mounted){ this.drawColorSquare() }
        },

        updateSelectedColor(){
            this.$store.state.color[this.selectedColor] = [...this.rgb, this.alpha/255]
        },

        updateHSL(rgb){
            var HSL = this.RGBtoHSL(rgb)
            this.$store.state.color.hue = Math.round(HSL[0]);
            this.$store.state.color.saturation = Math.round(HSL[1]);
            this.$store.state.color.lightness = Math.round(HSL[2]);
        },

        updateHex(rgb){
            this.$store.state.color.hex = this.RGBtoHEX(rgb)
        },

        updateRGB(rgb){
            this.$store.state.color.rgb = rgb
        }
    },

    components:{
        HueSlider,
        InputSlider,
        ColorSlider,
        Input
    }
}
</script>


<style>
#color-picker{
    position: absolute;
    background-color: rgb(59, 59, 65);
    width: 550px;
    border-radius: 5px;
    box-shadow: 0px 0px 11px 2px rgba(0,0,0,0.60);
    z-index: 50;
}

#color-picker-header{
    background-color: rgb(154, 154, 154);
    text-align: center;
    font-size: 10pt;
    line-height: 22px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-top: 1px solid rgb(202, 202, 202);
    box-shadow: 0px 3px 5px -2px rgba(0,0,0,0.75);
}

#color-picker-body{
    border-top: 1px solid rgb(23, 23, 23);
    height: 318px;
}

#color-picker-settings{
    display: grid;
    grid-template-columns: 256px 40px auto;

    width: 95%;
    height: 255px;
    margin: 15px auto 0 auto;

    position: relative;
}

#color-picker-settings .input-slider-wrapper{
    margin-right: 20px;
    float: right;
}

#color-canvas{
    grid-column: 1;
    top: 0;
    width: 255px;
    height: 255px;
}

#color-values{
    display: grid;
    grid-template-columns: 115px 115px;
    grid-template-rows: 70px 38px 38px 38px 38px 38px;
    color: white;
    align-items: center;
}

#hex-input{
    grid-column: 1;
    grid-area: 6 / 1 / span 1 / span 2;
    align-self: center;
}

#hex-input input{
    width: 75px;
}

#new-color{
    grid-row: 1;
    grid-column: 1;
    color: white;
    position: relative;
}

#new-color span{
    float: left;
}

#new-color-rect{
    position: absolute;
    width: 63px;
    height: 63px;
    right: 0;
    top: -22px;
    z-index: 10;
}

#old-color{
    grid-row: 1;
    grid-column: 2;
    color: white;
    position: relative;
}

#old-color span{
    float: right;
}

#old-color-rect{
    position: absolute;
    width: 63px;
    height: 63px;
    left: 0px;
    top: -22px;
    z-index: 10;
}

/* Alpha rects */
#new-alpha-rect, #old-alpha-rect{
    position: absolute;
    width: 63px;
    height: 63px;
    background-image: url('../assets/alpha-triangle.png');
    background-size: 63px 63px;
}

#new-alpha-rect{
    right: 0;
    top: -22px;
}

#old-alpha-rect{
    left: 0;
    top: -22px;
}

#color-picker-buttons{
    grid-row: 2;
    width: 175px;
    height: 28px;
    margin: 12px auto 0 auto;
}

#color-picker-buttons button{
    color: white;
    border-color: white;
}

#color-picker-cancel{
    float: right;
}

#color-picker-buttons button:active{
    background-color: rgb(217, 217, 217);
    color: black;
}
</style>

