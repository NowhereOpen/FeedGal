import * as _gyst from "./pages/gyst"
import * as _login from "./pages/login"
import * as _oauth_signup from "./pages/oauth-signup"
import * as _posts from "./pages/posts"
// import * as _settings from "./pages/settings"
import * as suites from "./pages/settings/gyst-suites"
import * as settings_user from "./pages/settings/user"
import * as _signup from "./pages/signup"
import * as _user from "./pages/user"

export const gyst = _gyst
export const login = _login
export const oauth_signup = _oauth_signup
export const posts = _posts
export const settings = {
  suites,
  user: settings_user
}
export const signup = _signup
export const user = _user

export const pages = {
  gyst,
  login,
  oauth_signup,
  posts,
  settings,
  signup,
  user
}

export default pages