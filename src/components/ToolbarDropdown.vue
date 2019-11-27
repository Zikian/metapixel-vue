<template>
    <div class="toolbar-item">
        <div class="toolbar-item" @click="show()" @mouseleave="hide()">
            <i :class="icon"></i>
            <span>{{ name }}</span>
        </div>
        
        <div class="toolbar-dropdown" v-if="showDropdown" @mouseenter="show()" @mouseleave="hide()">
            <ul>
                <li v-for="item in items" :key="item.key" @click="emitEvent(item.event)">
                    <div class="icon-wrapper">
                        <i :class="item.icon"></i>
                    </div>
                    {{ item.title }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import EventBus from './EventBus'

export default {
    props: ['name', 'icon', 'items'],

    data(){
        return {
            showDropdown: false
        }
    },

    methods:{
        emitEvent(event){
            EventBus.$emit(event)
        },

        hide(){
            this.showDropdown = false
        },

        show(){
            this.showDropdown = true
        }
    }
}
</script>

<style>
.toolbar-dropdown{
    position: absolute;
    width: 160px;
    height: auto;
    background-color: rgb(73, 73, 82);
    border-radius: 0 5px 5px 5px;
    top: 27px;
    box-shadow: 0px 8px 22px -2px rgba(0,0,0,0.75);
    z-index: 1000;
    overflow: hidden;
}

.toolbar-dropdown ul{
    text-align: left;
    color: white;
    margin: 0;
    padding: 0;
}

.toolbar-dropdown li {
    font-family: Montserrat;
    font-size: 9pt;
    line-height: 27px;
    padding-left: 15px;
    color: white;
}

.toolbar-dropdown li:hover {
    background-color: rgb(92, 92, 105);
}

.toolbar-dropdown .icon-wrapper {
    display: inline-block;
    width: 20px;
}

.toolbar-dropdown li i {
    font-size: 13pt;
    line-height: 27px;
}

</style>


