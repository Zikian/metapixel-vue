<template><div></div></template>

<script>
import baseTool from '../../mixins/baseTool'

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

        drawingSelection:{
            get(){ return this.$store.state.selection.drawingSelection },
            set(val){ this.$store.state.selection.drawingSelection = val }
        }
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
                }

                //Draw selection
                this.drawingSelection = true
                this.mouseStart = this.pixelPos
                this.mouseEnd = this.mouseStart
            }
        },
    
        onMouseDrag(){
            if(this.resizingSelection){
                this.resizeSelection()
            } else if(this.drawingSelection){
                this.drawSelection()
            } else {
                this.moveSelection()
            }
        },
    
        onMouseUp(){
            if(this.resizingSelection){
                this.selection.resizeX = false
                this.selection.resizeY = false
            }

            if(this.mouseEnd.join() === this.mouseStart.join()){
                if(this.selection.detached){
                    this.commitSelection()
                } else {
                    this.clearSelection()
                }
            }

            if(!this.selection.detached){
                this.intersectSelection()
            }

            this.drawingSelection = false
        },

        moveSelection(){
            this.selection.x = this.pixelPos[0] - this.mouseOffset[0]
            this.selection.y = this.pixelPos[1] - this.mouseOffset[1]
        },

        drawSelection(){
            var selectionRect = {}

            if(this.shiftKey){
                this.mouseEnd = this.rectToSquare(...this.mouseStart, ...this.pixelPos)
                selectionRect = this.getRect(this.mouseStart, this.mouseEnd)
            } else {
                this.mouseEnd = this.pixelPos.slice()
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
            this.selection = { x: 0, y: 0, w: 0, h: 0 }
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
        },

        detachSelection(){
            this.selection.detached = true
        },

        commitSelection(){
            this.selection.detached = false
            this.flipX = false,
            this.flipX = true
        },
    }
}
</script>

