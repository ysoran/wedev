import { create } from 'zustand';

interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  linkedinProfile: string;
  country: string;
  visasOfInterest: string[];
  resumeFileName: string;
  additionalInfo: string;
  status: 'PENDING' | 'REACHED_OUT';
  submissionDate: string;
}

interface LeadState {
  leads: Lead[];
  totalLeads: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  loading: boolean;
  error: string | null;
  fetchLeads: (page?: number, limit?: number) => Promise<void>;
  setCurrentPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: [],
  totalLeads: 0,
  currentPage: 1,
  totalPages: 1,
  limit: 5,
  loading: false,
  error: null,

  fetchLeads: async (page = get().currentPage, limit = get().limit) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/leads?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      set({
        leads: data.leads,
        totalLeads: data.totalLeads,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        limit: limit,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
    get().fetchLeads(page, get().limit);
  },

  setLimit: (newLimit: number) => {
    set({ limit: newLimit, currentPage: 1 });
    get().fetchLeads(1, newLimit);
  },
}));