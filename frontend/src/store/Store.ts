import { configureStore } from '@reduxjs/toolkit';
import authSlice, { AuthState } from './slices/Auth.slice.ts';

interface RootState {
  auth: AuthState;
}

const Store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

export default Store;
export type { RootState };
