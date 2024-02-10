import {
  currentCursorStyle,
  activeInteractiveElement,
  canvasElements,
  overlayForDrag,
  setIsElementCurrentlyResizing,
  undoStack,
} from "../../interactionhelpers";
import { ElementsContainer, ElementTypes } from "../../../Types/Types";
import {
  startAnimationPreview,
  stopAnimationPreview,
} from "../../Render/DynamicElements/handleSelectedShapeAnimation";
import cloneDeep from "lodash/cloneDeep";

let activeElementIndex: number = -1;
let mouseDownX: number = 0;
let mouseDownY: number = 0;
let offSetX: number = 0;
let offSetY: number = 0;
let setNewRecoilElements: React.Dispatch<
  React.SetStateAction<ElementsContainer>
>;
let canvasRef: React.RefObject<HTMLCanvasElement>;
let sidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;

export function handleResizeOperation(
  x: number,
  y: number,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
  setIsSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>,
) {
  if (!mainCanvasRef.current || !activeInteractiveElement) return;
  activeElementIndex = canvasElements.findIndex(
    (Element) => Element.id === activeInteractiveElement!.id
  );
  if (activeElementIndex === -1) return;
  mouseDownX = x;
  mouseDownY = y;
  setNewRecoilElements = setRecoilElements;
  sidePanelOpen = setIsSidePanelOpen;
  canvasRef = mainCanvasRef;
  calculateInitialOffset();
  startAnimationPreview();
  sidePanelOpen(false);
  overlayForDrag.style.display = "block";
  overlayForDrag.style.cursor = currentCursorStyle;
  overlayForDrag.addEventListener("mousemove", handleMouseMove);
  overlayForDrag.addEventListener("mouseup", handleMouseUp);

  function handleMouseUp(e: MouseEvent) {
   
    e.stopPropagation();
    stopAnimationPreview();
    overlayForDrag.style.display = "none";
    overlayForDrag.removeEventListener("mousemove", handleMouseMove);
    overlayForDrag.removeEventListener("mouseup", handleMouseUp);
    
      const invertedElement = handleElementInversion(
        canvasElements[activeElementIndex]
      );
      canvasElements[activeElementIndex] = invertedElement;
      undoStack.push(invertedElement);
    mouseDownX = 0;
    mouseDownY = 0;
    offSetX = 0;
    offSetY = 0;
    activeElementIndex = -1;
    setIsElementCurrentlyResizing(false);
    sidePanelOpen(true);
    localStorage.setItem("canvasElements", JSON.stringify(canvasElements));
    setNewRecoilElements([...canvasElements]);
  }
}

function handleMouseMove(e: MouseEvent) {
  e.stopPropagation();
  if (!canvasRef.current || !activeInteractiveElement) return;
  const mainCanvasRect = canvasRef.current.getBoundingClientRect();
  const mouseX = e.clientX - mainCanvasRect.left;
  const mouseY = e.clientY - mainCanvasRect.top;

  const activeElement = cloneDeep(canvasElements[activeElementIndex]);

  switch (currentCursorStyle) {
    case "nw-resize":
      activeElement.startCoordinates!.x = mouseX - offSetX;
      activeElement.startCoordinates!.y = mouseY - offSetY;
      break;
    case "n-resize":
      activeElement.startCoordinates!.y = mouseY - offSetY;
      break;
    case "ne-resize":
      activeElement.endCoordinates!.x = mouseX - offSetX;
      activeElement.startCoordinates!.y = mouseY - offSetY;
      break;
    case "w-resize":
      activeElement.startCoordinates!.x = mouseX - offSetX;
      break;
    case "e-resize":
      activeElement.endCoordinates!.x = mouseX - offSetX;
      break;
    case "sw-resize":
      activeElement.startCoordinates!.x = mouseX - offSetX;
      activeElement.endCoordinates!.y = mouseY - offSetY;
      break;
    case "s-resize":
      activeElement.endCoordinates!.y = mouseY - offSetY;
      break;
    case "se-resize":
      activeElement.endCoordinates!.x = mouseX - offSetX;
      activeElement.endCoordinates!.y = mouseY - offSetY;
      break;
  }
  if (activeElement.type === "pencil") {
    updatePencilPoints(activeElement);
  } else {
    canvasElements[activeElementIndex] = cloneDeep(activeElement);
  }
}

