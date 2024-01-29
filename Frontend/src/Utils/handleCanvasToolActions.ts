import React from "react";
import { ElementsContainer } from "../Types/Types";
import { activeInteractiveElement, canvasElements, globalCursorStyle, setGlobalCursorStyle, isElementMoving, isElementResizing } from "./interactionhelpers";
import { renderSelectedShape } from "./Render/DynamicElements/renderSelectedShape";
import { setCanvasAndRecoilState, handlMainCanvasMouseMovements } from "./Operations/handleMainCanvasMouseMovements";
import { handleActiveOperation } from "./Operations/handleActiveOperation";
import { handleEraserOperation } from "./Operations/Eraser/handleEraserOperation";
import { startAnimationPreview } from "./Render/DynamicElements/handleSelectedShapeAnimation";



export const handleCanvasToolActions = (
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  selectedTool: string,
  setSelectedTool: React.Dispatch<React.SetStateAction<string>>,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
  recoilElements: ElementsContainer,
) => {
    if (!mainCanvasRef.current) return;

  
  switch (selectedTool) {
    case "circle":
    case "ellipse":
    case "rectangle":
    case "biSquare":
    case "pencil":
    case "text":
      setGlobalCursorStyle("crosshair");
      mainCanvasRef.current.style.cursor = globalCursorStyle;
      mainCanvasRef.current.addEventListener("mousedown", handleActiveToolMouseDown);
      break;
    case "select":
      setGlobalCursorStyle("default");
      if(recoilElements.length !== 0){
        setCanvasAndRecoilState(mainCanvasRef, recoilElements, setRecoilElements);
        mainCanvasRef.current.addEventListener("mousemove", onMouseMove);
        mainCanvasRef.current.addEventListener("mousedown", handleGeneralCanvasMouseDown);
      }
      mainCanvasRef.current.style.cursor = globalCursorStyle;
      break;
    case "eraser":
      console.log("eraser selected");
      mainCanvasRef.current.style.cursor = "url('/src/assets/cursor-eraser.png'), auto";
      setGlobalCursorStyle("eraser");
      mainCanvasRef.current!.addEventListener("mousedown", handleEraserMouseDown);
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

  function handleGeneralCanvasMouseDown(e: MouseEvent){
    handleActiveOperation(e, mainCanvasRef, recoilElements, setRecoilElements);
  }

  function handleEraserMouseDown(e: MouseEvent){
    if(globalCursorStyle !== "eraser") return;
    if (e.button !== 0) return; // to avoid right click
    console.log("inside eraser mouse down becuase globalCursorStyle is eraser")
    handleEraserOperation(e, mainCanvasRef, recoilElements, setRecoilElements, setSelectedTool);
  };

 function onMouseMove(e: MouseEvent) {
  console.log("value of isElementResizing: ", isElementResizing);
    if(isElementMoving || isElementResizing) return; // if element is currently moving, do not go inside this function to avoid flickering
    console.log("inside mainCanvasMouse becuase you fucked up")
    handlMainCanvasMouseMovements(e);
  }


  return () => {
  
      mainCanvasRef.current!.removeEventListener("mousedown", handleActiveToolMouseDown);
      mainCanvasRef.current!.removeEventListener("mousedown", handleGeneralCanvasMouseDown);
      mainCanvasRef.current!.removeEventListener("mousemove", onMouseMove);
      mainCanvasRef.current!.removeEventListener("mousedown", handleEraserMouseDown);
    
  };
};
