import { createSlice } from "@reduxjs/toolkit";

const initialStepper = {
  step: 0,
};

const stepper = createSlice({
  name: "stepper",
  initialState: initialStepper,
  reducers: {
    setStep(state, action) {
      state.step = action.payload;
    },
  },
});

export const stepperActions = stepper.actions;

export default stepper.reducer;
