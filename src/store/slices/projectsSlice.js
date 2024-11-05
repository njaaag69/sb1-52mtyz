import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projects } from '../../api';

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async () => {
    const response = await projects.getAll();
    return response.data;
  }
);

export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData) => {
    const response = await projects.create(projectData);
    return response.data;
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    loading: false,
    error: null,
    filters: {
      track: null,
      cohort: null,
      search: ''
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      });
  }
});

export const { setFilters } = projectsSlice.actions;
export default projectsSlice.reducer;