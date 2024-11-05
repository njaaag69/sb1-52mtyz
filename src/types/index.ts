export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  cohort?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  track: 'Full Stack' | 'Android';
  cohort: string;
  owners: User[];
  members: User[];
  createdAt: string;
}

export interface Cohort {
  id: string;
  name: string;
  track: 'Full Stack' | 'Android';
  startDate: string;
  endDate: string;
}