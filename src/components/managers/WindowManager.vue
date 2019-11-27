<template>
    <div id="window-manager">
        <ColorPicker/>
        <NewDocumentWindow/>
        <LayerSettingsWindow/>
        <ExportWindow/>
        <ResizeWindow/>
    </div>
</template>

<script>
import ColorPicker from '../ColorPicker'
import NewDocumentWindow from '../NewDocumentWindow'
import LayerSettingsWindow from '../LayerSettingsWindow'
import ExportWindow from '../ExportWindow'
import ResizeWindow from '../ResizeWindow'

export default {
    name: 'WindowManager',

    components: {
        ColorPicker,
        NewDocumentWindow,
        LayerSettingsWindow,
        ExportWindow,
        ResizeWindow
    }
}
</script>

<style>
#window-manager{
  position: absolute;
  top: 0;
}
</style>


