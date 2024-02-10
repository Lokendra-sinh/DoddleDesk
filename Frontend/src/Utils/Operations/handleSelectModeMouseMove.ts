import { ElementTypes, ElementsContainer } from "../../Types/Types";
import {
  canvasElements,
  cueBallProperties,
  boundingBoxProperties,
  BALL_RADIUS,
  isElementCurrentlyMoving,
  cueBallsAreVisible,
  currentCursorStyle,
  setCurrentCursorStyle,
  isElementCurrentlyResizing,
} from "../interactionhelpers";

let mouseX: number = 0;
let mouseY: number = 0;


export function handleSelectModeMouseMove(
  e: MouseEvent,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  appElements: ElementsContainer,
  setAppElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
  setIsSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
  e.stopPropagation();

  if (!mainCanvasRef.current || canvasElements.length === 0) return;
  const mainCanvasRect = mainCanvasRef.current.getBoundingClientRect();
  mouseX = e.clientX - mainCanvasRect.left;
  mouseY = e.clientY - mainCanvasRect.top;

  const newCursorStyle = checkMousePosition();
  setCurrentCursorStyle(newCursorStyle);
  mainCanvasRef.current.style.cursor = currentCursorStyle;
}

function checkMousePosition() {
  if (cueBallsAreVisible) {
    const cueBallCursorStyle = determineCueBallCursorStyle();
    if (cueBallCursorStyle) return cueBallCursorStyle;

    if (isMouseOverBoundingBox()) {
      return "move";
    }
  }

  if (checkMouseOverElement()) {
    return "move";
  }

  return "default";
}


function determineCueBallCursorStyle() {
  if (isOverCueBall(cueBallProperties.topLeft)) return "nw-resize";
  if (isOverCueBall(cueBallProperties.topMiddle)) return "n-resize";
  if (isOverCueBall(cueBallProperties.topRight)) return "ne-resize";
  if (isOverCueBall(cueBallProperties.leftMiddle)) return "w-resize";
  if (isOverCueBall(cueBallProperties.rightMiddle)) return "e-resize";
  if (isOverCueBall(cueBallProperties.bottomLeft)) return "sw-resize";
  if (isOverCueBall(cueBallProperties.bottomMiddle)) return "s-resize";
  if (isOverCueBall(cueBallProperties.bottomRight)) return "se-resize";
  return false;


  function isOverCueBall(ball: { x: number; y: number }) {
    const distance = Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2);
    return distance < BALL_RADIUS;
  }
}

function isMouseOverBoundingBox() {
  return (
    mouseX >= boundingBoxProperties.startX &&
    mouseX <= boundingBoxProperties.endX &&
    mouseY >= boundingBoxProperties.startY &&
    mouseY <= boundingBoxProperties.endY
  );
}

function checkMouseOverElement() {
  const element = canvasElements.find((element) => {
    if (element.type === "ellipse") {
      return isMouseInsideEllipse(element);
    } else if (element.type === "circle") {
      return isMouseInsideCirce(element);
    } else {
      // Handle other types as before
      return (
        mouseX >= element.startCoordinates!.x &&
        mouseX <= element.endCoordinates!.x &&
        mouseY >= element.startCoordinates!.y &&
        mouseY <= element.endCoordinates!.y
      );
    }
  });
  return element;
}

function isMouseInsideEllipse(element: ElementTypes) {
  if (!element.startCoordinates || !element.endCoordinates) return false;
  const centerX = (element.startCoordinates.x + element.endCoordinates.x) / 2;
  const centerY = (element.startCoordinates.y + element.endCoordinates.y) / 2;
  const rx =
    Math.abs(element.endCoordinates.x - element.startCoordinates.x) / 2;
  const ry =
    Math.abs(element.endCoordinates.y - element.startCoordinates.y) / 2;

  return (
    (mouseX - centerX) ** 2 / rx ** 2 + (mouseY - centerY) ** 2 / ry ** 2 <= 1
  );
}

function isMouseInsideCirce(element: ElementTypes) {
  if (!element.startCoordinates || !element.endCoordinates) return false;
  const centerX = (element.startCoordinates.x + element.endCoordinates.x) / 2;
  const centerY = (element.startCoordinates.y + element.endCoordinates.y) / 2;
  const radius =
    Math.sqrt(
      (element.endCoordinates.x - element.startCoordinates.x) ** 2 +
        (element.endCoordinates.y - element.startCoordinates.y) ** 2
    ) / 2;
  return (mouseX - centerX) ** 2 + (mouseY - centerY) ** 2 <= radius ** 2;
}
