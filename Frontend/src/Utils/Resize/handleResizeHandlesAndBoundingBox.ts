import { ElementTypes } from "../../Types/Types";
import { drawCueBalls } from "./drawCueBalls";
import { updateHandlersAndBoxPosition } from "./updateHandlersAndBoxPosition";
import { showResizeHandlesAndBoundingBox } from "./showResizeHandlesAndBoundingBox";
import { 
  areListenersAttached,
  setAreListenersAttached,
  bottomLeftCueBall,
  bottomMiddleCueBall,
  bottomRightCueBall,
  leftMiddleCueBall,
  rightMiddleCueBall,
  topLeftCueBall,
  topMiddleCueBall,
  topRightCueBall,
  overlayForDrag,
  boundingBox
} from "../interactionhelpers";
import { attachBottomLeftCueBallListeners } from "./cueBalls/attachBottomLeftCueBallListeners";
import { attachBottomMiddleCueBallListeners } from "./cueBalls/attachBottomMiddleCueBallListeners";
import { attachBottomRightCueBallListeners } from "./cueBalls/attachBottomRightCueBallListeners";
import { attachLeftMiddleCueBallListeners } from "./cueBalls/attachLeftMiddleCueBallListeners";
import { attachRightMiddleCueBallListeners } from "./cueBalls/attachRightMiddleCueBallListeners";
import { attachTopLeftCueBallListeners } from "./cueBalls/attachTopLeftCueBallListeners";
import { attachTopMiddleCueBallListeners } from "./cueBalls/attachTopMiddleCueBallListeners";
import { attachTopRightCueBallListeners } from "./cueBalls/attachTopRightCueBallListeners";



const MARGIN_GAP = 5;

export function handleResizeHandlesAndBoundingBox(
  animationCanvasContextRef: CanvasRenderingContext2D,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementTypes[]>>
) {

  if(!animationCanvasContextRef) return;
  updateHandlersAndBoxPosition();
  showResizeHandlesAndBoundingBox();
  if(!areListenersAttached) {
  attachResizeListeners(animationCanvasContextRef, mainCanvasRef, setRecoilElements);
  setAreListenersAttached(true);
  }
 
}

function attachResizeListeners(
  animationRenderContext: CanvasRenderingContext2D,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementTypes[]>>
) {
  if (!animationRenderContext) return;

  attachBottomLeftCueBallListeners(bottomLeftCueBall, animationRenderContext, mainCanvasRef, setRecoilElements);
  attachBottomMiddleCueBallListeners(bottomMiddleCueBall, animationRenderContext, mainCanvasRef, setRecoilElements);
  attachBottomRightCueBallListeners(bottomRightCueBall, animationRenderContext, mainCanvasRef, setRecoilElements);
  attachLeftMiddleCueBallListeners(leftMiddleCueBall, animationRenderContext, mainCanvasRef, setRecoilElements);
  attachRightMiddleCueBallListeners(rightMiddleCueBall, animationRenderContext, mainCanvasRef, setRecoilElements);
  attachTopLeftCueBallListeners(topLeftCueBall, animationRenderContext, mainCanvasRef, setRecoilElements);
  attachTopMiddleCueBallListeners(topMiddleCueBall, animationRenderContext, mainCanvasRef, setRecoilElements);
  attachTopRightCueBallListeners(topRightCueBall, animationRenderContext, mainCanvasRef, setRecoilElements);

}