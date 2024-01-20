// listeners.ts
import { elementsOnCanvas, setElementsOnCanvas, activeElementId } from "../../../../Components/Board/Board";
import { ElementTypes } from "../../../../Types/Types";

export function attachListeners(
  topMiddleCueBall: HTMLDivElement,
  canvasRef: React.RefObject<HTMLCanvasElement>
) {
  if (!canvasRef.current) return;

  let isResizing = false;
  let offsetToCenter = { x: 0, y: 0 };
  let currentActiveElementIndex: number;
  const overlayForDragging = document.querySelector(".overlay-for-dragging") as HTMLDivElement;
  
  if (!overlayForDragging) return;

  const updateElementCoordinates = (newY: number) => {
    const updatedElements = [...elementsOnCanvas];
    const currentElement = updatedElements[currentActiveElementIndex];
    updatedElements[currentActiveElementIndex] = {
      ...currentElement,
      startCoordinates: { ...currentElement.startCoordinates, y: newY }
    };
    setElementsOnCanvas(updatedElements);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !canvasRef.current) return;
    const newY = e.clientY - canvasRef.current.offsetTop - offsetToCenter.y;
    updateElementCoordinates(newY);
  };

  const handleInversion = (currentElement: ElementTypes) => {
    if (currentElement.startCoordinates.y > currentElement.endCoordinates.y) {
      [currentElement.startCoordinates.y, currentElement.endCoordinates.y] = 
        [currentElement.endCoordinates.y, currentElement.startCoordinates.y];
    }
  };

  const handleMouseUp = () => {
    isResizing = false;
    overlayForDragging.style.display = "none";
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    const currentElement = elementsOnCanvas[currentActiveElementIndex];
    handleInversion(currentElement);
    setElementsOnCanvas([...elementsOnCanvas]);
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!canvasRef.current) return;
    isResizing = true;
    currentActiveElementIndex = elementsOnCanvas.findIndex(element => element.id === activeElementId);
    overlayForDragging.style.display = "block";
    overlayForDragging.style.cursor = "s-resize";

    const rect = topMiddleCueBall.getBoundingClientRect();
    offsetToCenter.y = e.clientY - rect.top - rect.height / 2;

    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseup", handleMouseUp);
  };

  topMiddleCueBall.addEventListener("mouseenter", () => topMiddleCueBall.style.cursor = "s-resize");
  topMiddleCueBall.addEventListener("mouseleave", () => topMiddleCueBall.style.cursor = "default");
  topMiddleCueBall.addEventListener("mousedown", handleMouseDown);
}
