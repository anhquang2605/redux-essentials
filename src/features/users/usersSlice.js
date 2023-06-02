import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit'
import {client} from '../../api/client'

const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await client.get('/fakeApi/users')
    return response.data
})

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchUsers.fulfilled, /* (state, action) => {
            return action.payload
        } */
        usersAdapter.setAll//will replace the entire users state with the fetched data
        )
    }
})
/* export const selectAllUsers = state => state.users

export const selectUserById = (state, userId) =>
  state.users.find(user => user.id === userId) */

export const { selectAll: selectAllUsers, selectById: selectUserById } =
usersAdapter.getSelectors(state => state.users) 
  
export default usersSlice.reducer