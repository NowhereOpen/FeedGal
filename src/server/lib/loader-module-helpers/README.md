# Raw services library

The modules written for this library MUST NOT know about GYST and its related data structures or libraries. So there MUST NOT be retrieving data from database or using `GystRequestData`. The libraries here should work directly with the user name, access token, and some OAuth1 libraries, with token data.

The modules written here should be able to be useful on its own.

The modules written here should help shortening the code of gyst services.

For example Twitch "Live channels that I followed" isn't provided by Twitch, so we create a module here. This isn't GYST specific function and should be useful on its own.

GYST related handling should be done in the `gyst-services` modules, not in the files stored here.

This library should provide functions that will be used in `runRequest` of gyst-services, basically a general request handler. And DO NOT couple all of these general request handler. I would say that's over engineering.