<template>
  <div class="toolbar-item" @click="emitEvent()">
      <i :class="icon"></i>
      <span>{{ name }}</span>
  </div>
</template>

<script>
import EventBus from './EventBus'

export default {
  name: 'ToolbarButton',

  props: ['name', 'icon', 'event'],

  methods:{
    emitEvent(){
      EventBus.$emit(this.event)
    }
  }
}
</script>

