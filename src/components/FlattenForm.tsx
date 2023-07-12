import React, { useEffect, useState } from "react";
import { Box, Button, Link } from "@mui/material";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Document, Page } from "react-pdf";
import { PDFDocumentProxy } from "pdfjs-dist";
import hexRgb from "hex-rgb";

const FlattenForm = () => {
  const [pdfBytesX, setPdfBytesX] = useState<Uint8Array>();
  const [newFile, setNewFile] = useState<File>();
  const [numPages, setNumPages] = useState<number>();

  const elements = useSelector<RootState, IElement[]>(
    (state) => state.elements.elements
  );

  const handleHexRgb = (hex: string) => {
    const rgbObj = hexRgb(hex);

    return rgb(rgbObj.red / 255, rgbObj.green / 255, rgbObj.blue / 255);
  };

  const file = useSelector<RootState, File | null>((state) => state.file.file);

  const modifyPdf = async () => {
    if (file !== undefined && file !== null) {
      const pdfDoc = await PDFDocument.load(await file?.arrayBuffer());

      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      elements.forEach((el) => {
        firstPage.drawText(el.value, {
          x: el.x,
          y: height - el.y,
          size: el.size,
          font: helveticaFont,
          color: el.color !== undefined ? handleHexRgb(el.color) : rgb(0, 0, 0),
          rotate: degrees(0),
        });
      });

      const pdfBytes = await pdfDoc.save();

      setPdfBytesX(pdfBytes);
    }
  };

  const getMockData = () => {
    if (pdfBytesX !== undefined && pdfBytesX !== null) {
      const blob = new File([pdfBytesX], "dsdsd");
      setNewFile(blob);
    }
  };

  const onDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }: PDFDocumentProxy) => {
    setNumPages(nextNumPages);
  };

  useEffect(() => {
    getMockData();
  }, [pdfBytesX]);

  useEffect(() => {
    if (file !== undefined && file !== null) {
      modifyPdf();
    }
  }, [file]);

  const handleDownloadClick = () => {
    if (newFile !== undefined) {
      const url = URL.createObjectURL(newFile);
      console.log(url);

      return url;
    }
  };

  return (
    <>
      <Box sx={{ m: 3, display: "flex", justifyContent: "center" }}>
        <Box sx={{ position: "relative" }}>
          {newFile !== undefined && (
            <Document
              file={newFile}
              onLoadSuccess={() => onDocumentLoadSuccess}
            >
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
          )}
        </Box>
      </Box>

      <Box sx={{ m: 3, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          size="large"
          sx={{ width: "60%" }}
          href={`${handleDownloadClick()}`}
          download="filled-form.pdf"
        >
          Download Document
        </Button>
      </Box>
    </>
  );
};

export default FlattenForm;
