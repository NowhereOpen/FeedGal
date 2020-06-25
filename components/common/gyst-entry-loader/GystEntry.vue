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
                    )
                      span {{ context.name }}
                      span.ml-1(v-if="index == 0")
                        i.fa(:class="{ ['fa-' + gystEntry.service_id]: true, ['btn-' + gystEntry.service_id]: true }")
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
              div {{ getDatetime(gystEntry.datetime_info) }}
            v-spacer
            v-col(cols="auto")
              div {{ paginationIndex }}
        
</template>

<script lang="ts">
import { Prop, Vue, Component } from "nuxt-property-decorator"
import * as _ from "lodash"
import moment from "moment"
import humanizeDuration from "humanize-duration"

@Component
export default class GystEntry extends Vue {
  @Prop() gystEntry:any
  /**
   * 2020-05-18 14:51
   * Not a gyst entry property. This is included in the "gyst entry response", and not available to
   * "gyst entry".
   */
  @Prop() paginationIndex!:number

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

  getDatetime(datetime_value:any) {
    const now = moment()
    const dt_moment = moment(datetime_value)
    const year = dt_moment.get("year")
    const datetime = dt_moment.format("MMM DD, HH:mm")
    let dt_string = ""
    if(year != now.get("year")) {
      dt_string += year + " "
    }

    dt_string += datetime

    const from_now_ms = moment().diff(moment(datetime_value))
    const duration = humanizeDuration(Math.abs(from_now_ms), {
      delimiter: " ", round: true, largest: 2,
      units: ['y', 'mo', 'd', 'h', 'm']
    })
    const from_now = from_now_ms > 0 ? `${duration} ago` : `in ${duration}`

    return `${dt_string} (${from_now})`
  }
}
</script>

<style lang="less">
@import "~font-awesome/less/font-awesome.less";
@import "~bootstrap3/less/variables.less";
@import "~bootstrap3/less/mixins";
@import "~bootstrap3/less/buttons.less";
@import "~bootstrap-social/bootstrap-social.less";

.btn-reddit {
  .btn-social(#ff5700)
}

.btn-twitch {
  .btn-social(#6441a5)
}

.btn-trello {
  .btn-social(#0079BF)
}
</style>