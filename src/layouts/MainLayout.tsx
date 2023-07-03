import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import HorizontalStepper from "../components/HorizontalStepper";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import FileUpload from "../components/FileUpload";
import CreateForm from "../components/CreateForm";
import FillForm from "../components/FillForm";

const MainLayout = () => {
  const step = useSelector<RootState, number>((state) => state.stepper.step);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        mt: 2,
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ width: "1000px" }}>
        <Typography
          variant="h5"
          sx={{ mt: 4, width: "100%", textAlign: "center" }}
        >
          Form Builder (POC)
        </Typography>

        <HorizontalStepper />

        {step === 0 && <FileUpload />}
        {step === 1 && <CreateForm />}
      </Paper>
    </Box>
  );
};

export default MainLayout;
