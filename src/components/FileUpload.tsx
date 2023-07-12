import React from "react";
import { useDispatch } from "react-redux";
import { stepperActions } from "../store/stepper";
import { fileActions } from "../store/file";
import { Box } from "@mui/material";

const FileUpload = () => {
  const dispatch = useDispatch();

  const setStep = (step: number) => {
    dispatch(stepperActions.setStep(step));
  };

  const setFile = (file: File) => {
    dispatch(fileActions.setFile(file));
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (files && files[0]) {
      setFile(files[0] || null);
    }

    setStep(1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 3,
        my: 12,
        cursor: "pointer",
      }}
    >
      <Box>
        <label htmlFor="file">Select the PDF form: </label>
        <input
          id="file"
          onChange={onFileChange}
          type="file"
          accept="application/pdf"
        />
      </Box>
    </Box>
  );
};

export default FileUpload;
