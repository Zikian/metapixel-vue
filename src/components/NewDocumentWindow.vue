<template>
    <div id="new-document-window" class="window" v-if="isOpen">
        <div class="window-header">
            <span>New Document</span>
            <i class="fas fa-times" @click="isOpen = false"></i>
        </div>
        <div class="window-tabs">
            <div @click="docType = 0" :class="docType != 0 && 'tab-hidden'" >Single Image</div>
            <div @click="docType = 1" :class="docType != 1 && 'tab-hidden'" >Tiled</div>
        </div>
        <div class="window-body">
            <form id="single-image-settings" v-if="docType == 0" ref="form">
                <div class="settings-wrapper">
                    <span>Document Name:</span>
                    <input 
                        class="window-input" 
                        :value="currentDocName" 
                        type="text" 
                        name="name"
                    >
                </div>

                <div class="settings-wrapper">
                    <span>Width (px):</span>
                    <input 
                        class="window-input" 
                        type="number" 
                        name="doc-width" 
                        v-model="docWidth" 
                    >
                </div>

                <div class="settings-wrapper">
                    <span>Height (px):</span>
                    <input 
                        class="window-input" 
                        type="number" 
                        name="doc-height" 
                        v-model="docHeight" 
                    >
                </div>

                <div class="settings-wrapper">
                    <input 
                        type="checkbox" 
                        :checked="currentDocTransparent && 'checked'" name="transparency"
                    >
                    <span>Transparency</span>
                </div>
            </form>

            <form id="tiled-settings" v-if="docType == 1" ref="form">
                <div class="settings-wrapper" id="doc-name">
                    <span>Document Name:</span>
                    <input 
                        class="window-input" 
                        :value="currentDocName" 
                        type="text" 
                        name="name"
                    >
                </div>

                <div class="settings-wrapper tiles-x" >
                    <span>Width (tiles):</span>
                    <input 
                        class="window-input" 
                        type="number" 
                        name="tiles-x" 
                        v-model="xTiles"
                    > 
                </div>

                <div class="settings-wrapper tiles-y">
                    <span>Height (tiles):</span>
                    <input 
                        class="window-input" 
                        type="number"
                        name="tiles-y"
                        v-model="yTiles" 
                    >
                </div>

                <div class="settings-wrapper tile-width" >
                    <span>Tile Width (px):</span>
                    <input 
                        class="window-input" 
                        type="number" 
                        name="tile-width" 
                        v-model="tileWidth" 
                    >
                </div>

                <div class="settings-wrapper tile-height">
                    <span>Tile Height (tiles):</span>
                    <input 
                        class="window-input" 
                        type="number" 
                        name="tile-height" 
                        v-model="tileHeight" 
                    >
                </div>

                <div class="settings-wrapper">
                    <input type="checkbox" :checked="currentDocTransparent && 'checked'" name="transparency">
                    <span>Transparency</span>
                </div>
            </form>
        </div>
        <div class="window-buttons">
            <button class="window-button" @click="docType == 0 ? confirmSingleImage() : confirmTiledImage()">OK</button>
            <button class="window-button" @click="isOpen = false">Cancel</button>
        </div>
        <div class="window-footer"></div>
    </div>
</template>

<script>
import EventBus from './EventBus'

export default {
    name: 'NewDocumentWindow',

    mounted(){
        this.docType = this.currentDocType === 'single-image' ? 0 : 1 

        EventBus.$on('open-new-document-window', () => {
            this.isOpen = true
        })
    },

    computed:{
        currentDocName(){ return this.$store.getters.document.name },
        currentDocType(){ return this.$store.getters.document.type },
        currentDocWidth(){ return this.$store.getters.document.width },
        currentDocHeight(){ return this.$store.getters.document.height },
        currentDocTransparent(){ return this.$store.getters.document.transparency },
        document(){ return this.$store.getters.document }
    },

    data(){
        return {
            isOpen: false,
            docType: null,

            docWidth: null,
            docHeight: null,

            xTiles: 4,
            yTiles: 4,
            tileWidth: 16,
            tileHeight: 16
        }
    },

    watch:{
        docWidth(){
            this.docWidth = !this.docWidth ? '' : this.clamp(this.docWidth, 0, 1000)
        },

        docHeight(){
            this.docHeight = !this.docHeight ? '' : this.clamp(this.docHeight, 0, 1000)
        },

        xTiles(){
            var totalWidth = this.xTiles * this.tileWidth
            this.xTiles = totalWidth > 2000 ? Math.floor(2000 / this.tileWidth) : this.xTiles
        },

        yTiles(){
            var totalWidth = this.xTiles * this.tileWidth
            this.xTiles = totalWidth > 2000 ? Math.floor(2000 / this.tileWidth) : this.xTiles
        },

        tileWidth(){
            this.tileWidth = !this.tileWidth ? '' : this.clamp(this.tileWidth, 0, 2000)
        },

        tileHeight(){
            this.tileHeight = !this.tileHeight ? '' : this.clamp(this.tileHeight, 0, 2000)
        },

        isOpen(){
            if(this.isOpen){
                this.docWidth = this.currentDocWidth
                this.docHeight = this.currentDocHeight
            }
        }
    },

    methods: {
        confirmSingleImage(){
            var name = this.$refs.form['name'].value
            name = name.length ? name : 'Untitled'
            var docWidth = parseInt(this.$refs.form['doc-width'].value)
            docWidth = docWidth ? docWidth : 1
            var docHeight = parseInt(this.$refs.form['doc-height'].value)
            docHeight = docHeight ? docHeight : 1
            var transparency = this.$refs.form['transparency'].checked

            this.document.type = 'single-image'
            this.document.name = name
            this.document.width = docWidth
            this.document.height = docHeight
            this.document.transparency = transparency
            this.document.xTiles = 1
            this.document.yTiles = 1

            EventBus.$emit('new-document')
            this.isOpen = false
        },

        confirmTiledImage(){
            var name = this.$refs.form['name'].value
            name = name.length ? name : 'Untitled'
            var docWidth = this.tileWidth * this.xTiles
            var docHeight = this.tileHeight * this.yTiles
            var transparency = this.$refs.form['transparency'].checked

            this.document.type = 'tiled'
            this.document.name = name
            this.document.width = docWidth
            this.document.height = docHeight
            this.document.transparency = transparency
            this.document.xTiles = this.xTiles
            this.document.yTiles = this.yTiles

            EventBus.$emit('new-document')
            this.isOpen = false
        }
    }
}
</script>

<style scoped>
#new-document-window{
    left: 499px;
    top: 274.5px;
    display: block;
    width: 250px;
}

.window-tabs{
    grid-template-columns: 1fr 1fr;
}

#single-image-settings{
    display: grid;
    grid-template-rows: 55px 55px 55px 27px;
}

#tiled-settings{
    display: grid;
    grid-template-rows: 55px 55px 55px 27px;
    grid-template-columns: 50% 50%;
}

.settings-wrapper span{
    line-height: 24px;
    float: left;
}

.settings-wrapper input{
    width: 100%;
    float: left;
}

.settings-wrapper input[type='checkbox']{
    float: left;
    height: 14px;
    width: 14px;
    margin: 5px 5px 0 0;
}

.window-buttons{
    height: 35px;
    text-align: center
}

/* Tiled Settings */
#doc-name{
    grid-area: 1 / 1 / span 1 / span 2;
}

.settings-wrapper.tiles-x, .settings-wrapper.tile-width {
    padding-right: 5px;
}

</style>


