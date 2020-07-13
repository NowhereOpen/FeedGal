import Parser from "rss-parser"

export async function getRssFeedResponse(url:string) {
  const parser = new Parser()
  const result = await parser.parseURL(url)
  return result
}