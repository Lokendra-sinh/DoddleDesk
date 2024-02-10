import React from "react";
import { ElementsContainer } from "../Types/Types";
import { canvasElements, setCanvasElements } from "./interactionhelpers";


let originalCanvasWidth = 0;
let originalCanvasHeight = 0;

export const handleResize = (
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) => {
  if (!mainCanvasRef.current) return;
  const mainCanvasContext = mainCanvasRef.current.getContext("2d");
  if (!mainCanvasContext) return;

  // reset overlay div element 
  let overlayDiv = document.querySelector(".overlay-for-dragging") as HTMLDivElement;
  if(overlayDiv){
    overlayDiv.style.display = "none";
    overlayDiv.style.width = `{document.documentElement.clientWidth}`;
    overlayDiv.style.height = `{document.documentElement.clientHeight}`;
  }


    const dpi = window.devicePixelRatio || 1;
    const width = document.documentElement.clientWidth * dpi;
    const height = (document.documentElement.clientHeight) * dpi; // Adjust navbarHeight accordingly
  
    mainCanvasRef.current.width = width;
    mainCanvasRef.current.height = height;
    mainCanvasRef.current.getContext("2d")?.scale(dpi, dpi);

    const widthRatio = width / originalCanvasWidth;
    const heightRatio = height / originalCanvasHeight;

    const scaledElements = canvasElements.map((element) => {
      if (element.type === "text") return element;
      if(!element.startCoordinates || !element.endCoordinates) return element;
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
  const height = (document.documentElement.clientHeight) * dpi; // Adjust navbarHeight accordingly

  originalCanvasHeight = height;
  originalCanvasWidth = width;

  mainCanvasRef.current.width = width;
  mainCanvasRef.current.height = height;
  mainCanvasRef.current.getContext("2d")?.scale(dpi, dpi);
  mainCanvasContext.fillStyle = "white";
  
}
