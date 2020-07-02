<template lang="pug">
div
  v-card
    v-card-text
      div You are signing up using #[span.signup-service-name {{ $route.query.service_id }}].
      div.check-user-id-container(v-if="signup_form.user_id") Is this you? #[b.check-user-id {{ signup_form.user_id }}]
      div #[v-icon(color="yellow") mdi-alert] This is not me! #[a(href="/about#issue1") Solution]
      v-text-field.friendly-name-form(
        v-model="signup_form.friendly_name"
        :rules="[validateSignupForm]"
        label="Displayed name"
      )
    v-card-actions
      v-btn.signup-btn(
        @click="onSignupBtnClick"
        :disabled="validateSignupForm() != undefined"
      ) Sign up
      v-btn.cancel-btn(@click="onCancelBtnClick") Cancel
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"

import * as requestMaker from "~/src/cli/request-maker"

// Types
import { SignupForm } from "~/src/common/types/pages/signup-oauth"

/**
 * 2020-06-28 00:03
 * 
 * Do not use `$router` expecting the page to reload after changing the url. Refer to:
 * 
 *   - https://forum.vuejs.org/t/this-router-push-doesnt-reload-the-page/39700
 * 
 * The client side router isn't expected to reload. This is important especially with
 * server side data injection because using `$router` doesn't let the server side data
 * injection to happen. So, when the user is redirectted to `/login` nothing will
 * appear on that page.
 */

@Component({
  components: {}
})
export default class OAuthSignupPage extends Vue {
  signup_form:SignupForm = {
    friendly_name: "",
    user_id: ""
  }

  service_id:string = ""

  created() {
    /**
     * 2020-06-29 23:23
     * 
     * Refer to `src/server/gyst-server/express-server-endpoint-collection/endpoints/oauth/callback-handler-redirect.ts` for search parameters included
     * in the url.
     */
    this.signup_form.friendly_name = <string> (this.$route.query.friendly_name != undefined ? this.$route.query.friendly_name : this.$route.query.user_id)
    this.signup_form.user_id = <string>this.$route.query.user_id
    this.service_id = <string>this.$route.query.service_id
  }

  async onSignupBtnClick() {
    if(this.signup_form.friendly_name.trim() == "") {
      this.alertBadSignupFormEmptyFriendlyName()
      return
    }

    try {
      await requestMaker.oauth_signup.createNewAccount(this.signup_form)
      this.visit("/login", { relogin: true })
    }
    catch(e) {
      if("response" in e && e.response.status == 403 && e.response.data.name == "MUST_BE_ANON_USER") {
        alert("You are already logged in. Redirecting to '/login' in a few seconds.")
        setTimeout(() => this.visit("/login"), 2000)
        return
      }
      else if("response" in e && e.response.status == 400 && e.response.data.name == "BAD_SIGNUP_FORM") {
        this.alertBadSignupFormEmptyFriendlyName()
        return
      }
      throw e
    }
  }

  validateSignupForm():string|undefined {
    if(this.signup_form.friendly_name.trim() == "") {
      return "Friendly name must not be empty."
    }
  }

  alertBadSignupFormEmptyFriendlyName() {
    alert("Friendly name must not be empty.")
  }

  async onCancelBtnClick() {
    /**
     * Revoke the access token, or something.
     */
    await requestMaker.oauth_signup.cancelSignup()
    this.visit("/login")
  }

  visit(pathname:string, params?:any) {
    let parameters = ""
    if(params) {
      const sp = new URLSearchParams(params)
      parameters = sp.toString()
    }
    location.replace(`${pathname}?${parameters}`)
  }
}
</script>
