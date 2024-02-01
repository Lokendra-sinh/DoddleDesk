import React from "react";
import { ElementsContainer, ElementTypes } from "../../../Types/Types";
import { moveElement } from "../../Operations/Move/moveElement";
import { handleResizeHandlesAndBoundingBox } from "../../Render/DynamicElements/ResizeHandlers/handleResizeHandlesAndBoundingBox";
import {
    canvasElements,
  setBlinkingCursorIntervalId,
  blinkingCursorIntervalId,
  cursorPosition,
  setCursorHeight,
  cursorBlinkingInterval,
  cursorColor,
  cursorHeight,
  cursorWidth,
  setCursorPosition,
  overlayForDrag,
} from "../../interactionhelpers";
import { v4 as uuidv4 } from "uuid";

let mouseX = 0;
let mouseY = 0;
let text = "";
let ctx: CanvasRenderingContext2D;
let canvasRef: React.RefObject<HTMLCanvasElement>;
let currentTextElement: ElementTypes | undefined = undefined;
let fontSize = 16;
let newAppElements: ElementsContainer = [];
let setNewAppElements: React.Dispatch<React.SetStateAction<ElementsContainer>>;

function initializeNewElement() {

    currentTextElement = {
        id: uuidv4(),
        type: "text",
        startCoordinates: { x: mouseX - 5, y: mouseY - 5},
        endCoordinates: { x: mouseX + 10, y: mouseY + cursorHeight + 5},
        strokeColor: "#4b5563",
        fillColor: "transparent",
        opacity: 1,
        strokeWidth: 2,
        textContent: "",
        fontSize: 16,
        fontFamily: "Arial",
        isFilled: false,
        isStroked: true,
        isText: false,
        isErased: false,
        isDragged: false,
        isResized: false,
        isRotated: false,
        isDeleted: false,
        isDrawn: false,
        toBeErased: false,
        isActive: false,
        zIndex: 1,
      };
}

export function handleTextOnMouseClick(
  e: MouseEvent,
  overlayCanvasRef: React.RefObject<HTMLCanvasElement>,
  appElements: ElementsContainer,
  setAppElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) {
  e.stopPropagation();
  if (!overlayCanvasRef.current) return;
  canvasRef = overlayCanvasRef;
  const context = overlayCanvasRef.current.getContext("2d");
  if (!context) return;
  ctx = context;
    setNewAppElements = setAppElements;
    newAppElements = appElements;
  const canvasRect = overlayCanvasRef.current.getBoundingClientRect();
  mouseX = e.clientX - canvasRect.left;
  mouseY = e.clientY - canvasRect.top;

  if (blinkingCursorIntervalId) {
    clearInterval(blinkingCursorIntervalId);
  }
  ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height); //clear canvas
  setCursorPosition(mouseX, mouseY);
  initializeNewElement();
  handleResizeHandlesAndBoundingBox(ctx, overlayCanvasRef, currentTextElement!);
  renderBlinkingCursor();
//   overlayForDrag.style.display = "block";
//   overlayForDrag.style.cursor = "default";
  overlayCanvasRef.current.addEventListener("mousemove", handleTextOnMouseMove);
  overlayCanvasRef.current.addEventListener("mousedown", handleTextOnMouseDown);
  document.addEventListener("keydown", handleTextOnKeyDown);
  return () => {
    document.removeEventListener("keydown", handleTextOnKeyDown);
    overlayCanvasRef.current!.removeEventListener("mousemove", handleTextOnMouseMove);
    overlayCanvasRef.current!.removeEventListener("mousedown", handleTextOnMouseDown);
  };
}

function handleTextOnKeyDown(e: KeyboardEvent) {
  if (!ctx || !canvasRef.current) return;
  const { key } = e;
  if (key === "Escape" || key === "Unidentified") return;

  switch (key) {
    case "Backspace":
      console.log("backspace pressed");
      text = text.slice(0, -1);
      break;
    case "Enter":
      text = text + "\n";
      break;
    default:
      // Add the typed character to the text string
      text += key;
      break;
  }

  redrawText(key);
}

function updateImmediateCursorPosition() {
  if (!canvasRef?.current || !ctx) return;
  console.log("cursor position before clear: ", cursorPosition);
  ctx.fillRect(cursorPosition.x, cursorPosition.y, cursorWidth, cursorHeight);
//   ctx.clearRect(cursorPosition.x, cursorPosition.y, cursorWidth, cursorHeight);
  // No need to immediately redraw the cursor here since renderBlinkingCursor will handle it
}

