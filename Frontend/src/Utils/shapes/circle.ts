import React from "react";
import { elementTypes, elementsContainer } from "../../Recoil/Atoms/elements";

type Position = {
    x: number;
    y: number;
}

export function drawCircle(
    ctx: CanvasRenderingContext2D,
    element: elementTypes,
  ) {
   
    if (!ctx) return;

    const { startCoordinates, endCoordinates } = element;
  
    // Calculate the midpoint (center) of the circle
    const centerX = (startCoordinates.x + endCoordinates.x) / 2;
    const centerY = (startCoordinates.y + endCoordinates.y) / 2;
  
    // Calculate the radius as half the distance between start and end points
    const radius =
      Math.sqrt(
        Math.pow(endCoordinates.x - startCoordinates.x, 2) +
          Math.pow(endCoordinates.y - startCoordinates.y, 2)
      ) / 2;
    ctx.beginPath();
    ctx.strokeStyle = element.color;
    ctx.lineWidth = element.size;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
  }
