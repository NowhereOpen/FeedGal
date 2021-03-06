<template lang="pug">
div
  div
    div.not-logged-in-container(v-if="is_logged_in == false")
      OAuthLogin(ref="oauth-login")

    div.logged-in-container(v-else)
      div You are already logged in as '#[span.friendly-name {{ user_info.friendly_name }}]'
      v-btn(@click="onLogoutClick") Logout
      div Want to update your user settings? Do it #[a(href="/settings/user") here].
    
    div
      v-dialog(
        width="500"
        v-model="messages.relogin"
      )
        v-card
          v-card-title.headline.blue Signup successful!
          v-card-text
            div Please login again.
          v-card-actions
            v-btn(@click="messages.relogin = false") Confirm
      v-dialog(
        width="500"
        v-model="messages.error.signup_exists"
      )
        v-card
          v-card-title.headline.red Signup failed...
          v-card-text
            div Signup information already exists. Please signup with different account.
          v-card-actions
            v-btn(@click="messages.error.signup_exists = false") Confirm
</template>

<script lang="ts">
import { Vue, Component, State } from "nuxt-property-decorator"

import OAuthLogin from "~/components/page-login/oauth-login/OAuthLogin.vue"

import * as requestMaker from "~/src/cli/request-maker"
import { UserInfo, OAuthInfos } from "~/src/common/types/pages/login"

@Component({
  components: { OAuthLogin }
})
export default class LoginPage extends Vue {
  @State(state => state.session.is_logged_in) is_logged_in!:boolean
  @State(state => state['page-login'].user_info) user_info!:UserInfo
  @State(state => state['page-login'].oauth_infos) oauth_infos!:OAuthInfos

  // Display message
  messages = {
    relogin: false,
    error: {
      signup_exists: false
    }
  }

  mounted() {
    console.log(`Login page mounted hook. is_logged_in (${this.is_logged_in})`)

    this.handleMessage()

    if(this.is_logged_in == false) {
      ;(<OAuthLogin> this.$refs["oauth-login"]).loadSupportedOAuthServices(this.oauth_infos)
    }
  }

  handleMessage() {
    const relogin = this.$route.query.relogin
    const error = this.$route.query.error

    if(relogin == "true") {
      this.messages.relogin = true
      return
    }
    
    if(error == "signup_exists") {
      this.messages.error.signup_exists = true
    }
  }

  onLogin(data:any) {
    this.$router.push("/user")
  }

  async onLogoutClick() {
    const response = await requestMaker.user.logout()
    const data = response.data
    
    setTimeout(() => {
      location.reload(true)
    }, 1500)
  }
}
</script>
