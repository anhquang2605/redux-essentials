import {createSlice, nanoid, createAsyncThunk, createSelector, createEntityAdapter} from '@reduxjs/toolkit'
import {client} from '../../api/client'
import {sub} from 'date-fns'
/* const initialState = [
    {id: '1', title: 'First Post!', content: 'Hello!', date: sub(new Date(), {minutes: 10}).toISOString(), reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}},
    {id: '2', title: 'Second Post', content: 'More text', date: sub(new Date(), {minutes: 5}).toISOString(), reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}}
] */
/* const initialState = {
  posts: [],
    status: 'idle',
    error: null
} */
const postsAdapter = createEntityAdapter({
  sortComparer: (a,b) => b.date.localeCompare(a.date)
})
const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null
})
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
            //const existingPost = state.posts.find(post => post.id === id)//existing post is a state object, once updated will be updated in the state
           const existingPost = state.entities[id]
            if (existingPost){
                existingPost.title = title
                existingPost.content = content
            }
        },
        reactionAdded(state, action){
            const {postId, reaction} = action.payload
            //const existingPost = state.posts.find(post => post.id === postId)
            const existingPost = state.entities[postId]
            if(existingPost){
                existingPost.reactions[reaction]++
            }
        }
    },
    extraReducers(builder) {//ussually used for async actions
        builder
          .addCase(fetchPosts.pending, (state, action) => {
            state.status = 'loading'
          })
          .addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'succeeded'
            // Add any fetched posts to the array (oroiginal code)
            // state.posts = state.posts.concat(action.payload)
            // Use the `upsertMany` reducer as a mutating update utility
            postsAdapter.upsertMany(state, action.payload)
          })
          .addCase(fetchPosts.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
          })
        builder.addCase(addNewPost.fulfilled, 
            //(state, action) => {
            //state.posts.push(action.payload)
            postsAdapter.addOne)
      }
})
/* export const selectAllPosts = state => state.posts.posts

export const selectPostById = (state, postId) =>
  state.posts.posts.find(post => post.id === postId) */

// Export the customized selectors for this adapter using `getSelectors`, 
//the adapter will return a set of memoized selector functions corresponding to the reducers and selectors it contains. 
//The functions helps to select entities in the store state.
export const {
  selectAll: selectAllPosts, //rename the selectAll selector function to selectAllPosts
  selectById: selectPostById,
  selectIds: selectPostIds
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)//where are the posts from state.posts coming from? the name of the slice is posts, so the state.posts is the posts slice of the state
//We want to provide the function with state.posts so that it can select the posts from the state.

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