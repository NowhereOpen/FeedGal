/**
 * 2020-07-10 09:02 
 * 
 * Run with `npx ts-node -P tsconfig-server.json -r tsconfig-paths/register .../collect-samples`
 */
import axios from "axios"
import Parser from "rss-parser"
import fs from "fs"
import path from "path"

class SaveBadUrls {
  urls:any[] = []
  fp:string
  constructor(fp:string) {
    this.fp = fp
  }
  add(url:string, error:any) {
    this.urls.push({ url, error, error_message: error.message })
  }

  saveBadUrls() {
    const count = this.urls.length
    console.log(`Found ${count} bad urls.`)
    if(this.urls.length > 0) {
      const old_content = fs.existsSync(this.fp) ? JSON.parse(fs.readFileSync(this.fp, "utf-8")) : []
      console.log(`Adding to existing ${old_content.length} bad urls.`)
      const new_content = old_content.concat(this.urls)
      fs.writeFileSync(this.fp, JSON.stringify(new_content, null, 2), "utf-8")
    }
  }
}

async function main() {
  const bad_urls_fp = path.join(__dirname, "./bad-urls.json")
  const all_urls:string[] = require("./urls.json")
  const bad_urls_entries:any[] = fs.existsSync(bad_urls_fp) ? require("./bad-urls.json") : []
  const bad_urls = bad_urls_entries.map(entry => entry.url)

  const save_bad_urls = new SaveBadUrls(bad_urls_fp)
  const parser = new Parser()

  const urls = all_urls.filter(url => bad_urls.includes(url) == false)
  // const urls = bad_urls

  console.log(`Retrieving RSS feeds for the following ${urls.length} urls:`)
  console.log(urls)

  await Promise.all(
    urls.map(async url => {
      try {
        const response = await parser.parseURL(url)
        const title = response.title
        fs.writeFileSync(path.join(__dirname, "./samples", title + ".json"), JSON.stringify(response, null, 2), "utf-8")
      }
      catch(e) {        
        await convertErrorAttempt(url)
        save_bad_urls.add(url, e)
      }
    })
  )

  save_bad_urls.saveBadUrls()
}

main()

async function convertErrorAttempt(url:string) {
  console.log(`rss-parser threw error for ${url}`)
  console.log(`Check if it's because the url points to a html page.`)
  try {
    const response = await axios.get(url, { headers: { 'User-Agent': 'rss-parser', 'Accept': 'application/rss+xml', }})
    console.log(url, response)
  }
  catch(e) {
    if(e.response == undefined) {
      /**
       * 2020-07-10 12:02
       * 
       * Errors like `ENOTFOUND`, `UNABLE_TO_VERIFY_LEAF_SIGNATURE` are caught in here, and are actually NODE stuff.
       */
      console.log(e.toJSON())
    }
    else {
      console.log(url, e.response.status)
    }
  }
}