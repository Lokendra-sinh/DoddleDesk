import { ElementsContainer } from "../../../Types/Types";
import { blinkingCursorIntervalId } from "../../interactionhelpers";

let mouseDownX = 0;
let mouseDownY = 0;
let canvasRef: React.RefObject<HTMLCanvasElement> | null = null;
export function handleTextOnMouseDown(
    e: MouseEvent,
    mainCanvasRef: React.RefObject<HTMLCanvasElement>,
    setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
){

    if(!mainCanvasRef.current) return;
    const context = mainCanvasRef.current.getContext("2d");
    if(!context) return;
    const canvasRect = mainCanvasRef.current.getBoundingClientRect();
    mouseDownX = e.clientX - canvasRect.left;
    mouseDownY = e.clientY - canvasRect.top;

    if(blinkingCursorIntervalId){
        clearInterval(blinkingCursorIntervalId);
    }

    document.addEventListener("mousemove", handleTextOnMouseMove);
    document.addEventListener("mouseup", handleTextOnMouseUp);

}


function handleTextOnMouseMove(e: MouseEvent){
    if(!canvasRef?.current) return;
    const context = canvasRef.current.getContext("2d");
    if(!context) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;

    const width = Math.abs(mouseX - mouseDownX);
    const height = Math.abs(mouseY - mouseDownY);

    if(width < 5 || height < 15) return;
    
}