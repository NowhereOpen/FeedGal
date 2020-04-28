import moment from "moment"

import { PaginationOptions } from "~/src/gyst/common/types/gyst-entry"

type DateRange = { from: any, to: any }

export function getPaginationData(date_range?:DateRange):PaginationOptions {
  if(date_range == null) {
    date_range = {
      from: moment().startOf("week"),
      to: moment().endOf("week"),
    }
  }
  else {
    date_range = {
      from: moment(date_range.from),
      to: moment(date_range.to)
    }
  }

  return {
    new: {
      from: date_range.from.clone().add(7, "days").toString(),
      to: date_range.to.clone().add(7, "days").toString(),
    },
    old: {
      from: date_range.from.clone().subtract(7, "days").toString(),
      to: date_range.to.clone().subtract(7, "days").toString(),
    }
  }
}