import React, { useEffect, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Input,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { DraggableData, Rnd } from "react-rnd";
import { ElementType } from "../enums";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddIcon from "@mui/icons-material/Add";
import { elementsActions } from "../store/elements";
import { stepperActions } from "../store/stepper";
import FormatSizeIcon from "@mui/icons-material/FormatSize";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.js",
//   import.meta.url
// ).toString();

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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

  const handleClose = () => {
    setOpen(false);
  };

  const defaultColor = "#000000";
  const defaultAlignment = "left";
  const defaultSize = 12;

  const onDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }: PDFDocumentProxy) => {
    setNumPages(nextNumPages);
  };

  const createId = () => {
    const newElementId = `el-${idNumber}`;
    setIdNumber(idNumber + 1);

    return newElementId;
  };

  const handleClick = (type: ElementType, label: string) => {
    // Text Input
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
        size: defaultSize,
        value: "",
        alignment: defaultAlignment,
      };

      setElements([...elements, newElement]);
    }

    // Date Picker
    if (type === ElementType.DatePickerElement) {
      const newElement: IElement = {
        id: createId(),
        type,
        label,
        x: 0,
        y: 0,
        width: "160px",
        height: "30px",
        color: defaultColor,
        size: defaultSize,
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

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const newFontSize = newValue;

    if (selectedElement !== undefined && typeof newFontSize === "number") {
      setSelectedElement({ ...selectedElement, size: newFontSize });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFontSize =
      event.target.value === "" ? "" : Number(event.target.value);

    if (selectedElement !== undefined && typeof newFontSize === "number") {
      setSelectedElement({ ...selectedElement, size: newFontSize });
    }
  };

  const handleBlur = () => {
    if (selectedElement?.size !== undefined && selectedElement?.size < 2) {
      setSelectedElement({ ...selectedElement, size: 2 });
    } else if (
      selectedElement?.size !== undefined &&
      selectedElement?.size > 40
    ) {
      setSelectedElement({ ...selectedElement, size: 40 });
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
              if (
                el.type === ElementType.TextInputElement ||
                el.type === ElementType.DatePickerElement
              ) {
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
              handleClick(ElementType.TextInputElement, "Text Input")
            }
          >
            Text Input
          </Button>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            size="medium"
            sx={{ my: 1 }}
            onClick={() =>
              handleClick(ElementType.DatePickerElement, "Date Picker")
            }
          >
            Date Picker
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

        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}
          >
            {/*Label*/}
            {(selectedElement?.type === ElementType.TextInputElement ||
              selectedElement?.type === ElementType.DatePickerElement) && (
              <TextField
                id="el-label"
                label="Label"
                variant="outlined"
                value={selectedElement.label}
                onChange={(e) => handleLabelChange(e)}
                sx={{ m: 1, width: "100%" }}
              />
            )}

            {/*Color*/}
            {(selectedElement?.type === ElementType.TextInputElement ||
              selectedElement?.type === ElementType.DatePickerElement) && (
              <TextField
                id="text-color"
                size="medium"
                type="color"
                label="Color"
                variant="outlined"
                value={selectedElement.color}
                onChange={(e) => handleTextColorChange(e)}
                sx={{ m: 1, width: "100%" }}
              />
            )}
          </Box>

          {/*Font Size*/}
          {(selectedElement?.type === ElementType.TextInputElement ||
            selectedElement?.type === ElementType.DatePickerElement) && (
            <Box sx={{ m: 1 }}>
              <Typography id="input-slider" gutterBottom>
                Font Size
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <FormatSizeIcon />
                </Grid>
                <Grid item xs>
                  <Slider
                    value={selectedElement.size}
                    onChange={handleSliderChange}
                    aria-labelledby="input-slider"
                    max={40}
                    min={2}
                    step={1}
                  />
                </Grid>
                <Grid item>
                  <Input
                    value={selectedElement.size}
                    size="small"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    inputProps={{
                      step: 1,
                      min: 2,
                      max: 40,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateForm;
