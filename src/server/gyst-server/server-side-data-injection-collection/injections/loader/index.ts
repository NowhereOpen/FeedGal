import { getEmptyLoadStatus } from "./get-empty-load-status"

export async function inject(state:any, user_id:string) {
  const load_status = await getEmptyLoadStatus(user_id)
  state.load_status = load_status
}