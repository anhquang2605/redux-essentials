import {createSlice, nanoid, createAsyncThunk, createSelector} from '@reduxjs/toolkit'
import {client} from '../../api/client'
import {sub} from 'date-fns'
const initialState = {
    posts: [],
    status: 'idle',
    error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await client.get('/fakeApi/posts')
    return response.data
})
export const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    // The payload creator receives the partial `{title, content, user}` object
    async initialPost => {
      // We send the initial data to the fake API server
      const response = await client.post('/fakeApi/posts', initialPost)
      // The response includes the complete post object, including unique ID
      return response.data
    }
  )
  
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {//allowed to mutate the state directly inside the createSlice() call
        postUpdated(state, action){
            const {id, title, content} = action.payload
            const existingPost = state.posts.find(post => post.id === id)//existing post is a state object, once updated will be updated in the state
            if (existingPost){
                existingPost.title = title
                existingPost.content = content
            }
        },
        reactionAdded(state, action){
            const {postId, reaction} = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if(existingPost){
                existingPost.reactions[reaction]++
            }
        }
    },
    extraReducers(builder) {
        builder
          .addCase(fetchPosts.pending, (state, action) => {
            state.status = 'loading'
          })
          .addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'succeeded'
            // Add any fetched posts to the array
            state.posts = state.posts.concat(action.payload)
          })
          .addCase(fetchPosts.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
          })
        builder.addCase(addNewPost.fulfilled, (state, action) => {
            state.posts.push(action.payload)
        })
      }
})
export const selectAllPosts = state => state.posts.posts

export const selectPostById = (state, postId) =>
  state.posts.posts.find(post => post.id === postId)
//over here the arrays in the first argument are the input selectors, the function in the second argument is the output selector. 
//The input selectors specify the data from the store that the output selector needs to calculate its return value. 
//When there are changes to the store, the output selector will only recalculate its value if the input selectors return values have changed. 
//This will support memoization to avoid unnecessary re-renders
export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],//we only care about the userId, not the entire state so we use a function to get the userId from the provided arguments. Why can we just provide the userId without returning in the function?
    (posts,userId) => posts.filter(post => post.user === userId)
)

export const {postUpdated, reactionAdded} = postsSlice.actions
export default postsSlice.reducer