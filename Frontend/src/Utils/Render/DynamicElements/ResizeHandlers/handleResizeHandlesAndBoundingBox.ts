import { ElementTypes } from "../../../../Types/Types";
import { calculateHandlersAndBoxPosition } from "./calculateHandlersAndBoxPosition";
import { renderResizeHandlesAndBoundingBox } from "./renderResizeHandlesAndBoundingBox";


export function handleResizeHandlesAndBoundingBox(
  animationCanvasContextRef: CanvasRenderingContext2D,
  element: ElementTypes | undefined,
) {

  if(!animationCanvasContextRef) return;
  calculateHandlersAndBoxPosition(element);
  renderResizeHandlesAndBoundingBox(animationCanvasContextRef);
//   if(!areListenersAttached) {
//   attachResizeListeners(animationCanvasContextRef, mainCanvasRef, setRecoilElements);
//   setAreListenersAttached(true);
//   }
 
}