import { configureStore } from "@reduxjs/toolkit";
import stepperReducer from "./stepper";
import fileReducer from "./file";
import elementsReducer from "./elements";

const store = configureStore({
  reducer: {
    stepper: stepperReducer,
    file: fileReducer,
    elements: elementsReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
