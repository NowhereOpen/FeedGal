<template lang="pug">
div
  v-card
    v-card-title About
    v-card-text
      h2 FeedGal

      div
        div Thank you for using FeedGal, Galaxy of Feeds, developed by #[a(href="https://nowhere.business") Nowhere]

        div
          | With FeedGal, you can view your feeds from your favorite services in one tab.

      hr.my-2

      h2 Contact us please

      div
        div If you have bugs and errors to report, please go straight to #[a(href="https://github.com/NowhereOpen/FeedGal/issues") here].

        //- div If you would like to contribute, please follow the steps from #[a(href=toPublicRepoFile("docs/contribute.md")) here].

</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"
import urlJoin from "url-join"

@Component({
  components: {}
})
export default class AboutPage extends Vue {
  toPublicRepoFile(path:string) {
    const base = `https://github.com/NowhereOpen/FeedGal/tree/master`
    return urlJoin(base, path)
  }
}
</script>
