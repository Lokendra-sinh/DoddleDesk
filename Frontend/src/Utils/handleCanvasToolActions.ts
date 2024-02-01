import React from "react";
import { ElementTypes, ElementsContainer } from "../Types/Types";
import { globalCursorStyle, setGlobalCursorStyle, isElementMoving, isElementResizing } from "./interactionhelpers";
import { renderSelectedShape } from "./Render/DynamicElements/renderSelectedShape";
import { setCanvasAndRecoilState, handlMainCanvasMouseMovements } from "./Operations/handleMainCanvasMouseMovements";
import { handleActiveOperation } from "./Operations/handleActiveOperation";
import { handleEraserOperation } from "./Operations/Eraser/handleEraserOperation";
import { handleTextOnMouseClick } from "./Tools/Text/handleTextOnMouseClick";


export const handleCanvasToolActions = (
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  overlayCanvasRef: React.RefObject<HTMLCanvasElement>,
  selectedTool: string,
  setSelectedTool: React.Dispatch<React.SetStateAction<string>>,
  setAppElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
  appElements: ElementsContainer,
  activeCanvasElement: ElementTypes | null,
  setActiveCanvasElement: React.Dispatch<React.SetStateAction<ElementTypes | null>>,
  setIsSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    if (!mainCanvasRef.current) return;


    const textToolMousedownCleanUp = (e: MouseEvent) => {
      e.stopPropagation();
      overlayCanvasRef.current!.style.cursor = "default";
      const cleanup = handleTextOnMouseClick(e, overlayCanvasRef, appElements, setAppElements);

      return () => {
        cleanup;
      }
    }

  switch (selectedTool) {
    case "circle":
    case "ellipse":
    case "rectangle":
    case "biSquare":
    case "pencil":
      setGlobalCursorStyle("crosshair");
      mainCanvasRef.current.style.cursor = globalCursorStyle;
      mainCanvasRef.current.addEventListener("mousedown", handleActiveToolMouseDown);
      break;
    case "select":
      setGlobalCursorStyle("default");
      if(appElements.length !== 0){
        setCanvasAndRecoilState(mainCanvasRef, appElements, setAppElements);
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
      case "text":
        overlayCanvasRef.current!.style.display = "block";
        overlayCanvasRef.current!.style.cursor = "text";
        overlayCanvasRef.current!.width = mainCanvasRef.current.width;
        overlayCanvasRef.current!.height = mainCanvasRef.current.height;
        overlayCanvasRef.current!.addEventListener("mousedown", textToolMousedownCleanUp);
        // mainCanvasRef.current!.addEventListener("mousedown", handleTextToolMouseDown);
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

  function handleGeneralCanvasMouseDown(e: MouseEvent){
    handleActiveOperation(e, mainCanvasRef, appElements, setAppElements);
  }

  function handleEraserMouseDown(e: MouseEvent){
    if(globalCursorStyle !== "eraser") return;
    if (e.button !== 0) return; // to avoid right click

    handleEraserOperation(e, mainCanvasRef, appElements, setAppElements, setSelectedTool);
  };

 function onMouseMove(e: MouseEvent) {
    if(isElementMoving || isElementResizing) return; // if element is currently moving, do not go inside this function to avoid flickering
    handlMainCanvasMouseMovements(e);
  }


function handleTextToolMouseDown(e: MouseEvent){
  console.log("mousedown maincanvas coordinates: ", e.clientX, e.clientY);
}

  return () => {
  
      mainCanvasRef.current!.removeEventListener("mousedown", handleActiveToolMouseDown);
      mainCanvasRef.current!.removeEventListener("mousedown", handleGeneralCanvasMouseDown);
      mainCanvasRef.current!.removeEventListener("mousemove", onMouseMove);
      mainCanvasRef.current!.removeEventListener("mousedown", handleEraserMouseDown);
      mainCanvasRef.current!.removeEventListener("mousedown", handleTextToolMouseDown);
      overlayCanvasRef.current!.removeEventListener("mousedown", textToolMousedownCleanUp);
      textToolMousedownCleanUp;
  };
};
