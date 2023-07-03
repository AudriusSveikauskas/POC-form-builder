import React, { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Box, Typography } from "@mui/material";
import { Rnd } from "react-rnd";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const CreateForm = () => {
  const file = useSelector<RootState, File | null>((state) => state.file.file);

  const [numPages, setNumPages] = useState<number>();

  const [elements, setElements] = useState<IElements[]>([]);

  const onDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }: PDFDocumentProxy) => {
    setNumPages(nextNumPages);
  };

  const handleClick = () => {
    setElements([
      ...elements,
      { x: 0, y: 0, width: 200, height: 200, label: "kkkk" },
    ]);
  };

  return (
    <Box sx={{ m: 3, display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ position: "relative" }}>
        <Box
          id="pdf-file"
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            backgroundColor: "yellow",
            zIndex: 1000,
            width: "100%",
            height: "100%",
          }}
        >
          {elements.map((e) => (
            <Rnd
              default={{
                x: e.x,
                y: e.y,
                width: e.width,
                height: e.height,
              }}
            >
              <Typography sx={{ color: "blue" }}>56454</Typography>
            </Rnd>
          ))}
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

      <Box
        sx={{ width: "100%", ml: 2, display: "flex", flexDirection: "column" }}
      >
        <Typography>Elements:</Typography>
        <Box
          sx={{ border: "1px solid red", p: 2, cursor: "pointer" }}
          onClick={handleClick}
        >
          <Typography>Text Field</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateForm;
