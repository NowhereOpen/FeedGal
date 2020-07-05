<template lang="pug">
div
  v-card.gyst-login-container
    v-card-title
      h2 Login with GYST account
    v-card-text
      v-text-field.login-form-user-id(
        v-model="login_form.user_id"
        label="User name"
        @keypress="onLoginFormKeypress"
      )
      v-text-field.login-form-password(
        v-model="login_form.password"
        type="password"
        label="Password"
        @keypress="onLoginFormKeypress"
      )
      //- div or
      //- v-text-field.login-form-token(
      //-   v-model="login_form.signup_token"
      //-   type="password"
      //-   label="Use sign up token"
      //-   @keypress="onLoginFormKeypress"
      //- )
    v-card-actions.login-actions-container
      v-btn.login-btn(@click="onLoginClick") Login
      span.login-error-message.ml-4.red--text(v-if="login_form_error") {{ login_form_message }}  
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"
import requestMaker from "~/src/cli/request-maker"

@Component
export default class LoginForm extends Vue {
  login_form = {
    user_id: "",
    password: "",
    // signup_token: ""
  }

  login_form_message:string = ""
  login_form_error:boolean = false

  onLoginFormKeypress($event:any) {
    // Detect "enter" keypress
    if($event.which == 13) {
      this.login()
    }
  }

  async onLoginClick() {
    this.login()
  }

  async login() {
    try {
      const { data } = await requestMaker.user.login(this.login_form)
      this.$emit("login", data)
    }
    catch(e) {
      if("response" in e && e.response.status == 422) {
        this.login_form_message = e.response.data.msg
        this.login_form_error = true
      }
    }
  }
}
</script>