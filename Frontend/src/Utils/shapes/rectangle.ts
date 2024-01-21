import React from "react";
import { ElementTypes } from "../../Types/Types";

type Position = {
    x: number;
    y: number;
}

export function drawRectangle(
    ctx: CanvasRenderingContext2D,
    element: ElementTypes,
  ) {
   
    if (!ctx) return;
    const { startCoordinates, endCoordinates } = element;
    ctx.strokeStyle = element.color;
    ctx.lineWidth = element.size;
    ctx.strokeRect(
      startCoordinates.x,
      startCoordinates.y,
      endCoordinates.x - startCoordinates.x,
      endCoordinates.y - startCoordinates.y
    );
  }