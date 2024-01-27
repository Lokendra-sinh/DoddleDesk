import { set } from "lodash";
import { ElementsContainer, ElementTypes } from "../../Types/Types";
import { handleResizeHandlesAndBoundingBox } from "../Resize/handleResizeHandlesAndBoundingBox";
import {
  activeInteractiveElement,
  setActiveInteractiveElement,
} from "../interactionhelpers";
import { setAnimationRenderContextAndTool, startAnimationPreview, stopAnimationPreview } from "./drawPreviewOnAnimationLayer";

let initialMouseX = 0;
let initialMouseY = 0;
let grabbedElementIndex = -1;
let isDragging = false;

export function handleActiveElementOperations(
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
  const mainCanvasRect = mainCanvasRef.current.getBoundingClientRect();
  initialMouseX = e.clientX - mainCanvasRect.left;
  initialMouseY = e.clientY - mainCanvasRect.top;

  if (
    !checkIfMouseDownInsideElement(initialMouseX, initialMouseY, recoilElements)
  ) {
    initialMouseX = 0;
    initialMouseY = 0;
    return;
  }
  
  mainCanvasRef.current.style.cursor = "move";
  setActiveInteractiveElement({
    ...recoilElements[grabbedElementIndex],
    isActive: true,
  });
  setAnimationRenderContextAndTool(animationRenderCanvasRef.current.getContext("2d")!, setRecoilElements);
  startAnimationPreview();

  const onMouseMove = (e: MouseEvent) => {
    dragElement(e, mainCanvasRef, recoilElements, setRecoilElements);
  };

  const onMouseUp = (e: MouseEvent) => {
    e.stopPropagation();
    stopAnimationPreview();
    if (!mainCanvasRef.current || !activeInteractiveElement) return;
    mainCanvasRef.current.removeEventListener("mousemove", onMouseMove);
    mainCanvasRef.current.removeEventListener("mouseup", onMouseUp);
    isDragging = false;
    grabbedElementIndex = -1;
    initialMouseX = 0;
    initialMouseY = 0;

    const updatedRecoilElements = recoilElements.map((element) => {
        if (element.id === activeInteractiveElement!.id) {
          const updatedElement = {...activeInteractiveElement!};
          return updatedElement;
        }

        return element;
    })

    setRecoilElements(updatedRecoilElements);

  };

  mainCanvasRef.current.addEventListener("mousemove", onMouseMove);
  mainCanvasRef.current.addEventListener("mouseup", onMouseUp);
}

function dragElement(
  e: MouseEvent,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  recoilElements: ElementsContainer,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) {
  if(!mainCanvasRef.current || !activeInteractiveElement) return;
  const mainCanvasRect = mainCanvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - mainCanvasRect.left;
    const mouseY = e.clientY - mainCanvasRect.top;

  const deltaX = mouseX - initialMouseX;
  const deltaY = mouseY - initialMouseY;

  setActiveInteractiveElement({
    ...activeInteractiveElement,
    startCoordinates: {
      x: activeInteractiveElement.startCoordinates!.x + deltaX,
      y: activeInteractiveElement.startCoordinates!.y + deltaY,
    },
    endCoordinates: {
      x: activeInteractiveElement!.endCoordinates!.x + deltaX,
      y: activeInteractiveElement!.endCoordinates!.y + deltaY,
    },
  });

  initialMouseX = mouseX;
  initialMouseY = mouseY;

  e.stopPropagation();
}



function checkIfMouseDownInsideElement(
  mouseDownX: number,
  mouseDownY: number,
  recoilElements: ElementsContainer
) {
  for (let i = 0; i < recoilElements.length; i++) {
    const element = recoilElements[i];
    if (!element.startCoordinates || !element.endCoordinates) continue;
    if (
      mouseDownX >= element.startCoordinates.x &&
      mouseDownX <= element.endCoordinates.x &&
      mouseDownY >= element.startCoordinates.y &&
      mouseDownY <= element.endCoordinates.y
    ) {
      grabbedElementIndex = i;
      return true;
    }
  }

  return false;
}
