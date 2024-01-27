import { activeForegroundElement } from "../../Components/Board/Board";
import { ElementTypes } from "../../Types/Types";

export function drawBiSquare(
    ctx: CanvasRenderingContext2D,
    element: ElementTypes,
  ) {

    if (!ctx) return;
    const { startCoordinates, endCoordinates } = element;
    if (!startCoordinates || !endCoordinates) return;

  
    const cornerRadius = 20;
    const squareWidth = endCoordinates.x - startCoordinates.x;
    const squareheight = endCoordinates.y - startCoordinates.y;
    const startX =
      squareWidth >= 0 ? startCoordinates.x : startCoordinates.x + squareWidth;
    const startY =
      squareheight >= 0 ? startCoordinates.y : startCoordinates.y + squareheight;
    const width = Math.abs(squareWidth);
    const height = Math.abs(squareheight);
    const effectiveCornerRadius = Math.min(cornerRadius, width / 3, height / 3);

    ctx.beginPath();
  
    //top-left corner
    ctx.moveTo(startX + effectiveCornerRadius, startY);
  
    //top-edge and top-right corner
    ctx.lineTo(startX + width - effectiveCornerRadius, startY);
    ctx.arcTo(
      startX + width,
      startY,
      startX + width,
      startY + effectiveCornerRadius,
      effectiveCornerRadius
    );
  
    //right-edge and bottom-right corner
    ctx.lineTo(startX + width, startY + height - effectiveCornerRadius);
    ctx.arcTo(
      startX + width,
      startY + height,
      startX + width - effectiveCornerRadius,
      startY + height,
      effectiveCornerRadius
    );
  
    //bottom-edge and bottom-left corner
    ctx.lineTo(startX + effectiveCornerRadius, startY + height);
    ctx.arcTo(
      startX,
      startY + height,
      startX,
      startY + height - effectiveCornerRadius,
      effectiveCornerRadius
    );
  
    //left-edge and top-left corner
    ctx.lineTo(startX, startY + effectiveCornerRadius);
    ctx.arcTo(
      startX,
      startY,
      startX + effectiveCornerRadius,
      startY,
      effectiveCornerRadius
    );
  
    ctx.closePath();
    ctx.strokeStyle = element.color;
    ctx.stroke();
  }