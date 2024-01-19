import React from "react";
import { BoundingBoxAndCueBalls, ElementsContainer } from "../Types/Types";
import { findActiveCueBall } from "./Resize/findActiveCueBall";
import { drawBoundingBoxAndCueBalls } from "./resizeElements/drawBoundingBoxAndCueBalls";
import { handleActiveElementDrawing } from "./handleCanvasDrawing";

import {
  elementsOnCanvas,
  setElementsOnCanvas,
  getElementsOnCanvas,
  activeElementId,
  setActiveElementId,
  getActiveElementId,
} from "../../src/Components/Board/Board";

export const handleCanvasToolActions = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  selectedTool: string,
  setSelectedTool: React.Dispatch<React.SetStateAction<string>>,
  activeBoxAndCueBalls: React.MutableRefObject<BoundingBoxAndCueBalls>
  // elementsOnCanvas: React.MutableRefObject<ElementsContainer>,
  // activeElementId: string | "",
  // setActiveElementId: React.Dispatch<React.SetStateAction<string | "">>,
) => {
  if (!canvasRef.current) return;
  console.log(
    "inside handleCanvasToolActions where cursor is: ",
    canvasRef.current.style.cursor
  );
  // const handleMouseDown = (e: MouseEvent) => {
  //   onMouseDown(
  //     e,
  //     canvasRef,
  //     activeBoxAndCueBalls,
  //     elementsOnCanvas,
  //     activeElementId,
  //     setActiveElementId,
  //   );
  // };

  switch (selectedTool) {
    case "circle":
    case "ellipse":
    case "rectangle":
    case "biSquare":
    case "line":
    case "text":
      canvasRef.current.style.cursor = "crosshair";
      handleActiveElementDrawing(
        canvasRef,
        // elementsOnCanvas,
        selectedTool,
        setSelectedTool,
        // setActiveElementId
      );
      break;
    case "grab":
      canvasRef.current.style.cursor = "grab";
      break;
    case "select":
      canvasRef.current.style.cursor = "default";
      if (elementsOnCanvas.length === 0) return;
      console.log("inside handleCanvasToolActions when the case is select: ");
      // canvasRef.current.addEventListener("mousedown", handleMouseDown);
      break;
    // Add more cases or a default case if needed
  }

  // Return a cleanup function
  return () => {
    if (canvasRef.current) {
      // canvasRef.current.removeEventListener("mousedown", handleMouseDown);
    }
  };
};

// function onMouseDown(
//   e: MouseEvent,
//   canvasRef: React.RefObject<HTMLCanvasElement>,
//   activeBoxAndCueBalls: React.MutableRefObject<BoundingBoxAndCueBalls>,
//   elementsOnCanvas: React.MutableRefObject<ElementsContainer>,
//   activeElementId: string | "",
//   setActiveElementId: React.Dispatch<React.SetStateAction<string | "">>,
// ) {
//   if (!canvasRef.current) return;
//   const currentElementIndex = elementsOnCanvas.current.findIndex(
//     (element) => element.id === activeElementId
//   );
//   const currentElement = elementsOnCanvas.current[currentElementIndex];
//   const mouseX = e.clientX - canvasRef.current.offsetLeft;
//   const mouseY = e.clientY - canvasRef.current.offsetTop;
//   let isDragging = true;
//   const offset = {
//     x: mouseX - currentElement.startCoordinates.x,
//     y: mouseY - currentElement.startCoordinates.y,
//   };

//   const activeCueBall = findActiveCueBall(
//     mouseX,
//     mouseY,
//     canvasRef,
//     activeBoxAndCueBalls
//   );

//   if (activeCueBall !== null) {
//     switch (activeCueBall) {
//       case "topLeft":
//         canvasRef.current.style.cursor = "nw-resize";
//         break;
//       case "topRight":
//         canvasRef.current.style.cursor = "ne-resize";
//         break;
//       case "bottomLeft":
//         canvasRef.current.style.cursor = "sw-resize";
//         break;
//       case "bottomRight":
//         canvasRef.current.style.cursor = "se-resize";
//         break;
//       case "topMiddle":
//         canvasRef.current.style.cursor = "n-resize";
//         break;
//       case "bottomMiddle":
//         canvasRef.current.style.cursor = "s-resize";
//         break;
//       case "leftMiddle":
//         canvasRef.current.style.cursor = "w-resize";
//         break;
//       case "rightMiddle":
//         canvasRef.current.style.cursor = "e-resize";
//         break;
//       default:
//         canvasRef.current.style.cursor = "default";
//         break;
//     }

