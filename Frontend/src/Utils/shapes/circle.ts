import { ElementTypes } from "../../Types/Types";

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  element: ElementTypes,
) {
  if (!ctx) return;
  const { startCoordinates, endCoordinates } = element!;
  if (!startCoordinates || !endCoordinates) return;
  const centerX = (startCoordinates.x + endCoordinates.x) / 2;
  const centerY = (startCoordinates.y + endCoordinates.y) / 2;

  // Calculate the radius as half the distance between start and end points
  const radius =
    Math.sqrt(
      Math.pow(endCoordinates.x - startCoordinates.x, 2) +
        Math.pow(endCoordinates.y - startCoordinates.y, 2)
    ) / 2;

  ctx.beginPath();
  ctx.strokeStyle = element.strokeColor;
  ctx.lineWidth = element.strokeWidth ? element.strokeWidth : 2;
  ctx.fillStyle = element.fillColor ? element.fillColor : "transparent";
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
}
