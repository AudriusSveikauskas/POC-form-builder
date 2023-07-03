import React, { useEffect, useState } from "react";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { ElementType, HeaderTextVariant } from "../enums";
import { Rnd } from "react-rnd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Document, Page } from "react-pdf";
import { PDFDocumentProxy } from "pdfjs-dist";

const FillForm = () => {
  const [numPages, setNumPages] = useState<number>();

  const file = useSelector<RootState, File | null>((state) => state.file.file);

  const elements = useSelector<RootState, IElement[]>(
    (state) => state.elements.elements
  );

  const onDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }: PDFDocumentProxy) => {
    setNumPages(nextNumPages);
  };

  useEffect(() => {
    console.log("------------", elements);
    console.log("++++++++++++", file);
  }, []);

  return (
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
          {elements.map((el) => {
            if (el.type === ElementType.TextInputElement) {
              return (
                <Box sx={{ position: "absolute", top: el.y, left: el.x }}>
                  <TextField
                    id="standard-basic"
                    size="small"
                    label={el.label}
                    variant="filled"
                    value={el.value}
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
  );
};

export default FillForm;
