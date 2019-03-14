<template>
    <div class="input">
        <span>{{ title+':' }}</span>
        <input 
            ref="input" 
            :value="value"
            :maxlength="maxLen"
        >
    </div>
</template>

<script>
import EventBus from './EventBus'

export default {
    name: 'Input',

    props: {
        'title': String, 
        'type': String,
        'startVal': String || Number, 
        'affectedValPath': String,
        'maxLen': Number
    },

    computed:{
        value(){ return Object.getByString(this.$store.state, this.affectedValPath) },
        input(){ return this.$refs.input },
    },

    mounted(){
        if(this.type === 'hex'){
            this.input.onchange = this.inputValidation
            this.input.oninput = function(){
               this.value = this.value.replace(/([^a-f0-9A-F])/g, '')
            }
        } else {
            this.input.oninput = this.inputValidation
        }

        this.updateValue(this.startVal)
    },

    methods:{
        inputValidation(){
            var value = this.type === 'hex' ? this.hexValidation() : this.numberValidation()
            this.updateValue(value)
        },

        hexValidation(){
            var value = this.input.value
            switch (value.length){
                case 0:
                    value = "000000"
                    break;
                case 1:
                    value = "00000" + value;
                    break;
                case 2:
                    value = "0000" + value;
                    break;
                case 3:
                    value = value[0] + value[0] + value[1] + value[1] + value[2] + value[2] 
                    break;
                case 4:
                    value = "00" + value;
                    break;
                case 5:
                    value = "0" + value;
                    break
                }
            return value
        },

        numberValidation(){

        },

        updateValue(value){
            EventBus.$emit(`update-${this.affectedValPath}`, value)
        }
    }
}
</script>

<style>
.input{
    height: 27px;
}

.input input{
    margin-left: 10px;
    height: 24px;
    background-color: rgb(23, 23, 23);
    border-radius: 4px;
    border: 0;
    color: white;
    font-size: 12pt;
    padding: 0 0 0 5px;
    outline: none;
}

.input span{
    color: white;
    font-size: 12pt;
    line-height: 24px;
    float: left;
}
</style>


