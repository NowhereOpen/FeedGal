import Twitter from "twitter"

type TwitterCred = {
  access_token_key:string,
  access_token_secret:string,
  consumer_key:string,
  consumer_secret:string
}

/**
 * https://www.npmjs.com/package/twitter
 * 
 * The return type is `any`. As for the `search.json` API, which is used in getting replies,
 * it returns an object of structure `{ statuses, search_metadata }` while it's an array of
 * tweets for `stasuses/home_timeline.json`.
 * 
 * `account/verify_credentials` also returns a non-array JSON.
 * 
 * @param method        Only get, post, and stream
 * @param path           The "api path" such as `statuses/show/:id`.
 * @param twitter_cred  TwitterCred type with four keys
 * @param params        I don't think this is the "url query parameter". Twitter module handles this.
 */
export async function makeRequest(method:"get"|"post"|"stream", path:string, twitter_cred:TwitterCred, params?:any):Promise<any> {
  const twitter = new Twitter(twitter_cred)

  const tweets = await new Promise((res, rej) => {
    const cb = (error:any, tweets:any, response:any) => {
      if(error) {
        return rej(error)
      }
      res(tweets)
    }

    // Promise is resolved in the `cb`
    if(params != undefined && Object.keys(params).length > 0) {
      twitter[method](path, params, cb)
    }
    else {
      twitter[method](path, cb)
    }
  })

  return tweets
}

export async function getUserInfo(twitter_cred:TwitterCred) {
  const body = await makeRequest("get", "account/verify_credentials.json", twitter_cred, { include_email: true })
  return body
}

export async function getHomeTimeline(twitter_cred:TwitterCred, params?:any) {
  return await makeRequest("get", "statuses/home_timeline.json", twitter_cred, params)
}

/**
 * There is no one API to get replies for a tweet. This function implements one of the suggested
 * methods in the following SO post:
 * 
 *   - https://stackoverflow.com/questions/2693553/replies-to-a-particular-tweet-twitter-api
 * 
 * @param tweet_id 
 * @param screen_name 
 * @param twitter_cred 
 */
export async function getRepliesWithTweetIdAndScreenName(tweet_id:string, screen_name:string, twitter_cred:TwitterCred) {
  const res_data = await makeRequest("get", "search/tweets.json", twitter_cred, {
    q: `to:${screen_name}`,
    since_id:tweet_id,
    /**
     * Using `result_type: "popular"` will make this function return an empty array, probably because
     * the API doesn't know that I want popular 'replies' to the `tweet_id`, not ANY tweet to the user
     * identified by the `screen_name`.
     */
    // result_type: "popular"
  })
  const replies = res_data.statuses.filter((tweet:any) => (tweet.in_reply_to_status_id_str == tweet_id) && (tweet.id_str != tweet_id))
  return replies
}

/**
 * Makes two requests. First to get the tweet object to fetching the `screen name` of the tweet author.
 * 
 * Then another request through `getRepliesWithTweetIdAndScreenName`
 * 
 * @param tweet_id 
 * @param twitter_cred 
 */
export async function getRepliesWithTweetId(tweet_id:string, twitter_cred:TwitterCred) {
  const tweet = await getTweetWithTweetId(tweet_id, twitter_cred)
  const screen_name:string = tweet.user.screen_name
  const replies = await getRepliesWithTweetIdAndScreenName(tweet, screen_name, twitter_cred)
  
  return replies
}

export async function getTweetWithTweetId(tweet_id:string, twitter_cred:TwitterCred) {
  return <any> await makeRequest("get", `statuses/show/${tweet_id}`, twitter_cred)
}