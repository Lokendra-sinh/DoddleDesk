import React from "react";
import { elementTypes } from "../Recoil/Atoms/elements";

type Position = {
  x: number;
  y: number;
};

function handleVisualCuesForCircle(
  ctx: CanvasRenderingContext2D,
  element: elementTypes,
  gapSize: number
) {
  const { startCoordinates, endCoordinates } = element;
  const centerX = (startCoordinates.x + endCoordinates.x) / 2;
  const centerY = (startCoordinates.y + endCoordinates.y) / 2;
  const radius =
    Math.sqrt(
      Math.pow(endCoordinates.x - startCoordinates.x, 2) +
        Math.pow(endCoordinates.y - startCoordinates.y, 2)
    ) / 2;

  // Calculate the top-left corner of the bounding box considering the gap
  const topLeftX = centerX - radius - gapSize;
  const topLeftY = centerY - radius - gapSize;

  // Adjust the width and height to include the gap
  const width = radius * 2 + 2 * gapSize;
  const height = radius * 2 + 2 * gapSize;

  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 2;
  ctx.strokeRect(topLeftX, topLeftY, width, height);

  // Draw the resize cue balls

  drawResizeCueBalls(topLeftX, topLeftY, width, height);
}

export function handleAddVisualCues(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  element: elementTypes
) {
  if (!canvasRef.current) return;
  const ctx = canvasRef.current.getContext("2d");
  if (!ctx) return;
  if (element.type === "circle") handleVisualCuesForCircle(ctx, element, 5);
  else {
    const margin = 8; // Set a margin for the bounding box
    const { startCoordinates, endCoordinates } = element;
    const { x: startX, y: startY } = startCoordinates;
    const { x: endX, y: endY } = endCoordinates;

    // Calculate the bounding box coordinates with margin
    const x = Math.min(startX, endX) - margin;
    const y = Math.min(startY, endY) - margin;
    const width = Math.abs(endX - startX) + 2 * margin;
    const height = Math.abs(endY - startY) + 2 * margin;

    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Draw the resize cue balls

    drawResizeCueBalls(x, y, width, height, canvasRef);
  }
}

