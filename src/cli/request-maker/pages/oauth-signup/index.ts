import axios from "axios"
import { UrlsGystResource } from "~/src/common/urls"

// Types
import { SignupForm } from "~/src/common/types/pages/signup-oauth"

export async function createNewAccount(signup_form:SignupForm) {
  return await axios.post(UrlsGystResource.createNewAccountWithOAuth(), { signup_form })
}

export async function cancelSignup() {
  return await axios.post(UrlsGystResource.cancelSignupWithOAuth())
}