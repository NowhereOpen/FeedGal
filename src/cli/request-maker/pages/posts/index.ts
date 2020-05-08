import axios from "axios"
import { UrlsGystResource } from "~/src/common/urls"

import { PostForm } from "~/src/common/types/gyst-post"

export async function createNewPost(gyst_post:PostForm) {
  return axios.post(UrlsGystResource.createGystPost(), { gyst_post })
}

export async function updatePost(post_id:string, gyst_post:PostForm) {
  return axios.patch(UrlsGystResource.updateGystPost(post_id), { gyst_post })
}

export async function deletePost(post_id:string) {
  return axios.delete(UrlsGystResource.deleteGystPost(post_id))
}

export async function unsave(service_id:string, entry_uid:string) {
  return axios.delete(UrlsGystResource.unsaveSavedGystEntry(service_id, entry_uid))
}

export async function convertGystEntryToPost(service_id:string, entry_uid:string) {
  return axios.patch(UrlsGystResource.convertGystEntryToPost(service_id, entry_uid))
}