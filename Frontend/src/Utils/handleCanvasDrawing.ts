import React from "react";
import { v4 as uuidv4 } from "uuid";
import { elementTypes } from "../Recoil/Atoms/elements";
import { elementsContainer } from "../Recoil/Atoms/elements";



export function handleCanvasDrawing(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setElements: React.Dispatch<React.SetStateAction<elementsContainer>>,
  selectedTool: string | undefined,
  currentElementRef: React.MutableRefObject<elementTypes>,
  // selectedElementId: React.MutableRefObject<string | null>,
) {
  if (!canvasRef.current) return;

  canvasRef.current.addEventListener("mousedown", (e: MouseEvent) => {
    e.stopPropagation();
    console.log("inside handleCanvasDrawing mousedown");
    console.log("selectedTool: ", selectedTool);
    if (!canvasRef.current || canvasRef.current.style.cursor === "default") return;
    let isDragging = true;
    
    currentElementRef.current = {
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
      active: true,
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.stopPropagation();

      currentElementRef.current.endCoordinates = {
        x: e.clientX - canvasRef.current!.offsetLeft,
        y: e.clientY - canvasRef.current!.offsetTop,
      };
    };

    const onMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      if (!canvasRef.current) return;
      isDragging = false;

      currentElementRef.current.endCoordinates = {
        x: e.clientX - canvasRef.current!.offsetLeft,
        y: e.clientY - canvasRef.current!.offsetTop,
      };

      canvasRef.current.style.cursor = "default";
      canvasRef.current.removeEventListener("mousemove", onMouseMove);
      canvasRef.current.removeEventListener("mouseup", onMouseUp);
      console.log("mousedown currentElement: ", currentElementRef.current);


      // selectedElementId.current = currentElementRef.current.id;
      setElements((prevElements) => [...prevElements, currentElementRef.current]);
      currentElementRef.current = {
        type: "",
        startCoordinates: { x: 0, y: 0 },
        endCoordinates: { x: 0, y: 0 },
        color: "",
        size: 0,
        cursor: "",
        id: "",
        active: false,
      }
    };

    canvasRef.current.addEventListener("mousemove", onMouseMove);
    canvasRef.current.addEventListener("mouseup", onMouseUp);
  });
}
