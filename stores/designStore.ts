import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface DesignState {
  currentJobId: string | null;
  ideaPrompt: string;
  setJobId: (id: string | null) => void;
  setIdeaPrompt: (prompt: string) => void;
  reset: () => void;
}

export const useDesignStore = create<DesignState>()(
  immer((set) => ({
    currentJobId: null,
    ideaPrompt: '',
    setJobId: (id) =>
      set((state) => {
        state.currentJobId = id;
      }),
    setIdeaPrompt: (prompt) =>
      set((state) => {
        state.ideaPrompt = prompt;
      }),
    reset: () =>
      set((state) => {
        state.currentJobId = null;
        state.ideaPrompt = '';
      }),
  }))
);
