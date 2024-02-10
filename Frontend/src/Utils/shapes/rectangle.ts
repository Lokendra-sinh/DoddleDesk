
import { ElementTypes } from "../../Types/Types";



export function drawRectangle(
    ctx: CanvasRenderingContext2D,
    element: ElementTypes,
  ) {
   
    if (!ctx) return;
    const { startCoordinates, endCoordinates } = element!;
    if (!startCoordinates || !endCoordinates) return;
    ctx.strokeStyle = element.strokeColor;
    ctx.lineWidth = element.strokeWidth ? element.strokeWidth : 1;
    ctx.fillStyle = element.fillColor ? element.fillColor : "transparent";
    ctx.strokeRect(
      startCoordinates.x,
      startCoordinates.y,
      endCoordinates.x - startCoordinates.x,
      endCoordinates.y - startCoordinates.y
    );
    ctx.fillRect(
      startCoordinates.x,
      startCoordinates.y,
      endCoordinates.x - startCoordinates.x,
      endCoordinates.y - startCoordinates.y
    );
  }