import { globalCursorStyle, activeInteractiveElement, canvasElements, overlayForDrag } from "../../interactionhelpers";
import { ElementsContainer, ElementTypes } from "../../../Types/Types";
import { startAnimationPreview, stopAnimationPreview } from "../../Render/DynamicElements/handleSelectedShapeAnimation";
import cloneDeep from 'lodash/cloneDeep';

let activeElementIndex: number = -1;
let mouseDownX: number = 0;
let mouseDownY: number = 0;
let offSetX: number = 0;
let offSetY: number = 0;
let setNewRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>;
let canvasRef: React.RefObject<HTMLCanvasElement>;
let inversionDone: boolean = false;

export function handleResizeOperation(
    x: number,
    y: number,
    mainCanvasRef: React.RefObject<HTMLCanvasElement>,
    setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
){

    if (!mainCanvasRef.current || !activeInteractiveElement) return;
    console.log("handleResizeOperation cursorStyle: ", globalCursorStyle);
    activeElementIndex = canvasElements.findIndex(Element => Element.id === activeInteractiveElement!.id);
    if(activeElementIndex === -1) return;
    mouseDownX = x;
    mouseDownY = y;
    setNewRecoilElements = setRecoilElements;
    canvasRef = mainCanvasRef;
    console.log("canvasElements before resize: ", canvasElements[activeElementIndex]);
    calculateInitialOffset();
    console.log("canvasElements after initial offset: ", canvasElements[activeElementIndex]);
    console.log("fuck reached here and going to start animation")
    startAnimationPreview();
    console.log("animation started");
    overlayForDrag.style.display = "block"
    overlayForDrag.style.cursor = globalCursorStyle;
    overlayForDrag.addEventListener("mousemove", handleMouseMove);
    overlayForDrag.addEventListener("mouseup", handleMouseUp);

    function handleMouseUp(e: MouseEvent){
        console.log("resize finished inside mouseup")
        e.stopPropagation();
        stopAnimationPreview();
        overlayForDrag.style.display = "none";
        overlayForDrag.removeEventListener("mousemove", handleMouseMove);
        overlayForDrag.removeEventListener("mouseup", handleMouseUp);
        const invertedElement = handleElementInversion(canvasElements[activeElementIndex]);
        canvasElements[activeElementIndex] = invertedElement;
        mouseDownX = 0;
        mouseDownY = 0;
        offSetX = 0;
        offSetY = 0;
        activeElementIndex = -1;
        setNewRecoilElements([...canvasElements]);
    }
}


function handleMouseMove(e: MouseEvent){
    console.log("overlay mousemove")
    e.stopPropagation();
    if (!canvasRef.current || !activeInteractiveElement) return;
    console.log("currently resizing: ", globalCursorStyle);
    const mainCanvasRect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - mainCanvasRect.left;
    const mouseY = e.clientY - mainCanvasRect.top;
    console.log("move mouseX: ", mouseX);
    console.log("move mouseY: ", mouseY);
    const activeElement = cloneDeep(canvasElements[activeElementIndex]);

    switch(globalCursorStyle){
        case "nw-resize":
            activeElement.startCoordinates!.x = mouseX - offSetX;
            activeElement.startCoordinates!.y = mouseY - offSetY;
            break;
        case "n-resize":
            activeElement.startCoordinates!.y = mouseY - offSetY;
            break;
        case "ne-resize":
            activeElement.endCoordinates!.x = mouseX - offSetX;
            activeElement.startCoordinates!.y = mouseY - offSetY;
            break;
        case "w-resize":
            activeElement.startCoordinates!.x = mouseX - offSetX;
            break;
        case "e-resize":
            activeElement.endCoordinates!.x = mouseX - offSetX;
            break;
        case "sw-resize":
            activeElement.startCoordinates!.x = mouseX - offSetX;
            activeElement.endCoordinates!.y = mouseY - offSetY;
            break;
        case "s-resize":
            activeElement.endCoordinates!.y = mouseY - offSetY;
            break;
        case "se-resize":
            activeElement.endCoordinates!.x = mouseX - offSetX;
            activeElement.endCoordinates!.y = mouseY - offSetY;
            break;
    }

   
    canvasElements[activeElementIndex] = cloneDeep(activeElement);
    console.log("pakda gaya resize: ", canvasElements[activeElementIndex]);
};