function renderBlinkingCursor() {
  if (!canvasRef || !canvasRef.current || !ctx) return;

  let cursorVisible = false;
  ctx.fillStyle = cursorColor;

  // Use the correct parameters for fillRect and clearRect
  const cursorId = setInterval(() => {
    if (!ctx || !canvasRef?.current) return;
    if (cursorVisible) {
      ctx.clearRect(
        cursorPosition.x,
        cursorPosition.y,
        cursorWidth,
        cursorHeight
      );
    } else {
      ctx.fillRect(
        cursorPosition.x,
        cursorPosition.y,
        cursorWidth,
        cursorHeight
      );
    }
    cursorVisible = !cursorVisible;
  }, cursorBlinkingInterval);

  setBlinkingCursorIntervalId(cursorId);
}

function redrawText(key: string) {
  if (!ctx || !canvasRef?.current) return;
  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";

  const lines = text.split("\n");
  let lineX = mouseX + cursorWidth; // Horizontal position
  let lineHeight = cursorHeight; // Height of each line, assuming it matches cursor height
  let lineY = mouseY; // Initial vertical position
  let maxBoundingBoxEndX = 0;
  let maxBoundingBoxEndY = 0;

  lines.forEach((line, index) => {
    ctx.fillText(line, lineX, lineY + index * lineHeight + lineHeight - 4);

    // calculate max width for bounding box end coordinates
    const lineWidth = ctx.measureText(line).width;
    if (lineWidth > maxBoundingBoxEndX) {
      maxBoundingBoxEndX = mouseX + cursorWidth + lineWidth + 10;
    }
  });

  if (key === "Enter") {
    setCursorPosition(lineX, lineY + (lines.length - 1) * lineHeight + 4);
    maxBoundingBoxEndY = lineY + (lines.length - 1) * lineHeight + 4;
  } else {
    // Adjust cursor position for text input, right after the last character
    if (lines.length > 0) {
      const lastLineMetrics = ctx.measureText(lines[lines.length - 1]);
      setCursorPosition(
        lineX + Math.floor(lastLineMetrics.width) + 2,
        lineY + (lines.length - 1) * lineHeight
      );
      maxBoundingBoxEndY = lineY + (lines.length - 1) * lineHeight + 10;
    }
  }

  if(text.length !== 0){
    currentTextElement!.textContent = text;
    currentTextElement!.endCoordinates!.x = maxBoundingBoxEndX;
    currentTextElement!.endCoordinates!.y = maxBoundingBoxEndY;
    handleResizeHandlesAndBoundingBox(ctx, canvasRef, currentTextElement!);
  }

  updateImmediateCursorPosition();

}


function handleTextOnMouseMove(e: MouseEvent){
    e.stopPropagation();
    if (!ctx || !canvasRef.current) return;
    if(!currentTextElement || !currentTextElement.startCoordinates || !currentTextElement.endCoordinates) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const mouseMoveX = e.clientX - canvasRect.left;
    const mouseMoveY = e.clientY - canvasRect.top;

    if(
        mouseMoveX >= currentTextElement!.startCoordinates!.x &&
        mouseMoveX <= currentTextElement!.endCoordinates!.x &&
        mouseMoveY >= currentTextElement!.startCoordinates!.y &&
        mouseMoveY <= currentTextElement!.endCoordinates!.y
    ){
        overlayForDrag.style.cursor = "move";
        canvasRef.current.style.cursor = "move";
        // handleResizeHandlesAndBoundingBox(ctx, canvasRef, currentTextElement!)
    } else {
        overlayForDrag.style.cursor = "default";
        canvasRef.current.style.cursor = "default";
    }

}


function handleTextOnMouseDown(e: MouseEvent){
    e.stopPropagation();
    if (!ctx || !canvasRef.current) return;
    if(!currentTextElement || !currentTextElement.startCoordinates || !currentTextElement.endCoordinates) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const mouseDownX = e.clientX - canvasRect.left;
    const mouseDownY = e.clientY - canvasRect.top;

    if(
        mouseDownX >= currentTextElement!.startCoordinates!.x &&
        mouseDownX <= currentTextElement!.endCoordinates!.x &&
        mouseDownY >= currentTextElement!.startCoordinates!.y &&
        mouseDownY <= currentTextElement!.endCoordinates!.y
    ){
        overlayForDrag.style.cursor = "move";
        canvasRef.current.style.cursor = "move";
        currentTextElement!.isActive = true;
        canvasElements.push(currentTextElement!);
        handleResizeHandlesAndBoundingBox(ctx, canvasRef, currentTextElement!)
        moveElement(mouseDownX, mouseDownY, newAppElements, setNewAppElements);
    } else {
        overlayForDrag.style.cursor = "default";
    }

}