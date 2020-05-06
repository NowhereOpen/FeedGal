import { LoaderModuleOutput, PaginationOptions, Entry } from "~/src/server/loader-module-collection/loader-module-base/types"
import { getCommits } from "~/src/server/lib/loader-module-helpers/services/github"

export async function getEntriesInit() {

}

export async function getEntriesPagination() {
  
}

function formatEntries(entry:any):Entry {
  const commit = entry.commit
  const commit_message = commit.message
  const commit_msg_first_line = commit_message.split("\n")[0]

  const committer = commit.committer

  const TITLE_LENGTH = 52

  return {
    service_id: "github",
    id: entry.sha,
    title: commit_msg_first_line.length > TITLE_LENGTH ? commit_msg_first_line.slice(0, TITLE_LENGTH).padEnd(TITLE_LENGTH+3, ".") : commit_msg_first_line,
    content: commit_message,
    json_content: entry,
    datetime_info: committer.date,
    contexts: [
      { name: "Github", url: "https://github.com" },
      { name: entry.repo_name, url: entry.repo_url },
      { name: entry.branch_name, url: entry.branch_url },
      { name: entry.sha.slice(0, 7), url: entry.html_url }
    ],
    resources: {
      /**
       * 2020-03-22 22:07
       * 
       * Committer vs author. It seems like the author is some one who made the pull request and
       * the committer is someone who accepts it into the branch/repo. For example:
       * 
       *   - https://github.com/chulman444/gyst-tiddlywiki/commit/23797b05a1c7e5a05055e8b6750e06686a1d6aa1
       * 
       * And this happens for repos that I forked. Commits that were made by the actual author before I
       * forked it have `author: null`:
       * 
       *   - https://github.com/chulman444/gyst-tiddlywiki/commit/2a3f1b44030ed10a4cef4442cab5050a080fc2f0
       */
      thumbnail_url: entry.committer.avatar_url
    }
  }
}

function getPaginationData(pagination_index:number, pagination_value:any):PaginationOptions {
  if(pagination_index == 0) {
    /**
     * The first page starts at 1.
     * 
     * Ref: https://developer.github.com/v3/guides/traversing-with-pagination/
     */
    return { old: 2, new: null }
  }
  else {
    return {
      old: pagination_value + 1,
      new: pagination_value - 1
    }
  }
}