import { activeInteractiveElement, setActiveInteractiveElement } from "../interactionhelpers";
import { ElementsContainer, ElementTypes } from "../../Types/Types";
import { hideResizeHandlesAndBoundingBox } from "../Resize/hideResizeHandlesAndBoundingBox";


export function handleMouseClick(
    e: MouseEvent,
    drawRenderCanvasRef: React.RefObject<HTMLCanvasElement>,
    animationRenderCanvasRef: React.RefObject<HTMLCanvasElement>,
    mainCanvasRef: React.RefObject<HTMLCanvasElement>,
    recoilElements: ElementsContainer,
    setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
){
e.stopPropagation();
if(!drawRenderCanvasRef.current || !animationRenderCanvasRef.current || !mainCanvasRef.current) return;
if(recoilElements.length === 0) return;
console.log("inside handleMainCanvasClick: ", activeInteractiveElement!);
const mainCanvasRect = mainCanvasRef.current.getBoundingClientRect();
const mainCanvasX = e.clientX - mainCanvasRect.left;
const mainCanvasY = e.clientY - mainCanvasRect.top;


let clickedInsideElement = false;
const updatedElements = recoilElements.map(element => {
    // Clone each element to create a mutable copy
    const clonedElement = { ...element };

    if (isClickInsideBoundingBox(mainCanvasX, mainCanvasY, clonedElement)) {
        clickedInsideElement = true;
        if (clonedElement.id === activeInteractiveElement?.id) return element; // Return the original element if no changes are needed

        clonedElement.isActive = true;
        setActiveInteractiveElement(clonedElement);
    } else {
        clonedElement.isActive = false;
    }

    return clonedElement; // Return the cloned and potentially modified element
});

if(!clickedInsideElement){
    console.log("clicked outside");
    hideResizeHandlesAndBoundingBox();
    setActiveInteractiveElement(undefined);
    setRecoilElements(updatedElements);
} else {
    console.log("clicked inside");
    setRecoilElements(updatedElements);
}

}


function isClickInsideBoundingBox(
    clickedX: number,
    clickedY: number,
    element: ElementTypes,
  ) {
    const { startCoordinates, endCoordinates } = element;
    if(!startCoordinates || !endCoordinates) return false;
  
    let topLeftX: number, topLeftY: number, width: number, height: number;
    const MARGIN_GAP = 5;
    if (element.type === "circle") {
        const centerX = (startCoordinates.x + endCoordinates.x) / 2;
        const centerY = (startCoordinates.y + endCoordinates.y) / 2;
        const radius =
          Math.sqrt(
            Math.pow(endCoordinates.x - startCoordinates.x, 2) +
              Math.pow(endCoordinates.y - startCoordinates.y, 2)
          ) / 2;
      
        // Calculate the top-left corner of the bounding box considering the gap
        topLeftX = centerX - radius - MARGIN_GAP;
        topLeftY = centerY - radius - MARGIN_GAP;
      
        // Adjust the width and height to include the gap
         width = radius * 2 + 2 * MARGIN_GAP;
         height = radius * 2 + 2 * MARGIN_GAP;
  
    } else {
      // Calculate dimensions and position for other shapes
      topLeftX = Math.min(startCoordinates.x, endCoordinates.x) - MARGIN_GAP;
      topLeftY = Math.min(startCoordinates.y, endCoordinates.y) - MARGIN_GAP;
      width = Math.abs(endCoordinates.x - startCoordinates.x) + 2 * MARGIN_GAP;
      height = Math.abs(endCoordinates.y - startCoordinates.y) + 2 * MARGIN_GAP;
    }
  
      if (
          clickedX >= topLeftX &&
          clickedX <= topLeftX + width &&
          clickedY >= topLeftY &&
          clickedY <= topLeftY + height
      ) {
          return true;
      }
  
      return false;
  }