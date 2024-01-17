import React from "react";
import { elementTypes, elementsContainer } from "../../Recoil/Atoms/elements";

type Position = {
    x: number;
    y: number;
}

export function drawRectangle(
    ctx: CanvasRenderingContext2D,
    element: elementTypes,
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