import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cohorts } from '../../api';

export const fetchCohorts = createAsyncThunk(
  'cohorts/fetchAll',
  async () => {
    const response = await cohorts.getAll();
    return response.data;
  }
);

export const createCohort = createAsyncThunk(
  'cohorts/create',
  async (cohortData) => {
    const response = await cohorts.create(cohortData);
    return response.data;
  }
);

export const deleteCohort = createAsyncThunk(
  'cohorts/delete',
  async (id) => {
    await cohorts.delete(id);
    return id;
  }
);

const cohortsSlice = createSlice({
  name: 'cohorts',
  initialState: {
    cohorts: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCohorts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCohorts.fulfilled, (state, action) => {
        state.loading = false;
        state.cohorts = action.payload;
      })
      .addCase(fetchCohorts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createCohort.fulfilled, (state, action) => {
        state.cohorts.push(action.payload);
      })
      .addCase(deleteCohort.fulfilled, (state, action) => {
        state.cohorts = state.cohorts.filter(c => c.id !== action.payload);
      });
  }
});

export default cohortsSlice.reducer;