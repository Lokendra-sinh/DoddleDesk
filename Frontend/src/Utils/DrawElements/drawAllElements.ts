import { ElementsContainer, ElementTypes } from "../../Types/Types";
import { drawRectangle } from "../shapes/rectangle";
import { drawCircle } from "../shapes/circle";
import { drawEllipse } from "../shapes/ellipse";
import { drawBiSquare } from "../shapes/biSquare";
import { drawPencil } from "../shapes/pencil";
import { drawResizeHandlesAndBoundingBox } from "../Resize/handleResizeHandlesAndBoundingBox";
import { setActiveForegroundElement } from "../../Components/Board/Board";

export function drawAllElements(
  backgroundCanvasRef: React.RefObject<HTMLCanvasElement>,
  foregroundCanvasRef: React.RefObject<HTMLCanvasElement>,
  elements: ElementsContainer,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) {
  if (!backgroundCanvasRef.current || !foregroundCanvasRef.current) return;
  const backgroundContext = backgroundCanvasRef.current.getContext("2d");
  const foregroundContext = foregroundCanvasRef.current.getContext("2d");
  if (!backgroundContext || !foregroundContext) return;

  backgroundContext.clearRect(0, 0, backgroundContext.canvas.width, backgroundContext.canvas.height);
  foregroundContext.clearRect(0, 0, foregroundContext.canvas.width, foregroundContext.canvas.height);

  elements.forEach((element) => {
    if(element.isActive){
      console.log("Element active is: ", element);
        setActiveForegroundElement(element);
        drawElement(foregroundContext, element);
        drawResizeHandlesAndBoundingBox(foregroundContext, element, setRecoilElements);
    } else {
        drawElement(backgroundContext, element);
    }
  });
}

export function drawElement(
  ctx: CanvasRenderingContext2D,
  element: ElementTypes,
) {
    if (!ctx) return;

  switch (element.type) {
    case "rectangle":
      drawRectangle(ctx, element);
      break;
    case "circle":
      drawCircle(ctx, element);
      break;
    case "ellipse":
      drawEllipse(ctx, element);
      break;
    case "biSquare":
      drawBiSquare(ctx, element);
      break;
    case "pencil":
      drawPencil(ctx, element);
    default:
      break;
  }
}
