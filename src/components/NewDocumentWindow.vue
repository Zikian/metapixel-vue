<template>
    <div id="new-document-window" class="window" v-if="isOpen">
        <div class="window-header">
            <span>New Document</span>
            <i class="fas fa-times"></i>
        </div>
        <div class="window-tabs">
            <div @click="docType = 0" :class="docType != 0 && 'tab-hidden'" >Single Image</div>
            <div @click="docType = 1" :class="docType != 1 && 'tab-hidden'" >Tiled</div>
        </div>
        <div class="window-body">
            <form id="single-image-settings" v-if="docType == 0" ref="form">
                <div class="settings-wrapper">
                    <span>Document Name:</span>
                    <input class="window-input" :value="currentDocName" type="text" name="name">
                </div>

                <div class="settings-wrapper" id="test">
                    <span>Width (px):</span>
                    <input class="window-input" :value="currentDocWidth" type="number" name="doc-width" @input="inputValidation()">
                </div>

                <div class="settings-wrapper">
                    <span>Height (px):</span>
                    <input class="window-input" :value="currentDocHeight" type="number" name="doc-height" @input="inputValidation()">
                </div>

                <div class="settings-wrapper">
                    <input type="checkbox" :checked="currentDocTransparent && 'checked'" name="transparency">
                    <span>Transparency</span>
                </div>
            </form>

            <div id="tiled-settings" v-if="docType == 1" ref="form">

            </div>
        </div>
        <div class="window-buttons">
            <button class="window-button" @click="docType == 0 ? confirmSingleImage() : confirmTiledImage()">OK</button>
            <button class="window-button">Cancel</button>
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
        currentDocName(){ return this.$store.getters.currentDocument.name },
        currentDocType(){ return this.$store.getters.currentDocument.type },
        currentDocWidth(){ return this.$store.getters.currentDocument.width },
        currentDocHeight(){ return this.$store.getters.currentDocument.height },
        currentDocTransparent(){ return this.$store.getters.currentDocument.transparency },
        currentDocument(){ return this.$store.getters.currentDocument }
    },

    data(){
        return {
            isOpen: false,
            docType: null,
        }
    },

    methods: {
        inputValidation(){
            var docWidth = this.$refs.form["doc-width"].value
            this.$refs.form["doc-width"].value = docWidth > 1000 ? 1000 : docWidth

            var docHeight = this.$refs.form["doc-height"].value
            this.$refs.form["doc-height"].value = docHeight > 1000 ? 1000 : docHeight
        },

        confirmSingleImage(){
            var name = this.$refs.form['name'].value
            var docWidth = parseInt(this.$refs.form['doc-width'].value)
            var docHeight = parseInt(this.$refs.form['doc-height'].value)
            var transparency = this.$refs.form['transparency'].checked

            this.currentDocument.type = 'single-image'
            this.currentDocument.name = name
            this.currentDocument.width = docWidth
            this.currentDocument.height = docHeight
            this.currentDocument.transparency = transparency

            EventBus.$emit('new-document')
            this.isOpen = false
        },

        confirmTiledImage(){

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

.settings-wrapper{
    padding-left: 9px;
    padding-right: 9px;
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

</style>


