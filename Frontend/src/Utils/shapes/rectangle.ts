import { activeForegroundElement } from "../../Components/Board/Board";
import { ElementTypes } from "../../Types/Types";



export function drawRectangle(
    ctx: CanvasRenderingContext2D,
    element: ElementTypes,
  ) {
   
    if (!ctx) return;
    const { startCoordinates, endCoordinates } = element!;
    if (!startCoordinates || !endCoordinates) return;

    ctx.strokeStyle = element!.color;
    ctx.lineWidth = element!.lineWidth;
    ctx.strokeRect(
      startCoordinates.x,
      startCoordinates.y,
      endCoordinates.x - startCoordinates.x,
      endCoordinates.y - startCoordinates.y
    );
  }