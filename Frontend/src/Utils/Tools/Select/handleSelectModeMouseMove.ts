import { ElementTypes, ElementsContainer } from "../../../Types/Types";
import { currentCursorStyle, setCurrentCursorStyle, boundingBoxProperties, isElementCurrentlyMoving, isElementCurrentlyResizing } from "../../interactionhelpers";
import { isMouseOverResizeHandles } from "./isMouseOverResizeHandles";

export function handleSelectModeMouseMove(
  e: MouseEvent,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  doddleDeskElements: ElementsContainer,
  setDoddleDeskElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
  activeCanvasElement: ElementTypes | null,
  setActiveCanvasElement: React.Dispatch<
    React.SetStateAction<ElementTypes | null>
  >,
  setIsSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  e.stopPropagation();
  if (!mainCanvasRef.current) return;
  if(isElementCurrentlyMoving || isElementCurrentlyResizing) return;
  const mainCanvasRect = mainCanvasRef.current.getBoundingClientRect();
  const mouseDownX = e.clientX - mainCanvasRect.left;
  const mouseDownY = e.clientY - mainCanvasRect.top;

  //if active element exists then first check if the mouse is over the resize handles -> bounding box
  if(activeCanvasElement){
    if(isMouseOverResizeHandles(mouseDownX, mouseDownY, mainCanvasRef, activeCanvasElement, doddleDeskElements, setDoddleDeskElements)){
      return;
    }

    //if mouse is not over the resize handles then check if the mouse is inside the bounding box
    if(
        mouseDownX >= boundingBoxProperties.startX &&
        mouseDownX <= boundingBoxProperties.startX + boundingBoxProperties.width &&
        mouseDownY >= boundingBoxProperties.startY &&
        mouseDownY <= boundingBoxProperties.startY + boundingBoxProperties.height
    ) {
      mainCanvasRef.current.style.cursor = "move";
      return;
    }
  }

 
    //if active element does not exist then check if the mouse is over any element
  if(isMouseInsideElement(mouseDownX, mouseDownY, doddleDeskElements)){
    setCurrentCursorStyle("move");
    mainCanvasRef.current.style.cursor = "move";
    return;
  }

    setCurrentCursorStyle("default");
    mainCanvasRef.current.style.cursor = "default";

}


function isMouseInsideElement(
  x: number,
  y: number,
  elements: ElementsContainer
): boolean {
 
    return elements.some(element => {
        if(!element.startCoordinates || !element.endCoordinates) return false;
        return (
            x >= element.startCoordinates.x &&
            x <= element.endCoordinates.x &&
            y >= element.startCoordinates.y &&
            y <= element.endCoordinates.y
        ) 
    })
}