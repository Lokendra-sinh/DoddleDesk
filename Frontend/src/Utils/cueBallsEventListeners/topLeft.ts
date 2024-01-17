import React from "react";
import { elementTypes } from "../../Recoil/Atoms/elements"
import { elementsContainer } from "../../Recoil/Atoms/elements"
import { handleElementsResize } from "../resizeElements/handleElementsResize";
import { drawElements } from "../drawElements";


export function topLeft (
    topLeftCueBall: HTMLDivElement,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    activeElement: React.MutableRefObject<elementTypes>,
    elementId: string,
    cursorStyle: string,
    setElements?: React.Dispatch<React.SetStateAction<elementsContainer>>,
  ) {
  
    if(!canvasRef.current || !activeElement.current || !setElements) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    console.log("inside topLeft");
    let offset = { x: 0, y: 0 };
    topLeftCueBall.addEventListener("mousedown", (e) => {
        if(!canvasRef.current) return;
      e.stopPropagation();
      let isDragging = true;

      offset = {
        x: e.clientX - canvasRef.current.offsetLeft - activeElement.current.startCoordinates.x,
        y: e.clientY - canvasRef.current.offsetTop - activeElement.current.startCoordinates.y,
      };
  
      const onMouseMove = (e: MouseEvent) => {
        if(!isDragging || !canvasRef.current) return;
        e.stopPropagation();
        canvasRef.current!.style.cursor = cursorStyle;
        // hideAllCueBalls();
  
        const newStartX = e.clientX - canvasRef.current.offsetLeft - offset.x;
        const newStartY = e.clientY - canvasRef.current.offsetTop - offset.y;
  
        const newStartPosition = {
          x: newStartX,
          y: newStartY,
        };

        activeElement.current.startCoordinates = newStartPosition;
        drawElements(ctx, activeElement.current);
        handleElementsResize(canvasRef, activeElement, elementId);
        
      }
  
      const onMouseUp = (e: MouseEvent) => {
        e.stopPropagation();
        isDragging = false;
        canvasRef.current!.style.cursor = "default";
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        setElements((prevElements) => {
            const newElements = [...prevElements];
            const elementIndex = newElements.findIndex(
              (el) => el.id === elementId
            );
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
      };
  
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
  
  
    });    
  }