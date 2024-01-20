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
  console.log(
    "inside handleCanvasToolActions where cursor is: ",
    canvasRef.current.style.cursor
  );

  const onMouseDown = (e: MouseEvent) => {
    handleActiveElementDrawing(
      e,
      canvasRef,
      selectedTool,
      setSelectedTool,
      setActiveElementId,
      setRecoilElements,
    );
  };

  switch (selectedTool) {
    case "circle":
    case "ellipse":
    case "rectangle":
    case "biSquare":
    case "line":
    case "text":
      canvasRef.current.style.cursor = "crosshair";
      canvasRef.current.addEventListener("mousedown", onMouseDown);
      break;
    case "grab":
      canvasRef.current.style.cursor = "grab";
      break;
    case "select":
      canvasRef.current.style.cursor = "default";
      break;
  }

  // Return a cleanup function
  return () => {
    if (canvasRef.current) {
      canvasRef.current.removeEventListener("mousedown", onMouseDown);
    }
  };
};
