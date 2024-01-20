// listeners.ts
import { elementsOnCanvas, setElementsOnCanvas, activeElementId } from "../../../../Components/Board/Board";
import { ElementTypes } from "../../../../Types/Types";

export function attachListeners(
  leftMiddleCueBall: HTMLDivElement,
  canvasRef: React.RefObject<HTMLCanvasElement>
) {
  if (!canvasRef.current) return;

  let isResizing = false;
  let offsetToCenter = { x: 0, y: 0 };
  let currentActiveElementIndex: number;
  const overlayForDragging = document.querySelector(".overlay-for-dragging") as HTMLDivElement;

  if (!overlayForDragging) return;

  const updateElementCoordinates = (newX: number) => {
    const updatedElements = [...elementsOnCanvas];
    const currentElement = updatedElements[currentActiveElementIndex];
    updatedElements[currentActiveElementIndex] = {
      ...currentElement,
      startCoordinates: { ...currentElement.startCoordinates, x: newX }
    };
    setElementsOnCanvas(updatedElements);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !canvasRef.current) return;
    const newX = e.clientX - canvasRef.current.offsetLeft - offsetToCenter.x;
    updateElementCoordinates(newX);
  };

  const handleInversion = (currentElement: ElementTypes) => {
    const { startCoordinates, endCoordinates } = currentElement;
    if (startCoordinates.x > endCoordinates.x) {
      [startCoordinates.x, endCoordinates.x] = [endCoordinates.x, startCoordinates.x];
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
    overlayForDragging.style.cursor = "e-resize";

    const rect = leftMiddleCueBall.getBoundingClientRect();
    offsetToCenter.x = e.clientX - rect.left - rect.width / 2;

    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseup", handleMouseUp);
  };

  leftMiddleCueBall.addEventListener("mouseenter", () => leftMiddleCueBall.style.cursor = "e-resize");
  leftMiddleCueBall.addEventListener("mouseleave", () => leftMiddleCueBall.style.cursor = "default");
  leftMiddleCueBall.addEventListener("mousedown", handleMouseDown);
}
