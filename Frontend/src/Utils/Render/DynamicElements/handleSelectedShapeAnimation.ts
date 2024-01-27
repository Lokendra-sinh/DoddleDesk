import {
  activeInteractiveElement,
  canvasElements,
} from "../../interactionhelpers";
import { ElementTypes, ElementsContainer, } from "../../../Types/Types";
import { drawCircle } from "../../shapes/circle";
import { drawEllipse } from "../../shapes/ellipse";
import { drawRectangle } from "../../shapes/rectangle";
import { drawBiSquare } from "../../shapes/biSquare";
import { drawPencil } from "../../shapes/pencil";
import { handleResizeHandlesAndBoundingBox } from "../DynamicElements/ResizeHandlers/handleResizeHandlesAndBoundingBox"

let animationId: number | null = null;
let canvasContext: CanvasRenderingContext2D;
let canvasRef: React.RefObject<HTMLCanvasElement>;
let setNewRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>;

export function setAnimationContext(
  animationCanvasRenderContext: CanvasRenderingContext2D,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) {
  canvasContext = animationCanvasRenderContext;
  canvasRef = mainCanvasRef;
  setNewRecoilElements = setRecoilElements;
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

  canvasElements.forEach((element) => {
    renderElement(element);
  });
}

function renderElement(element: ElementTypes) {
    // if(!activeInteractiveElement) return;

    // if (activeInteractiveElement.type === "text") return;

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
      handleResizeHandlesAndBoundingBox(
        canvasContext,
        canvasRef,
        element,
      );
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
