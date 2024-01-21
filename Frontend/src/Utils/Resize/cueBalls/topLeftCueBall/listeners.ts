// listeners.ts
import { elementsOnCanvas, setElementsOnCanvas, activeElementId } from "../../../../Components/Board/Board";
import { ElementTypes } from "../../../../Types/Types";

export function attachListeners(
  topLeftCueBall: HTMLDivElement,
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
      startCoordinates: { x: newX, y: newY }
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
    const { x: startX, y: startY } = startCoordinates;
    const { x: endX, y: endY } = endCoordinates;
  
    // Inversion along the X-axis
    if (startX > endX) {
      startCoordinates.x = endX;
      endCoordinates.x = startX;
    }
  
    // Inversion along the Y-axis
    if (startY > endY) {
      startCoordinates.y = endY;
      endCoordinates.y = startY;
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
    overlayForDragging.style.cursor = "nw-resize";

    const rect = topLeftCueBall.getBoundingClientRect();
    offsetToCenter.x = e.clientX - rect.left - rect.width / 2;
    offsetToCenter.y = e.clientY - rect.top - rect.height / 2;

    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseup", handleMouseUp);
  };

  topLeftCueBall.addEventListener("mouseenter", () => topLeftCueBall.style.cursor = "nw-resize");
  topLeftCueBall.addEventListener("mouseleave", () => topLeftCueBall.style.cursor = "default");
  topLeftCueBall.addEventListener("mousedown", handleMouseDown);
}
