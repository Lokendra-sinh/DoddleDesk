import { ElementTypes, ElementsContainer } from "../../Types/Types";
import {
  elementsOnCanvas,
  setElementsOnCanvas,
  activeElementId,
  setActiveElementIndex,
  activeElementIndex,
  setActiveElementId,
  overlayForDrag,
} from "../../Components/Board/Board";
import React from "react";

let initialMouseX = 0;
let initialMouseY = 0;
let currentElement: ElementTypes | undefined;
let isDragging = false;

export function handleMouseDown(
  e: MouseEvent,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) {
  if (!canvasRef.current) return;
  e.stopPropagation();
  const canvasRect = canvasRef.current.getBoundingClientRect();
  initialMouseX = e.clientX - canvasRect.left;
  initialMouseY = e.clientY - canvasRect.top;

  const handleCurrentlyDragging = (e: MouseEvent) => {
    onMouseMove(e, canvasRef, setRecoilElements);
  };

  const handleStopDragging = (e: MouseEvent) => {
    onMouseUp(e, canvasRef, setRecoilElements);
  };

  function onMouseUp(
    e: MouseEvent,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
  ) {
  
      if (!isDragging || !canvasRef.current) return;
      e.stopPropagation();
      console.log("finished move");
      isDragging = false;
      overlayForDrag.style.display = "none";
      document.body.style.cursor = "default";
      overlayForDrag.removeEventListener('mousemove', handleCurrentlyDragging);
      overlayForDrag.removeEventListener('mouseup', handleStopDragging);
  
      setRecoilElements([...elementsOnCanvas]);
  
  }

  for (let i = elementsOnCanvas.length - 1; i >= 0; i--) {
    const element = elementsOnCanvas[i];
    if (
      initialMouseX >= element.startCoordinates.x - 5 &&
      initialMouseX <= element.endCoordinates.x + 5 &&
      initialMouseY >= element.startCoordinates.y - 5 &&
      initialMouseY <= element.endCoordinates.y + 5
    ) {
      isDragging = true;
      setActiveElementId(element.id);
      setActiveElementIndex(i);
      break;
    }
  }

  if (!isDragging) {
    setActiveElementId("");
    setActiveElementIndex(-1);
    return;
  } else {
    currentElement = elementsOnCanvas[activeElementIndex];
    overlayForDrag.style.display = "block";
    overlayForDrag.style.cursor = "move";
    overlayForDrag.addEventListener("mousemove", handleCurrentlyDragging);
    overlayForDrag.addEventListener("mouseup", handleStopDragging);
  }
}

function onMouseMove(
  e: MouseEvent,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) {
  if (!canvasRef.current) return;
  e.stopPropagation();

  const canvasRect = canvasRef.current.getBoundingClientRect();
  const mouseX = e.clientX - canvasRect.left;
  const mouseY = e.clientY - canvasRect.top;

  const deltaX = mouseX - initialMouseX;
  const deltaY = mouseY - initialMouseY;

  const updatedStartCoordinates = {
    x: currentElement!.startCoordinates.x + deltaX,
    y: currentElement!.startCoordinates.y + deltaY,
  };
  const updatedEndCoordinates = {
    x: currentElement!.endCoordinates.x + deltaX,
    y: currentElement!.endCoordinates.y + deltaY,
  };

  const updatedElements = [...elementsOnCanvas];
  updatedElements[activeElementIndex] = {
    ...currentElement!,
    startCoordinates: updatedStartCoordinates,
    endCoordinates: updatedEndCoordinates,
  };
  setElementsOnCanvas(updatedElements);
}
