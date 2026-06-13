import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyCompaniesAPI, createCompanyAPI, updateCompanyAPI, deleteCompanyAPI } from '../../services/api';

export const fetchMyCompanies = createAsyncThunk('companies/my', async (_, { rejectWithValue }) => {
  try { const res = await getMyCompaniesAPI(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const createCompany = createAsyncThunk('companies/create', async (data, { rejectWithValue }) => {
  try { const res = await createCompanyAPI(data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const updateCompany = createAsyncThunk('companies/update', async ({ id, data }, { rejectWithValue }) => {
  try { const res = await updateCompanyAPI(id, data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const removeCompany = createAsyncThunk('companies/delete', async (id, { rejectWithValue }) => {
  try { await deleteCompanyAPI(id); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

const companySlice = createSlice({
  name: 'companies',
  initialState: { myCompanies: [], currentCompany: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyCompanies.pending, (state) => { state.loading = true; })
      .addCase(fetchMyCompanies.fulfilled, (state, action) => { state.loading = false; state.myCompanies = action.payload.companies; })
      .addCase(fetchMyCompanies.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createCompany.fulfilled, (state, action) => { state.myCompanies.unshift(action.payload.company); })
      .addCase(updateCompany.fulfilled, (state, action) => {
        const idx = state.myCompanies.findIndex((c) => c._id === action.payload.company._id);
        if (idx !== -1) state.myCompanies[idx] = action.payload.company;
      })
      .addCase(removeCompany.fulfilled, (state, action) => { state.myCompanies = state.myCompanies.filter((c) => c._id !== action.payload); });
  },
});

export default companySlice.reducer;
