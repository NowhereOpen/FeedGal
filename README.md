# Installing and running on fresh GCP VM instance

```
sudo apt update
sudo apt install vim git

# Check installation
# > git --version
# > vim --version

# Install nvm for installing node & npm
# Refer to: https://github.com/nvm-sh/nvm#install--update-script
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
source ~/.bashrc

# Check installation
# > nvm --version

# Install node
nvm install node

# Check installation
# > node --version
# > npm --version

# Install mongodb.
# Refer to: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
sudo apt-get update
# Go over installation
sudo apt-get install -y mongodb-org

# Set auto start mongod
sudo systemctl enable mongod.service

# Start mongo
sudo service mongod start
# Check status
# > sudo service mongod status

# Download gyst
git clone https://chulman444@github.com/chulman444/gyst-wip && cd gyst-wip

# Install essential package required in installing node packages for gyst
sudo apt-get install build-essential

# Install node packages
npm i

# Edit your settings in `app-settings.yml` and `service-credentials.yml`.

# Run gyst
NUXT_HOST=0.0.0.0 NUXT_PORT=3000 npm run dev &> ~/gyst-log.txt &

# Install this to use `netstat`
sudo apt install net-tools

# Test that the server is running properly
# > netstat -tnlp
```

VM machine type. > `f1-micro`. `f1-micro` lags and can't even compile the code.

## Running the server on port 80

When you have a proper domain, you may want to serve GYST on port 80.

Make sure to update `app-settings.yml` "ext-host" option to the domain name instead of `localhost` or an external ip.

```
# Make node and npm available in sudo
# Refer to:
#   * https://stackoverflow.com/a/5062718
#   * If using nvm: https://stackoverflow.com/a/40078875
sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/node" "/usr/local/bin/node"
sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/npm" "/usr/local/bin/npm"

# Run gyst
sudo NUXT_HOST=0.0.0.0 NUXT_PORT=3000 npm run dev &> ~/gyst-log.txt
```

## HTTPS

Set `app-settings.yml > server > protocol` to `https` and run with `NUXT_PORT=443` as needed.

### Self signed certificate

This works when running on `localhost` ([ref](https://timonweb.com/posts/running-expressjs-server-over-https/)).

```
openssl req -nodes -new -x509 -keyout sslcert/server.key -out sslcert/server.cert
```

### Certbot

Following instructions from certbot instruction [page](https://certbot.eff.org/instructions).

This doesn't work with `localhost` or `127.0.0.1`.

# Development

Should be helpful for development and in case I forget my own code.

## Project structure

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

## Models

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

## Add your own service

#### pages-info.yml

Stores url path and target file name. E.g., `’/s/my-service’: ‘./index.vue’`

## Pages

  - index
  - login
  - oauth-signup
  - settings
  - signup
  - user

### / Index page

Gyst entries are loaded.

### /login

Login/signup with gyst login or oauth.

### /oauth-signup

When the user chose a service from `/login` page, and it's the first time the user used that service for gyst, the user needs to provide basic user information to be associated with gyst and the service he/she chose, such as the user name.

### /settings

Some services REQUIRE setting values to be used. This is the page where setting values are updated.

User can update gyst suite on this page.

User can connect other services from this page.

User can update so that some services that are connected are not loaded.

### /signup

A page for filling out the form for gyst login (refer to "gyst-login" model in Models)

### /user

User can logout, delete account or modify user settings from this page.

User settings include privacy settings, user name, and much more.