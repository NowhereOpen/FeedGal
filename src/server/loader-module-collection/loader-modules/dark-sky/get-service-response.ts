import { GetServiceResponse } from "~/src/gyst/server/base-class/service-module/get-service-response"

export class GetDarkSkyServiceResponse extends GetServiceResponse {
  async run() {
    const api_key = this.credential
  }
}