import {createSlice} from '@reduxjs/toolkit'
import {nanoid} from '@reduxjs/toolkit'
import {sub} from 'date-fns'
const initialState = [
    {id: '1', title: 'First Post!', content: 'Hello!', date: sub(new Date(), {minutes: 10}).toISOString(), reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}},
    {id: '2', title: 'Second Post', content: 'More text', date: sub(new Date(), {minutes: 5}).toISOString(), reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}}
]

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {//allowed to mutate the state directly inside the createSlice() call
        postAdded: {//action when dispatched will accept tilte and content as arguments
            reducer(state, action){
                state.push(action.payload)
            },
            prepare(title,content, userId) {//way to customize the action object passed to the reducer, prepare() function is called before the reducer function, and it must return an action object containing the payload field
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        users: userId,
                        date: new Date().toISOString(),
                        reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}
                    }
                }
            }
        },
        postUpdated(state, action){
            const {id, title, content} = action.payload
            const existingPost = state.find(post => post.id === id)//existing post is a state object, once updated will be updated in the state
            if (existingPost){
                existingPost.title = title
                existingPost.content = content
            }
        },
        reactionAdded(state, action){
            const {postId, reaction} = action.payload
            const existingPost = state.find(post => post.id === postId)
            if(existingPost){
                existingPost.reactions[reaction]++
            }
        }
    }
})
export const {postAdded, postUpdated, reactionAdded} = postsSlice.actions
export default postsSlice.reducer