import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

// Model
import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"
import { gyst_user_storage } from "~/src/server/model-collection/models/user"
import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"

// Types
import { SignupForm } from "~/src/common/types/pages/signup-oauth"
import { UserInfo } from "~/src/server/gyst-server/common/session"

export class PostCreateNewAccountRequestHandler extends SessionRequestHandlerBase {
  // Signup form from `signup/oauth` page
  signup_form!:SignupForm
  token_data!:any
  authenticated_user_info!:UserInfo
  service_id!:string
  gyst_user_id!:string

  async storeParams():Promise<void> {
    this.signup_form = this.req.body.signup_form

    const { service_id, token_data, user_info } = this.getDataForSignup()

    this.token_data = token_data
    this.authenticated_user_info = user_info
    this.service_id = service_id
  }

  async doTasks():Promise<void> {
    // Must have "friendly_name"
    this.gyst_user_id = await gyst_user_storage.createNewGystUser(this.signup_form)

    const oauth_connected_user_entry_id = await oauth_connected_user_storage!.connectAsSignup(
      this.gyst_user_id,
      this.service_id,
      this.authenticated_user_info,
      this.authenticated_user_info.json_content
    )
  
    await oauth_access_token_storage!.storeTokenData(this.service_id, oauth_connected_user_entry_id, this.token_data)
  
    // gystSession.loginUser(req, user_id)
    
    this.clearDataForSignup()
  
    console.log(`[create-new-account] Successfully created a new account with:`)
    console.log(`(user id='${this.gyst_user_id}', oauth service='${this.service_id}')`)
    console.log(this.authenticated_user_info)
    console.log(`[create-new-account] End of log`)
  }

  async getResponse():Promise<any> {
    return { user_id: this.gyst_user_id }
  }
}