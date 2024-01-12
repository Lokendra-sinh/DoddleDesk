import React from "react";
import { toolTypes } from "../Recoil/Atoms/tools";
import { elementsContainer } from "../Recoil/Atoms/elements";

type Position = {
  x: number;
  y: number;
};

export function drawBiSquare(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  startPosition: Position,
  endPosition: Position,
  selectedTools: toolTypes,
  elements: elementsContainer,
  cornerRadius: number,
) {
  if (!canvasRef.current) return;
  const ctx = canvasRef.current.getContext("2d");
  if (!ctx) return;

  const squareWidth = endPosition.x - startPosition.x;
  const squareheight = endPosition.y - startPosition.y;
  const startX =
    squareWidth >= 0 ? startPosition.x : startPosition.x + squareWidth;
  const startY =
    squareheight >= 0 ? startPosition.y : startPosition.y + squareheight;
  const width = Math.abs(squareWidth);
  const height = Math.abs(squareheight);
  const effectiveCornerRadius = Math.min(cornerRadius, width / 3, height / 3);
  redrawElements(canvasRef, elements);
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
  ctx.stroke();
}

export function drawSquare(canvasRef: React.RefObject<HTMLCanvasElement>, selectedTools: toolTypes, startPosition: Position, lastPosition: Position, elements: elementsContainer) {
    console.log("inside drawSquare");
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    redrawElements(canvasRef, elements);
    ctx.strokeStyle = selectedTools.color;
    ctx.lineWidth = selectedTools.size;
    ctx.strokeRect(
      startPosition.x,
      startPosition.y,
      lastPosition.x - startPosition.x,
      lastPosition.y - startPosition.y
    );
  }

 function handleBiSquare(
    canvasRef: React.RefObject<HTMLCanvasElement>,
    startPosition: Position,
    endPosition: Position,
    cornerRadius: number,
  ) {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
  
    const squareWidth = endPosition.x - startPosition.x;
    const squareheight = endPosition.y - startPosition.y;
    const startX =
      squareWidth >= 0 ? startPosition.x : startPosition.x + squareWidth;
    const startY =
      squareheight >= 0 ? startPosition.y : startPosition.y + squareheight;
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
    ctx.stroke();
  }

function handleSquare(canvasRef: React.RefObject<HTMLCanvasElement>, startPosition: Position, lastPosition: Position, color: string, size: number) {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.strokeRect(
      startPosition.x,
      startPosition.y,
      lastPosition.x - startPosition.x,
      lastPosition.y - startPosition.y
    );
}

export function redrawElements(canvasRef: React.RefObject<HTMLCanvasElement>, elements: elementsContainer) {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    elements.forEach((element) => {
        element.type === "square" && handleSquare(canvasRef, element.startCoordinates, element.endCoordinates, element.color, element.size);
        element.type === "biSquare" && handleBiSquare(canvasRef, element.startCoordinates, element.endCoordinates, element.cornerRadius ?? 10);
    });
  }