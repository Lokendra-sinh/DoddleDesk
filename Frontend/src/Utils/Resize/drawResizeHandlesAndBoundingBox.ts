import { BoundingBoxAndCueBalls, ElementTypes, ElementsContainer } from "../../Types/Types";
import { drawCueBalls } from "./drawCueBalls";

const MARGIN_GAP = 5;



export function drawResizeHandlesAndBoundingBox(
  element: ElementTypes,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  activeElementId: string | "",
) {
    let boundingBox = document.querySelector('.bounding-box') as HTMLDivElement;
    if (!boundingBox) {
      boundingBox = document.createElement("div");
      boundingBox.style.position = "absolute";
      boundingBox.style.zIndex = "1000";
      boundingBox.style.border = "2px solid #fecdd3";
      boundingBox.style.pointerEvents = "none"; // To pass click events to canvas
      boundingBox.className = "bounding-box";
      document.body.appendChild(boundingBox);
    }
  
    let topLeftX: number, topLeftY: number, width: number, height: number;
    const { startCoordinates, endCoordinates } = element;
  
    if (element.type === "circle") {
        const centerX = (startCoordinates.x + endCoordinates.x) / 2;
        const centerY = (startCoordinates.y + endCoordinates.y) / 2;
        const radius =
          Math.sqrt(
            Math.pow(endCoordinates.x - startCoordinates.x, 2) +
              Math.pow(endCoordinates.y - startCoordinates.y, 2)
          ) / 2;
      
        // Calculate the top-left corner of the bounding box considering the gap
        topLeftX = centerX - radius - MARGIN_GAP;
        topLeftY = centerY - radius - MARGIN_GAP;
      
        // Adjust the width and height to include the gap
         width = radius * 2 + 2 * MARGIN_GAP;
         height = radius * 2 + 2 * MARGIN_GAP;
    } else {
      // Calculate dimensions and position for other shapes
      topLeftX = Math.min(startCoordinates.x, endCoordinates.x) - MARGIN_GAP;
      topLeftY = Math.min(startCoordinates.y, endCoordinates.y) - MARGIN_GAP;
      width = Math.abs(endCoordinates.x - startCoordinates.x) + 2 * MARGIN_GAP;
      height = Math.abs(endCoordinates.y - startCoordinates.y) + 2 * MARGIN_GAP;
    }
  
    // Set container dimensions and position
    boundingBox.style.left = `${topLeftX}px`;
    boundingBox.style.top = `${topLeftY}px`;
    boundingBox.style.width = `${width}px`;
    boundingBox.style.height = `${height}px`;
    boundingBox.style.display = "block";
  
    // Draw the resize cue balls
    drawCueBalls(topLeftX, topLeftY, width, height, canvasRef, activeElementId);
  }

  