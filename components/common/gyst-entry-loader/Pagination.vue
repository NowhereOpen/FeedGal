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
        @click="handlePagination"
      ) Load more
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class PaginationComp extends Vue {
  is_waiting_pagination = false

  mounted() {
    this.setPaginationOnScroll()
    this.handlePaginationCb = async () => {
      // throw Error("handlePaginationCb not implemented")
      console.error("handlePaginationCb not implemented")

      setTimeout(() => {
        /**
         * 2020-02-10 07:54
         * 
         * Defining this directly to `handlePaginationCb` has weird behavior where
         * assigning a value `is_waiting_pagination` directly doesn't work but using
         * `setIsWaitingPagination` works.
         * 
         * Defining `handlePaginationCb` in `mounted` works with direct assignment
         * of value.
         */
        this.is_waiting_pagination = false
      }, 1500)
    }
  }

  handlePaginationCb:() => Promise<void> = async () => {}

  setPaginationOnScroll() {
    window.addEventListener('scroll', () => {
      /**
       * Detect hitting the bottom of the page.
       * 
       * SO post: https://stackoverflow.com/questions/9439725
       */
      if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        this.handlePagination()
      }
    });
  }

  async handlePagination() {
    const container = <HTMLElement> this.$refs["pagination-container"]
    
    if(! this.is_waiting_pagination) {
      this.is_waiting_pagination = true

      // this.$nextTick(async () => {
      //   window.scrollTo(0, document.body.scrollHeight)
      // })

      await this.handlePaginationCb()
    }
    else {
      // This part of the logic used in test

      const container = <HTMLElement> this.$refs["pagination-container"]

      if(container.classList.contains("debounced")) {
        return
      }
      else {
        container.classList.add("debounced")
        setTimeout(() => {
          container.classList.remove("debounced")
        }, 1000)
      }
    }
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