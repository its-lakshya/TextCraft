import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToastState {
  showToast: boolean,
  message: string,
  type: 'SUCCESS'| 'FAILED' | 'UNAUTHORIZED' | 'DEFAULT'
}

const initialState: ToastState = {
  showToast: false,
  message: '',
  type: 'SUCCESS'
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,

  reducers: {
    setShowToast: (state, action: PayloadAction<ToastState>) => {
      state.showToast = action.payload.showToast;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
  },
});

export const { setShowToast } = toastSlice.actions;
export default toastSlice.reducer;
