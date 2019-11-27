<template>
    <div id="resize-window" class="window" v-if="isOpen">
        <div class="window-header">
            <span>Resize Drawing</span>
            <i class="fas fa-times" @click="isOpen = false"></i>
        </div>

        <div class="window-body">
            <form ref="form">
                <div class="settings-wrapper">
                    <span>Width (px):</span>
                    <input 
                        class="window-input"
                        :value="width"
                        @input="width = $event.target.value"
                        type="number" 
                        name="width"
                    >
                </div>

                <div class="settings-wrapper">
                    <span>Height (px):</span>
                    <input 
                        class="window-input"
                        :value="height"
                        @input="height = $event.target.value"
                        type="number" 
                        name="height"
                    >
                </div>

                <div class="anchor-settings">
                    <div>
                        <span>Anchor:</span>
                        <div class="anchor-wrapper">
                            <div 
                                class="anchor-option"
                                v-for="option in anchorOptions"
                                :key="option.key" 
                                @click="selectAnchor(option.key)"
                                :class="{ 'anchor-selected': option.isSelected, }"
                            >
                                <i 
                                    :class="{
                                        'fas fa-arrow-up': option.resizeDirection == 'up',
                                        'fas fa-arrow-down': option.resizeDirection == 'down',
                                        'fas fa-arrow-left': option.resizeDirection == 'left',
                                        'fas fa-arrow-right': option.resizeDirection == 'right',
                                    }"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="window-buttons">
                        <button type="button" class="window-button" @click="confirm()">OK</button>
                        <button type="button" class="window-button" @click="cancel()">Cancel</button>
                    </div>
                </div>
            </form>
        </div>

        <div class="window-footer"></div>
    </div>
</template>

<script>
import EventBus from './EventBus'

export default {
    mounted() {
        EventBus.$on('open-resize-window', () => {
            this.open()
        })
    },
    
    computed: {
        docSize() { return this.$store.getters.docSize },
    },

    data() {
        return {
            isOpen: false,

            selectedAnchor: 0,
            width: 1,
            height: 1,

            anchorOptions: [
                { key: 0, isSelected: true, resizeDirection: '' },
                { key: 1, isSelected: false, resizeDirection: 'right' },
                { key: 2, isSelected: false, resizeDirection: '' },
                { key: 3, isSelected: false, resizeDirection: 'down' },
                { key: 4, isSelected: false, resizeDirection: '' },
                { key: 5, isSelected: false, resizeDirection: '' },
                { key: 6, isSelected: false, resizeDirection: '' },
                { key: 7, isSelected: false, resizeDirection: '' },
                { key: 8, isSelected: false, resizeDirection: '' }
            ]
        }
    },

    watch: {
        width() {
            this.width = !this.width ? '' : this.clamp(this.width, 0, 1000)
        },

        height() {
            this.height = !this.height ? '' : this.clamp(this.height, 0, 1000)
        }
    },

    methods: {
        confirm() {
            let width = this.width == 0 ? 1 : this.width
            let height = this.height == 0 ? 1 : this.height

            EventBus.$emit('resize-document', this.selectedAnchor, width, height)
            EventBus.$emit('resize-tiles', this.selectedAnchor, width, height)
            this.isOpen = false
        },

        cancel() {
            this.selectAnchor(0)
            this.isOpen = false
        },

        open() {
            this.isOpen = true
            this.width = this.docSize.width
            this.height = this.docSize.height
        },

        selectAnchor(key) {
            this.anchorOptions[this.selectedAnchor].isSelected = false
            this.resetResizeDirections(this.selectedAnchor)
    
            this.anchorOptions[key].isSelected = true
            this.setResizeDirections(key)
    
            this.selectedAnchor = key
        },

        resetResizeDirections(key) {
            this.setResizeDirection(key-3, '')
            this.setResizeDirection(key-1, '')
            this.setResizeDirection(key+1, '')
            this.setResizeDirection(key+3, '')
        },

        setResizeDirections(key) {
            let anchorRow = key % 3

            this.setResizeDirection(key-3, 'up')

            if ((key - 1) % 3 + 1 == anchorRow) {
                this.setResizeDirection(key-1, 'left')
            }

            if ((key + 1) % 3 - 1 == anchorRow) {
                this.setResizeDirection(key+1, 'right')
            }

            this.setResizeDirection(key+3, 'down')
        },
    
        setResizeDirection(key, direction) {
            if (key >= 0 && key <= 8) {
                this.anchorOptions[key].resizeDirection = direction
            }
        }
    }
}

</script>

<style scoped>
#resize-window{
    left: 500px;
    top: 274.5px;
    display: block;
    width: 170px;
}

.window-body {
    display: grid;
}

form {
    display: grid;
    grid-template-rows: 36px 27px auto;
}

.settings-wrapper {
    position: relative;
}

.settings-wrapper span, .anchor-settings span {
    line-height: 27px;
}

.anchor-settings {
    display: grid;
    grid-template-columns: 83px 1fr;
}

input[name="width"], input[name="height"] {
    position: absolute;
    right: 0;
    width: 70px;

}

.anchor-wrapper {
    width: 72px;
    height: 72px;
    margin-left: 5px;
}

.anchor-option {
    width: 24px;
    height: 24px;
    float: left;
    box-shadow: inset 0px 0px 0px 0.5px rgba(0, 0, 0, 0.404);
    box-sizing: border-box;
    text-align: center;
}

.anchor-option i {
    line-height: 24px;
    color: rgb(64, 64, 202);
}

.anchor-option:hover {
    box-shadow: inset 0px 0px 0px 2px rgba(0, 0, 0, 0.404);
}

.anchor-selected {
    box-shadow: inset 0px 0px 0px 3px rgb(64, 64, 202);
}

.anchor-selected:hover {
    box-shadow: inset 0px 0px 0px 3px rgb(64, 64, 202);
}

.window-buttons {
    height: fit-content;
    width: fit-content;
    margin-top: 1.9rem;
}

.window-buttons button {
    width: 70px;
    margin: 3px auto;
}
</style>