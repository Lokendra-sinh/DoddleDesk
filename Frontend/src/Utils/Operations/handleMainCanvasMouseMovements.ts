import { ElementTypes, ElementsContainer } from "../../Types/Types";
import {
  canvasElements,
  cueBallProperties,
  boundingBoxProperties,
  BALL_RADIUS,
  isElementMoving,
  cueBallsAreVisible,
  globalCursorStyle,
  setGlobalCursorStyle,
  isElementResizing,
} from "../interactionhelpers";

let mouseX: number = 0;
let mouseY: number = 0;
let canvasRef: React.RefObject<HTMLCanvasElement>;
let newAppElements: ElementsContainer;
let setNewAppElements: React.Dispatch<
  React.SetStateAction<ElementsContainer>
>;

export function setCanvasAndRecoilState(
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  appElements: ElementsContainer,
  setAppElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) {
  if (!mainCanvasRef.current || appElements.length === 0) return;
  canvasRef = mainCanvasRef;
  newAppElements = appElements;
  setNewAppElements = setAppElements;
}

export function handlMainCanvasMouseMovements(e: MouseEvent) {
  e.stopPropagation();
  if
  (isElementMoving || isElementResizing){
    console.log("existing motherfuckers becuase resizing or moving is true");
    return;
  }
  if (!canvasRef.current || canvasElements.length === 0) return;
  const mainCanvasRect = canvasRef.current.getBoundingClientRect();
  mouseX = e.clientX - mainCanvasRect.left;
  mouseY = e.clientY - mainCanvasRect.top;

  const newCursorStyle = checkMousePosition();
  console.log("newCursorStyle: ", newCursorStyle);
    setGlobalCursorStyle(newCursorStyle);
    changeCursorStyle();
}

function changeCursorStyle() {
  if (!canvasRef.current) return;
  canvasRef.current.style.cursor = globalCursorStyle;
}

function checkMousePosition() {
  if (cueBallsAreVisible){

    if (isMouseOverCueBalls()) {
      return determineCueBallCursorStyle();
    }
  
    if (isMouseOverBoundingBox()) {
      return "move";
    }
  }

  if (checkMouseOverElement()) {
    return "move";
  }

  return "default";
}

function isMouseOverCueBalls() {
  const cueBalls = Object.values(cueBallProperties);
  return cueBalls.some(
    (ball) =>
      mouseX >= ball.x &&
      mouseX <= ball.x + BALL_RADIUS * 2 &&
      mouseY >= ball.y &&
      mouseY <= ball.y + BALL_RADIUS * 2
  );
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
  return "default";

  function isOverCueBall(ball: { x: number; y: number }) {
    return (
      mouseX >= ball.x &&
      mouseX <= ball.x + BALL_RADIUS * 2 &&
      mouseY >= ball.y &&
      mouseY <= ball.y + BALL_RADIUS * 2
    );
  }
}

function isMouseOverBoundingBox() {
  console.log("inside isMouseOverBoundingBox");
  return (
    mouseX >= boundingBoxProperties.startX &&
    mouseX <= boundingBoxProperties.endX &&
    mouseY >= boundingBoxProperties.startY &&
    mouseY <= boundingBoxProperties.endY
  );
}

function checkMouseOverElement() {
  console.log("canvasElements on hovering inside element is: ", canvasElements);
  const element = canvasElements.find((element) => {

    if (element.type === 'ellipse') {
      return isMouseInsideEllipse(element);
    } else if (element.type === "circle") {
      return isMouseInsideCirce(element);
    } else {
      // Handle other types as before
      return mouseX >= element.startCoordinates!.x &&
             mouseX <= element.endCoordinates!.x &&
             mouseY >= element.startCoordinates!.y &&
             mouseY <= element.endCoordinates!.y;
    }
  });
  return element;
}

function isMouseInsideEllipse(element: ElementTypes) {
  if(!element.startCoordinates || !element.endCoordinates) return false;
  const centerX = (element.startCoordinates.x + element.endCoordinates.x) / 2;
  const centerY = (element.startCoordinates.y + element.endCoordinates.y) / 2;
  const rx = Math.abs(element.endCoordinates.x - element.startCoordinates.x) / 2;
  const ry = Math.abs(element.endCoordinates.y - element.startCoordinates.y) / 2;

  return ((mouseX - centerX) ** 2) / rx ** 2 + ((mouseY - centerY) ** 2) / ry ** 2 <= 1;
}


function isMouseInsideCirce(element: ElementTypes) {
  if(!element.startCoordinates || !element.endCoordinates) return false;
  const centerX = (element.startCoordinates.x + element.endCoordinates.x) / 2;
  const centerY = (element.startCoordinates.y + element.endCoordinates.y) / 2;
    const radius = Math.sqrt(
    (element.endCoordinates.x - element.startCoordinates.x) ** 2 +
    (element.endCoordinates.y - element.startCoordinates.y) ** 2
  ) / 2;
  return ((mouseX - centerX) ** 2) + ((mouseY - centerY) ** 2) <= radius ** 2;
}