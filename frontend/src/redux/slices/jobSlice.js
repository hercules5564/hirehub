import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getJobsAPI, getJobAPI, getFeaturedJobsAPI, createJobAPI, updateJobAPI, deleteJobAPI, getRecruiterJobsAPI } from '../../services/api';

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (params, { rejectWithValue }) => {
  try { const res = await getJobsAPI(params); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch jobs'); }
});

export const fetchJob = createAsyncThunk('jobs/fetchJob', async (id, { rejectWithValue }) => {
  try { const res = await getJobAPI(id); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch job'); }
});

export const fetchFeaturedJobs = createAsyncThunk('jobs/fetchFeatured', async (_, { rejectWithValue }) => {
  try { const res = await getFeaturedJobsAPI(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const createJob = createAsyncThunk('jobs/create', async (data, { rejectWithValue }) => {
  try { const res = await createJobAPI(data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to create job'); }
});

export const updateJob = createAsyncThunk('jobs/update', async ({ id, data }, { rejectWithValue }) => {
  try { const res = await updateJobAPI(id, data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to update'); }
});

export const removeJob = createAsyncThunk('jobs/delete', async (id, { rejectWithValue }) => {
  try { await deleteJobAPI(id); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to delete'); }
});

export const fetchRecruiterJobs = createAsyncThunk('jobs/recruiterJobs', async (_, { rejectWithValue }) => {
  try { const res = await getRecruiterJobsAPI(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState: { jobs: [], featuredJobs: [], recruiterJobs: [], currentJob: null, pagination: null, loading: false, error: null },
  reducers: { clearJobError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => { state.loading = true; })
      .addCase(fetchJobs.fulfilled, (state, action) => { state.loading = false; state.jobs = action.payload.jobs; state.pagination = action.payload.pagination; })
      .addCase(fetchJobs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchJob.pending, (state) => { state.loading = true; })
      .addCase(fetchJob.fulfilled, (state, action) => { state.loading = false; state.currentJob = action.payload.job; })
      .addCase(fetchJob.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchFeaturedJobs.fulfilled, (state, action) => { state.featuredJobs = action.payload.jobs; })
      .addCase(createJob.fulfilled, (state, action) => { state.recruiterJobs.unshift(action.payload.job); })
      .addCase(updateJob.fulfilled, (state, action) => {
        const idx = state.recruiterJobs.findIndex((j) => j._id === action.payload.job._id);
        if (idx !== -1) state.recruiterJobs[idx] = action.payload.job;
      })
      .addCase(removeJob.fulfilled, (state, action) => { state.recruiterJobs = state.recruiterJobs.filter((j) => j._id !== action.payload); })
      .addCase(fetchRecruiterJobs.pending, (state) => { state.loading = true; })
      .addCase(fetchRecruiterJobs.fulfilled, (state, action) => { state.loading = false; state.recruiterJobs = action.payload.jobs; })
      .addCase(fetchRecruiterJobs.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearJobError } = jobSlice.actions;
export default jobSlice.reducer;
