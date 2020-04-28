import axios from "axios"

import * as common from "../../common"
import { ReqData } from "../../common"

export async function makeRequest(method:string, path:string, access_token:string, req_data:ReqData) {
  const axios_config:any = {
    params: { access_token },
    baseURL: "https://www.googleapis.com"
  };

  const { data } = await common.makeRequest(method, path, axios_config, req_data)
  return data
}

export async function getUserInfo(access_token:string) {
  const { data } = await axios.get("https://openidconnect.googleapis.com/v1/userinfo", { params: { access_token } })
  return data
}