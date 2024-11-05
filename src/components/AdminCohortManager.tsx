import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2 } from 'lucide-react';
import { addCohort, deleteCohort } from '../store/slices/cohortsSlice';
import type { RootState } from '../store';

export default function AdminCohortManager() {
  const dispatch = useDispatch();
  const { cohorts } = useSelector((state: RootState) => state.cohorts);
  const [newCohort, setNewCohort] = useState({
    name: '',
    track: 'Full Stack',
    startDate: '',
    endDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addCohort({
      id: Date.now().toString(),
      ...newCohort
    }));
    setNewCohort({
      name: '',
      track: 'Full Stack',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Manage Cohorts</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cohort Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={newCohort.name}
              onChange={(e) => setNewCohort({ ...newCohort, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Track</label>
            <select
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={newCohort.track}
              onChange={(e) => setNewCohort({ ...newCohort, track: e.target.value as 'Full Stack' | 'Android' })}
            >
              <option value="Full Stack">Full Stack</option>
              <option value="Android">Android</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={newCohort.startDate}
              onChange={(e) => setNewCohort({ ...newCohort, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={newCohort.endDate}
              onChange={(e) => setNewCohort({ ...newCohort, endDate: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Cohort
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Current Cohorts</h3>
        <div className="space-y-2">
          {cohorts.map((cohort) => (
            <div
              key={cohort.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div>
                <span className="font-medium">{cohort.name}</span>
                <span className="ml-2 text-sm text-gray-500">({cohort.track})</span>
              </div>
              <button
                onClick={() => dispatch(deleteCohort(cohort.id))}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}