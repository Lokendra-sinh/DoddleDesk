import { ElementTypes, ElementsContainer } from "../../../Types/Types";
import { drawCircle } from "../../shapes/circle";
import { drawEllipse } from "../../shapes/ellipse";
import { drawRectangle } from "../../shapes/rectangle";
import { drawBiSquare } from "../../shapes/biSquare";
import { drawPencil } from "../../shapes/pencil";
import { handleResizeHandlesAndBoundingBox } from "../DynamicElements/ResizeHandlers/handleResizeHandlesAndBoundingBox";
import { setActiveInteractiveElement, setCueBallsAreVisible } from "../../interactionhelpers";




export function drawStaticElements(
    mainCanvasRef: React.RefObject<HTMLCanvasElement>,
    doddleDeskElements: ElementsContainer,
    activeCanvasElement: ElementTypes | null,
    setActiveCanvasElement: React.Dispatch<React.SetStateAction<ElementTypes | null>>,
    setIsSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>,
){
    if(!mainCanvasRef) return;
    const mainCanvasContext = mainCanvasRef.current?.getContext("2d");
    if(!mainCanvasContext) return;
    mainCanvasContext.clearRect(0, 0, mainCanvasContext.canvas.width, mainCanvasContext.canvas.height);
    let activeElementIndex = -1;

  
    doddleDeskElements.forEach((element, index) => {
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
            activeElementIndex = index;
        }
    })

    if(activeElementIndex !== -1){
        handleResizeHandlesAndBoundingBox(mainCanvasContext, mainCanvasRef, doddleDeskElements[activeElementIndex]);
        setActiveInteractiveElement(doddleDeskElements[activeElementIndex]);
        setActiveCanvasElement(doddleDeskElements[activeElementIndex]);
        setCueBallsAreVisible(true);
        setIsSidePanelOpen(true);
    }
}