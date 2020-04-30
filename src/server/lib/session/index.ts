import _ from "lodash"

type UserInfo = any

type UserId = string
type SessionContainer = { session:any }

function log(...args:any[]) {
  console.log("[gyst-session]", ...args)
}

export function loginUser(session_container:SessionContainer, user_id:string) {
  session_container.session.user_id = user_id
}

/**
 * 
 * Returns undefined if the current session is not yet logged in or
 * the app started as a single user mode.
 * 
 * @param req 
 */
export function getLoggedInUserId(session_container:SessionContainer):UserId {
  const user_id = session_container.session.user_id
  const is_invalid = user_id == undefined

  /**
   * Throw error. Assume that this is used after middleware that checks
   * for user's loggin status. Then if the user is not logged in, in which
   * case, `user_id == undefined`, it's handled by the middleware.
   */
  if(is_invalid) {
    const e = new Error("User is not logged in.")
    e.name = "USER_NOT_LOGGED_IN"
    throw e
  }

  return user_id
}

export function isLoggedin(session_container:SessionContainer) {
  const case1 = "user_id" in session_container.session
  const user_id = session_container.session.user_id
  // NOT includes null, undefined
  const case2 = ! [null, undefined].includes(user_id)

  return case1 && case2
}

export function logout(session_container:SessionContainer) {
  if(isLoggedin(session_container)) {
    const user_id = session_container.session.user_id
    log(`User with user_id (${user_id}) logging out.`)
    delete session_container.session.user_id
    session_container.session.save((err:any) => {
      if(err) throw err
    })
  }
  else {
    throw Error("The current session is not logged in")
  }
}

export type DataForSignup = { service_id:string, user_info:UserInfo, token_data:any }

/**
 * Will be stored into the server when the user completest the signup process
 */
export function storeDataForSignup(session_container:SessionContainer, service_id:string, user_info:UserInfo, token_data:any) {
  session_container.session.signup = <DataForSignup> { service_id, user_info, token_data }
}

export function getDataForSignup(session_container:SessionContainer):DataForSignup {
  return session_container.session.signup
}

export function clearDataForSignup(session_container:SessionContainer) {
  delete session_container.session.signup
}

export function isSigningUp(session_container:SessionContainer) {
  return "signup" in session_container.session && ["user_info", "token_data"].every(prop => prop in session_container.session.signup)
}