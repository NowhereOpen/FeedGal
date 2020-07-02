import { LoaderModuleOutput, PaginationData, Entry } from "~/src/server/loader-module-collection/loader-module-base/types"
import { getCommits } from "~/src/server/lib/loader-module-helpers/services/github"

export async function getEntries(
  access_token:string,
  user_name:string, repo_name:string,
  pagination_page?:string|number
):Promise<LoaderModuleOutput> {
  /**
   * 2020-05-15 17:02 
   * 
   * Support only master branch for now.
   */
  const branch_name = "master"
  const params:any = { sha: branch_name }

  if(pagination_page) {
    Object.assign(params, { page: pagination_page })
  }

  let commits:any[] = []
  commits = await getCommits(user_name, repo_name, access_token, { params })
  commits = commits.map((commit:any) => {
    commit.repo_name = repo_name
    commit.branch_name = branch_name
    commit.repo_url = `https://github.com/${user_name}/${repo_name}`
    commit.branch_url = `https://github.com/${user_name}/${repo_name}/tree/${branch_name}`
    return commit
  })

  return {
    entries: commits.map(entry => formatEntries(entry)),
    pagination_data: getPaginationData(pagination_page),
    service_response: commits
  }
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

function getPaginationData(pagination_page:any|undefined):PaginationData {
  if([undefined, 1].includes(pagination_page)) {
    /**
     * The first page starts at 1.
     * 
     * Ref: https://developer.github.com/v3/guides/traversing-with-pagination/
     */
    return { old: 2, new: null }
  }
  else {
    return {
      old: pagination_page + 1,
      new: pagination_page - 1
    }
  }
}