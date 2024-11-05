import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Cohort } from '../../types';

interface CohortsState {
  cohorts: Cohort[];
  loading: boolean;
  error: string | null;
}

const initialState: CohortsState = {
  cohorts: [
    {
      id: '1',
      name: 'MC-45',
      track: 'Full Stack',
      startDate: '2024-01-01',
      endDate: '2024-06-30'
    },
    {
      id: '2',
      name: 'MC-46',
      track: 'Android',
      startDate: '2024-03-01',
      endDate: '2024-08-31'
    }
  ],
  loading: false,
  error: null
};

const cohortsSlice = createSlice({
  name: 'cohorts',
  initialState,
  reducers: {
    setCohorts: (state, action: PayloadAction<Cohort[]>) => {
      state.cohorts = action.payload;
    },
    addCohort: (state, action: PayloadAction<Cohort>) => {
      state.cohorts.push(action.payload);
    },
    updateCohort: (state, action: PayloadAction<Cohort>) => {
      const index = state.cohorts.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.cohorts[index] = action.payload;
      }
    },
    deleteCohort: (state, action: PayloadAction<string>) => {
      state.cohorts = state.cohorts.filter(c => c.id !== action.payload);
    }
  }
});

export const { setCohorts, addCohort, updateCohort, deleteCohort } = cohortsSlice.actions;
export default cohortsSlice.reducer;