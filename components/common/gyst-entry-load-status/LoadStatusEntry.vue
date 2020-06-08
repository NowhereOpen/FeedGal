<template lang="pug">
div
  span {{ text }} ({{ total }})
    span(v-if="is_error == false")
      v-progress-circular.ml-2(v-if="is_loading" indeterminate size="20")
      span(v-if="is_warning == true")
        v-tooltip(right)
          template(v-slot:activator="{ on }")
            v-icon(color="yellow" v-on="on") info
          span
            span {{ warning_text }}
    
    span(v-else)
      v-tooltip(right)
        template(v-slot:activator="{ on }")
          v-icon(v-on="on" color="red") info
        span
          span {{ error_text }}
</template>

<script lang="ts">
import { Vue, Component, State, Getter, Prop } from "nuxt-property-decorator"
import 'material-design-icons-iconfont/dist/material-design-icons.css'

@Component
export default class GystEntryLoadStatus extends Vue {
  @Prop() text!:string
  @Prop() total!:number
  @Prop() is_loading!:boolean
  @Prop() is_warning!:boolean
  @Prop() warning_text!:string
  @Prop() is_error!:boolean
  @Prop() error_text!:string
}
</script>