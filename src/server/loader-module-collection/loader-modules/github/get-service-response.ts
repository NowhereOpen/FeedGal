import { GetServiceResponse } from "~/src/gyst/server/base-class/service-module/get-service-response"
import { getCommits } from "~/src/lib/gyst-entries-helper/services/github"

export class GetGithubServiceResponse extends GetServiceResponse {
  async run() {
    if(["user_name", "branch_name", "repo_name"].every(prop_name => prop_name in this.req_params) == false) {
      throw Error("this.req_params for Github must contain all user_name, branch_name, and repo_name.")
    }

    const { user_name, branch_name, repo_name } = this.req_params

    const params:any = { sha: branch_name }
    // Note. `Number(null) == 0`, so no conversion at all.
    const pagination_page = this.pagination_value
    const access_token = this.credential

    if(pagination_page) {
      Object.assign(params, { page: pagination_page })
    }

    let commits = []
    commits = await getCommits(user_name, repo_name, access_token, { params })
    commits = commits.map((commit:any) => {
      commit.repo_name = repo_name
      commit.branch_name = branch_name
      commit.repo_url = `https://github.com/${user_name}/${repo_name}`
      commit.branch_url = `https://github.com/${user_name}/${repo_name}/tree/${branch_name}`
      return commit
    })

    return commits
  }
}