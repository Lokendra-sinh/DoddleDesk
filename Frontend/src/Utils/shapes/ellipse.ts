import React from "react";
import { ElementTypes } from "../../Types/Types";

type Position = {
  x: number;
  y: number;
};

export function drawEllipse(
  ctx: CanvasRenderingContext2D,
  element: ElementTypes
) {
   
  if (!ctx) return;
  const { startCoordinates, endCoordinates } = element;

  const cx = (startCoordinates.x + endCoordinates.x) / 2;
  const cy = (startCoordinates.y + endCoordinates.y) / 2;
  const rx = Math.abs(endCoordinates.x - startCoordinates.x) / 2;
  const ry = Math.abs(endCoordinates.y - startCoordinates.y) / 2;

  ctx.beginPath();
  ctx.fillStyle = element.color;
  ctx.lineWidth = element.size;
  ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
  ctx.strokeStyle = element.color;
  ctx.stroke();
}
