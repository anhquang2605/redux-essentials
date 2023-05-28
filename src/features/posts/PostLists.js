import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButton } from './ReactionButton'
export const PostsList = () => {
    //any element within App can access the Redux store, 
    //and we can use the useSelector hook to retrieve the posts from the store in the state global object
  const posts = useSelector(state => state.posts)//will rerender the component whenever the posts change
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
  //Render the post into a list of post excerpts
  const renderedPosts = orderedPosts.map(post => (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <ReactionButton post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
        </Link>
    </article>
  ))

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}