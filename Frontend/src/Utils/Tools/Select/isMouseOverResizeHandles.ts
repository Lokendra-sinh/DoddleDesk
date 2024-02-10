import { cueBallProperties, BALL_RADIUS, setCurrentCursorStyle } from "../../interactionhelpers";
import { ElementTypes, ElementsContainer } from "../../../Types/Types";

export function isMouseOverResizeHandles(
  x: number,
  y: number,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  activeElement: ElementTypes,
  doddleDeskElements: ElementsContainer,
  setDoddleDeskElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
): boolean {
  if (!mainCanvasRef.current) return false;

  const mainCanvasContext = mainCanvasRef.current.getContext("2d");
  if (!mainCanvasContext) return false;


  const {topLeft, topRight, bottomLeft, bottomRight, topMiddle, bottomMiddle, leftMiddle, rightMiddle} = cueBallProperties;


    if (isMouseInsideCueBall(x, y, topLeft)) {
        setCurrentCursorStyle("nw-resize");
        mainCanvasRef.current.style.cursor = "nw-resize";
        return true;
    }

    if (isMouseInsideCueBall(x, y, topMiddle)) {
        setCurrentCursorStyle("n-resize");
        mainCanvasRef.current.style.cursor = "n-resize";
        return true;
    }

    if (isMouseInsideCueBall(x, y, topRight)) {
        setCurrentCursorStyle("ne-resize");
        mainCanvasRef.current.style.cursor = "ne-resize";
        return true;
    }

    if (isMouseInsideCueBall(x, y, leftMiddle)) {
        setCurrentCursorStyle("w-resize");
        mainCanvasRef.current.style.cursor = "w-resize";
        return true;
    }

    if (isMouseInsideCueBall(x, y, rightMiddle)) {
        setCurrentCursorStyle("e-resize");
        mainCanvasRef.current.style.cursor = "e-resize";
        return true;
    }

    if (isMouseInsideCueBall(x, y, bottomLeft)) {
        setCurrentCursorStyle("sw-resize");
        mainCanvasRef.current.style.cursor = "sw-resize";
        return true;
    }

    if (isMouseInsideCueBall(x, y, bottomMiddle)) {
        setCurrentCursorStyle("s-resize");
        mainCanvasRef.current.style.cursor = "s-resize";
        return true;
    }

    if (isMouseInsideCueBall(x, y, bottomRight)) {
        setCurrentCursorStyle("se-resize");
        mainCanvasRef.current.style.cursor = "se-resize";
        return true;
    }
    
    setCurrentCursorStyle("default");
    mainCanvasRef.current.style.cursor = "default";
    return false;
}

function isMouseInsideCueBall(x: number, y: number, cueBall: {x: number, y:number}): boolean {

    //check if mouse is inside any cueball use the distance formula
    const distance = Math.sqrt((x - cueBall.x) ** 2 + (y - cueBall.y) ** 2);
    return distance <= BALL_RADIUS;

}