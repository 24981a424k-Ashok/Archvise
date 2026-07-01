import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface AuditState {
  currentJobId: string | null;
  selectedRepo: string | null;
  selectedBranch: string | null;
  selectedFileType: string; // 'Backend' | 'Frontend' | 'Mixed'
  uploadedFiles: { filename: string; size: number; content: string }[];
  setJobId: (id: string | null) => void;
  selectRepo: (repo: string | null, branch?: string | null) => void;
  setFileType: (fileType: string) => void;
  addUploadedFile: (file: { filename: string; size: number; content: string }) => void;
  removeUploadedFile: (filename: string) => void;
  clearUploadedFiles: () => void;
  reset: () => void;
}

export const useAuditStore = create<AuditState>()(
  immer((set) => ({
    currentJobId: null,
    selectedRepo: null,
    selectedBranch: null,
    selectedFileType: 'Backend',
    uploadedFiles: [],
    setJobId: (id) =>
      set((state) => {
        state.currentJobId = id;
      }),
    selectRepo: (repo, branch = "main") =>
      set((state) => {
        state.selectedRepo = repo;
        state.selectedBranch = branch;
      }),
    setFileType: (fileType) =>
      set((state) => {
        state.selectedFileType = fileType;
      }),
    addUploadedFile: (file) =>
      set((state) => {
        // Prevent duplicate file entries
        if (!state.uploadedFiles.some(f => f.filename === file.filename)) {
          state.uploadedFiles.push(file);
        }
      }),
    removeUploadedFile: (filename) =>
      set((state) => {
        state.uploadedFiles = state.uploadedFiles.filter(f => f.filename !== filename);
      }),
    clearUploadedFiles: () =>
      set((state) => {
        state.uploadedFiles = [];
      }),
    reset: () =>
      set((state) => {
        state.currentJobId = null;
        state.selectedRepo = null;
        state.selectedBranch = null;
        state.uploadedFiles = [];
      }),
  }))
);
