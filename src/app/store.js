import { configureStore } from '@reduxjs/toolkit'
import postReducer from '../features/posts/postsSlice'
import usersReducer from '../features/users/usersSlice'
export default configureStore({
  reducer: {
    posts: postReducer,
    users: usersReducer
  },
})
