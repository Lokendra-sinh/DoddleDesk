import { ElementsContainer } from "../../../Types/Types";
import { canvasElements, eraserFadeTrailPoints, setCanvasElements } from "../../interactionhelpers";
import { startAnimationPreview, stopAnimationPreview } from "../../Render/DynamicElements/handleSelectedShapeAnimation";
import { cloneDeep, throttle } from "lodash";

let mouseDownX: number = 0;
let mouseDownY: number = 0;
let canvasRef: React.RefObject<HTMLCanvasElement>;
let isErasing: boolean = false;
let isAnimationStarted: boolean = false;


export function handleEraserOperation(
  e: MouseEvent,
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
) {
  e.stopPropagation();
  e.preventDefault();
  if (!mainCanvasRef.current) return;
  console.log("initiating erasing operation");
    canvasRef = mainCanvasRef;
    const mainCanvasRect = mainCanvasRef.current.getBoundingClientRect();
    mouseDownX = e.clientX - mainCanvasRect.left;
    mouseDownY = e.clientY - mainCanvasRect.top;
    isErasing = true;
    eraserFadeTrailPoints.push({x: mouseDownX, y: mouseDownY, drawnTime: Date.now()});
    const throttledMouseMove = throttle(onMouseMove, 10);
    document.addEventListener("mousemove", throttledMouseMove);
    document.addEventListener("mouseup", onMouseUp);


    function onMouseUp(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        console.log("mouse up when erasing");
        if (!isErasing || !isAnimationStarted) return;
        stopAnimationPreview();
        eraserFadeTrailPoints.length = 0;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        isErasing = false;
        isAnimationStarted = false;

        //erase the elements 

        deleteElementsToBeErased();
        console.log("after deletion: ", canvasElements);
        setRecoilElements(() => [...canvasElements]);
        }
  
}



function onMouseMove(e: MouseEvent) {
  e.stopPropagation();
  if (!isErasing) return;
  const currentCanvasRect = canvasRef.current!.getBoundingClientRect();
  const mainCanvasX = e.clientX - currentCanvasRect.left;
  const mainCanvasY = e.clientY - currentCanvasRect.top;
  eraserFadeTrailPoints.push({ x: mainCanvasX, y: mainCanvasY, drawnTime: Date.now()});
  if(!isAnimationStarted){
    startAnimationPreview();
    isAnimationStarted = true;
  }
  
  checkForElementsToBeErased(mainCanvasX, mainCanvasY);

}

function deleteElementsToBeErased() {

    const updatedElementsAfterDeletion = canvasElements.filter(element => !element.toBeErased);
    setCanvasElements(updatedElementsAfterDeletion);
}


function checkForElementsToBeErased(mainCanvasX: number, mainCanvasY: number) {
 
    const elementsToBeErased = cloneDeep(canvasElements);

    elementsToBeErased.forEach((element) => {
        if(
            mainCanvasX >= element.startCoordinates!.x &&
            mainCanvasX <= element.endCoordinates!.x &&
            mainCanvasY >= element.startCoordinates!.y &&
            mainCanvasY <= element.endCoordinates!.y
        ){
            element.strokeColor = adjustOpacityForErasure(element.strokeColor);
            element.fillColor = adjustOpacityForErasure(element.fillColor);
            element.toBeErased = true;
        }
    });

    setCanvasElements(elementsToBeErased);

}


function hexToRGBA(hex: string, opacity: number) {
  hex = hex.replace(/^#/, '');


  var r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function adjustOpacityForErasure(color: string) {
 
     var newOpacity = 0.1;
     return hexToRGBA(color, newOpacity);
    
}

