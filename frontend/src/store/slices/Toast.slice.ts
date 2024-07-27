import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToastState {
  showToast: boolean,
  message: string,
  type: 'SUCCESS'| 'FAILED' | 'UNAUTHORIZED' | 'DEFAULT',
  timing: number,
  image?: string,
}

const initialState: ToastState = {
  showToast: false,
  message: '',
  type: 'DEFAULT',
  timing: 0,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,

  reducers: {
    setShowToast: (state, action: PayloadAction<ToastState>) => {
      state.showToast = action.payload.showToast;
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.timing = action.payload.timing
      if(action.payload.image){
        state.image = action.payload.image
      }
    },
  },
});

export const { setShowToast } = toastSlice.actions;
export default toastSlice.reducer;
