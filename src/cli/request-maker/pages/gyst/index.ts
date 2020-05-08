import axios from "axios"
import { UrlsGystResource } from "~/src/common/urls"

export async function loadGystEntries(service_id:null|string) {
  let pathname
  if(typeof service_id == "string") {
    pathname = UrlsGystResource.loadGystEntriesWithServiceId(service_id)
  }
  else {
    pathname = UrlsGystResource.loadGystEntries()
  }

  return await axios.get(pathname)
}

export async function loadGystEntriesWithPagination(service_id:null|string, services_pagination_data:any) {
  let url
  if(typeof service_id == "string") {
    url = UrlsGystResource.loadGystEntriesWithServiceIdWithPagination(service_id, "old")
  }
  else {
    url = UrlsGystResource.loadGystEntriesWithPagination("old")
  }
  return await axios.post(url, { services_pagination_data })
}

export async function saveToggleToMyPost(gyst_entry:any) {
  return axios.post(UrlsGystResource.saveGystEntry(), { gyst_entry })
}