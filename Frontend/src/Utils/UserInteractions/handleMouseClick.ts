import { ElementsContainer} from "../../Types/Types";
import {
    elementsOnCanvas,
    setActiveElementIndex,
  } from "../../Components/Board/Board";

  type SetActiveElementIdType = (id: string) => void;

export const handleMouseClick = (
    e: MouseEvent,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    setActiveElementId: SetActiveElementIdType,
    setSelectedTool: React.Dispatch<React.SetStateAction<string>>,
    setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
  ) => {
    console.log("inside handleClick");
    if (!canvasRef.current) return;
    e.stopPropagation();
    let clickedOnElement = false;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const clickedX = e.clientX - canvasRect.left;
    const clickedY = e.clientY - canvasRect.top;
  
  
    for (let i = 0; i < elementsOnCanvas.length; i++) {
      const { startCoordinates, endCoordinates } = elementsOnCanvas[i];
      const { x: startX, y: startY } = startCoordinates;
      const { x: endX, y: endY } = endCoordinates;
      if (
        clickedX >= startX &&
        clickedX <= endX &&
        clickedY >= startY &&
        clickedY <= endY
      ) {
        setActiveElementId(elementsOnCanvas[i].id);
        setActiveElementIndex(i);
        clickedOnElement = true;
        break;
      }
    }

    if (!clickedOnElement) {
      console.log("no element was clicked");
      // Reset active element only if no element is clicked
      setActiveElementId("");
      setActiveElementIndex(-1);
      setRecoilElements((prev) => [...prev]);
    }
  };