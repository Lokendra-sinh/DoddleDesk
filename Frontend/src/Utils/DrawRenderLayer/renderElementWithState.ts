import { ElementTypes, ElementsContainer } from "../../Types/Types";
import { activeInteractiveElement, setActiveInteractiveElement } from "../interactionhelpers";
import { drawCircle } from "../shapes/circle";
import { drawEllipse } from "../shapes/ellipse";
import { drawRectangle } from "../shapes/rectangle";
import { drawBiSquare } from "../shapes/biSquare";
import { drawPencil } from "../shapes/pencil";
import { handleResizeHandlesAndBoundingBox } from "../Resize/handleResizeHandlesAndBoundingBox";

export function renderElementWithState(
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  recoilElements: ElementsContainer,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) {
  if (!mainCanvasRef.current) return;
  const mainCanvasContext = mainCanvasRef.current.getContext("2d");
  if (!mainCanvasContext) return;
  if (recoilElements.length === 0) return;
  mainCanvasContext.clearRect(
    0,
    0,
    mainCanvasContext.canvas.width,
    mainCanvasContext.canvas.height
  );

  for (let i = 0; i < recoilElements.length; i++) {
    if (recoilElements[i].isActive) {
      setActiveInteractiveElement({...recoilElements[i]});
      console.log("active interactive element set is:", activeInteractiveElement);
      handleResizeHandlesAndBoundingBox(mainCanvasContext, mainCanvasRef, setRecoilElements);
    }
    renderElements(recoilElements[i], mainCanvasContext);
  }
}

function renderElements(
  element: ElementTypes,
  mainCanvasContext: CanvasRenderingContext2D
) {
  switch (element.type) {
    case "circle":
      return drawCircle(mainCanvasContext, element);
    case "ellipse":
      return drawEllipse(mainCanvasContext, element);
    case "rectangle":
      return drawRectangle(mainCanvasContext, element);
    case "biSquare":
      return drawBiSquare(mainCanvasContext, element);
    case "pencil":
      return drawPencil(mainCanvasContext, element);
    case "text":
      break;
  }
}
