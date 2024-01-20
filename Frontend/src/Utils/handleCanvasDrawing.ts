import React from "react";
import { v4 as uuidv4 } from "uuid";
import { ElementsContainer, ElementTypes} from "../Types/Types";

import {
  elementsOnCanvas,
  setElementsOnCanvas,
} from "../../src/Components/Board/Board";

type SetActiveElementIdType = (id: string) => void;

export function handleActiveElementDrawing(
  e: MouseEvent,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  selectedTool: string,
  setSelectedTool: React.Dispatch<React.SetStateAction<string>>,
  setActiveElementId: SetActiveElementIdType,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) {
  console.log("initiated drag");
  if (!canvasRef.current) return;
  let isDragging = false;
  let minDistance = 10;
  let elementAdded = false;
  let currentElementIndex = elementsOnCanvas.length;
  let currentElement: ElementTypes = {
    type: selectedTool,
    startCoordinates: {
      x: e.clientX - canvasRef.current!.offsetLeft,
      y: e.clientY - canvasRef.current!.offsetTop,
    },
    endCoordinates: {
      x: e.clientX - canvasRef.current!.offsetLeft,
      y: e.clientY - canvasRef.current!.offsetTop,
    },
    color: "black",
    size: 2,
    cursor: "crosshair",
    id: uuidv4(),
    active: false,
  };

  const onMouseMove = (e: MouseEvent) => {
    const endX = e.clientX - canvasRef.current!.offsetLeft;
    const endY = e.clientY - canvasRef.current!.offsetTop;
    const distanceMoved = Math.sqrt(
      (endX - currentElement.startCoordinates.x) ** 2 +
        (endY - currentElement.startCoordinates.y) ** 2
    );
    console.log("distanceMoved: ", distanceMoved);
    if (distanceMoved >= minDistance) {
      if (!elementAdded) {
        elementsOnCanvas.push(currentElement);
        currentElementIndex = elementsOnCanvas.length - 1;
        elementAdded = true;
      }
      isDragging = true;
      console.log("currently dragging");
      elementsOnCanvas[currentElementIndex].endCoordinates = {
        x: endX,
        y: endY,
      };
    }
  };

  const onMouseUp = (e: MouseEvent) => {
    if (elementAdded) {
      canvasRef.current!.style.cursor = "default";
      setActiveElementId(elementsOnCanvas[currentElementIndex].id);
      setSelectedTool("select");
      setRecoilElements(prevElements => [...prevElements, elementsOnCanvas[currentElementIndex]]);
      console.log("finished dragging");
    } else {
      console.log("no dragging occurred");
    }
    canvasRef.current!.removeEventListener("mousemove", onMouseMove);
    canvasRef.current!.removeEventListener("mouseup", onMouseUp);
    isDragging = false;
    elementAdded = false;
  };
  canvasRef.current.addEventListener("mousemove", onMouseMove);
  canvasRef.current.addEventListener("mouseup", onMouseUp);
}

export const handleClick = (
  e: MouseEvent,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setActiveElementId: SetActiveElementIdType,
  setSelectedTool: React.Dispatch<React.SetStateAction<string>>,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) => {
  console.log("inside handleClick");
  if (!canvasRef.current) return;
  console.log("inside handleClick becuase canvasRef.current exists");
  e.stopPropagation();
  const clickedX = e.clientX - canvasRef.current!.offsetLeft;
  const clickedY = e.clientY - canvasRef.current!.offsetTop;
  let clickedElementIndex: number | undefined;
  let clickedElement: ElementTypes | undefined;
  let clickedElementId: string | undefined;

  for (let i = 0; i < elementsOnCanvas.length; i++) {
    const { startCoordinates, endCoordinates } = elementsOnCanvas[i];
    const { x: startX, y: startY } = startCoordinates;
    const { x: endX, y: endY } = endCoordinates;
    if (
      clickedX >= startX &&
      clickedX <= endX &&
      clickedY >= startY &&
      clickedY <= endY
    ) {
      console.log("inside element");
      clickedElementId = elementsOnCanvas[i].id;
      clickedElementIndex = i;
      clickedElement = elementsOnCanvas[i];
      break;
    }
  }

  if (
    clickedElementIndex === undefined ||
    clickedElement === undefined ||
    clickedElementId === undefined
  ) {
    console.log("no element was clicked");
    setActiveElementId("");
    setRecoilElements((prevElements) => [...prevElements]);
    return;
  }
  setActiveElementId(clickedElementId);
  setRecoilElements((prevElements) => {
    // Check if the element is already in the state
    const isElementAlreadyInState = prevElements.some(
      (element) => element.id === clickedElementId
    );
    if (!isElementAlreadyInState) {
      // Add the new element if it's not already present
      return [...prevElements, clickedElement!];
    }
    return prevElements; // Return the existing state if the element is already present
  });
};
