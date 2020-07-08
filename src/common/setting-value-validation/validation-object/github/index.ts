import { GithubInvalidReason } from "~/src/common/types/common/setting-value-validation"

export const ALL_EMPTY = () => <GithubInvalidReason> {
  name: "ALL_EMPTY",
  message: "Please fill both the repo name and the owner."
}

export const REPO_NAME_EMPTY = () => <GithubInvalidReason>  {
  name: "REPO_NAME_EMPTY",
  message: "Repo name must not be empty."
}

export const OWNER_NAME_EMPTY = () => <GithubInvalidReason> {
  name: "OWNER_NAME_EMPTY",
  message: "Owner name must not be empty."
}

export const REPOSITORY_NOT_FOUND = () => <GithubInvalidReason> {
  name: "REPOSITORY_NOT_FOUND",
  message: "The repository wasn't found"
}

export const EXACT_REPO_NAME_REQUIRED = (repo_name:string) => <GithubInvalidReason> {
  name: "EXACT_REPO_NAME_REQUIRED",
  message: `Did you mean '${repo_name}'? Please use the exact repo name.`
}