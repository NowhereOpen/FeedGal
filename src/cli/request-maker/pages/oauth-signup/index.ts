import axios from "axios"
import { UrlsGystResource } from "~/src/common/urls"

export async function createNewAccount(signup_form:any) {
  return await axios.post(UrlsGystResource.createNewAccountWithOAuth(), { signup_form })
}

export async function cancelSignup() {
  return await axios.post(UrlsGystResource.cancelSignupWithOAuth())
}