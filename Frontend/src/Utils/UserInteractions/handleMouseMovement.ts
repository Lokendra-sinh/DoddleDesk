import { ElementsContainer, ElementTypes } from "../../Types/Types";
import { elementsOnCanvas, overlayForDrag } from "../../Components/Board/Board";


export function handleMouseMovement(
  e: MouseEvent,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
  currentActiveElement: ElementTypes | undefined,
) {
  if (!canvasRef.current) return;
  if (!currentActiveElement) return;
  let insideBoundaryBox = false;

  const canvasRect = canvasRef.current.getBoundingClientRect();
  const mouseX = e.clientX - canvasRect.left;
  const mouseY = e.clientY - canvasRect.top;

  elementsOnCanvas.forEach((element) => {
    const updateCursorStyle = isMouseInsideBoundaryBox(
        mouseX,
        mouseY,
        element.startCoordinates.x,
        element.startCoordinates.y,
        element.endCoordinates.x,
        element.endCoordinates.y
        );
    if (updateCursorStyle) insideBoundaryBox = true;

});

    if(insideBoundaryBox) {
    overlayForDrag.style.display = "block";
  overlayForDrag.style.cursor = "move";
} else {
    overlayForDrag.style.display = "none";
    overlayForDrag.style.cursor = "default";
}
insideBoundaryBox = false;
}


const isMouseInsideBoundaryBox = (
    mouseX: number,
    mouseY: number,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    return (
      mouseX >= startX &&
      mouseX <= endX &&
      mouseY >= startY &&
      mouseY <= endY
    );
  };