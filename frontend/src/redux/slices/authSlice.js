import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerAPI, loginAPI, logoutAPI, getMeAPI } from '../../services/api';

// Turn an axios error into a clear, user-facing message. A missing `err.response`
// means the request never reached the API (server down, wrong URL, or no network) —
// surface that explicitly instead of a misleading "login failed".
const apiError = (err, fallback) => {
  if (err.response) return err.response.data?.message || fallback;
  if (err.code === 'ERR_NETWORK' || !err.response)
    return 'Cannot reach the server. Make sure the backend is running on port 5000.';
  return err.message || fallback;
};

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await registerAPI(data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  } catch (err) { return rejectWithValue(apiError(err, 'Registration failed')); }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await loginAPI(data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  } catch (err) { return rejectWithValue(apiError(err, 'Login failed')); }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutAPI();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const res = await getMeAPI();
    return res.data;
  } catch (err) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return rejectWithValue('Session expired');
  }
});

const storedUser = localStorage.getItem('user');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      // Keep the cached user in sync, so a reload doesn't briefly show stale data.
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.isAuthenticated = true; state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.isAuthenticated = true; state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(logout.fulfilled, (state) => { state.user = null; state.token = null; state.isAuthenticated = false; })
      .addCase(loadUser.fulfilled, (state, action) => { state.user = action.payload.user; state.isAuthenticated = true; localStorage.setItem('user', JSON.stringify(action.payload.user)); })
      .addCase(loadUser.rejected, (state) => { state.user = null; state.token = null; state.isAuthenticated = false; });
  },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
