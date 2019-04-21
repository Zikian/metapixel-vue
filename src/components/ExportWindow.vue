<template>
    <div id="export-window" class="window" v-if="isOpen">
        <div class="window-header">
            <span>Export</span>
            <i class="fas fa-times" @click="isOpen = false"></i>
        </div>
        <div class="window-tabs">
            <div @click="docType = 0" :class="docType != 0 && 'tab-hidden'" >Image</div>
            <div @click="docType = 1" :class="docType != 1 && 'tab-hidden'" >Animation</div>
            <div @click="docType = 3" :class="docType != 3 && 'tab-hidden'" >Tileset</div>
        </div>
        <div class="window-body">
            <form v-if="docType == 0" ref="form" id="image-form">
                <div class="settings-wrapper">
                    <span>Pixel Scale:</span>
                    <input 
                        class="window-input" 
                        name="pixel-scale" 
                        type="number" 
                        @input="pixelScale = pixelScale == 0 ? '' : clamp(pixelScale, 1, 16)"
                        v-model="pixelScale"
                    >
                </div>
                <div class="settings-wrapper">
                    <span>File Name:</span>
                    <input 
                        class="window-input" 
                        name="file-name" 
                        @input="fileName = fileName.substring(0, 255)"
                        v-model="fileName"
                    >
                </div>
                <div class="settings-wrapper">
                    <input 
                        type="checkbox" 
                        name="separate-files" 
                        @click="handleCheckbox(0)"
                        v-model="imageCheckboxStates[0]"
                    >
                    <span @click="handleCheckbox(0)">Layers as separate files</span>
                </div>
                <div class="settings-wrapper">
                    <input 
                        type="checkbox" 
                        name="current-layer" 
                        @click="handleCheckbox(1)"
                        v-model="imageCheckboxStates[1]"
                    >
                    <span @click="handleCheckbox(1)">Current layer only</span>
                </div>
            </form>

            <form v-if="docType == 1" ref="form">

            </form>

            <form v-if="docType == 2" ref="form">

            </form>
        </div>
        <div class="window-buttons">
            <button class="window-button" @click="confirm()">OK</button>
            <button class="window-button" @click="isOpen = false">Cancel</button>
        </div>
        <div class="window-footer"></div>
    </div>
</template>

<script>
import EventBus from './EventBus'

export default {
    name: 'ExportWindow',

    computed:{
        currentDocument(){ return this.$store.getters.currentDocument },
        layers(){ return this.$store.state.layers },
        currentLayer(){ return this.$store.getters.currentLayer }
    },

    data(){
        return {
            docType: 0,
            isOpen: false,

            fileName: null,
            pixelScale: 1,
            imageCheckboxStates: [false, false],

            downloadCanvas: document.createElement('canvas'),
            downloadCtx: null
        }
    },

    mounted(){
        this.downloadCtx = this.downloadCanvas.getContext('2d')
        
        EventBus.$on('open-export-window', () => {
            this.isOpen = true
            this.fileName = this.currentDocument.name
        })
    },

    methods: {
        handleCheckbox(choice){
        //Choice is eight 0 or 1, defines which checkbox was clicked

            if(this.docType == 0){
                var checkA = choice == 0 && !this.imageCheckboxStates[0];
                var checkB = choice == 1 && !this.imageCheckboxStates[1];
                this.imageCheckboxStates = [checkA, checkB]
            }
        },

        resetDownloadCanvas(pixelScale){
            this.downloadCanvas.width = this.currentDocument.width * pixelScale
            this.downloadCanvas.height = this.currentDocument.height * pixelScale
            this.downloadCtx.imageSmoothingEnabled = false
            this.downloadCtx.scale(pixelScale, pixelScale)
        },

        confirm(){
            if(this.docType == 0){
                var pixelScale = parseInt(this.$refs.form["pixel-scale"].value)
                pixelScale = pixelScale.length ? pixelScale : 1

                this.fileName = this.fileName.length ? this.fileName : "Untitled"

                this.resetDownloadCanvas(pixelScale)

                if(this.imageCheckboxStates[0]) this.downloadLayers()
                else if(this.imageCheckboxStates[1]) this.downloadCurrentLayer(this.fileName)
                else this.downloadImage(this.fileName)
            }
        },

        downloadLayers(){
            this.layers.forEach(layer => {
                this.downloadCtx.clearRect(0, 0, this.currentDocument.width, this.currentDocument.height);
                
                if(!this.currentDocument.transparency){
                    this.downloadCtx.fillStyle = "white";
                    this.downloadCtx.fillRect(0, 0, this.currentDocument.width, this.currentDocument.height);
                }

                this.downloadCtx.globalAlpha = layer.opacity / 255;
                this.downloadCtx.drawImage(layer.canvas, 0, 0);

                this.download(layer.name, this.downloadCanvas.toDataURL());
            })
        },

        downloadCurrentLayer(fileName){
            if(!this.currentDocument.transparency){
                    this.downloadCtx.fillStyle = "white"
                    this.downloadCtx.fillRect(0, 0, this.currentDocument.width, this.currentDocument.height)
            }

            this.downloadCtx.globalAlpha = this.currentLayer.opacity / 255
            this.downloadCtx.drawImage(this.currentLayer.canvas, 0, 0)

            this.download(this.downloadCanvas.toDataURL(), fileName)
        },

        downloadImage(fileName){
            if(!this.currentDocument.transparency){
                this.downloadCtx.fillStyle = "white"
                this.downloadCtx.fillRect(0, 0, this.currentDocument.width, this.currentDocument.height)
            }

            var reversedLayers = this.layers.slice().reverse() 
            reversedLayers.forEach(layer => {
                this.downloadCtx.globalAlpha = layer.opacity / 255
                this.downloadCtx.drawImage(layer.canvas, 0, 0)
            })

            this.download(this.downloadCanvas.toDataURL(), fileName)
        },

        download(url, fileName){
            var link = document.createElement("a");
            link.download = fileName;
            link.href = url;
            link.click();
        }
    }
}
</script>

<style scoped>
#export-window{
    left: 200px;
    top: 274.5px;
    display: block;
    width: 250px;
}

.window-tabs{
    grid-template-columns: 1fr 1fr 1fr;
}

.settings-wrapper{
    margin-left: 10px;
    align-self: center;
    height: auto;
}

.settings-wrapper span{
    line-height: 27px;
    float: left;
}

.settings-wrapper input{
    float: left;
}

.window-buttons{
    height: 35px;
    text-align: center
}

/* IMAGE FORM */
#image-form{
    display: grid;
    grid-template-rows: 40px 27px 30px 27px;
    align-content: center;
}

input[name="pixel-scale"]{
    width: 60px;
    margin-left: 8px;
}

input[name="file-name"]{
    width: 158px;
    margin-left: 10px;
}

input[type="checkbox"]{
    margin-top: 7px;
}
</style>


