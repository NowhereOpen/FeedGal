// Types
import {
  State
} from "~/src/common/types/pages/main"

import { getLoadStatus } from "./get-load-status"

export async function inject(state:State, user_id:string) {
  state.load_status = await getLoadStatus(user_id)
}