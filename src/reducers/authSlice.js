import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, register } from '../services/authService.js';

const token = localStorage.getItem("token");
const localUser = localStorage.getItem("user");
const user = localUser ? JSON.parse(localUser) : null

const initialState = {
  token,
  user,
  login: {
    status: 'idle',
    error: null
  },
  registration: {
    status: 'idle',
    error: null
  }
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (input, thunk) => {
    try {
      const data = await login(input);
      localStorage.setItem('token', data.token);
      const userJson = JSON.stringify(data.user);
      localStorage.setItem('user', userJson);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed'
      return thunk.rejectWithValue(message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (input, thunk) => {
    try {
      const data = await register(input);
      return data
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed'
      return thunk.rejectWithValue(message)
    }
  }
)

// export const saveUser = () => () => {}
export function saveUser (user) {
  const userJson = JSON.stringify(user);
  localStorage.setItem('user', userJson);
  return function (dispatch) {
    const action = authSlice.actions.setUser(user)
    dispatch(action)
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.login.error = null
      state.login.status = 'idle'
      state.registration.error = null
      state.registration.status = 'idle'
    },
    setUser: (state, action) => {
      state.user = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.login.status = 'pending'
        state.login.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.login.status = 'fulfilled'
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.login.status = 'rejected'
        state.login.error = action.payload
      })
      .addCase(registerUser.pending, (state) => {
        state.registration.status = 'pending'
        state.registration.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registration.status = 'fulfilled'
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registration.status = 'rejected'
        state.registration.error = action.payload
      })
  }
})
export default authSlice.reducer;
export const clearAuthState = authSlice.actions.clearAuthState;