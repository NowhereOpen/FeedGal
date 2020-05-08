import axios from "axios"
import { UrlsGystResource } from "~/src/common/urls"

export async function loadSettings() {
  return await axios.get(UrlsGystResource.loadSettings())
}

export async function deleteSetting(service_id:string, index:number) {
  return await axios.post(
    UrlsGystResource.deleteSetting(service_id),
    { index }
  )
}

export async function toggleService(service_id:string) {
  return await axios.post(
    UrlsGystResource.toggleService(),
    { service_ids: [service_id] }
  )
}

export async function createNewSettingValue(service_id:string, form:{ value: string }) {
  return await axios.post(
    UrlsGystResource.createNewSettingValue(service_id),
    form
  )
}

export async function updateSettingValue(service_id:string, form:{ value: string, index:number }) {
  return await axios.patch(
    UrlsGystResource.updateSettingValue(service_id),
    form
  )
}

export async function disconnectService(service_id:string) {
  return await axios.get(UrlsGystResource.disconnectService(service_id))
}

export async function getGoogleCalendars() {
  return await axios.get(UrlsGystResource.getGoogleCalendars())
}