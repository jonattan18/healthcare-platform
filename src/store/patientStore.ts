import { create } from 'zustand';
import type { Patient } from '../types';
import { patients as mockPatients } from '../data/patients';

type ViewMode = 'grid' | 'list';

interface PatientState {
  patients: Patient[];
  viewMode: ViewMode;
  searchQuery: string;
  statusFilter: string;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  filteredPatients: () => Patient[];
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: mockPatients,
  viewMode: 'grid',
  searchQuery: '',
  statusFilter: 'all',

  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),

  filteredPatients: () => {
    const { patients, searchQuery, statusFilter } = get();
    return patients.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.condition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  },
}));
