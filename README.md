# Project structure

```
service-modules/
  <service-name>/
    server/
      service-info.yml
      get-gyst-entries.ts
        - getResponse
        - formatToGystEntry
        - getPaginationOption
        - loadSettingValues
    client/
      ServiceSetting.vue
      ServiceSettingEditor.vue
    pages/
      pages-info.yml
credential-modules/
  oauth/
    <service name>-<oauth version>.ts
  <service name>.ts
models/
  gyst-entry-cache
  gyst-login
  gyst-post
  gyst-suite
  gyst-user
  login-method
  oauth-access-token
  oauth-connected-user
  service-setting
  user-setting
```

# Models

#### gyst-entry-cache

Cached entries. Stores the exact response instead of the gyst format so that it can be used for testing response-to-gyst-format method.

#### gyst-login

Not to be confused with gyst-user.

Stores login id/name and password.

#### gyst-post

Stores user posted posts and any gyst entries that are loaded from another service that are shared by the user. Stores privacy settings for each post; share with friends only, private post, share with all gyst users, etc.

#### gyst-suite

#### gyst-user

Not to be confused with gyst-login and oauth-connected-user.

Stores information about the user excluding credentials.

#### login-method

Stores login method of a `gyst-user` entry. It’s either `gyst` which means that the user logins in using login id/name and password, or `oauth` which means the user clicks on "login/signup with [service name]".

#### oauth-access-token

#### oauth-connected-user

#### service-setting

#### user-setting

Stores user specific settings including privacy settings.

# Add your own service

#### pages-info.yml

Stores url path and target file name. E.g., `’/s/my-service’: ‘./index.vue’`

# Pages

  - index
  - login
  - oauth-signup
  - settings
  - signup
  - user

## / Index page

Gyst entries are loaded.

## /login

Login/signup with gyst login or oauth.

## /oauth-signup

When the user chose a service from `/login` page, and it's the first time the user used that service for gyst, the user needs to provide basic user information to be associated with gyst and the service he/she chose, such as the user name.

## /settings

Some services REQUIRE setting values to be used. This is the page where setting values are updated.

User can update gyst suite on this page.

User can connect other services from this page.

User can update so that some services that are connected are not loaded.

## /signup

A page for filling out the form for gyst login (refer to "gyst-login" model in Models)

## /user

User can logout, delete account or modify user settings from this page.

User settings include privacy settings, user name, and much more.