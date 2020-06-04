import axios, { AxiosResponse } from "axios"

type JsonObj = { [keyname:string]:any }

export type ReqData = { params?:JsonObj, data?:JsonObj }

/**
 * DO NOT OVERENGINEER DO NOT OVERENGINEER DO NOT OVERENGINEER DO NOT OVERENGINEER DO NOT OVERENGINEER 
 * DO NOT OVERENGINEER DO NOT OVERENGINEER DO NOT OVERENGINEER DO NOT OVERENGINEER DO NOT OVERENGINEER 
 * DO NOT OVERENGINEER DO NOT OVERENGINEER DO NOT OVERENGINEER DO NOT OVERENGINEER DO NOT OVERENGINEER 
 * 
 * Some services use `access_token` only but some use a combination of `access_token` and
 * client-id or consumer key (eg. Trello).
 * 
 * @param method 
 * @param url The 'pathname' to be appended to the `baseURL` in the `default_axios_config`
 * @param default_axios_config MUST have `baseURL`
 * @param req_data 
 */
export async function makeRequest(method:string, url:string, default_axios_config:any, req_data?:ReqData):Promise<AxiosResponse> {
  /**
   * set request data into `default_axios_config`
   */
  if(req_data != undefined) {
    ["params", "data"].forEach((_keyname) => {
      const keyname = <"params"|"data">_keyname
      /**
       * It is important to prevent adding an empty JSON `{}`, especially to `data` property.
       * For example, google calendar API will throw error for this case. In this case, not
       * including the `data` property at all resolves the issue. And that's exactly what we
       * are doing here.
       */
      if(keyname in req_data && req_data[keyname] != undefined && Object.keys(<JsonObj>req_data[keyname]).length > 0) {
        if(! (keyname in default_axios_config)) {
          default_axios_config[keyname] = req_data[keyname]
        }
        else {
          /**
           * Override for now. Could implement `setAxiosConfigCb` in the future.
           */
          Object.assign(default_axios_config[keyname], req_data[keyname])
        }
      }
    })
  }

  const axios_config = Object.assign({}, default_axios_config, { method, url })

  return await axios(axios_config)
}