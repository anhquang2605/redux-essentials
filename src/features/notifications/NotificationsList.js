import React, { useLayoutEffect } from 'react'
import { formatDistanceToNow, parseISO } from 'date-fns'

import { selectAllUsers } from '../users/usersSlice'

import { selectAllNotifications, allNotificationsRead } from './notificationsSlice'
import {useDispatch, useSelector} from 'react-redux'
import classnames from 'classnames'

export const NotificationsList = () => {
  const notifications = useSelector(selectAllNotifications)
  const users = useSelector(selectAllUsers)
    const dispatch = useDispatch()
    useLayoutEffect(() => {//useLayoutEffect is used to dispatch the allNotificationsRead action creator when the component is rendered (updated component according to state changes) or mounted (created in DOM for the first time). This ensures that the notifications are marked as read as soon as the user sees them without re rendering the component causing a flicker, this is because useLayoutEffect runs synchronously after React has performed all DOM mutations and computation and effects while useEffect runs asynchronously
        dispatch(allNotificationsRead())
        //the above the not cause infinite because the second time the component is rendered, the notificatiions state did not change, so the useLayoutEffect will not run again
        //can be avoided by having dispatch the first time when mounted, then check if notifications state array size changed, if so, dispatch again
    })
  const renderedNotifications = notifications.map(notification => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find(user => user.id === notification.user) || {
      name: 'Unknown User'
    }

    const notificationClassname = classnames('notification', {
        new: notification.isNew
      })
      return (
        <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}