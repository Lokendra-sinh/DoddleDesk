import React from "react";
import { elementTypes } from "../../Recoil/Atoms/elements"
import { elementsContainer } from "../../Recoil/Atoms/elements"

export function bottomLeft (
    bottomLeftCueBall: HTMLDivElement,
    cueBallContainer: HTMLDivElement,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    element: elementTypes,
    cursorStyle: string,
    setElements?: React.Dispatch<React.SetStateAction<elementsContainer>>,
  ) {
  
    if(!canvasRef.current || !element || !setElements) return;
    let offset = { x: 0, y: 0 };
    bottomLeftCueBall.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      let isDragging = true;

      offset = {
        x: e.clientX - canvasRef.current!.offsetLeft - element.endCoordinates.x,
        y: e.clientY - canvasRef.current!.offsetTop - element.startCoordinates.y,
    }
      const onMouseMove = (e: MouseEvent) => {
        if(!isDragging) return;
        e.stopPropagation();
        canvasRef.current!.style.cursor = cursorStyle;
        // hideAllCueBalls();
  
        const draggedPosition = {
            x: e.clientX - canvasRef.current!.offsetLeft - offset.x,
            y: e.clientY - canvasRef.current!.offsetTop - offset.y,
          }
  
          const startPosition = {
              x: draggedPosition.x,
              y: element.startCoordinates.y,
          }
  
          const endPosition = {
              x: element.endCoordinates.x,
              y: draggedPosition.y,
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
        e.stopPropagation();
        isDragging = false;
        canvasRef.current!.style.cursor = "default";
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
  
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);

    });

}