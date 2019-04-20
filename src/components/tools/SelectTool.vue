<template><div></div></template>

<script>
import baseTool from '../../mixins/baseTool'
import EventBus from '../EventBus'

export default {
    mixins: [baseTool],

    computed:{
        pixelPos(){ return this.$store.state.pixelPos },
        prevPixelPos(){ return this.$store.state.prevPixelPos },
        docSize(){ return this.$store.getters.docSize },
        mouseStart:{ 
            get(){ return this.$store.state.mouseStart },
            set(val){ this.$store.state.mouseStart = val }
        },
        shiftKey(){ return this.$store.state.keys.shift },
        altKey(){ return this.$store.state.keys.alt },
        selection:{ 
            get(){ return this.$store.state.selection },
            set(val){ this.$store.state.selection = val } 
        },
        mouseOverSelection(){
            return this.pointInRect(...this.pixelPos, this.selection)
        },
        selectionExists(){ return this.selection.w && this.selection.h },
        activeElement(){ return this.$store.state.elems.activeElement },

        resizingSelection(){ 
            return (this.selection.resizeX || this.selection.resizeY)  
        },
    },

    data(){
        return {
            mouseEnd: [0, 0],
            mouseOffset: [0, 0],
        }
    },

    methods: {
        onMouseLeft(){
            if(this.resizingSelection) return

            if(this.selection.detached && this.altKey){
                EventBus.$emit('paste-selection')
            }

            if(this.selectionExists && this.mouseOverSelection){
                if(this.shiftKey){
                    this.detachSelection()
                }

                //Initial mouse offset when moving the selection
                var offsetX = this.pixelPos[0] - this.selection.x
                var offsetY = this.pixelPos[1] - this.selection.y
                this.mouseOffset = [offsetX, offsetY]
            } else {
                if(this.selection.detached){
                    this.commitSelection()
                } else {
                    this.clearSelection()
                }

                //Draw selection
                this.selection.drawingSelection = true
                this.mouseStart = this.pixelPos
                this.mouseEnd = this.mouseStart
            }
        },
    
        onMouseDrag(){
            if(this.resizingSelection){
                this.resizeSelection()
            } else if(this.selection.drawingSelection){
                this.drawSelection()
            } else {
                this.moveSelection()
            }
        },
    
        onMouseUp(){
            this.selection.resizeX = false
            this.selection.resizeY = false
            this.selection.drawingSelection = false

            if(!this.selection.detached){
                this.intersectSelection()
            }
        },

        moveSelection(){
            this.selection.x = this.pixelPos[0] - this.mouseOffset[0]
            this.selection.y = this.pixelPos[1] - this.mouseOffset[1]

            if(this.selection.detached){
                EventBus.$emit('render-canvas')
                EventBus.$emit('render-preview')
            }
        },

        drawSelection(){
            var selectionRect = {}

            if(this.shiftKey){
                this.mouseEnd = this.rectToSquare(...this.mouseStart, ...this.pixelPos)
                selectionRect = this.getRect(this.mouseStart, this.mouseEnd)
            } else {
                this.mouseEnd = this.pixelPos
                selectionRect = this.getRect(this.mouseStart, this.mouseEnd)
            }

            Object.assign(this.selection, selectionRect)
        },

        getRect(start, end){
            //Get a rectangle from top left and bottom right coords

            var x = Math.min(start[0], end[0])
            var y = Math.min(start[1], end[1])
            var w = Math.max(start[0], end[0]) - x + 1
            var h = Math.max(start[1], end[1]) - y + 1

            return { x: x, y: y, w: w, h: h }
        },

        intersectSelection(){
            var canvasRect = { x: 0, y: 0, w: this.docSize.width, h: this.docSize.height }
            var selectionRect = this.intersectRects(this.selection, canvasRect)
            
            if(!selectionRect.w && !selectionRect.h){
                this.clearSelection()
                return
            }

            Object.assign(this.selection, selectionRect)
        },
        
        clearSelection(){
            Object.assign(this.selection, { x: 0, y: 0, w: 0, h: 0 })
        },

        resizeSelection(){
            var selection = this.selection
            var dx = this.pixelPos[0] - this.prevPixelPos[0];
            var dy = this.pixelPos[1] - this.prevPixelPos[1];

            var x = selection.x
            var y = selection.y
            var w = selection.w
            var h = selection.h

            if(selection.resizeX){
                var newW = w + dx * (selection.clampX - !selection.clampX);
                if(newW < 0){
                    selection.clampX = !selection.clampX;    
                    selection.flipX = !selection.flipX;
                    var prevW = w;
                    selection.w = dx < 0 ? x - this.pixelPos[0] : dx - w;
                    selection.x = dx < 0 ? this.pixelPos[0] : x + prevW;
                } else {
                    selection.w = newW;
                    selection.x += dx * !selection.clampX;
                }
            }

            if(selection.resizeY){
                var newH = h + dy * (selection.clampY - !selection.clampY);
                if(newH < 0){
                    selection.clampY = !selection.clampY;
                    selection.flipY = !selection.flipY;
                    var prevH = h;
                    selection.h = dy < 0 ? y - this.pixelPos[1] : dy - h;
                    selection.y = dy < 0 ? this.pixelPos[1] : y + prevH;
                } else {
                    selection.y += dy * !selection.clampY;
                    selection.h = newH;
                }
            }

            EventBus.$emit('resize-paste-canvas')
            EventBus.$emit('render-canvas')
            EventBus.$emit('render-preview')
        },

        detachSelection(){
            if(this.selection.detached) return

            this.selection.detached = true
            EventBus.$emit('detach-selection')
        },

        commitSelection(){
            this.selection.detached = false
            this.selection.flipX = false
            this.selection.flipY = false
            EventBus.$emit('commit-selection')

            this.intersectSelection()
        },
    }
}
</script>

