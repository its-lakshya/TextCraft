import { configureStore } from '@reduxjs/toolkit';
import authSlice, { AuthState } from './slices/Auth.slice.ts';
import toastSlice, { ToastState } from './slices/Toast.slice.ts';
import docSavingSlice, { DocSaving } from './slices/DocSaving.slice.ts';

interface RootState {
  auth: AuthState;
  toast: ToastState;
  docSaving: DocSaving;
}

const Store = configureStore({
  reducer: {
    auth: authSlice,
    toast: toastSlice,
    docSaving: docSavingSlice,
  },
});

export default Store;
export type { RootState };
