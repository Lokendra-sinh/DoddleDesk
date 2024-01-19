import React from "react";
import { elementTypes } from "../../Recoil/Atoms/elements"
import { elementsContainer } from "../../Recoil/Atoms/elements"

export function topCenter (
    topCenterCueBall: HTMLDivElement,
    cueBallContainer: HTMLDivElement,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    element: elementTypes,
    cursorStyle: string,
    setElements?: React.Dispatch<React.SetStateAction<elementsContainer>>,
  ) {
  
    if(!canvasRef) return;
    if(!element) return;
    if(!setElements) return;
    topCenterCueBall.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      let isDragging = true;
  
      const onMouseMove = (e: MouseEvent) => {
        if(!isDragging) return;
        e.stopPropagation();
        canvasRef.current!.style.cursor = cursorStyle;
        // hideAllCueBalls();
  
        const draggedPosition = {
          x: e.clientX - canvasRef.current!.offsetLeft,
          y: e.clientY - canvasRef.current!.offsetTop,
        }

        const startPosition = {
            x: element.startCoordinates.x,
            y: draggedPosition.y,
        }

        const endPosition = {
            x: element.endCoordinates.x,
            y: element.endCoordinates.y,
        }
  
        setElements((prevElements) => {
          const newElements = [...prevElements];
          const elementIndex = newElements.findIndex((el) => el.id === element.id);
          if (elementIndex >= 0) {
            const updatedElement = {
              ...newElements[elementIndex],
              startCoordinates: startPosition,
              endCoordinates: endPosition,
              cueBallsVisible: true,
              cueBallsDragging: true,
            };
            newElements[elementIndex] = updatedElement;
          }
          return newElements;
        });
        
      }
  
      const onMouseUp = (e: MouseEvent) => {
        if(!isDragging) return;
        isDragging = false;
        e.stopPropagation();
        canvasRef.current!.style.cursor = "default";
        // showAllCueBalls();
        setElements((prevElements) => {
          const newElements = [...prevElements];
          const elementIndex = newElements.findIndex((el) => el.id === element.id);
          if (elementIndex >= 0) {
            const updatedElement = {
              ...newElements[elementIndex],
              cueBallsVisible: false,
              cueBallsDragging: false,
            };
            newElements[elementIndex] = updatedElement;
          }
          return newElements;
        });
      }