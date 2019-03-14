<template>
    <div></div>
</template>

<script>
export default {
    name: 'HistoryManager',

    data(){
        return {
            undoHistory: [],
            redoHistory: []
        }
    },

    methods: {
        undoLast(){
            if(this.undoHistory.length == 0) { return; }
            this.undoHistory[this.undoHistory.length - 1].undo();
            this.redoHistory.push(this.undoHistory.pop());    
        },
    
        redoLast(){
            if(this.redoHistory.length == 0) { return; }
            this.redoHistory[this.redoHistory.length - 1].redo();
            this.undoHistory.push(this.redoHistory.pop());
        }
    }
}
</script>

