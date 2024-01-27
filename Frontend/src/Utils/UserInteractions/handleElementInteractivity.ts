import React from "react";
import { ElementTypes, ElementsContainer } from "../../Types/Types";
import { activeInteractiveElement, setActiveInteractiveElement } from "../interactionhelpers";
import { setAnimationRenderContextAndTool, startAnimationPreview, stopAnimationPreview } from "./drawPreviewOnAnimationLayer";

export function handleElementInteractivity(
  e: MouseEvent,
  drawRenderCanvasRef: React.RefObject<HTMLCanvasElement>,
  animationRenderCanvasRef: React.RefObject<HTMLCanvasElement>,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  recoilElements: ElementsContainer,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) {
  e.stopPropagation();
  if (
    !drawRenderCanvasRef.current ||
    !animationRenderCanvasRef.current ||
    !mainCanvasRef.current
  )
    return;
  if (recoilElements.length === 0) return;
  const mainCanvasX = e.clientX;
  const mainCanvasY = e.clientY;
  let hoveredOverElement = false;

  for(let i = 0; i < recoilElements.length; i++){
    const element = recoilElements[i];
    if(!element.startCoordinates || !element.endCoordinates) continue;
    if(isHoveredOverElement(mainCanvasX, mainCanvasY, element)){
      hoveredOverElement = true;
    }
  }

  if(hoveredOverElement){
    mainCanvasRef.current.style.cursor = "grab";
  } else {
    mainCanvasRef.current.style.cursor = "default";
  }

}

// let initialMouseX = 0;
// let initialMouseY = 0;
// let grabbedElementIndex = -1;
// let isDragging = false;


// export function handleMouseDown(
//   e: MouseEvent,
//   mainCanvasRef: React.RefObject<HTMLCanvasElement>,
//   animationRenderCanvasRef: React.RefObject<HTMLCanvasElement>,
//   recoilElements: ElementsContainer,
//   setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
// ) {
//   e.stopPropagation();
//   const overlayForDragRect = overlayForDrag.getBoundingClientRect();
//   initialMouseX = e.clientX - overlayForDragRect.left;
//   initialMouseY = e.clientY - overlayForDragRect.top;

//   const handleCurrentlyDragging = (e: MouseEvent) => {
//     onMouseMove(e, mainCanvasRef);
//   };

//   const handleStopDragging = (e: MouseEvent) => {
//     onMouseUp(e, mainCanvasRef, setRecoilElements);
//   };

  
//   for (let i = recoilElements.length - 1; i >= 0; i--) {
//     const element = recoilElements[i];
//     if (
//       initialMouseX >= element.startCoordinates!.x - 5 &&
//       initialMouseX <= element.endCoordinates!.x + 5 &&
//       initialMouseY >= element.startCoordinates!.y - 5 &&
//       initialMouseY <= element.endCoordinates!.y + 5
//     ) {
//       isDragging = true;
//       grabbedElementIndex = i;
//       break;
//     }
//   }

//   if (!isDragging) {
//     return;
//   } else {
//     setActiveForegroundElement(recoilElements[grabbedElementIndex]);
//     overlayForDrag.style.cursor = "move";
//     setAnimationRenderContextAndTool(animationRenderCanvasRef.current!.getContext("2d")!, setRecoilElements);
//     startAnimationPreview();
//     overlayForDrag.addEventListener("mousemove", handleCurrentlyDragging);
//     overlayForDrag.addEventListener("mouseup", handleStopDragging);
//   }


//   function onMouseUp(
//     e: MouseEvent,
//     mainCanvasRef: React.RefObject<HTMLCanvasElement>,
//     setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
//   ) {
//       e.stopPropagation();
//       if (!isDragging || !mainCanvasRef.current) return;
//       console.log("finished move");
//       stopAnimationPreview();
//       isDragging = false;
//       grabbedElementIndex = -1;
//       overlayForDrag.style.display = "none";
//       mainCanvasRef.current.style.cursor = "default";
//       overlayForDrag.removeEventListener('mousemove', handleCurrentlyDragging);
//       overlayForDrag.removeEventListener('mouseup', handleStopDragging);
//       const updatedRecoilElements = [...recoilElements];
//       updatedRecoilElements[grabbedElementIndex] = {...activeForegroundElement!};
//       setRecoilElements([...updatedRecoilElements]);
  
//   }

// }



// function onMouseMove(
//   e: MouseEvent,
//   mainCanvasRef: React.RefObject<HTMLCanvasElement>,
// ) {
//   if(!activeForegroundElement) return;
//   e.stopPropagation();
//   const overlayForDragRect = overlayForDrag.getBoundingClientRect();
//   const mouseX = e.clientX - overlayForDragRect.left;
//   const mouseY = e.clientY - overlayForDragRect.top;

//   const deltaX = mouseX - initialMouseX;
//   const deltaY = mouseY - initialMouseY;
  
//   setActiveForegroundElement({
//     ...activeForegroundElement,
//     startCoordinates: {
//       x: activeForegroundElement.startCoordinates!.x + deltaX,
//       y: activeForegroundElement.startCoordinates!.y + deltaY,
//     },
//     endCoordinates: {
//       x: activeForegroundElement!.endCoordinates!.x + deltaX,
//       y: activeForegroundElement!.endCoordinates!.y + deltaY,
//     },
//   })


// }






function isHoveredOverElement(
  mainCanvasX: number,
  mainCanvasY: number,
  element: ElementTypes,
) {
  const { startCoordinates, endCoordinates } = element;
  if (!startCoordinates || !endCoordinates) return false;
  const { x: startX, y: startY } = startCoordinates;
  const { x: endX, y: endY } = endCoordinates;
  const isInsideX = mainCanvasX >= startX && mainCanvasX <= endX;
  const isInsideY = mainCanvasY >= startY && mainCanvasY <= endY;
  return isInsideX && isInsideY;
}