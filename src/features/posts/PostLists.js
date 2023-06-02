import React, {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButton } from './ReactionButton'
import { selectAllPosts, fetchPosts, selectPostById, selectPostIds } from './postsSlice'
import {Spinner}  from '../../components/Spinner'

//Render the post into a list of post excerpts, this is a component that will be used in the PostsList component
const PostExcerpt = ({ postId }) => {
  const post = useSelector(state => selectPostById(state, postId))//no need to write a selector for this, can use the existing selector selectPostById thanks to createEntityAdapter returned selectors
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButton post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}
PostExcerpt = React.memo(PostExcerpt) //don't rerender the PostExcerpt component if the post the props hasn't changed, will bypass the default behavior where the component will always rerender when the parent component rerenders
let content

export const PostsList = () => {
    //any element within App can access the Redux store, 
    //and we can use the useSelector hook to retrieve the posts from the store in the state global object
  const posts = useSelector(selectAllPosts)//will rerender the component whenever the posts change
    const postStatus = useSelector(state => state.posts.status)
    const error = useSelector(state => state.posts.error)
    const dispatch = useDispatch()
    const orderedPostIds = useSelector(selectPostIds)
    useEffect(() => {
      if(postStatus === 'idle'){
        dispatch(fetchPosts())
      }
    }, [postStatus, dispatch])
  
  //check status and render content accordingly
  if (postStatus === 'loading') {
    content = <Spinner text="Loading..." />
  } else if (postStatus === 'succeeded') {
    // Sort posts in reverse chronological order by datetime string
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))

    content = orderedPostIds.map(postId => (
      <PostExcerpt key={postId} postId={postId} />
    ))
  } else if (postStatus === 'failed') {
    content = <div>{error}</div>
  }
  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}