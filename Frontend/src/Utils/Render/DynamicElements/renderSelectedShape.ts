import { ElementsContainer, ElementTypes } from "../../../Types/Types"
import {
  canvasElements,
  addCanvasElement,
  setActiveInteractiveElement,
  setCueBallsAreVisible,
} from "../../interactionhelpers";
import { setAnimationContext, startAnimationPreview, stopAnimationPreview } from "./handleSelectedShapeAnimation";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";

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
let setSelectedTool: React.Dispatch<React.SetStateAction<string>>;
let setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>;


function calculateDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function initializeNewElement(e: MouseEvent) {

    const currentCanvasRect = currentCanvasRef.current!.getBoundingClientRect();
    const mainCanvasX = e.clientX - currentCanvasRect.left;
    const mainCanvasY = e.clientY - currentCanvasRect.top;

    tempElement = {
        id: uuidv4(),
        type: currentTool,
        startCoordinates:
          currentTool !== "pencil" ? { x: mainCanvasX, y: mainCanvasY } : undefined,
        endCoordinates:
          currentTool !== "pencil" ? { x: mainCanvasX, y: mainCanvasY } : undefined,
        points:
          currentTool === "pencil"
            ? [{ x: mainCanvasX, y: mainCanvasY }]
            : undefined,
        color: "#4b5563",
        lineWidth: 2,
        isActive: false,
        zIndex: stackingOrder++,
      };
}

export function renderSelectedShape(
  e: MouseEvent,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  selectedTool: string,
  toolSetterFunction: React.Dispatch<React.SetStateAction<string>>,
  recoilElementsSetter: React.Dispatch<React.SetStateAction<ElementsContainer>>
) {
  e.stopPropagation();
  if (!mainCanvasRef.current) return;
  console.log("handleMainCanvasInteraction");
  allowDrawing = true;
  currentTool = selectedTool;
  setSelectedTool = toolSetterFunction;
  setRecoilElements = recoilElementsSetter;
  currentCanvasRef = mainCanvasRef;
  currentCanvasContext = mainCanvasRef.current.getContext("2d")!;


  initializeNewElement(e);

  console.log("tempElement: ", tempElement);

  // Attach event listeners
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(e: MouseEvent) {
  if (!allowDrawing) return;

  const currentCanvasRect = currentCanvasRef.current!.getBoundingClientRect();
  const mouseX = e.clientX - currentCanvasRect.left;
  const mouseY = e.clientY - currentCanvasRect.top;

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
  if (!animationStarted) {
    currentTool === "pencil"
        ? tempElement.points!.push({ x: mouseX, y: mouseY })
        : (tempElement.endCoordinates = { x: mouseX, y: mouseY });
    // Check if elementIndex is -1 before adding a new element
    if (elementIndex === -1) {
        addCanvasElement(tempElement);
        elementIndex = canvasElements.length - 1;
    }
    setAnimationContext(currentCanvasContext, currentCanvasRef, setRecoilElements);
    startAnimationPreview();
    animationStarted = true;
}

  currentTool === "pencil"
    ? tempElement.points!.push({ x: mouseX, y: mouseY })
    : (tempElement.endCoordinates = { x: mouseX, y: mouseY });

  canvasElements[elementIndex] = {...tempElement};
}

function onMouseUp(e: MouseEvent) {
  e.stopPropagation();
  if (!currentCanvasRef.current || !allowDrawing) return;

  // if(e.clientY < 50){
  //   console.log(`e.clientY: ${e.clientY}`)
  //   console.log("scrolling up");
  //   const offsetHeight = 50 - e.clientY;
  //   const canvasContainer = document.getElementById("canvas-container")!;
  //   console.log(`current canvas container height: ${canvasContainer.offsetHeight}`)
  //   canvasContainer.style.height = `${canvasContainer.offsetHeight + offsetHeight}px`;
  //   console.log(`new canvas container height: ${canvasContainer.offsetHeight}`)
  // }
  console.log("mouse up");
  stopAnimationPreview();
  setCueBallsAreVisible(true);
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
  tempElement.isActive = true;

  organizeElement();

  canvasElements[elementIndex] = tempElement;
  console.log("canvasElements: ", canvasElements);
  console.log("canvasElements[elementIndex]: ", canvasElements[elementIndex]);
  console.log("temp element: ", tempElement);
  animationStarted = false;
  allowDrawing = false;
  distanceChecked = false;
  elementIndex = -1;
  setRecoilElements(() => [...canvasElements]);
  setSelectedTool("select");
}


function organizeElement() {
  const { startCoordinates, endCoordinates } = cloneDeep(tempElement);
  if (!startCoordinates || !endCoordinates) return;

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