function drawResizeCueBalls(
  x: number,
  y: number,
  width: number,
  height: number,
  canvasRef: React.RefObject<HTMLCanvasElement>
) {
  // Top-left corner

  const topLeftCueBallX: number = x - 5;
  const topLeftCueBallY: number = y - 5;
  const topLeftCueBall: HTMLDivElement | null = document.createElement("div");
  topLeftCueBall.style.position = "absolute";
  topLeftCueBall.style.width = "10px";
  topLeftCueBall.style.height = "10px";
  topLeftCueBall.style.borderRadius = "30%";
  topLeftCueBall.style.border = "2px solid #cbd5e1";
  topLeftCueBall.style.backgroundColor = "white";
  topLeftCueBall.style.left = `${topLeftCueBallX}px`;
  topLeftCueBall.style.top = `${topLeftCueBallY}px`;
  topLeftCueBall.style.cursor = "nwse-resize";
  topLeftCueBall.style.zIndex = "1000";
  topLeftCueBall.id = "topLeftCueBall";

  document.body.appendChild(topLeftCueBall);

  //top-edge-middle cue ball

  const topMiddleCueBallX: number = x + width / 2 - 5;
  const topMiddleCueBallY: number = y - 5;
  const topMiddleCueBall: HTMLDivElement | null = document.createElement("div");
  topMiddleCueBall.style.position = "absolute";
  topMiddleCueBall.style.width = "10px";
  topMiddleCueBall.style.height = "10px";
  topMiddleCueBall.style.borderRadius = "30%";
  topMiddleCueBall.style.border = "2px solid #cbd5e1";
  topMiddleCueBall.style.backgroundColor = "white";
  topMiddleCueBall.style.left = `${topMiddleCueBallX}px`;
  topMiddleCueBall.style.top = `${topMiddleCueBallY}px`;
  topMiddleCueBall.style.cursor = "ns-resize";
  topMiddleCueBall.style.zIndex = "1000";
  topMiddleCueBall.id = "topMiddleCueBall";

  document.body.appendChild(topMiddleCueBall);

  // Top-right corner

  const topRightCueBallX: number = x + width - 5;
  const topRightCueBallY: number = y - 5;
  const topRightCueBall: HTMLDivElement | null = document.createElement("div");
  topRightCueBall.style.position = "absolute";
  topRightCueBall.style.width = "10px";
  topRightCueBall.style.height = "10px";
  topRightCueBall.style.borderRadius = "30%";
  topRightCueBall.style.border = "2px solid #cbd5e1";
  topRightCueBall.style.backgroundColor = "white";
  topRightCueBall.style.left = `${topRightCueBallX}px`;
  topRightCueBall.style.top = `${topRightCueBallY}px`;
  topRightCueBall.style.cursor = "nesw-resize";
  topRightCueBall.style.zIndex = "1000";
  topRightCueBall.id = "topRightCueBall";

  document.body.appendChild(topRightCueBall);

  // right-edge-middle cue ball

  const rightMiddleCueBallX: number = x + width - 5;
  const rightMiddleCueBallY: number = y + height / 2 - 5;
  const rightMiddleCueBall: HTMLDivElement | null =
    document.createElement("div");
  rightMiddleCueBall.style.position = "absolute";
  rightMiddleCueBall.style.width = "10px";
  rightMiddleCueBall.style.height = "10px";
  rightMiddleCueBall.style.borderRadius = "30%";
  rightMiddleCueBall.style.border = "2px solid #cbd5e1";
  rightMiddleCueBall.style.backgroundColor = "white";
  rightMiddleCueBall.style.left = `${rightMiddleCueBallX}px`;
  rightMiddleCueBall.style.top = `${rightMiddleCueBallY}px`;
  rightMiddleCueBall.style.cursor = "ew-resize";
  rightMiddleCueBall.style.zIndex = "1000";
  rightMiddleCueBall.id = "rightMiddleCueBall";

  document.body.appendChild(rightMiddleCueBall);

  // Bottom-right corner

  const bottomRightCueBallX: number = x + width - 5;
  const bottomRightCueBallY: number = y + height - 5;
  const bottomRightCueBall: HTMLDivElement | null =
    document.createElement("div");
  bottomRightCueBall.style.position = "absolute";
  bottomRightCueBall.style.width = "10px";
  bottomRightCueBall.style.height = "10px";
  bottomRightCueBall.style.borderRadius = "30%";
  bottomRightCueBall.style.border = "2px solid #cbd5e1";
  bottomRightCueBall.style.backgroundColor = "white";
  bottomRightCueBall.style.left = `${bottomRightCueBallX}px`;
  bottomRightCueBall.style.top = `${bottomRightCueBallY}px`;
  bottomRightCueBall.style.cursor = "nwse-resize";
  bottomRightCueBall.style.zIndex = "1000";
  bottomRightCueBall.id = "bottomRightCueBall";

  document.body.appendChild(bottomRightCueBall);

  // bottom-edge-middle cue ball

  const bottomMiddleCueBallX: number = x + width / 2 - 5;
  const bottomMiddleCueBallY: number = y + height - 5;
  const bottomMiddleCueBall: HTMLDivElement | null =
    document.createElement("div");
  bottomMiddleCueBall.style.position = "absolute";
  bottomMiddleCueBall.style.width = "10px";
  bottomMiddleCueBall.style.height = "10px";
  bottomMiddleCueBall.style.borderRadius = "30%";
  bottomMiddleCueBall.style.border = "2px solid #cbd5e1";
  bottomMiddleCueBall.style.backgroundColor = "white";
  bottomMiddleCueBall.style.left = `${bottomMiddleCueBallX}px`;
  bottomMiddleCueBall.style.top = `${bottomMiddleCueBallY}px`;
  bottomMiddleCueBall.style.cursor = "ns-resize";
  bottomMiddleCueBall.style.zIndex = "1000";
  bottomMiddleCueBall.id = "bottomMiddleCueBall";

  document.body.appendChild(bottomMiddleCueBall);

  // Bottom-left corner

  const bottomLeftCueBallX: number = x - 5;
  const bottomLeftCueBallY: number = y + height - 5;
  const bottomLeftCueBall: HTMLDivElement | null =
    document.createElement("div");
  bottomLeftCueBall.style.position = "absolute";
  bottomLeftCueBall.style.width = "10px";
  bottomLeftCueBall.style.height = "10px";
  bottomLeftCueBall.style.borderRadius = "30%";
  bottomLeftCueBall.style.border = "2px solid #cbd5e1";
  bottomLeftCueBall.style.backgroundColor = "white";
  bottomLeftCueBall.style.left = `${bottomLeftCueBallX}px`;
  bottomLeftCueBall.style.top = `${bottomLeftCueBallY}px`;
  bottomLeftCueBall.style.cursor = "nesw-resize";
  bottomLeftCueBall.style.zIndex = "1000";
  bottomLeftCueBall.id = "bottomLeftCueBall";

  document.body.appendChild(bottomLeftCueBall);

  // left-edge-middle cue ball

  const leftMiddleCueBallX: number = x - 5;
  const leftMiddleCueBallY: number = y + height / 2 - 5;
  const leftMiddleCueBall: HTMLDivElement | null =
    document.createElement("div");
  leftMiddleCueBall.style.position = "absolute";
  leftMiddleCueBall.style.width = "10px";
  leftMiddleCueBall.style.height = "10px";
  leftMiddleCueBall.style.borderRadius = "30%";
  leftMiddleCueBall.style.border = "2px solid #cbd5e1";
  leftMiddleCueBall.style.backgroundColor = "white";
  leftMiddleCueBall.style.left = `${leftMiddleCueBallX}px`;
  leftMiddleCueBall.style.top = `${leftMiddleCueBallY}px`;
  leftMiddleCueBall.style.cursor = "ew-resize";
  leftMiddleCueBall.style.zIndex = "1000";
  leftMiddleCueBall.id = "leftMiddleCueBall";

  document.body.appendChild(leftMiddleCueBall);

  // rotate cue ball

  const rotateCueBallX: number = x + width / 2 - 7.5;
  const rotateCueBallY: number = y - 25;
  const rotateCueBall: HTMLSpanElement | null = document.createElement("i"); // Type is HTMLSpanElement or HTMLDivElement
  rotateCueBall.className = "fa-solid fa-rotate"; // Assign the class name
  rotateCueBall.style.position = "absolute";
  rotateCueBall.style.color = "#cbd5e1";
  rotateCueBall.style.left = `${rotateCueBallX}px`;
  rotateCueBall.style.top = `${rotateCueBallY}px`;
  rotateCueBall.style.fontSize = "15px";
  rotateCueBall.style.cursor = "grab";
  rotateCueBall.style.zIndex = "1000";
  rotateCueBall.id = "rotateCueBall";

  document.body.appendChild(rotateCueBall);

    // // delete cue ball
    // if (!canvasRef.current) return;
    // canvasRef.current.addEventListener("click", (e: MouseEvent) => {
    //     const target = e.target as HTMLElement;
    //     if(![topLeftCueBall, topMiddleCueBall, topRightCueBall, rightMiddleCueBall, bottomRightCueBall, bottomMiddleCueBall, bottomLeftCueBall, leftMiddleCueBall, rotateCueBall].includes(target)) {
    //         document.body.removeChild(topLeftCueBall);
    //         document.body.removeChild(topMiddleCueBall);
    //         document.body.removeChild(topRightCueBall);
    //         document.body.removeChild(rightMiddleCueBall);
    //         document.body.removeChild(bottomRightCueBall);
    //         document.body.removeChild(bottomMiddleCueBall);
    //         document.body.removeChild(bottomLeftCueBall);
    //         document.body.removeChild(leftMiddleCueBall);
    //         document.body.removeChild(rotateCueBall);
    //     }
    // });
}
