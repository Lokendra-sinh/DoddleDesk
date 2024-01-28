import {
  activeInteractiveElement,
  canvasElements,
  globalCursorStyle,
  setIsElementMoving,
  isElementResizing,
  setIsElementResizing,
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

export function handleActiveOperation(
  e: MouseEvent,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  recoilElements: ElementsContainer,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) {
  e.stopPropagation();
  if (!mainCanvasRef.current || canvasElements.length === 0) return;

  const mainCanvasRect = mainCanvasRef.current.getBoundingClientRect();
  mouseDownX = e.clientX - mainCanvasRect.left;
  mouseDownY = e.clientY - mainCanvasRect.top;
  newRecoilElements = recoilElements;
  setNewRecoilElements = setRecoilElements;

  switch (globalCursorStyle) {
    case "move":
      handleMoveOperation();
      break;
    case "nw-resize":
    case "n-resize":
    case "ne-resize":
    case "w-resize":
    case "e-resize":
    case "sw-resize":
    case "s-resize":
    case "se-resize":
      setIsElementResizing(true);
      console.log("resizing and isElementResizing: ", isElementResizing);
      handleResizeOperation(mouseDownX, mouseDownY, mainCanvasRef, setRecoilElements);
      break;
    case "default":
      toggleActiveStates(setRecoilElements);
      setCueBallsAreVisible(false);
      break;
  }
}

function handleMoveOperation() {
  setIsElementMoving(true);
  setCueBallsAreVisible(true);
  moveElement(mouseDownX, mouseDownY, newRecoilElements, setNewRecoilElements);
}

function toggleActiveStates(
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) {
  const updatedElements = canvasElements.map((element) => {
    const tempElement = { ...element };
    tempElement.isActive = false;

    return tempElement;
  });

  setCanvasElements([...updatedElements]);
  setRecoilElements([...updatedElements]);
}
