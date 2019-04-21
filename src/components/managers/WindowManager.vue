<template>
    <div id="window-manager">
        <ColorPicker/>
        <NewDocumentWindow/>
        <LayerSettingsWindow/>
        <ExportWindow/>
    </div>
</template>

<script>
import ColorPicker from '../ColorPicker'
import NewDocumentWindow from '../NewDocumentWindow'
import LayerSettingsWindow from '../LayerSettingsWindow'
import ExportWindow from '../ExportWindow'

export default {
    name: 'WindowManager',

    components: {
        ColorPicker,
        NewDocumentWindow,
        LayerSettingsWindow,
        ExportWindow
    }
}
</script>

<style>
#window-manager{
  position: absolute;
  top: 0;
}
</style>


