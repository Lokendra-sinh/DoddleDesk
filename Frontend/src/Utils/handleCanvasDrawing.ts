import React from "react";
import { v4 as uuidv4 } from "uuid";
import { ElementsContainer, ElementTypes, ToolFlags } from "../Types/Types";

import { elementsOnCanvas, setElementsOnCanvas, setActiveElementId } from "../../src/Components/Board/Board";

export function handleActiveElementDrawing(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  // setElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
  // elementsOnCanvas: React.MutableRefObject<ElementsContainer>,
  selectedTool: string,
  setSelectedTool: React.Dispatch<React.SetStateAction<string>>,
  // setActiveElementId: React.Dispatch<React.SetStateAction<string>>,
) {
  console.log("inside handleCanvasDrawing");
  if (!canvasRef.current) return;
  if (canvasRef.current.style.cursor === "default"){
    console.log("inside handleCanvasDrawing becuase cursor is default");
    return;
  }
  let isDragging = false;
  let currentElementIndex: number;
  let currentElement: ElementTypes;
  
  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    if(currentElementIndex === undefined) return;

    elementsOnCanvas[currentElementIndex].endCoordinates = {
      x: e.clientX - canvasRef.current!.offsetLeft,
      y: e.clientY - canvasRef.current!.offsetTop,
    };
    
  };

  const onMouseUp = (e: MouseEvent) => {
    e.stopPropagation();
    if (!canvasRef.current) return;
    isDragging = false;
    // if(currentElementIndex === undefined) return;
    //  currentElement.endCoordinates = {
    //   x: e.clientX - canvasRef.current!.offsetLeft,
    //   y: e.clientY - canvasRef.current!.offsetTop,
    // };
    // elementsOnCanvas[currentElementIndex] = currentElement;
    // setElementsOnCanvas(updatedElements);
    // elementsOnCanvas = [...elementsOnCanvas, elementsOnCanvas[currentElementIndex] = currentElement];
    canvasRef.current.removeEventListener("mousemove", onMouseMove);
    canvasRef.current.removeEventListener("mouseup", onMouseUp);
    canvasRef.current.removeEventListener("mousedown", onMouseDown);
    canvasRef.current.style.cursor = "default";
    setActiveElementId(currentElement.id);
    setSelectedTool("select");
  };

  const onMouseDown = (e: MouseEvent) => {
    e.stopPropagation();
    console.log("mousedown: activeElementDrawing");
    if (!canvasRef.current) return;
    isDragging = true;

      currentElement = {
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

    elementsOnCanvas.push(currentElement);
    currentElementIndex = elementsOnCanvas.length - 1;
    canvasRef.current.addEventListener("mousemove", onMouseMove);
    canvasRef.current.addEventListener("mouseup", onMouseUp);
  };

 
  canvasRef.current.addEventListener("mousedown", onMouseDown);
}

export const handleClick = (
  e: MouseEvent,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  // elementsOnCanvas: React.MutableRefObject<ElementsContainer>,
  // setActiveElementId: React.Dispatch<React.SetStateAction<string>>,
) => {
  if (!canvasRef.current) return;
  e.stopPropagation();
  const clickedX = e.clientX - canvasRef.current!.offsetLeft;
  const clickedY = e.clientY - canvasRef.current!.offsetTop;
  

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
      // selectedElementId = elements[i].id;
      setActiveElementId(elementsOnCanvas[i].id);
      break;
    } else {
      setActiveElementId("");
    }
  }

};