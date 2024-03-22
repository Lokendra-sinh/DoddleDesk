import { ElementsContainer, ElementTypes } from "../../../Types/Types"
import {
  canvasElements,
  addCanvasElement,
  setCueBallsAreVisible,
  overlayForDrag,
} from "../../interactionhelpers";
import { setAnimationContext, startAnimationPreview, stopAnimationPreview } from "./handleSelectedShapeAnimation";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep, throttle } from "lodash";
import { undoStack } from "../../interactionhelpers";

let allowDrawing = false;
let distanceChecked = false;
let animationStarted = false;
let elementIndex = -1;
let tempElement: ElementTypes;
let currentCanvasRef: React.RefObject<HTMLCanvasElement>;
let currentCanvasContext: CanvasRenderingContext2D;
const minDragDistance = 10;
let stackingOrder = 1;
let currentTool: string;
let minPencilCoordinates: { x: number; y: number } | undefined = { x: 0, y: 0 };
let maxPencilCoordinates: { x: number; y: number } | undefined  = { x: 0, y: 0 };
let setSelectedTool: React.Dispatch<React.SetStateAction<string>>;
let setAppElements: React.Dispatch<React.SetStateAction<ElementsContainer>>;



function calculateDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}


function initializeNewElement(e: MouseEvent) {

    const currentCanvasRect = currentCanvasRef.current!.getBoundingClientRect();
    const mainCanvasX = e.clientX - currentCanvasRect.left;
    const mainCanvasY = e.clientY - currentCanvasRect.top;

    if(currentTool === "pencil"){
      minPencilCoordinates = { x: mainCanvasX, y: mainCanvasY };
      maxPencilCoordinates = { x: mainCanvasX, y: mainCanvasY };
    }

    tempElement = {
        id: uuidv4(),
        type: currentTool,
        startCoordinates:
          currentTool !== "pencil" ? { x: mainCanvasX, y: mainCanvasY } : minPencilCoordinates,
        endCoordinates:
          currentTool !== "pencil" ? { x: mainCanvasX, y: mainCanvasY } : maxPencilCoordinates,
        points:
          currentTool === "pencil"
            ? [{ x: mainCanvasX, y: mainCanvasY }]
            : undefined,
        strokeColor: "#4b5563",
        fillColor: "transparent",
        opacity: 1,
        strokeWidth: 2,
        isFilled: false,
        isStroked: true,
        isText: false,
        isErased: false,
        isDragged: false,
        isResized: false,
        isRotated: false,
        isDeleted: false,
        isDrawn: false,
        toBeErased: false,
        isActive: false,
        zIndex: stackingOrder++,
      };
}

export function renderSelectedShape(
  e: MouseEvent,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  selectedTool: string,
  toolSetterFunction: React.Dispatch<React.SetStateAction<string>>,
  recoilElementsSetter: React.Dispatch<React.SetStateAction<ElementsContainer>>,
) {
  e.stopPropagation();
  if (!mainCanvasRef.current) return;
  allowDrawing = true;
  currentTool = selectedTool;
  setSelectedTool = toolSetterFunction;
  setAppElements = recoilElementsSetter;
  currentCanvasRef = mainCanvasRef;
  currentCanvasContext = mainCanvasRef.current.getContext("2d")!;


  initializeNewElement(e);

  overlayForDrag.style.display = "block";
  overlayForDrag.style.cursor = "crosshair";
  if(currentTool === "pencil"){
    overlayForDrag.addEventListener("mousemove", onMouseMove);
  } else {
    overlayForDrag.addEventListener("mousemove", onMouseMove);
  }
  overlayForDrag.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(e: MouseEvent) {
  if (!allowDrawing) return;

  const currentCanvasRect = currentCanvasRef.current!.getBoundingClientRect();
  const mouseX = e.clientX - currentCanvasRect.left;
  const mouseY = e.clientY - currentCanvasRect.top;

  if(currentTool === "pencil"){
    if(!minPencilCoordinates || !maxPencilCoordinates) return;
    minPencilCoordinates.x = Math.min(mouseX, minPencilCoordinates.x);
    minPencilCoordinates.y = Math.min(mouseY, minPencilCoordinates.y);
    maxPencilCoordinates.x = Math.max(mouseX, maxPencilCoordinates.x);
    maxPencilCoordinates.y = Math.max(mouseY, maxPencilCoordinates.y);
  }


if(currentTool !== "pencil" && currentTool !== "text"){
  if (!distanceChecked) {
    const draggedDistance = calculateDistance(
      tempElement.startCoordinates!.x,
      tempElement.startCoordinates!.y,
      mouseX,
      mouseY
    );
    if (draggedDistance < minDragDistance) return;
    distanceChecked = true;
  }
}

  if (!animationStarted) {
    currentTool === "pencil"
        ? tempElement.points!.push({ x: mouseX, y: mouseY })
        : (tempElement.endCoordinates = { x: mouseX, y: mouseY });
  
    if (elementIndex === -1) {
        addCanvasElement(tempElement);
        elementIndex = canvasElements.length - 1;
    }
    setAnimationContext(currentCanvasContext, currentCanvasRef);
    startAnimationPreview();
    animationStarted = true;
}

  currentTool === "pencil"
    ? tempElement.points!.push({ x: mouseX, y: mouseY })
    : (tempElement.endCoordinates = { x: mouseX, y: mouseY });

  canvasElements[elementIndex] = {...tempElement};
}

function onMouseUp(e: MouseEvent) {
  console.log("Mouse up when tool is: ", currentTool);
  e.stopPropagation();
  if (!currentCanvasRef.current || !allowDrawing || !animationStarted) return; // don't do anything if actual drawing didn't happen
  overlayForDrag.style.display = "none";
  stopAnimationPreview();
  setCueBallsAreVisible(true);
  overlayForDrag.removeEventListener("mousemove", onMouseMove);
  overlayForDrag.removeEventListener("mouseup", onMouseUp);
  if(currentTool === "pencil"){
    tempElement.isActive = false;
  } else {
  tempElement.isActive = true;
  }

  organizeElement();

  canvasElements[elementIndex] = tempElement;
  undoStack.push(canvasElements[elementIndex]);
  console.log("pencil:", canvasElements[elementIndex]);
  animationStarted = false;
  allowDrawing = false;
  distanceChecked = false;
  elementIndex = -1;
  if(currentTool === "pencil"){
    setSelectedTool("pencil");
  } else {
  setSelectedTool("select");
  }
  localStorage.setItem("canvasElements", JSON.stringify(canvasElements));
  setAppElements(() => [...canvasElements]);
}


function organizeElement() {
  const { startCoordinates, endCoordinates } = cloneDeep(tempElement);
  
  if (!startCoordinates || !endCoordinates) return;

  if(currentTool === "pencil"){
    tempElement.startCoordinates = minPencilCoordinates;
    tempElement.endCoordinates = maxPencilCoordinates;
    return;
  }

  // Ensure startCoordinates is the top-left corner
  const topLeft = {
      x: Math.min(startCoordinates.x, endCoordinates.x),
      y: Math.min(startCoordinates.y, endCoordinates.y),
  };

  // Ensure endCoordinates is the bottom-right corner
  const bottomRight = {
      x: Math.max(startCoordinates.x, endCoordinates.x),
      y: Math.max(startCoordinates.y, endCoordinates.y),
  };

  // Update tempElement coordinates
  tempElement.startCoordinates = topLeft;
  tempElement.endCoordinates = bottomRight;
}
