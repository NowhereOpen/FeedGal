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

      hr.my-2

      h2 Known Issues

      h3 Can't use the account from a service #[a(id="issue1").anchor-header]

      div
        | #[b TL;DR]. Log in to your second account on that service, continue authenticating on FeedGal.
        | #[b TL;DR2]. Use FeedGal in incognito or private mode only to connect the new account.
        | #[br]
        | #[b CRITICAL]. If you signed up with the account from the service that forces you to take the "convenient log in", I am very sorry
        | that you can't connect your other account on the same service while your 'Login account' is from that service.
        | #[br]
        | Method 1
        | #[br]
        | You must be very confused that FeedGal says you could connect multiple accounts, but it doesn't seem like so for some services.
        | We are very disappointed as well to inform you about this, but some services won't let you log in or choose another account that
        | you want to connect when you are authenticating.
        | #[br]
        | Well, this is certainly convenient when logging in with your primary account from that service, but it's definitely not when you
        | want to use connect your other accounts or sign up por log in with your second account for sign up.
        | #[br]
        | Viable solution, though not very convenient, is to visit the service website, log out from your primary account, log in to your
        | account that you want to login, signup, or connect, comeback to FeedGal then use your account.
        | #[br]
        | Logging out from your account that's connected to FeedGal from a service does not remove it from FeedGal, so don't worry.
        | #[br]
        | Once your account is connected, you should be good to go (If you have any issues, please report to us).
        | #[br]
        | Method 2
        | #[br]
        | This requires using incognito or private mode on the browser. Open your browser in incognito (Chrome) or private (Firefox) mode.
        | Navigate to Feedgal.com. Login. You need to enter your user name and password in this mode when you could just click your
        | way through with browser in 'normal mode'. This is the same when you are connecting your other accounts, unless you have already
        | authenticated while your 'private mode' browsers are open. 
        | #[br]
        | Very sorry fo the inconvenience.

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

<style>
.anchor-header {
  display: block;
  position: relative;
  top: -100px;
  visibility: hidden;
}
</style>