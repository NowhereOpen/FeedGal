<template lang="pug">
div
  v-card
    v-card-title About
    v-card-text
      h2 FeedGal

      div
        div Thank you for using FeedGal, Galaxy of Feeds, developed by #[a(href="https://nowhere.business") Nowhere]

        div
          | With FeedGal, you can view your feeds from your favorite services in one tab. No need to open so many tabs in
          | one browser, unless if you want to open one from a loaded feed in FeedGal.
      
      hr.my-2

      h2 Upcoming changes

      div
        div
          | #[b RSS loader]. Using RSS is nice. All you need is a url for the RSS, no need to login. You will be able to
          | do the same with FeedGal soon.
        
        div
          | #[b Localhost loader]. If you are a developer yourself, you can host your own feeds that can be hosted from your
          | computer locally. Some foolish idea would be hosting your browser history?

      hr.my-2

      h2 Contact us please

      div
        div If you have bugs and errors to report, please go straight to #[a(href="https://github.com/NowhereOpen/FeedGal/issues") here].

        div If you have any spice to add to the app, please take a look at the #[a(href="https://github.com/NowhereOpen/FeedGal/tree/master/docs/roadmap.md") roadmap] first.

        div If you would like to contribute, please follow the steps from #[a(href="https://github.com/NowhereOpen/FeedGal/tree/master/docs/contribute.md") here].

      hr.my-2
      
      h2 Known issues

      div
        div
          | There are two services associated with Google; YouTube and Google calendar. FeedGal prefers YouTube in this case.
          | For example, after connecting a google account then clicking on link that navigates to the `/suite` page, the 
          | editor will choose YouTube over Google Calendar.
        div
          | FeedGal doesn't automatically fetch new feeds unlike how loading older feeds is done by simply scrolling down.
          | You can only load new feeds by refreshing the page. Sorry for the inconvenience.

</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"
import urlJoin from "url-join"

@Component({
  components: {}
})
export default class AboutPage extends Vue {}
</script>
