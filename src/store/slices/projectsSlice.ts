import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Project } from '../../types';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  filters: {
    track: string | null;
    cohort: string | null;
    search: string;
  };
}

const initialState: ProjectsState = {
  projects: [
    {
      id: '1',
      name: 'E-Commerce Platform',
      description: 'A full-stack e-commerce platform with React and Node.js',
      githubUrl: 'https://github.com/example/ecommerce',
      track: 'Full Stack',
      cohort: 'MC-45',
      owners: [{ id: '1', name: 'John Doe', email: 'john@example.com', role: 'student' }],
      members: [{ id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'student' }],
      createdAt: '2024-03-10T10:00:00Z'
    },
    {
      id: '2',
      name: 'Fitness Tracker App',
      description: 'Android app for tracking workouts and nutrition',
      githubUrl: 'https://github.com/example/fitness',
      track: 'Android',
      cohort: 'MC-46',
      owners: [{ id: '3', name: 'Alice Johnson', email: 'alice@example.com', role: 'student' }],
      members: [],
      createdAt: '2024-03-15T14:30:00Z'
    }
  ],
  loading: false,
  error: null,
  filters: {
    track: null,
    cohort: null,
    search: ''
  }
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
    setFilters: (state, action: PayloadAction<Partial<ProjectsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  setProjects,
  addProject,
  updateProject,
  deleteProject,
  setFilters,
  setLoading,
  setError
} = projectsSlice.actions;

export default projectsSlice.reducer;