function updatePencilPoints(activeElement: ElementTypes) {
    // Previous state of the bounding box
    const oldBoundingBox = cloneDeep(canvasElements[activeElementIndex]);
    // Current state after resize
    const newBoundingBox = cloneDeep(activeElement);
  
    // Guard clause for missing coordinates
    if (
      !oldBoundingBox.startCoordinates ||
      !oldBoundingBox.endCoordinates ||
      !newBoundingBox.startCoordinates ||
      !newBoundingBox.endCoordinates
    ) {
      return;
    }
  
    // Calculate dimensions of old and new bounding boxes
    const oldWidth =
      Math.abs(oldBoundingBox.endCoordinates.x - oldBoundingBox.startCoordinates.x) === 0 ? 1 : oldBoundingBox.endCoordinates.x - oldBoundingBox.startCoordinates.x;
    const oldHeight =
      Math.abs(oldBoundingBox.endCoordinates.y - oldBoundingBox.startCoordinates.y) === 0 ? 1 : oldBoundingBox.endCoordinates.y - oldBoundingBox.startCoordinates.y;
    const newWidth =
      Math.abs(newBoundingBox.endCoordinates.x - newBoundingBox.startCoordinates.x) === 0 ? 1 : newBoundingBox.endCoordinates.x - newBoundingBox.startCoordinates.x;
    const newHeight =
      Math.abs(newBoundingBox.endCoordinates.y - newBoundingBox.startCoordinates.y) === 0 ? 1 : newBoundingBox.endCoordinates.y - newBoundingBox.startCoordinates.y;
  
    // calculate the scale factors eliminating infinity cases
    const scaleX = newWidth / oldWidth;
    const scaleY = newHeight / oldHeight;

    let newPoints = [];

    newPoints = oldBoundingBox.points!.map((point) => {
        
        const relativeX = point.x - oldBoundingBox.startCoordinates!.x;
        const relativeY = point.y - oldBoundingBox.startCoordinates!.y;

        const scaledX = relativeX * scaleX;
        const scaledY = relativeY * scaleY;

        const newX = scaledX + newBoundingBox.startCoordinates!.x;
        const newY = scaledY + newBoundingBox.startCoordinates!.y;


        return { x: newX, y: newY };
    })

  
    activeElement.points = newPoints;
    canvasElements[activeElementIndex] = activeElement;
  }
  

function calculateInitialOffset() {
  const activeElement = canvasElements[activeElementIndex];
  const { x: startX, y: startY } = activeElement.startCoordinates!;
  const { x: endX, y: endY } = activeElement.endCoordinates!;

  switch (currentCursorStyle) {
    case "nw-resize":
      offSetX = mouseDownX - startX;
      offSetY = mouseDownY - startY;
      break;
    case "n-resize":
      offSetX = 0;
      offSetY = mouseDownY - startY;
      break;
    case "ne-resize":
      offSetX = mouseDownX - endX;
      offSetY = mouseDownY - startY;
      break;
    case "w-resize":
      offSetX = mouseDownX - startX;
      offSetY = 0;
      break;
    case "e-resize":
      offSetX = mouseDownX - endX;
      offSetY = 0;
      break;
    case "sw-resize":
      offSetX = mouseDownX - startX;
      offSetY = mouseDownY - endY;
      break;
    case "s-resize":
      offSetX = 0;
      offSetY = mouseDownY - endY;
      break;
    case "se-resize":
      offSetX = mouseDownX - endX;
      offSetY = mouseDownY - endY;
      break;
  }
}

function handleElementInversion(element: ElementTypes) {
  const activeElement = cloneDeep(element);
  const { x: startX, y: startY } = activeElement.startCoordinates!;
  const { x: endX, y: endY } = activeElement.endCoordinates!;

  switch (currentCursorStyle) {
    case "nw-resize":
      if (startX >= endX) {
        let temp = startX;
        activeElement.startCoordinates!.x = endX;
        activeElement.endCoordinates!.x = temp;
      }
      if (startY >= endY) {
        let temp = startY;
        activeElement.startCoordinates!.y = endY;
        activeElement.endCoordinates!.y = temp;
      }
      break;
    case "n-resize":
      if (startY >= endY) {
        let temp = startY;
        activeElement.startCoordinates!.y = endY;
        activeElement.endCoordinates!.y = temp;
      }
      break;
    case "ne-resize":
      if (endX <= startX) {
        console.log("finally finished resizing top_right: ", activeElement);
        let temp = startX;
        activeElement.startCoordinates!.x = endX;
        activeElement.endCoordinates!.x = temp;
        console.log("calibertaed resizing top_right: ", activeElement);
      }
      if (startY >= endY) {
        let temp = startY;
        activeElement.startCoordinates!.y = endY;
        activeElement.endCoordinates!.y = temp;
      }
      break;
    case "w-resize":
      if (startX >= endX) {
        let temp = startX;
        activeElement.startCoordinates!.x = endX;
        activeElement.endCoordinates!.x = temp;
      }
      break;
    case "e-resize":
      if (endX <= startX) {
        let temp = startX;
        activeElement.startCoordinates!.x = endX;
        activeElement.endCoordinates!.x = temp;
      }
      break;
    case "sw-resize":
      if (startX >= endX) {
        let temp = startX;
        activeElement.startCoordinates!.x = endX;
        activeElement.endCoordinates!.x = temp;
      }
      if (startY >= endY) {
        let temp = startY;
        activeElement.startCoordinates!.y = endY;
        activeElement.endCoordinates!.y = temp;
      }
      break;
    case "s-resize":
      if (endY <= startY) {
        let temp = startY;
        activeElement.startCoordinates!.y = endY;
        activeElement.endCoordinates!.y = temp;
      }
      break;
    case "se-resize":
      if (endX <= startX) {
        let temp = startX;
        activeElement.startCoordinates!.x = endX;
        activeElement.endCoordinates!.x = temp;
      }
      if (endY <= startY) {
        let temp = startY;
        activeElement.startCoordinates!.y = endY;
        activeElement.endCoordinates!.y = temp;
      }
      break;
  }

  return activeElement;
}
