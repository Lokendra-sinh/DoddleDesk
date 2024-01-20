// listeners.ts
import { elementsOnCanvas, setElementsOnCanvas, activeElementId } from "../../../../Components/Board/Board";
import { ElementTypes } from "../../../../Types/Types";

export function attachListeners(
  topRightCueBall: HTMLDivElement,
  canvasRef: React.RefObject<HTMLCanvasElement>
) {
  if (!canvasRef.current) return;

  let isResizing = false;
  let offsetToCenter = { x: 0, y: 0 };
  let currentActiveElementIndex: number;
  const overlayForDragging = document.querySelector(".overlay-for-dragging") as HTMLDivElement;
  
  if (!overlayForDragging) return;

  const updateElementCoordinates = (newX: number, newY: number) => {
    const updatedElements = [...elementsOnCanvas];
    const currentElement = updatedElements[currentActiveElementIndex];
    updatedElements[currentActiveElementIndex] = {
      ...currentElement,
      endCoordinates: { ...currentElement.endCoordinates, x: newX },
      startCoordinates: { ...currentElement.startCoordinates, y: newY }
    };
    setElementsOnCanvas(updatedElements);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !canvasRef.current) return;
    const newX = e.clientX - canvasRef.current.offsetLeft - offsetToCenter.x;
    const newY = e.clientY - canvasRef.current.offsetTop - offsetToCenter.y;
    updateElementCoordinates(newX, newY);
  };

  const handleInversion = (currentElement: ElementTypes) => {
    const { startCoordinates, endCoordinates } = currentElement;
    //inversion along the X-axis
    if (startCoordinates.x > endCoordinates.x) {
      [startCoordinates.x, endCoordinates.x] = [endCoordinates.x, startCoordinates.x];
    }
  
    // Inversion along the Y-axis
    if (startCoordinates.y > endCoordinates.y) {
      [startCoordinates.y, endCoordinates.y] = [endCoordinates.y, startCoordinates.y];
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
    overlayForDragging.style.cursor = "ne-resize";

    const rect = topRightCueBall.getBoundingClientRect();
    offsetToCenter.x = e.clientX - rect.left - rect.width / 2;
    offsetToCenter.y = e.clientY - rect.top - rect.height / 2;

    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseup", handleMouseUp);
  };

  topRightCueBall.addEventListener("mouseenter", () => topRightCueBall.style.cursor = "ne-resize");
  topRightCueBall.addEventListener("mouseleave", () => topRightCueBall.style.cursor = "default");
  topRightCueBall.addEventListener("mousedown", handleMouseDown);
}
