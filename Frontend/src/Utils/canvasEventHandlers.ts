import React from "react";
import { ElementsContainer } from "../Types/Types";
import { canvasElements, setCanvasElements } from "./interactionhelpers";
import { throttle } from "lodash";

let originalCanvasWidth = 0;
let originalCanvasHeight = 0;

export const handleResize = (
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  recoilElements: ElementsContainer,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) => {
  if (!mainCanvasRef.current) return;
  const mainCanvasContext = mainCanvasRef.current.getContext("2d");
  if (!mainCanvasContext) return;

    const dpi = window.devicePixelRatio || 1;
    const width = document.documentElement.clientWidth * dpi;
    const height = (document.documentElement.clientHeight - 56) * dpi; // Adjust navbarHeight accordingly
  
    mainCanvasRef.current.width = width;
    mainCanvasRef.current.height = height;
    mainCanvasRef.current.getContext("2d")?.scale(dpi, dpi);

    const widthRatio = width / originalCanvasWidth;
    const heightRatio = height / originalCanvasHeight;

    const scaledElements = canvasElements.map((element) => {
      const scaledElement = {
        ...element,
        startCoordinates: {
          x: element.startCoordinates!.x * widthRatio,
          y: element.startCoordinates!.y * heightRatio,
        },
        endCoordinates: {
          x: element.endCoordinates!.x * widthRatio,
          y: element.endCoordinates!.y * heightRatio,
        },
      };
      return scaledElement;
    });

    originalCanvasHeight = height;
    originalCanvasWidth = width;

    console.log("scaled elements are:", scaledElements);
    setCanvasElements(scaledElements);
    setRecoilElements(scaledElements);

};

export function initiateCanvas(
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
) {
  if (!mainCanvasRef.current) return;
  const mainCanvasContext = mainCanvasRef.current.getContext("2d");
  if (!mainCanvasContext) return;
  
  const dpi = window.devicePixelRatio || 1;
  const width = document.documentElement.clientWidth * dpi;
  const height = (document.documentElement.clientHeight - 56) * dpi; // Adjust navbarHeight accordingly

  originalCanvasHeight = height;
  originalCanvasWidth = width;

  mainCanvasRef.current.width = width;
  mainCanvasRef.current.height = height;
  mainCanvasRef.current.getContext("2d")?.scale(dpi, dpi);
  
}