//     const handleMouseMove = (e: MouseEvent) => {
//       onMouseMove(
//         e,
//         activeCueBall,
//         canvasRef,
//         activeBoxAndCueBalls,
//         elementsOnCanvas,
//         activeElementId,
//         offset
//       );
//     };

//     const handleMouseUp = (e: MouseEvent) => {
//         if(!canvasRef.current) return;
//         offset.x = 0;
//         offset.y = 0;
//         isDragging = false;
//         canvasRef.current.style.cursor = "default";
//         canvasRef.current.removeEventListener("mousemove", handleMouseMove);
//         canvasRef.current.removeEventListener("mouseup", handleMouseUp);
//         // setActiveElementId(currentElement.id);
//     };

//     canvasRef.current.addEventListener("mousemove", handleMouseMove);
//     canvasRef.current.addEventListener("mouseup", handleMouseUp);
//   }
// }

// function onMouseMove(
//   e: MouseEvent,
//   activeCueBall: string,
//   canvasRef: React.RefObject<HTMLCanvasElement>,
//   activeBoxAndCueBalls: React.MutableRefObject<BoundingBoxAndCueBalls>,
//   elementsOnCanvas: React.MutableRefObject<ElementsContainer>,
//   activeElementId: string | "",
//   offset: { x: number; y: number }
// ) {
//   if (!canvasRef.current) return;
//   const ctx = canvasRef.current.getContext("2d");
//     if (!ctx) return;
//   const mouseX = e.clientX - canvasRef.current.offsetLeft;
//   const mouseY = e.clientY - canvasRef.current.offsetTop;
//   const currentElementIndex = elementsOnCanvas.current.findIndex(
//     (element) => element.id === activeElementId
//   );
//   const currentElement = elementsOnCanvas.current[currentElementIndex];

//   switch (activeCueBall) {
//     case "topLeft":
//       canvasRef.current.style.cursor = "nw-resize";

//       // Calculate the new top-left position
//       const newTopLeftX = mouseX - offset.x;
//       const newTopLeftY = mouseY - offset.y;

//       // Update the current element's start coordinates
//       currentElement.startCoordinates.x = newTopLeftX;
//       currentElement.startCoordinates.y = newTopLeftY;

//       drawBoundingBoxAndCueBalls(ctx, elementsOnCanvas.current[currentElementIndex], activeBoxAndCueBalls)
//       break;
//     case "topRight":
//       canvasRef.current.style.cursor = "ne-resize";

//       // Calculate the new top-right position
//       const newTopRightX = mouseX - offset.x;
//       const newTopRightY = mouseY - offset.y;

//       // Update the current element's start coordinates
//       currentElement.startCoordinates.x = currentElement.startCoordinates.x;
//       currentElement.startCoordinates.y = newTopRightY;
//       currentElement.endCoordinates.x = newTopRightX;
//       currentElement.endCoordinates.y = currentElement.endCoordinates.y;

//       drawBoundingBoxAndCueBalls(ctx, elementsOnCanvas.current[currentElementIndex], activeBoxAndCueBalls)
//       break;
//     case "bottomLeft":
//       canvasRef.current.style.cursor = "sw-resize";
//       break;
//     case "bottomRight":
//       canvasRef.current.style.cursor = "se-resize";

//       // Calculate the new bottom-right position
//       const newBottomRightX = mouseX - offset.x;
//       const newBottomRightY = mouseY - offset.y;

//       // Update the current element's start coordinates
//       currentElement.startCoordinates.x = currentElement.startCoordinates.x;
//       currentElement.startCoordinates.y = currentElement.startCoordinates.y;
//       currentElement.endCoordinates.x = newBottomRightX;
//       currentElement.endCoordinates.y = newBottomRightY;

//       drawBoundingBoxAndCueBalls(ctx, elementsOnCanvas.current[currentElementIndex], activeBoxAndCueBalls)
//       break;
//     case "topMiddle":
//       canvasRef.current.style.cursor = "n-resize";
//       break;
//     case "bottomMiddle":
//       canvasRef.current.style.cursor = "s-resize";
//       break;
//     case "leftMiddle":
//       canvasRef.current.style.cursor = "w-resize";
//       break;
//     case "rightMiddle":
//       canvasRef.current.style.cursor = "e-resize";
//       break;
//     default:
//       canvasRef.current.style.cursor = "default";
//       break;
//   }
// }
