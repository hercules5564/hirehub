import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applyForJobAPI, getMyApplicationsAPI, getJobApplicantsAPI, updateApplicationStatusAPI, withdrawApplicationAPI, getSavedJobsAPI, saveJobAPI } from '../../services/api';

export const applyForJob = createAsyncThunk('applications/apply', async (data, { rejectWithValue }) => {
  try { const res = await applyForJobAPI(data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to apply'); }
});

export const fetchMyApplications = createAsyncThunk('applications/my', async (_, { rejectWithValue }) => {
  try { const res = await getMyApplicationsAPI(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const fetchJobApplicants = createAsyncThunk('applications/jobApplicants', async (jobId, { rejectWithValue }) => {
  try { const res = await getJobApplicantsAPI(jobId); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const updateApplicationStatus = createAsyncThunk('applications/updateStatus', async ({ id, data }, { rejectWithValue }) => {
  try { const res = await updateApplicationStatusAPI(id, data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const withdrawApplication = createAsyncThunk('applications/withdraw', async (id, { rejectWithValue }) => {
  try { const res = await withdrawApplicationAPI(id); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to withdraw'); }
});

export const fetchSavedJobs = createAsyncThunk('applications/savedJobs', async (_, { rejectWithValue }) => {
  try { const res = await getSavedJobsAPI(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const toggleSaveJob = createAsyncThunk('applications/saveJob', async (jobId, { rejectWithValue }) => {
  try { const res = await saveJobAPI(jobId); return { ...res.data, jobId }; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

const applicationSlice = createSlice({
  name: 'applications',
  initialState: { myApplications: [], applicants: [], savedJobs: [], loading: false, error: null, savedJobIds: [] },
  reducers: { clearAppError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(applyForJob.fulfilled, (state, action) => { state.myApplications.unshift(action.payload.application); })
      .addCase(applyForJob.rejected, (state, action) => { state.error = action.payload; })
      .addCase(fetchMyApplications.pending, (state) => { state.loading = true; })
      .addCase(fetchMyApplications.fulfilled, (state, action) => { state.loading = false; state.myApplications = action.payload.applications; })
      .addCase(fetchMyApplications.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchJobApplicants.pending, (state) => { state.loading = true; })
      .addCase(fetchJobApplicants.fulfilled, (state, action) => { state.loading = false; state.applicants = action.payload.applications; })
      .addCase(fetchJobApplicants.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const idx = state.applicants.findIndex((a) => a._id === action.payload.application._id);
        if (idx !== -1) state.applicants[idx] = action.payload.application;
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        const idx = state.myApplications.findIndex((a) => a._id === action.payload.application._id);
        if (idx !== -1) state.myApplications[idx].status = action.payload.application.status;
      })
      .addCase(withdrawApplication.rejected, (state, action) => { state.error = action.payload; })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.savedJobs = action.payload.savedJobs;
        state.savedJobIds = action.payload.savedJobs.map((s) => s.jobId?._id).filter(Boolean);
      })
      .addCase(toggleSaveJob.fulfilled, (state, action) => {
        if (action.payload.saved) { state.savedJobIds.push(action.payload.jobId); }
        else { state.savedJobIds = state.savedJobIds.filter((id) => id !== action.payload.jobId); state.savedJobs = state.savedJobs.filter((s) => s.jobId?._id !== action.payload.jobId); }
      });
  },
});

export const { clearAppError } = applicationSlice.actions;
export default applicationSlice.reducer;
