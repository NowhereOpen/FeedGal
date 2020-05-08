import axios from "axios"
import { UrlsGystResource } from "~/src/common/urls"

export async function getOAuthInfos() {
  return await axios.get(UrlsGystResource.getOAuthInfos())
}