import React from "react";
import { ElementTypes, ElementsContainer } from "../Types/Types";
import { currentCursorStyle, setCurrentCursorStyle, isElementCurrentlyMoving, isElementCurrentlyResizing } from "./interactionhelpers";
import { renderSelectedShape } from "./Render/DynamicElements/renderSelectedShape";
import { handleSelectModeMouseMove } from "./Operations/handleSelectModeMouseMove";
import { handleSelectModeMouseDown } from "./Operations/handleSelectModeMouseDown";
import { handleEraserOperation } from "./Operations/Eraser/handleEraserOperation";


export const handleCanvasToolActions = (
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  selectedTool: string,
  setSelectedTool: React.Dispatch<React.SetStateAction<string>>,
  setAppElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
  appElements: ElementsContainer,
  activeCanvasElement: ElementTypes | null,
  setActiveCanvasElement: React.Dispatch<React.SetStateAction<ElementTypes | null>>,
  setIsSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    if (!mainCanvasRef.current) return;

  switch (selectedTool) {
    
    case "circle":
    case "ellipse":
    case "rectangle":
    case "biSquare":
    case "pencil":
      setCurrentCursorStyle("crosshair");
      mainCanvasRef.current.style.cursor = currentCursorStyle;
      mainCanvasRef.current.addEventListener("mousedown", handleActiveToolMouseDown);
      break;


    case "select":
        setCurrentCursorStyle("default");
        mainCanvasRef.current.addEventListener("mousemove", onSelectModeMouseMove);
        mainCanvasRef.current.addEventListener("mousedown", onSelectModeMouseDown);
        mainCanvasRef.current.style.cursor = currentCursorStyle;
      break;



    case "eraser":
   
      mainCanvasRef.current.style.cursor = "url('/src/assets/cursor-eraser.png'), auto";
      setCurrentCursorStyle("eraser");
      mainCanvasRef.current!.addEventListener("mousedown", handleEraserMouseDown);
      break;
  }

  function handleActiveToolMouseDown(e: MouseEvent){
    
    renderSelectedShape(
      e,
      mainCanvasRef,
      selectedTool,
      setSelectedTool,
      setAppElements,
      setIsSidePanelOpen,
      setActiveCanvasElement,
    );
  };

  function onSelectModeMouseDown(e: MouseEvent){
    handleSelectModeMouseDown(e, mainCanvasRef, appElements, setAppElements, setIsSidePanelOpen);
  }

  function handleEraserMouseDown(e: MouseEvent){
    if(currentCursorStyle !== "eraser") return;
    if (e.button !== 0) return; // to avoid right click

    handleEraserOperation(e, mainCanvasRef, appElements, setAppElements, setSelectedTool);
  };

 function onSelectModeMouseMove(e: MouseEvent) {
  
  if(isElementCurrentlyMoving || isElementCurrentlyResizing) return; // if element is currently moving, do not go inside this function to avoid flickering
    handleSelectModeMouseMove(e, mainCanvasRef, appElements, setAppElements, setIsSidePanelOpen);
  }


  return () => {
  
      mainCanvasRef.current!.removeEventListener("mousedown", handleActiveToolMouseDown);
      mainCanvasRef.current!.removeEventListener("mousedown", onSelectModeMouseDown);
      mainCanvasRef.current!.removeEventListener("mousemove", onSelectModeMouseMove);
      mainCanvasRef.current!.removeEventListener("mousedown", handleEraserMouseDown);
      
  };
};
