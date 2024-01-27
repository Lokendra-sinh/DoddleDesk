import { ElementsContainer } from "../../../Types/Types";
import { drawCircle } from "../../shapes/circle";
import { drawEllipse } from "../../shapes/ellipse";
import { drawRectangle } from "../../shapes/rectangle";
import { drawBiSquare } from "../../shapes/biSquare";
import { drawPencil } from "../../shapes/pencil";
import { handleResizeHandlesAndBoundingBox } from "../DynamicElements/ResizeHandlers/handleResizeHandlesAndBoundingBox";
import { setActiveInteractiveElement, canvasElements } from "../../interactionhelpers";


export function drawStaticElements(
    mainCanvasRef: React.RefObject<HTMLCanvasElement>,
    recoilElements: ElementsContainer,
){
    if(!mainCanvasRef) return;
    const mainCanvasContext = mainCanvasRef.current?.getContext("2d");
    if(!mainCanvasContext) return;
    mainCanvasContext.clearRect(0, 0, mainCanvasContext.canvas.width, mainCanvasContext.canvas.height);
  
    console.log("recoilElements in drawStaticElements: ", recoilElements);
    console.log("canvasElements inside drawStaticElements: ", canvasElements);
  
    recoilElements.forEach(element => {
        if(element.type === "text") return;

        switch(element.type) {
            case "circle":
                drawCircle(mainCanvasContext, element);
                break;
            case "ellipse":
                drawEllipse(mainCanvasContext, element);
                break;
            case "rectangle":
                drawRectangle(mainCanvasContext, element);
                break;
            case "biSquare":
                drawBiSquare(mainCanvasContext, element);
                break;
            case "pencil":
                drawPencil(mainCanvasContext, element);
                break;
            case "text":
                break;
        }

        if(element.isActive) {
            setActiveInteractiveElement(element);
            handleResizeHandlesAndBoundingBox(mainCanvasContext, mainCanvasRef, element);
        }
    })
}