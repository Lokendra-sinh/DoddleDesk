import React from "react";
import { ElementTypes } from "../Types/Types";


export const handleResize = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
) => {
  if (!canvasRef.current) return;
  const ctx = canvasRef.current.getContext("2d");
  if (!ctx) return;
  const dpi = window.devicePixelRatio;
  canvasRef.current.width = window.innerWidth * dpi;
  canvasRef.current.height = window.innerHeight * dpi;
  ctx.scale(dpi, dpi);
};

export function initiateCanvas(canvasRef: React.RefObject<HTMLCanvasElement>) {
  if (!canvasRef.current) return;
  const ctx = canvasRef.current.getContext("2d");
  if (!ctx) return;
  const dpi = window.devicePixelRatio || 1;
  canvasRef.current.width = window.innerWidth * dpi;
  canvasRef.current.height = window.innerHeight * dpi;
  ctx.scale(dpi, dpi);
  ctx.fillStyle = "#f9fafb";
  ctx.fillRect(
    0,
    0,
    canvasRef.current.width / dpi,
    canvasRef.current.height / dpi
  );
}
