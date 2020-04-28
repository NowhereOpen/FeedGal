import moment from "moment"

import { PaginationOptions } from "~/src/gyst/common/types/gyst-entry"

export function getPaginationData(pagination_index:number, prev_pagination_value:any):PaginationOptions {
  let date_range

  if(pagination_index == 0) {
    date_range = {
      from_moment: moment().subtract(7, "days"),
      to_moment: moment()
    }
  }
  else {
    date_range = {
      from_moment: moment(prev_pagination_value["from_moment"]),
      to_moment: moment(prev_pagination_value["to_moment"]),
    }
  }

  return {
    new: {
      from_moment: date_range.to_moment,
      to_moment: date_range.to_moment.clone().add(7, "days")
    },
    old: {
      to_moment: date_range.from_moment,
      from_moment: date_range.from_moment.clone().subtract(7, "days")
    }
  }
}