import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getNotificationsAPI, markNotificationReadAPI, markAllNotificationsReadAPI } from '../../services/api';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, { rejectWithValue }) => {
  try { const res = await getNotificationsAPI(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const markAsRead = createAsyncThunk('notifications/read', async (id) => {
  await markNotificationReadAPI(id); return id;
});

export const markAllAsRead = createAsyncThunk('notifications/readAll', async () => {
  await markAllNotificationsReadAPI();
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { notifications: [], unreadCount: 0, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => { state.notifications = action.payload.notifications; state.unreadCount = action.payload.unreadCount; })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const n = state.notifications.find((n) => n._id === action.payload);
        if (n && !n.isRead) { n.isRead = true; state.unreadCount = Math.max(0, state.unreadCount - 1); }
      })
      .addCase(markAllAsRead.fulfilled, (state) => { state.notifications.forEach((n) => n.isRead = true); state.unreadCount = 0; });
  },
});

export default notificationSlice.reducer;
