import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { client } from '../../api/client'

export const fetchNotifications = createAsyncThunk(//this is a thunk action creator, will receive an object (thunkAPI) containing get state and dispatch fields as argument, there are more fields in this object
  'notifications/fetchNotifications',
  async (_, { getState,dispatch }) => {// the _ is a placeholder for the payload, which we don't need for this request, the getState is a reference to the entire Redux state object which is in the notificationsSlice
    const allNotifications = selectAllNotifications(getState())//need to use getState to get the current state value which is defined in the notificationsSlice customer selector
    const [latestNotification] = allNotifications //this will return the first element of the array
    const latestTimestamp = latestNotification ? latestNotification.date : ''//if there is latestNotification, return the date, otherwise return an empty string
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )
    return response.data
  }
)

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    allNotificationsRead(state, action) {
        state.forEach(notification => {
          notification.read = true
        })
      }
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.push(...action.payload)
      state.forEach(notification => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.read
      })
      // Sort with newest first
      state.sort((a, b) => b.date.localeCompare(a.date))
    })
  }
})

export default notificationsSlice.reducer
export const { allNotificationsRead } = notificationsSlice.actions //export the action creator, why? because we need to dispatch this action in the component.
export const selectAllNotifications = state => state.notifications