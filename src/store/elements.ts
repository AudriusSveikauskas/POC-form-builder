import { createSlice } from "@reduxjs/toolkit";

const initialElements = {
  elements: [],
};

const elements = createSlice({
  name: "elements",
  initialState: initialElements,
  reducers: {
    setElements(state, action) {
      state.elements = action.payload;
    },
  },
});

export const elementsActions = elements.actions;

export default elements.reducer;
