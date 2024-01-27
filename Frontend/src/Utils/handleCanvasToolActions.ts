import React from "react";
import { ElementsContainer } from "../Types/Types";
import { activeInteractiveElement, canvasElements, globalCursorStyle, isElementMoving } from "./interactionhelpers";
import { renderSelectedShape } from "./Render/DynamicElements/renderSelectedShape";
import { setCanvasAndRecoilState, handlMainCanvasMouseMovements } from "./Operations/handleMainCanvasMouseMovements";
import { handleActiveOperation } from "./Operations/handleActiveOperation";




export const handleCanvasToolActions = (
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  selectedTool: string,
  setSelectedTool: React.Dispatch<React.SetStateAction<string>>,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
  recoilElements: ElementsContainer,
) => {
    if (!mainCanvasRef.current) return;
    console.log("inside handleCanvasToolActions: ", activeInteractiveElement!);

  
  switch (selectedTool) {
    case "circle":
    case "ellipse":
    case "rectangle":
    case "biSquare":
    case "pencil":
    case "text":
      mainCanvasRef.current.style.cursor = "crosshair";
      mainCanvasRef.current.addEventListener("mousedown", handleActiveToolMouseDown);
      break;
    case "select":
      if(recoilElements.length !== 0){
        console.log("canvasElements inside handleCanvasToolActions: ", canvasElements);
        setCanvasAndRecoilState(mainCanvasRef, recoilElements, setRecoilElements);
        mainCanvasRef.current.addEventListener("mousemove", onMouseMove);
        mainCanvasRef.current.addEventListener("mousedown", handleMainCanvasMouseDown);
      }
      mainCanvasRef.current.style.cursor = "default";
      break;
  }

  function handleActiveToolMouseDown(e: MouseEvent){
    console.log("Mouse down when tool is: ", selectedTool);
    renderSelectedShape(
      e,
      mainCanvasRef,
      selectedTool,
      setSelectedTool,
      setRecoilElements
    );
  };

  function handleMainCanvasMouseDown(e: MouseEvent){
    handleActiveOperation(e, mainCanvasRef, recoilElements, setRecoilElements);
  }


 function onMouseMove(e: MouseEvent) {
    if(isElementMoving) return;
    console.log("inside mainCanvasMouse when isElementMoving is false")
    handlMainCanvasMouseMovements(e);
  }


  return () => {
  
      mainCanvasRef.current!.removeEventListener("mousedown", handleActiveToolMouseDown);
      mainCanvasRef.current!.removeEventListener("mousedown", handleMainCanvasMouseDown);
      mainCanvasRef.current!.removeEventListener("mousemove", onMouseMove);
    
  };
};
