import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNewPost } from './postsSlice'

export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')
  const [addRequestStatus, setAddRequestStatus] = useState('idle')
  const users = useSelector(state => state.users)
  const dispatch = useDispatch();
  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)
  const onAuthorChanged = e => setUserId(e.target.value)
const onSavePostClicked = async () => {
    if(canSave){
        try{
            setAddRequestStatus('pending')
            //.unwrap() is used to unwrap the promise returned by the thunk so that any errors can be caught in the catch block, 
            //meant for try catch block. This is because createAsyncThunk only return the final action object, not the promise itself 
            //so we have no information about any errors that might have occurred
            await dispatch(addNewPost({title, content, user: userId})).unwrap()
            setTitle('')
            setContent('')
            setUserId('')
        }catch(error){
            console.error('Failed to save the post: ', error)
        }finally{
            setAddRequestStatus('idle')
        }
    }
}
const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    )
)
  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
            <option value=""></option>
            {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button onClick={onSavePostClicked} type="button" disabled={!canSave}>Save Post</button>
      </form>
    </section>
  )
}