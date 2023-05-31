import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { selectUserById } from '../users/usersSlice'
import { selectAllPosts, selectPostById } from '../posts/postsSlice'

export const UserPage = ({ match }) => {
  const { userId } = match.params

  const user = useSelector(state => selectUserById(state, userId))
//with the filter function, the function inside useSelector will always return a new array, even if the data inside the array hasn't changed, 
//this will cause the component to re-render after every action dispatched to the store
  const postsForUser = useSelector(state => selectPostById(state, userId))

  const postTitles = postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}