import React, { useEffect, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { DraggableData, Rnd } from "react-rnd";
import { ElementType, HeaderTextVariant } from "../enums";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddIcon from "@mui/icons-material/Add";
import { elementsActions } from "../store/elements";
import { stepperActions } from "../store/stepper";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const CreateForm = () => {
  const dispatch = useDispatch();

  const file = useSelector<RootState, File | null>((state) => state.file.file);

  const [numPages, setNumPages] = useState<number>();

  const [elements, setElements] = useState<IElement[]>([]);
  const [idNumber, setIdNumber] = useState(1);
  const [selectedElement, setSelectedElement] = useState<IElement | undefined>(
    undefined
  );

  const [open, setOpen] = React.useState(false);

  const setFillFormElements = () => {
    dispatch(elementsActions.setElements(elements));
  };

  const setStep = (step: number) => {
    dispatch(stepperActions.setStep(step));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const defaultColor = "#000000";
  const defaultVariant = HeaderTextVariant.F16;
  const defaultAlignment = "left";
  const defaultSize = "16px";
  const variantOptions = [
    HeaderTextVariant.F08,
    HeaderTextVariant.F10,
    HeaderTextVariant.F12,
    HeaderTextVariant.F14,
    HeaderTextVariant.F16,
    HeaderTextVariant.F18,
  ];

  const onDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }: PDFDocumentProxy) => {
    setNumPages(nextNumPages);
  };

  const createId = () => {
    const newElementId = `el-${idNumber}`;
    setIdNumber(idNumber + 1);

    console.log("newElementId", newElementId);
    return newElementId;
  };

  const handleClick = (type: ElementType, label: string) => {
    // Header Text
    if (type === ElementType.TextInputElement) {
      const newElement: IElement = {
        id: createId(),
        type,
        label,
        x: 0,
        y: 0,
        width: "160px",
        height: "30px",
        color: defaultColor,
        variant: defaultVariant,
        value: "",
        alignment: defaultAlignment,
      };

      setElements([...elements, newElement]);
    }
  };

  const handleDragStop = (id: string, d: DraggableData) => {
    const newElements = elements.map((e) => {
      if (e.id === id) {
        e.x = d.x;
        e.y = d.y;

        return e;
      }

      return e;
    });

    setElements(newElements);
  };

  const handleIconButton = (el: IElement) => {
    setSelectedElement(el);
    setOpen(true);
  };

  const handleLabelChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newLabel = e.target.value;
    if (selectedElement !== undefined) {
      setSelectedElement({ ...selectedElement, label: newLabel });
    }
  };

  const handleTextColorChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newColor = e.target.value;

    if (selectedElement !== undefined) {
      setSelectedElement({ ...selectedElement, color: newColor });
    }
  };

  const handleVariantChange = (variant: string | null) => {
    const newVariant = variant;

    if (selectedElement !== undefined && newVariant !== null) {
      setSelectedElement({ ...selectedElement, variant: newVariant });
    }
  };

  const handleFillFormClick = () => {
    setFillFormElements();
    setStep(2);
  };

  useEffect(() => {
    if (selectedElement !== undefined) {
      const selectedElementId = selectedElement.id;
      const newElements = elements.filter((e) => e.id !== selectedElementId);

      setElements([...newElements, selectedElement]);
    }
  }, [selectedElement]);

  return (
    <>
      <Box sx={{ m: 3, display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ position: "relative" }}>
          <Box
            id="pdf-file"
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              backgroundColor: "rgba(255,255,0,0.3)",
              zIndex: 1000,
              width: "100%",
              height: "100%",
            }}
          >
            {elements.map((el, i) => {
              // Header Text
              if (el.type === ElementType.TextInputElement) {
                return (
                  <Rnd
                    bounds="parent"
                    key={el.id}
                    enableResizing={false}
                    default={{
                      x: el.x,
                      y: el.y,
                      width: el.width,
                      height: el.height,
                    }}
                    onDragStop={(e, d) => handleDragStop(el.id, d)}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "left",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pl: 1,
                        width: "100%",
                        height: "100%",
                        border: "1px solid grey",
                        backgroundColor: "white",
                        overflow: "hidden",
                      }}
                    >
                      <Typography
                        noWrap
                        sx={{ overflow: "hidden", color: el.color }}
                      >
                        {el.label}
                      </Typography>
                      <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={() => handleIconButton(el)}
                      >
                        <AddCircleIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Rnd>
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

        <Box
          sx={{
            width: "100%",
            ml: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6">Elements:</Typography>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            size="medium"
            sx={{ my: 1 }}
            onClick={() =>
              handleClick(ElementType.TextInputElement, "Header Text")
            }
          >
            Header Text
          </Button>

          <Button
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            onClick={handleFillFormClick}
          >
            Fill Form
          </Button>
        </Box>
      </Box>

      <Dialog
        open={open}
        fullWidth
        maxWidth="sm"
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography noWrap variant="h6" sx={{ overflow: "hidden" }}>
            {`Editing element: "${selectedElement?.label}" (id: ${selectedElement?.id})`}
          </Typography>
        </DialogTitle>

        {selectedElement?.type === ElementType.TextInputElement && (
          <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              id="el-label"
              label="Label"
              variant="outlined"
              value={selectedElement.label}
              onChange={(e) => handleLabelChange(e)}
              sx={{ m: 1 }}
            />
            <TextField
              id="text-color"
              type="color"
              label="Color"
              variant="outlined"
              value={selectedElement.color}
              onChange={(e) => handleTextColorChange(e)}
              sx={{ m: 1 }}
            />
            <Autocomplete
              value={selectedElement.variant}
              onChange={(event: any, newValue: string | null) => {
                handleVariantChange(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Controllable" />
              )}
              options={variantOptions}
              sx={{ m: 1 }}
            />
          </DialogContent>
        )}

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateForm;
