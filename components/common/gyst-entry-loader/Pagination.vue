<template lang="pug">
div
  div.pagination-container(:style="{ height: '200px'}" ref="pagination-container")
    div.pagination-waiting-container(
      v-show="is_waiting_pagination"
    )
      v-btn.cancel-pagination-button(
        @click="onCancelPaginationClick"
      ) Cancel
      v-progress-circular(indeterminate size=80)

    div.pagination-idle-container(
      v-show="is_waiting_pagination == false"
      ref="pagination-idle-container"
    )
      span Scroll to the bottom to load more entries or click
      v-btn.ml-2.manual-pagination-button(
        @click="$emit('load-more')"
      ) Load more
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class PaginationComp extends Vue {
  is_waiting_pagination = false

  mounted() {
    this.setPaginationOnScroll()
  }

  setPaginationOnScroll() {
    window.addEventListener('scroll', () => {
      /**
       * Detect hitting the bottom of the page.
       * 
       * SO post: https://stackoverflow.com/questions/9439725
       */
      if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        this.$emit("bottom")
      }
    });
  }

  /**
   * 2020-01-23 22:28
   * 
   * Should be called inside `handlePaginationCb`. This has been separted from
   * `handlePagination` because async loading doesn't work properly when there is
   * no way of controlling `this.is_waiting_pagination`. It will set to `false`
   * even before first service has been loaded because async loader calls a method
   * that sends a request. Waiting for all response then calling a callback function
   * that sets `this.is_waiting_pagination = false` is done in other callback. Until
   * then, it will continue to show "loading" progress circle.
   */
  setIsWaitingPagination(value:boolean) {
    this.is_waiting_pagination = value
  }

  onCancelPaginationClick() {
    this.is_waiting_pagination = false;
    /**
     * Helpful with testing?
     */
    const idle_container = <HTMLElement> this.$refs["pagination-idle-container"]
    idle_container.classList.add("cancelled")
    setTimeout(() => {
      idle_container.classList.remove("cancelled")
    }, 1000)
  }
}
</script>