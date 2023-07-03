import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { ElementType } from "../enums";
import { Document, Page } from "react-pdf";
import { PDFDocumentProxy } from "pdfjs-dist";
import { elementsActions } from "../store/elements";
import { stepperActions } from "../store/stepper";

const FillForm = () => {
  const dispatch = useDispatch();

  const [numPages, setNumPages] = useState<number>();
  const [selectedElement, setSelectedElement] = useState<IElement | undefined>(
    undefined
  );

  const file = useSelector<RootState, File | null>((state) => state.file.file);

  const elements = useSelector<RootState, IElement[]>(
    (state) => state.elements.elements
  );

  const setElements = (el: IElement[]) => {
    dispatch(elementsActions.setElements(el));
  };

  const setStep = (step: number) => {
    dispatch(stepperActions.setStep(step));
  };

  const onDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }: PDFDocumentProxy) => {
    setNumPages(nextNumPages);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;

    if (selectedElement !== undefined) {
      setSelectedElement({ ...selectedElement, value: newValue });
    }
  };

  useEffect(() => {
    if (selectedElement !== undefined) {
      const selectedElementId = selectedElement.id;
      const newElements = elements.filter((e) => e.id !== selectedElementId);

      setElements([...newElements, selectedElement]);
    }
  }, [selectedElement]);

  const handleFlattenFormClick = () => {
    setElements(elements);
    setStep(3);
  };

  return (
    <>
      <Box sx={{ m: 3, display: "flex", justifyContent: "center" }}>
        <Box sx={{ position: "relative" }}>
          <Box
            id="pdf-file"
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: 1000,
              width: "100%",
              height: "100%",
            }}
          >
            {elements.map((el, i) => {
              if (el.type === ElementType.TextInputElement) {
                return (
                  <Box sx={{ position: "absolute", top: el.y, left: el.x }}>
                    <TextField
                      id={`el-${i + 1}`}
                      size="small"
                      label={el.label}
                      variant="filled"
                      value={el.value}
                      onClick={() => setSelectedElement(el)}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </Box>
                );
              }
            })}
          </Box>

          <Document file={file} onLoadSuccess={() => onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                width={600}
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
          </Document>
        </Box>
      </Box>

      <Box sx={{ m: 3, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          size="large"
          sx={{ width: "60%" }}
          onClick={handleFlattenFormClick}
        >
          Flatten Form
        </Button>
      </Box>
    </>
  );
};

export default FillForm;
