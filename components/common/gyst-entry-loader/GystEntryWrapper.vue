<template lang="pug">
div(:style="{ width: '1000px', margin: '0px' }")
  v-card
    v-container
      v-row
        GystEntry(
          :style="{ width: '100%' }"
          :gyst-entry="gystEntryWrapper.entry"
          :pagination-index="gystEntryWrapper.pagination_index"
        )

      //- v-row.footer-container(no-gutters)
      //-   v-col.mr-2(cols="auto")
      //-     v-btn like ( 0 )
      //-   v-col.mr-2(cols="auto")
      //-     v-btn(@click="is_comment = true") Comment
      //-   v-col.mr-2(cols="auto")
      //-     v-btn Dislike ( 0 )
      //-   v-col(cols="auto")
      //-     v-btn(@click="onClickToMyPost")
      //-       v-progress-circular.mr-2(v-if="is_saving_to_my_post" indeterminate)
      //-       span To My Post

      //- v-row
      //-   div(v-if="is_comment")
      //-     div Write a comment for me
      //-     v-btn(@click="is_comment = false") X

      //- v-row
      //-   CommentLoader(:style="{ width: '100%' }")
</template>

<script lang="ts">
import { Prop, Vue, Component } from "nuxt-property-decorator"

import GystEntry from "./GystEntry.vue"
import CommentLoader from "./CommentLoader.vue"

import { GystEntryWrapper as GystEntryWrapperType } from "~/src/common/types/pages/main"

@Component({
  components: { GystEntry, CommentLoader }
})
export default class GystEntryWrapper extends Vue {
  @Prop() gystEntryWrapper!:GystEntryWrapperType
}
</script>
