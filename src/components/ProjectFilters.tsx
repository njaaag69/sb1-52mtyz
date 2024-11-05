import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import { setFilters } from '../store/slices/projectsSlice';
import type { RootState } from '../store';

export default function ProjectFilters() {
  const dispatch = useDispatch();
  const { cohorts } = useSelector((state: RootState) => state.cohorts);
  const { filters } = useSelector((state: RootState) => state.projects);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={filters.search}
          onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Track</label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            value={filters.track || ''}
            onChange={(e) => dispatch(setFilters({ track: e.target.value || null }))}
          >
            <option value="">All Tracks</option>
            <option value="Full Stack">Full Stack</option>
            <option value="Android">Android</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cohort</label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            value={filters.cohort || ''}
            onChange={(e) => dispatch(setFilters({ cohort: e.target.value || null }))}
          >
            <option value="">All Cohorts</option>
            {cohorts.map((cohort) => (
              <option key={cohort.id} value={cohort.name}>
                {cohort.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}