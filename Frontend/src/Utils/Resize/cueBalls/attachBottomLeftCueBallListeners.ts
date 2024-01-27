
import { over } from "lodash";
import { ElementsContainer } from "../../../Types/Types";
import { activeInteractiveElement, setActiveInteractiveElement, overlayForDrag, setCanvasElements, canvasElements } from "../../interactionhelpers";
import { setAnimationRenderContextAndTool, startAnimationPreview, stopAnimationPreview } from "../../UserInteractions/drawPreviewOnAnimationLayer";


let isResizing = false;
let animationStarted = false;
let offsetToCenter = { x: 0, y: 0 };
let activeElementIndex = -1;

export function attachBottomLeftCueBallListeners(
  bottomLeftCueBall: HTMLDivElement,
  animationRenderCanvasContext: CanvasRenderingContext2D,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) {
  if (!animationRenderCanvasContext) return;

  const updateElementCoordinates = (newX: number, newY: number) => {
   if(!activeInteractiveElement) return;
    const updatedElement = {
        ...activeInteractiveElement,
        startCoordinates: { x: newX, y: activeInteractiveElement.startCoordinates!.y },
        endCoordinates: { x: activeInteractiveElement.endCoordinates!.x, y: newY },
    };
    setActiveInteractiveElement(updatedElement);
    canvasElements[activeElementIndex] = updatedElement;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !animationRenderCanvasContext) return;
    if(!animationStarted) {
      setAnimationRenderContextAndTool(animationRenderCanvasContext, mainCanvasRef, setRecoilElements);
      startAnimationPreview();
      animationStarted = true;
    }
    const canvasRect = animationRenderCanvasContext.canvas.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - offsetToCenter.x;
    const newY = e.clientY - canvasRect.top - offsetToCenter.y;
    updateElementCoordinates(newX, newY);
  };

  const handleInversion = () => {
    const { startCoordinates, endCoordinates } = activeInteractiveElement!;
    if (!startCoordinates || !endCoordinates) return;
    if(startCoordinates.x > endCoordinates.x) {
      const updatedElement = {
        ...activeInteractiveElement!,
        startCoordinates: { x: endCoordinates.x, y: startCoordinates.y },
        endCoordinates: { x: startCoordinates.x, y: endCoordinates.y },
      };
      setActiveInteractiveElement(updatedElement);
      canvasElements[activeElementIndex] = updatedElement;
    } 

    if(startCoordinates.y > endCoordinates.y) {
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
    if(!isResizing || !animationRenderCanvasContext) return;
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
    if (!animationRenderCanvasContext || !activeInteractiveElement) return;
    activeElementIndex = canvasElements.findIndex(element => element.id === activeInteractiveElement!.id);
    if(activeElementIndex === -1){
      console.error("Could not find active element in canvas elements array");
      return;
    }
    isResizing = true;
    overlayForDrag.style.display = "block";
    overlayForDrag.style.cursor = "sw-resize";

    const rect = bottomLeftCueBall.getBoundingClientRect();
    offsetToCenter.x = e.clientX - rect.left - rect.width / 2;
    offsetToCenter.y = e.clientY - rect.top - rect.height / 2;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  bottomLeftCueBall.addEventListener("mouseenter", () => bottomLeftCueBall.style.cursor = "sw-resize");
  bottomLeftCueBall.addEventListener("mouseleave", () => bottomLeftCueBall.style.cursor = "default");
  bottomLeftCueBall.addEventListener("mousedown", handleMouseDown);
}