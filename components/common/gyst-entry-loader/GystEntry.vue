<template lang="pug">
div
  v-card
    v-container
      v-row.pa-2(no-gutters)
        v-col.mr-2(
          cols="auto"
        )
          div(
            :style="{ width: '80px', height: '80px' }"
          )
            div(
              v-if="thumbnailExists()"
            )
              img(
                :src="gystEntry.resources.thumbnail_url"
                :style="{ maxWidth: '80px', maxHeight: '80px', border: '1px solid white' }"
              )
        v-col
          v-row.header-container(no-gutters)
            v-col
              v-row(no-gutters)
                span.contexts(v-if="'contexts' in gystEntry")
                  span(v-for="(context, index) of gystEntry.contexts" :key="index")
                    a(
                      v-if="'url' in context"
                      :class="{ ['url-context-' + index]: true }"
                      :href="context.url"
                      target="_blank"
                    ) {{ context.name }}
                    span(v-else) {{ context.name }}
                    //- Prints ' > '
                    span(v-if="index < gystEntry.contexts.length - 1") &nbsp;&gt;&nbsp;
              v-row(no-gutters)
                div.title(@click="is_collapsed = !is_collapsed") {{ gystEntry.title }}

          v-row.body-container(
            no-gutters
            v-show="is_collapsed == false"
          )
            div.text-content-container(
              :style="{ width: '100%', whiteSpace: 'pre-wrap', maxHeight: '20em', overflowY: 'auto', resize: 'vertical' }"
            )
              div(v-if="true")
                div {{ gystEntry.content }}
              div(v-else)
                div(v-html="gystEntry.content")

            div.media-container(
              :style="{ width: '100%' }"
            )
              img(
                v-if="getMediaExists()"
                :src="gystEntry.resources.main.value"
                alt="Image not found"
                :style="{ maxHeight: '800px', maxWidth: '100%' }"
              )
          
          v-row(no-gutters)
            v-col(cols="auto")
              div {{ gystEntry.datetime_info }}
        
</template>

<script lang="ts">
import * as _ from "lodash"
import { Prop, Vue, Component } from "nuxt-property-decorator"

@Component
export default class GystEntry extends Vue {
  @Prop() gystEntry:any

  is_collapsed = false

  mounted() {}

  contextExists() {
    return 'contexts' in this.gystEntry
  }

  getMediaExists() {
    const value = _.get(this.gystEntry, "resources.main.value", undefined)
    const exists = value != undefined
    return exists
  }

  thumbnailExists() {
    const value = _.get(this.gystEntry, "resources.thumbnail_url", undefined)
    const exists = value != undefined
    return exists
  }
}
</script>
