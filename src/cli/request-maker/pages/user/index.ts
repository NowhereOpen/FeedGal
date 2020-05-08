import axios from "axios"
import { UrlsGystResource } from "~/src/common/urls"

export async function getLoginStatus() {
  return await axios.get(UrlsGystResource.getLoginStatus())
}

export async function login(login_form:any) {
  return await axios.post(UrlsGystResource.login(), { login_form })
}

export async function logout() {
  return await axios.get(UrlsGystResource.logout())
}

export async function deleteUser() {
  return await axios.delete(UrlsGystResource.deleteUser())
}