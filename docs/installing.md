# Installing

Installing

After creating a new Ubuntu VM instance, install:

  - vim, git, nvm, node, npm, build-essential, mongo
  - oauth-module-suite
  - netstat (optional)

## Set up environment

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
```

## Install oauth-module-suite

FeedGal requires a module called `oauth-module-suite` ([link](https://github.com/NowhereOpen/oauth-module-suite.git)) currently only served on github.

```
cd local_modules
git clone https://github.com/NowhereOpen/oauth-module-suite.git
cd oauth-module-suite
npm i
# Build the module
npm run ttsc
```

## Install optional netstat

```
# Install this to use `netstat`
sudo apt install net-tools

# Test that the server is running properly
# > netstat -tnlp
```

# Running

## Run on 3000

Nuxt is configured to run on the port 3000 by default

```
# Install node packages
npm i

# Edit your settings in `app-settings.yml` and `service-credentials.yml`.

# Run gyst
NUXT_HOST=0.0.0.0 npm run dev &> ~/gyst-log.txt &
```

VM machine type. > `f1-micro`. `f1-micro` lags and can't even compile the code.

## Running the server publicly

When you have a proper domain, you may want to serve GYST on port 80 or 443.

Make sure to update `app-settings.yml`:

  - REQUIRED. `ext-host` option to the domain name instead of `localhost` or an external ip. The empty value resorts to `localhost`.
  - `is-public`. Setting this to `true` will override `protocol` and `port` options and run with `NUXT_HOST=0.0.0.0` and `PORT=443` automatically.

```
# Make node and npm available in sudo
# Refer to:
#   * https://stackoverflow.com/a/5062718
#   * If using nvm: https://stackoverflow.com/a/40078875
sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/node" "/usr/local/bin/node"
sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/npm" "/usr/local/bin/npm"

# Run gyst
sudo npm run dev &> ~/gyst-log.txt
```

### Self signed certificate

This works when running on `localhost` ([ref](https://timonweb.com/posts/running-expressjs-server-over-https/)).

```
openssl req -nodes -new -x509 -keyout sslcert/server.key -out sslcert/server.cert
```

### Certbot

Following instructions from certbot instruction [page](https://certbot.eff.org/instructions).

This doesn't work with `localhost` or `127.0.0.1`.