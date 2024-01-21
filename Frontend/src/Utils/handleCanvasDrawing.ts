import React from "react";
import { v4 as uuidv4 } from "uuid";
import { ElementsContainer, ElementTypes} from "../Types/Types";

import {
  elementsOnCanvas,
  setActiveElementIndex,
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
    color: "gray",
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
      setActiveElementId(elementsOnCanvas[currentElementIndex].id);
      setActiveElementIndex(currentElementIndex);
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

