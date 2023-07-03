import React, { useState } from "react";
import { Box, Step, StepLabel, Stepper } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const HorizontalStepper = () => {
  const step = useSelector<RootState, number>((state) => state.stepper.step);

  const steps = ["Upload File", "Create Form", "Fill Form", "Flatten Form"];

  return (
    <Box sx={{ width: "100%", my: 4 }}>
      <Stepper activeStep={step} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default HorizontalStepper;
