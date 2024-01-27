import { activeForegroundElement, setActiveForegroundElement } from "../../Components/Board/Board";
import { ElementTypes, ElementsContainer } from "../../Types/Types";
import { hideResizeHandlesAndBoundingBox } from "../Resize/hideResizeHandlesAndBoundingBox";



export function handleForegroundCanvasClick(
  e: MouseEvent,
  foregroundCanvasRef: React.RefObject<HTMLCanvasElement>,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementTypes[]>>,
  newRecoilElements: ElementsContainer,
) {
  e.stopPropagation();
  console.log("Clicked on foreground canvas");
  if (!foregroundCanvasRef.current) return;
  const foregroundContext = foregroundCanvasRef.current.getContext("2d");
  if (!foregroundContext) return;
  if(newRecoilElements.length === 0) return;

  const canvasRect = foregroundCanvasRef.current.getBoundingClientRect();
  const clickedX = e.clientX - canvasRect.left;
  const clickedY = e.clientY - canvasRect.top;
  let isElementClicked = false;

  newRecoilElements.forEach((element, index) => {
    isElementClicked = isClickInsideBoundingBox(clickedX, clickedY, element); 
    if(isElementClicked) {
      if(element.isActive) {
        setActiveForegroundElement(element);
        return; 
      } else {
        // Element is clicked but not active, activate it
        setRecoilElements(prevElements => {
          const updatedRecoilElements = [...prevElements];
          updatedRecoilElements[index] = { ...element, isActive: true };
          return updatedRecoilElements;
        });
        setActiveForegroundElement(element);
        return; 
      }
    }
  });

  // If no element was clicked, do not stop propagation
  if(!isElementClicked) {
    hideResizeHandlesAndBoundingBox();
    const updatedRecoilElements = [...newRecoilElements];
    updatedRecoilElements.forEach((element, index) => {
      updatedRecoilElements[index] = { ...element, isActive: false };
    });
    setRecoilElements(prevElements => [...updatedRecoilElements]);
  }

}

  export function handleBackgroundCanvasClick(
    e: MouseEvent,
    backgroundCanvasRef: React.RefObject<HTMLCanvasElement>,
    setRecoilElements: React.Dispatch<React.SetStateAction<ElementTypes[]>>,
    newRecoilElements: ElementsContainer,
  ) {
    e.stopPropagation();
    console.log("Clicked on background canvas");
    if (!backgroundCanvasRef.current) return;
    const backgroundContext = backgroundCanvasRef.current.getContext("2d");
    if (!backgroundContext) return;

    const canvasRect = backgroundCanvasRef.current.getBoundingClientRect();
    console.log("Canvas rect is: ", canvasRect.left, canvasRect.top);
    const clickedX = e.clientX - canvasRect.left;
    const clickedY = e.clientY - canvasRect.top;

    newRecoilElements.forEach((element, index) => {
      if(isClickInsideBoundingBox(clickedX, clickedY, element)){
        setRecoilElements(prevElements => {
          const updatedRecoilElements: ElementsContainer = [...prevElements];
          updatedRecoilElements[index] = {...prevElements[index], isActive: true} as ElementTypes;
          return updatedRecoilElements;
      })
        setActiveForegroundElement(element);
        return;
      }
    });
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