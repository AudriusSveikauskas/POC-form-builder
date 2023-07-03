import { configureStore } from "@reduxjs/toolkit";
import stepperReducer from "./stepper";
import fileReducer from "./file";

const store = configureStore({
  reducer: {
    stepper: stepperReducer,
    file: fileReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
