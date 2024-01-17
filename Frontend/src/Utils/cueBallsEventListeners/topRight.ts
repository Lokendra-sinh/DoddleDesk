import React from "react";
import { elementTypes } from "../../Recoil/Atoms/elements";
import { elementsContainer } from "../../Recoil/Atoms/elements";

export function topRight(
  topRightCueBall: HTMLDivElement,
  cueBallContainer: HTMLDivElement,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  element: elementTypes,
  cursorStyle: string,
  setElements?: React.Dispatch<React.SetStateAction<elementsContainer>>
) {
  if (!canvasRef.current || !element || !setElements) return;
  let offset = { x: 0, y: 0 };

  topRightCueBall.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    if (!canvasRef.current) return;
    let isDragging = true;

    const initialMouseX = e.clientX - canvasRef.current.offsetLeft;
    const initialMouseY = e.clientY - canvasRef.current.offsetTop;
    const initialWidth = element.endCoordinates.x - element.startCoordinates.x;
    const initialHeight = element.endCoordinates.y - element.startCoordinates.y;

    const onMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current || !isDragging) return;
      e.stopPropagation();
      canvasRef.current!.style.cursor = cursorStyle;

      // Calculate new dimensions
      const newWidth = Math.max(
        10,
        initialWidth +
          (e.clientX - canvasRef.current.offsetLeft - initialMouseX)
      );
      const newHeight = Math.max(
        10,
        initialHeight -
          (e.clientY - canvasRef.current.offsetTop - initialMouseY)
      );

      // Update positions
      const startPosition = {
        x: element.startCoordinates.x,
        y: element.startCoordinates.y + initialHeight - newHeight,
      };
      const endPosition = {
        x: startPosition.x + newWidth,
        y: startPosition.y + newHeight,
      };

      setElements((prevElements) => {
        const newElements = [...prevElements];
        const elementIndex = newElements.findIndex(
          (el) => el.id === element.id
        );
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
    };

    const onMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      isDragging = false;
      canvasRef.current!.style.cursor = "default";

      // Set the final element state
      setElements((prevElements) => {
        const newElements = [...prevElements];
        const elementIndex = newElements.findIndex(
          (el) => el.id === element.id
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

      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });
}
