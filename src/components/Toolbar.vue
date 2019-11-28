<template>
  <div id="Toolbar">
    <ToolbarButton
      v-for="button in buttons"
      :key="button.key"
      :id="button.id"
      :icon="button.icon"
      :name="button.name"
      :event="button.event"
    />

    <ToolbarDropdown
      v-for="dropdown in dropdowns"
      :key="dropdown.key"
      :id="dropdown.id"
      :name="dropdown.name"
      :icon="dropdown.icon"
      :items="dropdown.items"
    />
  </div>
</template>

<script>
import ToolbarButton from './ToolbarButton'
import ToolbarDropdown from './ToolbarDropdown'
import EventBus from './EventBus'

export default {
  name: 'Toolbar',

  data() {
    return {
      dropdowns: [
        {key: 0, id:'file-dropdown', name: 'File', icon: 'far fa-file-image', 
         items: [
           { key: 0, title: 'New', icon: 'far fa-file', event: 'open-new-document-window' },
           { key: 1, title: 'Clear', icon: 'far fa-trash-alt', event: 'clear-drawing' },
           { key: 2, title: 'Export', icon: 'far fa-save', event: 'open-export-window' },
           { key: 3, title: 'Open Image', icon: 'far fa-file-image', event: 'import-image' },
           { key: 4, title: 'Resize Drawing', icon: 'fas fa-expand-arrows-alt', event: 'open-resize-window' }
         ]
        },

        {key: 1, id:'selection-dropdown', name: 'Selection', icon: 'fas fa-cog', 
         items: [
           { key: 4, title: 'Flip Horizontal', icon: 'fas fa-arrows-alt-h', event: 'flip-selection-x' },
           { key: 5, title: 'Flip Vertical', icon: 'fas fa-arrows-alt-v', event: 'flip-selection-y' }
         ]
        }
      ],

      buttons: [
        {key: 6, id: 'undo-button', name: 'Undo', icon: 'fas fa-undo-alt', event: 'undo'},
        {key: 7, id: 'redo-button', name: 'Redo', icon: 'fas fa-redo-alt', event: 'redo'},
        {key: 8, id: 'fullscreen-button', name: 'Fullscreen', icon: 'fas fa-desktop', event: 'toggle-fullscreen' },
      ]
    }
  },
  components: {
    ToolbarButton,
    ToolbarDropdown
  }
}
</script>

<style>
#Toolbar{
  display: grid;
  grid-template-columns: 90px 90px 90px 90px 90px;
  grid-template-rows: 27px;
  grid-row: 1;
  background-color: rgb(59, 59, 65)
}

#file-dropdown{
  grid-row: 1;
  grid-column: 1; 
}

#undo-button{
  grid-column: 2;
}

#redo-button{
  grid-column: 3;
}

#selection-dropdown{
  grid-row: 1;
  grid-column: 4;
}

#fullscreen-button{
  grid-column: 5;
}

.toolbar-item{
  position: relative;
  float:left;
  height: 100%;
  width: 90px;
  text-align: center;
}

.toolbar-item:hover{
  background-color: rgb(82, 82, 87);
}

.toolbar-item span{
  line-height: 27px;
  color: white;
  font-size: 9pt;
}

.toolbar-item i{
  font-size: 12pt;
  color:white;
  margin-right: 5px;
}
</style>
