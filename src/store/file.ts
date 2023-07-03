import { createSlice } from "@reduxjs/toolkit";

const initialFile = {
  file: null,
};

const file = createSlice({
  name: "file",
  initialState: initialFile,
  reducers: {
    setFile(state, action) {
      state.file = action.payload;
    },
  },
});

export const fileActions = file.actions;

export default file.reducer;