function calculateInitialOffset(){
    const activeElement = canvasElements[activeElementIndex];
    const { x: startX, y: startY} = activeElement.startCoordinates!;
    const { x: endX, y: endY } = activeElement.endCoordinates!;
    
    switch(globalCursorStyle){
        case "nw-resize":
            offSetX = mouseDownX - startX;
            offSetY = mouseDownY - startY;
            break;
        case "n-resize":
            offSetX = 0;
            offSetY = mouseDownY - startY;
            break;
        case "ne-resize":
            offSetX = mouseDownX - endX;
            offSetY = mouseDownY - startY;
            break;
        case "w-resize":
            offSetX = mouseDownX - startX;
            offSetY = 0;
            break;
        case "e-resize":
            offSetX = mouseDownX - endX;
            offSetY = 0;
            break;
        case "sw-resize":
            offSetX = mouseDownX - startX;
            offSetY = mouseDownY - endY;
            break;
        case "s-resize":
            offSetX = 0;
            offSetY = mouseDownY - endY;
            break;
        case "se-resize":
            offSetX = mouseDownX - endX;
            offSetY = mouseDownY - endY;
            break;
    }
}

function updateElementForInitialOffset(){

    const activeElement = cloneDeep(canvasElements[activeElementIndex]);
    const { x: startX, y: startY} = activeElement.startCoordinates!;
    const { x: endX, y: endY } = activeElement.endCoordinates!;

    switch(globalCursorStyle){
        case "nw-resize":
            activeElement.startCoordinates!.x = startX + offSetX;
            activeElement.startCoordinates!.y = startY + offSetY;
            break;
        case "n-resize":
            activeElement.startCoordinates!.y = startY + offSetY;
            break;
        case "ne-resize":
            activeElement.endCoordinates!.x = endX + offSetX;
            activeElement.startCoordinates!.y = startY + offSetY;
            break;
        case "w-resize":
            activeElement.startCoordinates!.x = startX + offSetX;
            break;
        case "e-resize":
            activeElement.endCoordinates!.x = endX + offSetX;
            break;
        case "sw-resize":
            activeElement.startCoordinates!.x = startX + offSetX;
            activeElement.endCoordinates!.y = endY + offSetY;
            break;
        case "s-resize":
            activeElement.endCoordinates!.y = endY + offSetY;
            break;
        case "se-resize":
            activeElement.endCoordinates!.x = endX + offSetX;
            activeElement.endCoordinates!.y = endY + offSetY;
            break;
    }

    canvasElements[activeElementIndex] = activeElement;
    // setNewRecoilElements(canvasElements);
}


function handleElementInversion(element: ElementTypes){
    const activeElement = cloneDeep(element);
    const { x: startX, y: startY} = activeElement.startCoordinates!;
    const { x: endX, y: endY } = activeElement.endCoordinates!;

    switch(globalCursorStyle){
        case "nw-resize":
            if(startX >= endX){
                let temp = startX;
                activeElement.startCoordinates!.x = endX;
                activeElement.endCoordinates!.x = temp;
            }
            if(startY >= endY){
                let temp = startY;
                activeElement.startCoordinates!.y = endY;
                activeElement.endCoordinates!.y = temp;
            }
            break;
        case "n-resize":
            if(startY >= endY){
                let temp = startY;
                activeElement.startCoordinates!.y = endY;
                activeElement.endCoordinates!.y = temp;
            }
            break;
        case "ne-resize":
            if(endX <= startX){
                let temp = startX;
                activeElement.startCoordinates!.x = endX;
                activeElement.endCoordinates!.x = temp;
            }
            if(startY >= endY){
                let temp = startY;
                activeElement.startCoordinates!.y = endY;
                activeElement.endCoordinates!.y = temp;
            }
            break;
        case "w-resize":
            if(startX >= endX){
                let temp = startX;
                activeElement.startCoordinates!.x = endX;
                activeElement.endCoordinates!.x = temp;
            }
            break;
        case "e-resize":
            if(endX <= startX){
                let temp = startX;
                activeElement.startCoordinates!.x = endX;
                activeElement.endCoordinates!.x = temp;
            }
            break;
        case "sw-resize":
            if(startX >= endX){
                let temp = startX;
                activeElement.startCoordinates!.x = endX;
                activeElement.endCoordinates!.x = temp;
            }
            if(startY >= endY){
                let temp = startY;
                activeElement.startCoordinates!.y = endY;
                activeElement.endCoordinates!.y = temp;
            }
            break;
        case "s-resize":
            if(endY <= startY){
                let temp = startY;
                activeElement.startCoordinates!.y = endY;
                activeElement.endCoordinates!.y = temp;
            }
            break;
        case "se-resize":
            if(endX <= startX){
                let temp = startX;
                activeElement.startCoordinates!.x = endX;
                activeElement.endCoordinates!.x = temp;
            }
            if(endY <= startY){
                let temp = startY;
                activeElement.startCoordinates!.y = endY;
                activeElement.endCoordinates!.y = temp;
            }
            break;
    } 

   return activeElement;

}

