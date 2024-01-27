import { handleResizeHandlesAndBoundingBox } from "../Resize/handleResizeHandlesAndBoundingBox";
import {
  activeInteractiveElement,
  canvasElements,
} from "../interactionhelpers";
import { drawCircle } from "../shapes/circle";
import { drawEllipse } from "../shapes/ellipse";
import { drawRectangle } from "../shapes/rectangle";
import { drawBiSquare } from "../shapes/biSquare";
import { drawPencil } from "../shapes/pencil";
import { ElementTypes, ElementsContainer } from "../../Types/Types";

let animationCanvasRenderFrameId: number | null = null;
let animationRenderContext: CanvasRenderingContext2D;
let selectedTool: string;
let canvasRef: React.RefObject<HTMLCanvasElement>;
let setNewRecoilElements: React.Dispatch<React.SetStateAction<ElementTypes[]>>;

export function setAnimationRenderContextAndTool(
  animationCanvasRenderContext: CanvasRenderingContext2D,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) {
  animationRenderContext = animationCanvasRenderContext;
  canvasRef = mainCanvasRef;
  setNewRecoilElements = setRecoilElements;
}

function animate() {
  if (!animationRenderContext || !canvasRef) return;
  console.log("yes inside animate")
  animationCanvasRenderFrameId = requestAnimationFrame(animate);
  animationRenderContext.clearRect(
    0,
    0,
    animationRenderContext.canvas.width,
    animationRenderContext.canvas.height
  );

  canvasElements.forEach((element) => {
    if (element.type === "text") return;

    switch (element.type) {
      case "circle":
        drawCircle(animationRenderContext, element);
        break;
      case "ellipse":
        drawEllipse(animationRenderContext, element);
        break;
      case "rectangle":
        drawRectangle(animationRenderContext, element);
        break;
      case "biSquare":
        drawBiSquare(animationRenderContext, element);
        break;
      case "pencil":
        drawPencil(animationRenderContext, element);
        break;
      case "text":
        break;
    }

    if (element.isActive) {
      handleResizeHandlesAndBoundingBox(
        animationRenderContext,
        canvasRef,
        setNewRecoilElements
      );
    }
  });
}

export function startAnimationPreview() {
  if (!animationCanvasRenderFrameId) {
    animationCanvasRenderFrameId = requestAnimationFrame(animate);
  }
}

export function stopAnimationPreview() {
  if (animationCanvasRenderFrameId) {
    cancelAnimationFrame(animationCanvasRenderFrameId);
    animationCanvasRenderFrameId = null;
    if (animationRenderContext) {
      animationRenderContext.clearRect(
        0,
        0,
        animationRenderContext.canvas.width,
        animationRenderContext.canvas.height
      );
    }
  }
}
