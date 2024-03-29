import {
  eraserFadeTrailPoints,
  canvasElements,
} from "../../interactionhelpers";
import { ElementTypes } from "../../../Types/Types";
import { drawCircle } from "../../shapes/circle";
import { drawEllipse } from "../../shapes/ellipse";
import { drawRectangle } from "../../shapes/rectangle";
import { drawBiSquare } from "../../shapes/biSquare";
import { drawPencil } from "../../shapes/pencil";
import { handleResizeHandlesAndBoundingBox } from "../DynamicElements/ResizeHandlers/handleResizeHandlesAndBoundingBox";
import { drawEraserTrail } from "../../shapes/eraserTrail";

let animationId: number | null = null;
let canvasContext: CanvasRenderingContext2D;
let canvasRef: React.RefObject<HTMLCanvasElement>;


export function setAnimationContext(
  animationCanvasRenderContext: CanvasRenderingContext2D,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
) {
  canvasContext = animationCanvasRenderContext;
  canvasRef = mainCanvasRef;

}

function animate() {
  if (!canvasContext || !canvasRef) return;
  animationId = requestAnimationFrame(animate);
  canvasContext.clearRect(
    0,
    0,
    canvasContext.canvas.width,
    canvasContext.canvas.height
  );

  if(canvasElements.length !== 0){
  canvasElements.forEach((element) => {
    renderElement(element);
  });
  }
  if(eraserFadeTrailPoints.length !== 0){
    drawEraserTrail(canvasContext);
  }

}

function renderElement(element: ElementTypes) {
  if (!canvasContext || !canvasRef) return;

  switch (element.type) {
    case "circle":
      drawCircle(canvasContext, element);
      break;
    case "ellipse":
      drawEllipse(canvasContext, element);
      break;
    case "rectangle":
      drawRectangle(canvasContext, element);
      break;
    case "biSquare":
      drawBiSquare(canvasContext, element);
      break;
    case "pencil":
      drawPencil(canvasContext, element);
      break;
    case "text":
      break;
  }

  if (element.isActive) {
    handleResizeHandlesAndBoundingBox(canvasContext, element);
  }
}

export function startAnimationPreview() {
  if (!animationId) {
    animationId = requestAnimationFrame(animate);
  }
}

export function stopAnimationPreview() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
    if (canvasContext) {
      canvasContext.clearRect(
        0,
        0,
        canvasContext.canvas.width,
        canvasContext.canvas.height
      );
    }
  }
}
