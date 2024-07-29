import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  isAuthenticated?: boolean;
  _id: string;
  userName: string;
  gender: string;
  email: string;
  fullName: string;
  profileImage: string;
  mobileNumber?: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  _id: '',
  userName: '',
  gender: '',
  email: '',
  fullName: '',
  profileImage: '',
  mobileNumber: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUserDetails: (state, action: PayloadAction<AuthState>) => {
      state._id = action.payload._id;
      state.userName = action.payload.userName;
      state.gender = action.payload.gender;
      state.email = action.payload.email;
      state.fullName = action.payload.fullName;
      state.profileImage = action.payload.profileImage;
      state.mobileNumber = action.payload.mobileNumber;
    },
  },
});

export const { setAuthStatus, setUserDetails } = authSlice.actions;
export default authSlice.reducer;
