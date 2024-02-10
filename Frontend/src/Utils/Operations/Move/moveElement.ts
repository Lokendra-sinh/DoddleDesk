import {
  activeInteractiveElement,
  setActiveInteractiveElement,
  canvasElements,
  setIsElementCurrentlyMoving,
  setCanvasElements,
  undoStack,
  currentCursorStyle,
} from "../../interactionhelpers";
import { ElementsContainer } from "../../../Types/Types";
import {
  startAnimationPreview,
  stopAnimationPreview,
} from "../../Render/DynamicElements/handleSelectedShapeAnimation";
import React from "react";


let initialMouseX: number = 0;
let initialMouseY: number = 0;
let activeElementIndex: number = -1;
let animationStarted: boolean = false;
let setNewRecoilElements: React.Dispatch<
  React.SetStateAction<ElementsContainer>
>;
let sidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;

export function moveElement(
  mouseDownX: number,
  mouseDownY: number,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
  setIsSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>,
) {
  
  setNewRecoilElements = setRecoilElements;
  initialMouseX = mouseDownX;
  initialMouseY = mouseDownY;
  sidePanelOpen = setIsSidePanelOpen;
  findActiveElement(initialMouseX, initialMouseY);
  if (activeElementIndex === -1){
    setIsElementCurrentlyMoving(false);
    return;
  }
  setActiveInteractiveElement(canvasElements[activeElementIndex]);
  setIsElementCurrentlyMoving(true);
  document.body.style.cursor = currentCursorStyle;
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);

  function onMouseUp(e: MouseEvent) {
    e.stopPropagation();
    if (!activeInteractiveElement) return;
    stopAnimationPreview();
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    canvasElements[activeElementIndex] = activeInteractiveElement;
    
    initialMouseX = 0;
    initialMouseY = 0;
    activeElementIndex = -1;
    animationStarted = false;
    
    undoStack.push(activeInteractiveElement);
    console.log("undoStack after moving: ", undoStack);
    setIsElementCurrentlyMoving(false);
    sidePanelOpen(true);
    localStorage.setItem("canvasElements", JSON.stringify(canvasElements));
    setNewRecoilElements(() => [...canvasElements]);
  }
}

function onMouseMove(e: MouseEvent) {
  e.stopPropagation();
  if (!activeInteractiveElement) return;

  if (!animationStarted) {
    startAnimationPreview();
    animationStarted = true;
    sidePanelOpen(false);
  }
  const newMouseX = e.clientX;
  const newMouseY = e.clientY;

  const deltaX = newMouseX - initialMouseX;
  const deltaY = newMouseY - initialMouseY;

  if(activeInteractiveElement.type === "pencil"){
    activeInteractiveElement.points = activeInteractiveElement.points!.map(point => {
      return {
        x: point.x + deltaX,
        y: point.y + deltaY,
      }
    })
    activeInteractiveElement.startCoordinates = {
      x: activeInteractiveElement.startCoordinates!.x + deltaX,
      y: activeInteractiveElement.startCoordinates!.y + deltaY,
    };
    activeInteractiveElement.endCoordinates = {
      x: activeInteractiveElement.endCoordinates!.x + deltaX,
      y: activeInteractiveElement.endCoordinates!.y + deltaY,
    };
    setActiveInteractiveElement(activeInteractiveElement);
    canvasElements[activeElementIndex] = activeInteractiveElement;

  } else {

  const updatedElement = {
    ...activeInteractiveElement,
    startCoordinates: {
      x: activeInteractiveElement.startCoordinates!.x + deltaX,
      y: activeInteractiveElement.startCoordinates!.y + deltaY,
    },
    endCoordinates: {
      x: activeInteractiveElement.endCoordinates!.x + deltaX,
      y: activeInteractiveElement.endCoordinates!.y + deltaY,
    },
  };

  setActiveInteractiveElement(updatedElement);
  canvasElements[activeElementIndex] = updatedElement;
}


  initialMouseX = newMouseX;
  initialMouseY = newMouseY;
}


function findActiveElement(mouseDownX: number, mouseDownY: number) {
  const updatedElements = canvasElements.map((element, index) => {
    const tempElement = { ...element };
    if (
      mouseDownX >= tempElement.startCoordinates!.x &&
      mouseDownX <= tempElement.endCoordinates!.x &&
      mouseDownY >= tempElement.startCoordinates!.y &&
      mouseDownY <= tempElement.endCoordinates!.y
    ) {
      activeElementIndex = index;
      tempElement.isActive = true;
    } else {
      tempElement.isActive = false;
    }

    return tempElement;
  });

  setCanvasElements([...updatedElements]);
}
