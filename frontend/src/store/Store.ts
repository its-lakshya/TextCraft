import { configureStore } from '@reduxjs/toolkit';
import authSlice, { AuthState } from './slices/Auth.slice.ts';
import toastSlice, { ToastState } from './slices/Toast.slice.ts';

interface RootState {
  auth: AuthState;
  toast: ToastState;
}

const Store = configureStore({
  reducer: {
    auth: authSlice,
    toast: toastSlice,
  },
});

export default Store;
export type { RootState };
