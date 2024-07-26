import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DocSaving {
  isSaving: boolean
}

const initialState: DocSaving = {
  isSaving: false
}


const docSavingSlice = createSlice({
  name: 'docSaving',
  initialState,

  reducers: {
    setIsSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload
    }
  }
})

export const {setIsSaving} = docSavingSlice.actions;
export default docSavingSlice.reducer