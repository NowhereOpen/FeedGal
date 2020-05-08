<template lang="pug">
div
  v-card
    v-card-text
      div You are signing up using #[span.signup-service-name {{ $route.query.service_id }}].
      div.check-user-id-container(v-if="signup_form.user_id") Is this you? #[span.check-user-id {{ signup_form.user_id }}]
      v-text-field.friendly-name-form(
        v-model="signup_form.friendly_name"
        label="Displayed name"
      )
    v-card-actions
      v-btn.signup-btn(@click="onSignupBtnClick") Sign up
      v-btn.cancel-btn(@click="onCancelBtnClick") Cancel
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"

import * as requestMaker from "~/src/cli/request-maker"

@Component({
  components: {}
})
export default class OAuthSignupPage extends Vue {
  signup_form = {
    friendly_name: "",
    user_id: ""
  }

  created() {
    this.signup_form.friendly_name = <string> (this.$route.query.friendly_name != undefined ? this.$route.query.friendly_name : this.$route.query.user_id)
    this.signup_form.user_id = <string>this.$route.query.user_id
  }

  async onSignupBtnClick() {
    try {
      await requestMaker.oauth_signup.createNewAccount(this.signup_form)
      this.$router.push("/login?relogin=true")
    }
    catch(e) {
      if("response" in e && e.response.status == 403 && e.response.data.name == "INVALID_SESSION") {
        this.$router.push("/login")
        return
      }
      else if("response" in e && e.response.status == 400 && e.response.data.name == "LOGIN_EXISTS") {
        this.$router.push("/login?error=signup_exists")
        return
      }
      throw e
    }
    // this.$router.push("/gyst", () => {
    //   window.location.reload(true)
    // })
  }

  async onCancelBtnClick() {
    /**
     * Revoke the access token, or something.
     */
    await requestMaker.oauth_signup.cancelSignup()
    this.$router.push("/login")
  }
}
</script>
