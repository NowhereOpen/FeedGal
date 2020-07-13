/**
 * 2020-07-10 09:02 
 * 
 * Run with `npx ts-node -P tsconfig-server.json -r tsconfig-paths/register .../collect-samples`
 */

import Parser from "rss-parser"
import {} from "./"

async function main() {
  const urls = await getUrls()
  console.log(urls)
  await Promise.all(
    urls.map(async url => {
      try {
        const entries = await getEntries(url)
        console.log(entries)
      }
      catch(e) {
        console.log(e)
        console.log(`Error associated with`, url)
      }
    })
  )
}

main()