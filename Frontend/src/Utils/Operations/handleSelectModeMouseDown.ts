import {
  canvasElements,
  currentCursorStyle,
  setIsElementCurrentlyMoving,
  isElementCurrentlyResizing,
  setIsElementCurrentlyResizing,
  setCanvasElements,
  cueBallsAreVisible,
  setCueBallsAreVisible,
} from "../interactionhelpers";
import { ElementsContainer, ElementTypes } from "../../Types/Types";
import { moveElement } from "./Move/moveElement";
import React from "react";
import { handleResizeOperation } from "./Resize/handleResizeOperation";

let mouseDownX: number = 0;
let mouseDownY: number = 0;
let newRecoilElements: ElementsContainer;
let setNewRecoilElements: React.Dispatch<
  React.SetStateAction<ElementsContainer>
>;

export function handleSelectModeMouseDown(
  e: MouseEvent,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  recoilElements: ElementsContainer,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
  setIsSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>,
) {
  e.stopPropagation();
  if (!mainCanvasRef.current || canvasElements.length === 0) return;

  const mainCanvasRect = mainCanvasRef.current.getBoundingClientRect();
  mouseDownX = e.clientX - mainCanvasRect.left;
  mouseDownY = e.clientY - mainCanvasRect.top;
  newRecoilElements = recoilElements;
  setNewRecoilElements = setRecoilElements;

  //decide active operation based on the cursor style
  switch (currentCursorStyle) {
    case "move":
      handleMoveOperation(setIsSidePanelOpen);
      break;
    case "nw-resize":
    case "n-resize":
    case "ne-resize":
    case "w-resize":
    case "e-resize":  
    case "sw-resize":
    case "s-resize":
    case "se-resize":
      setIsElementCurrentlyResizing(true);
      handleResizeOperation(mouseDownX, mouseDownY, mainCanvasRef, setRecoilElements, setIsSidePanelOpen);
      break;
    case "default":
      //toggle off all active states and hide resize handles/bounding box
      setCueBallsAreVisible(false);
      setIsElementCurrentlyMoving(false);
      setIsElementCurrentlyResizing(false);
      toggleActiveStatesOfElements(setRecoilElements, setIsSidePanelOpen);
      break;
  }
}

function handleMoveOperation(setIsSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>) {
  setIsElementCurrentlyMoving(true);
  setCueBallsAreVisible(true);
  moveElement(mouseDownX, mouseDownY, newRecoilElements, setNewRecoilElements, setIsSidePanelOpen);
}

function toggleActiveStatesOfElements(
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
  setIsSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  const updatedElements = canvasElements.map((element) => {
    const tempElement = { ...element, isActive: false};
    return tempElement;
  });

  setCanvasElements([...updatedElements]);
  setIsElementCurrentlyMoving(false);
  setIsElementCurrentlyResizing(false);
  setIsSidePanelOpen(false);
  setRecoilElements([...updatedElements]);

}
