import { configureStore } from '@reduxjs/toolkit'
import postReducer from '../features/posts/postsSlice'
import usersReducer from '../features/users/usersSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'
import { apiSlice } from '../features/api/apiSlice'
export default configureStore({
  reducer: {
    posts: postReducer,
    users: usersReducer,
    notifications: notificationsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: getDefaultMiddleware =>//keeping other middle ware and adding apiSlice middleware
  getDefaultMiddleware().concat(apiSlice.middleware)
})
