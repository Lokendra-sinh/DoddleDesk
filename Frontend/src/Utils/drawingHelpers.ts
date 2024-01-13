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

export function drawCircle(canvasRef: React.RefObject<HTMLCanvasElement>, startPosition: Position, lastPosition: Position, selectedTools: toolTypes, elements: elementsContainer) {
  if (!canvasRef.current) return;
  const ctx = canvasRef.current.getContext("2d");
  if (!ctx) return;

  // Calculate the midpoint (center) of the circle
  const centerX = (startPosition.x + lastPosition.x) / 2;
  const centerY = (startPosition.y + lastPosition.y) / 2;

  // Calculate the radius as half the distance between start and end points
  const radius = Math.sqrt(Math.pow(lastPosition.x - startPosition.x, 2) + Math.pow(lastPosition.y - startPosition.y, 2)) / 2;
  redrawElements(canvasRef, elements);
  ctx.beginPath();
  ctx.strokeStyle = selectedTools.color;
  ctx.lineWidth = selectedTools.size;
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
  
}

export function drawEllipse(canvasRef: React.RefObject<HTMLCanvasElement>, startPosition: Position, lastPosition: Position, selectedTools: toolTypes, elements: elementsContainer) {
    
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        redrawElements(canvasRef, elements);
        const cx = (startPosition.x + lastPosition.x) / 2;
        const cy = (startPosition.y + lastPosition.y) / 2;
        const rx = Math.abs(lastPosition.x - startPosition.x) / 2;
        const ry = Math.abs(lastPosition.y - startPosition.y) / 2;
    
        ctx.beginPath();
        ctx.fillStyle = selectedTools.color;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
        ctx.lineWidth = selectedTools.size;
        ctx.stroke();
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

function handleCircle(canvasRef: React.RefObject<HTMLCanvasElement>, startPosition: Position, lastPosition: Position, color: string, size: number) {
  if (!canvasRef.current) return;
  const ctx = canvasRef.current.getContext("2d");
  if (!ctx) return;

  // Calculate the midpoint (center) of the circle
  const centerX = (startPosition.x + lastPosition.x) / 2;
  const centerY = (startPosition.y + lastPosition.y) / 2;

  // Calculate the radius as half the distance between start and end points
  const radius = Math.sqrt(Math.pow(lastPosition.x - startPosition.x, 2) + Math.pow(lastPosition.y - startPosition.y, 2)) / 2;

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

}

function handleEllipse(canvasRef: React.RefObject<HTMLCanvasElement>, startPosition: Position, lastPosition: Position, color: string, size: number) {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const cx = (startPosition.x + lastPosition.x) / 2;
    const cy = (startPosition.y + lastPosition.y) / 2;
    const rx = Math.abs(lastPosition.x - startPosition.x) / 2;
    const ry = Math.abs(lastPosition.y - startPosition.y) / 2;

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
    ctx.lineWidth = size;
    ctx.stroke();
}

export function redrawElements(canvasRef: React.RefObject<HTMLCanvasElement>, elements: elementsContainer) {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    elements.forEach((element) => {
        element.type === "square" && handleSquare(canvasRef, element.startCoordinates, element.endCoordinates, element.color, element.size);
        element.type === "biSquare" && handleBiSquare(canvasRef, element.startCoordinates, element.endCoordinates, element.cornerRadius ?? 10);
        element.type === "circle" && handleCircle(canvasRef, element.startCoordinates, element.endCoordinates, element.color, element.size);
        element.type === "ellipse" && handleEllipse(canvasRef, element.startCoordinates, element.endCoordinates, element.color, element.size);
    });
  }