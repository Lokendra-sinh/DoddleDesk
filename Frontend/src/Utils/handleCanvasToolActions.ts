import React from "react";
import { ElementsContainer } from "../Types/Types";
import { handleActiveElementDrawing } from "./handleCanvasDrawing";


type SetActiveElementIdType = (id: string) => void;


export const handleCanvasToolActions = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  selectedTool: string,
  setSelectedTool: React.Dispatch<React.SetStateAction<string>>,
  setActiveElementId: SetActiveElementIdType,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
) => {
  if (!canvasRef.current) return;

  switch (selectedTool) {
    case "circle":
    case "ellipse":
    case "rectangle":
    case "biSquare":
    case "line":
    case "text":
      document.body.style.cursor = "crosshair";
      canvasRef.current.addEventListener("mousedown", onMouseDown);
      break;
    case "grab":
      document.body.style.cursor = "grab";
      break;
    case "select":
      document.body.style.cursor = "default";
      break;
  }

  function onMouseDown(e: MouseEvent){
    handleActiveElementDrawing(
      e,
      canvasRef,
      selectedTool,
      setSelectedTool,
      setActiveElementId,
      setRecoilElements,
    );
  };
  // Return a cleanup function
  return () => {
    if (canvasRef.current) {
      canvasRef.current.removeEventListener("mousedown", onMouseDown);
    }
  };
};
