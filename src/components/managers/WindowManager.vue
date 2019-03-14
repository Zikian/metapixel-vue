<template>
    <div id="window-manager">
        <ColorPicker/>
        <NewDocumentWindow/>
        <LayerSettingsWindow/>
    </div>
</template>

<script>
import ColorPicker from '../ColorPicker'
import NewDocumentWindow from '../NewDocumentWindow'
import LayerSettingsWindow from '../LayerSettingsWindow'

export default {
    name: 'WindowManager',

    components: {
        ColorPicker,
        NewDocumentWindow,
        LayerSettingsWindow
    }
}
</script>

<style>
#window-manager{
  position: absolute;
  top: 0;
}
</style>


