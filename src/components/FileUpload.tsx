import React from "react";
import { useDispatch } from "react-redux";
import { stepperActions } from "../store/stepper";
import { fileActions } from "../store/file";

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
    <>
      <label htmlFor="file">Load from file:</label>{" "}
      <input onChange={onFileChange} type="file" />
    </>
  );
};

export default FileUpload;
