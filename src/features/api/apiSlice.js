// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: ['Post'],//will be used in providesTags property of the query endpoint and invalidateTags property of the mutation endpoint, can be string a small object
  // The "endpoints" represent operations and requests for this server
  endpoints: builder => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getPosts: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => '/posts'//can overide the base URL here with an object with different properties {url: '/posts', method: 'POST', body: newPost}
      ,providesTags: ['Post']// array in query endpoints, listing a set of tags describing the data in that query, when mutaion endpoint runs, it will invalidate the query endpoints with the same tags
    }),//builder.mutation() is for POST, PUT, DELETE requests
    getPost: builder.query({//single post endpoint
        query: postId => `/posts/${postId}`
    }),
    addNewPost: builder.mutation({
        query: initialPost => ({
          url: '/posts',
          method: 'POST',
          // Include the entire post object as the body of the request
          body: initialPost
        }),
        invalidatesTags: ['Post']//An invalidatesTags array in mutation endpoints, listing a set of tags that are invalidated every time that mutation runs
    }),
    editPost: builder.mutation({//update case
        query: post => ({
          url: `/posts/${post.id}`,
          method: 'PATCH',
          body: post
        })
    }),
    getUsers: builder.query({
        query: () => '/users'
    })
  })
})

// Export the auto-generated hook for the `getPosts` query endpoint which is defined in endpoints property of apiSlice
export const { useGetPostsQuery, useGetPostQuery, useAddNewPostMutation, useEditPostMutation, useGetUsersQuery } = apiSlice