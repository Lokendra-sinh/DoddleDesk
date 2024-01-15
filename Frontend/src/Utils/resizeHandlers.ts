import React from "react";
import { elementTypes } from "../Recoil/Atoms/elements";
import { elementsContainer } from "../Recoil/Atoms/elements";

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

  let cueBallContainer = document.querySelector('.cue-ball-container') as HTMLDivElement;
  if (!cueBallContainer) {
    cueBallContainer = document.createElement("div");
    cueBallContainer.style.position = "absolute";
    cueBallContainer.style.zIndex = "1000";
    cueBallContainer.style.border = "2px solid #cbd5e1";
    cueBallContainer.style.pointerEvents = "none"; // To pass click events to canvas
    cueBallContainer.className = "cue-ball-container";
    document.body.appendChild(cueBallContainer);
  }

  // Set container dimensions and position
  cueBallContainer.style.left = `${topLeftX}px`;
  cueBallContainer.style.top = `${topLeftY}px`;
  cueBallContainer.style.width = `${width}px`;
  cueBallContainer.style.height = `${height}px`;
  cueBallContainer.style.display = "block";

  // Draw the resize cue balls

  drawResizeCueBalls(topLeftX, topLeftY, width, height, cueBallContainer);

}

const MARGIN_GAP = 10; // Adjust this value for desired gap size

export function AddVisualCueBalls(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  element: elementTypes | undefined,
) {
  if (!canvasRef.current) return;
  const ctx = canvasRef.current.getContext("2d");
  if (!ctx) return;
  if (!element) return;
  // Select or create the cue ball container
  let cueBallContainer = document.querySelector('.cue-ball-container') as HTMLDivElement;
  if (!cueBallContainer) {
    cueBallContainer = document.createElement("div");
    cueBallContainer.style.position = "absolute";
    cueBallContainer.style.zIndex = "1000";
    cueBallContainer.style.border = "2px solid #fecdd3";
    cueBallContainer.style.pointerEvents = "none"; // To pass click events to canvas
    cueBallContainer.className = "cue-ball-container";
    document.body.appendChild(cueBallContainer);
  }

  let topLeftX, topLeftY, width, height;

  if (element.type === "circle") {
    handleVisualCuesForCircle(ctx, element, MARGIN_GAP);
    return;
  } else {
    // Calculate dimensions and position for other shapes
    const { startCoordinates, endCoordinates } = element;
    topLeftX = Math.min(startCoordinates.x, endCoordinates.x) - MARGIN_GAP;
    topLeftY = Math.min(startCoordinates.y, endCoordinates.y) - MARGIN_GAP;
    width = Math.abs(endCoordinates.x - startCoordinates.x) + 2 * MARGIN_GAP;
    height = Math.abs(endCoordinates.y - startCoordinates.y) + 2 * MARGIN_GAP;
  }

  // Set container dimensions and position
  cueBallContainer.style.left = `${topLeftX}px`;
  cueBallContainer.style.top = `${topLeftY}px`;
  cueBallContainer.style.width = `${width}px`;
  cueBallContainer.style.height = `${height}px`;
  cueBallContainer.style.display = "block";

  // Draw the resize cue balls
  drawResizeCueBalls(topLeftX, topLeftY, width, height, cueBallContainer);
}

export const hideAllCueBalls = () => {
  const ballContainer = document.body.querySelector('.cue-ball-container') as HTMLDivElement;
  if (ballContainer) {
    ballContainer.style.display = 'none';
  }
  const cueBalls = document.body.querySelectorAll('.cue-ball-class');
  cueBalls.forEach((cueBall) => {
    const cueBallElement = cueBall as HTMLDivElement;
    cueBallElement.style.display = 'none';
  })
};



function drawResizeCueBalls(
  x: number | undefined,
  y: number | undefined,
  width: number | undefined,
  height: number | undefined,
 cueBallContainer: HTMLDivElement,
) {

  if (typeof x !== 'number' || typeof y !== 'number' || 
      typeof width !== 'number' || typeof height !== 'number') {
    return; // Or handle the undefined case as needed
  }


  const createOrUpdateCueBall = (className: string, posX: number, posY: number, cursorStyle: string) => {
    let cueBall = document.body.querySelector(`.${className}`) as HTMLDivElement;
    if (!cueBall) {
      cueBall = document.createElement("div");
      cueBall.style.position = "absolute";
      cueBall.style.width = "10px";
      cueBall.style.height = "10px";
      cueBall.style.borderRadius = "30%"; 
      cueBall.style.border = "2px solid #fecdd3";
      cueBall.style.backgroundColor = "white";
      cueBall.style.zIndex = "1000";
      cueBall.style.display = "block";
      cueBall.style.pointerEvents = "auto";
      cueBall.className = `${className} cue-ball-class`;
      document.body.appendChild(cueBall);
    }
    cueBall.style.display = "block";
    cueBall.style.left = `${posX}px`;
    cueBall.style.top = `${posY}px`;
    cueBall.style.cursor = cursorStyle;
  };

  // Update positions of the cue balls
  createOrUpdateCueBall("top-left-cue-ball", x - 5, y - 5, "nwse-resize");
  createOrUpdateCueBall("top-middle-cue-ball", x + width / 2 - 5, y - 5, "ns-resize");
  createOrUpdateCueBall("top-right-cue-ball", x + width - 5, y - 5, "nesw-resize");
  createOrUpdateCueBall("right-middle-cue-ball", x + width - 5, y + height / 2 - 5, "ew-resize");
  createOrUpdateCueBall("bottom-right-cue-ball", x + width - 5, y + height - 5, "nwse-resize");
  createOrUpdateCueBall("bottom-middle-cue-ball", x + width / 2 - 5, y + height - 5, "ns-resize");
  createOrUpdateCueBall("bottom-left-cue-ball", x - 5, y + height - 5, "nesw-resize");
  createOrUpdateCueBall("left-middle-cue-ball", x - 5, y + height / 2 - 5, "ew-resize");

}
