import { activeInteractiveElement, setActiveInteractiveElement, overlayForDrag, canvasElements } from "../../interactionhelpers";
import { ElementsContainer } from "../../../Types/Types";
import {
  setAnimationRenderContextAndTool,
  startAnimationPreview,
  stopAnimationPreview,
} from "../../UserInteractions/drawPreviewOnAnimationLayer";

let isResizing = false;
let animationStarted = false;
let offsetToCenter = { x: 0, y: 0 };
let activeElementIndex = -1;

export function attachTopLeftCueBallListeners(
  topLeftCueBall: HTMLDivElement,
  mainCanvasContext: CanvasRenderingContext2D,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) {
  if (!mainCanvasRef || !mainCanvasContext) return;
  const updateElementCoordinates = (newX: number, newY: number) => {
    if (!activeInteractiveElement) return;
    const updatedElement = {
      ...activeInteractiveElement,
      startCoordinates: {
        x: newX,
        y: newY,
      },
    };
    setActiveInteractiveElement(updatedElement);
    canvasElements[activeElementIndex] = updatedElement;
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !mainCanvasContext) return;
    if(!animationStarted) {
      setAnimationRenderContextAndTool(mainCanvasContext, mainCanvasRef, setRecoilElements);
      startAnimationPreview();
      animationStarted = true;
    }
    const canvasRect = mainCanvasContext.canvas.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - offsetToCenter.x;
    const newY = e.clientY - canvasRect.top - offsetToCenter.y;
    updateElementCoordinates(newX, newY);
  };

  const handleInversion = () => {
    const { startCoordinates, endCoordinates } = activeInteractiveElement!;
    if (!startCoordinates || !endCoordinates) return;

    if (startCoordinates.x > endCoordinates.x) {
      const updatedElement = {
        ...activeInteractiveElement!,
        startCoordinates: { x: endCoordinates.x, y: startCoordinates.y },
        endCoordinates: { x: startCoordinates.x, y: endCoordinates.y },
      };
      setActiveInteractiveElement(updatedElement);
      canvasElements[activeElementIndex] = updatedElement;
    }

    if (startCoordinates.y > endCoordinates.y) {
      const updatedElement = {
        ...activeInteractiveElement!,
        startCoordinates: { x: startCoordinates.x, y: endCoordinates.y },
        endCoordinates: { x: endCoordinates.x, y: startCoordinates.y },
      };
      setActiveInteractiveElement(updatedElement);
      canvasElements[activeElementIndex] = updatedElement;
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.stopPropagation();
    if(!isResizing || !mainCanvasContext) return;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    overlayForDrag.style.display = "none";
    handleInversion();
    isResizing = false;
    animationStarted = false;
    activeElementIndex = -1;
    offsetToCenter = { x: 0, y: 0 };
    stopAnimationPreview();
    setActiveInteractiveElement({ ...activeInteractiveElement!});
    setRecoilElements(() => [...canvasElements]);
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.stopPropagation();
    if (!mainCanvasRef || !activeInteractiveElement) return;
    activeElementIndex = canvasElements.findIndex(element => element.id === activeInteractiveElement!.id);
    if(activeElementIndex === -1) return;
    isResizing = true;

    overlayForDrag.style.display = "block";
    overlayForDrag.style.cursor = "nw-resize";

    const rect = topLeftCueBall.getBoundingClientRect();
    offsetToCenter.x = e.clientX - rect.left - rect.width / 2;
    offsetToCenter.y = e.clientY - rect.top - rect.height / 2;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  topLeftCueBall.addEventListener(
    "mouseenter",
    () => (
      console.log("topLeftCueBall mouse enter"),
      topLeftCueBall.style.cursor = "nw-resize")
  );
  // topLeftCueBall.addEventListener(
  //   "mouseleave",
  //   () => (topLeftCueBall.style.cursor = "default")
  // );
  topLeftCueBall.addEventListener("mousedown", handleMouseDown);
}
