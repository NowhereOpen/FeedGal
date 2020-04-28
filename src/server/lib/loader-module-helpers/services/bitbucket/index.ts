import * as common from "../../common"

export async function makeRequest(method:string, path:string, access_token:string, req_data?:any) {
  return await common.makeRequest(method, path, {
    baseURL: "https://api.bitbucket.org/2.0/",
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  }, req_data)
}

export async function getUserInfo(access_token:string) {
  return await makeRequest("get", "2.0/user", access_token)
}