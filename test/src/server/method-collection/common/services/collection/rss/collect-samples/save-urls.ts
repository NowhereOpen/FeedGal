import axios from "axios"
import fs from "fs"
import path from "path"
const { JSDOM } = require("jsdom")

async function saveUrls() {
  const target_path = path.join(__dirname, "./urls.json")
  if(fs.existsSync(target_path)) {
    console.error(`Error. File already exists. Remove before saving urls.`)
    return
  }
  const urls = await (await Promise.all([getRssUrlsFromFeederCo(), getRssUrlsFromRssCom()])).reduce((urls, _urls) => urls.concat(_urls), [])
  fs.writeFileSync(target_path, JSON.stringify(urls, null, 2), "utf-8")
}
saveUrls()

async function getRssUrlsFromFeederCo() {
  const page_url = "https://feeder.co/knowledge-base/rss-content/popular-rss-feeds/"
  const { data } = await axios.get(page_url)
  const document = new JSDOM(data).window.document

  const trash_chars = "https://feeder.co/add-feed?url="
  const trash_chars_length = trash_chars.length
  const urls = Array.from(document.querySelectorAll(".entry-content a")).map((el:any) => el.href.substring(trash_chars_length))
  return urls
}

async function getRssUrlsFromRssCom() {
  const page_url = "https://rss.com/blog/popular-rss-feeds/"
  const { data } = await axios.get(page_url)
  const document = new JSDOM(data).window.document
  const urls = Array.from(document.querySelectorAll(".elementor-section-wrap .elementor-button-link"))
    .map((el:any) => el.href)
    .filter((href:string) => ["//podcasts.apple.com", "//rss.com"].some(domain => href.includes(domain)) == false)
  return urls
}