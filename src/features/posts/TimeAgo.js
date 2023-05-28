import React from "react"
import {parseISO, formatDistanceToNow} from 'date-fns' //help full library for date and time

export const TimeAgo = ({timestamp}) => {
    let timeAgo = ''
    if (timestamp) {
        //these two code convert the timestamp to time ago (like minutes, hours, days, weeks, months, years)
        const date = parseISO(timestamp)
        const timePeriod = formatDistanceToNow(date) //compute the difference from the date to now
        timeAgo = `${timePeriod} ago`
    }
    return (
        <span title={timestamp}>
        &nbsp; <i>{timeAgo}</i>
        </span>
    )
}