import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButton } from './ReactionButton'
export const SinglePostPage = ({ match }) => {
  const { postId } = match.params
    //return the right post from the posts array in the Redux store
  const post = useSelector(state =>
    state.posts.find(post => post.id === postId)
  )

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <div>
            <PostAuthor userId={post.user}></PostAuthor>
            <TimeAgo timestamp={post.date}></TimeAgo>
        </div>
        <ReactionButton post={post} />
        <Link to={`/editPost/${post.id}`} className="button">
            Edit Post
        </Link>
        
      </article>
    </section>
  )
}