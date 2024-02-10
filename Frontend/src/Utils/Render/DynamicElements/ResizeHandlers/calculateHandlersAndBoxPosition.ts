import { ElementTypes } from "../../../../Types/Types";
import { boundingBoxProperties, cueBallProperties } from "../../../interactionhelpers";

let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;


export function calculateHandlersAndBoxPosition(element: ElementTypes | undefined) {
  if (!element) return;
  
  // Determine the current top-left and bottom-right coordinates dynamically
  startX = Math.min(element.startCoordinates!.x, element.endCoordinates!.x) || 0;
  startY = Math.min(element.startCoordinates!.y, element.endCoordinates!.y) || 0;
 endX = Math.max(element.startCoordinates!.x, element.endCoordinates!.x) || 0;
  endY = Math.max(element.startCoordinates!.y, element.endCoordinates!.y) || 0;

 

    // if(element.type === "text") implement this later
    if(element.type === "circle") {
       calculateCirclesBoundingBoxPosition();
    } 

    updateBoundingBoxPosition();
    updateCueBallsPosition(element);
}


function calculateCirclesBoundingBoxPosition() {
    const centerX = (startX + endX) / 2;
    const centerY = (startY + endY) / 2;
    const radius =
      Math.sqrt(
        Math.pow(endX - startX, 2) +
          Math.pow(endY - startY, 2)
      ) / 2;
  
    // Calculate the top-left corner of the bounding box considering the gap
    startX = centerX - radius;
    startY = centerY - radius;

    // Calculate the bottom-right corner of the bounding box considering the gap
     endX = centerX + radius;
     endY = centerY + radius;
  
}

function updateBoundingBoxPosition() {
    boundingBoxProperties.startX = startX;
    boundingBoxProperties.startY = startY;
    boundingBoxProperties.endX = endX;
    boundingBoxProperties.endY = endY;
    boundingBoxProperties.width = endX - startX;
    boundingBoxProperties.height = endY - startY;

}

function updateCueBallsPosition(element: ElementTypes){

    // Top Left
    cueBallProperties.topLeft.x = boundingBoxProperties.startX;
    cueBallProperties.topLeft.y = boundingBoxProperties.startY;

     // Top Right
     cueBallProperties.topRight.x = boundingBoxProperties.endX;
     cueBallProperties.topRight.y = boundingBoxProperties.startY;
 
 
 
     // Bottom Left
     cueBallProperties.bottomLeft.x = boundingBoxProperties.startX;
     cueBallProperties.bottomLeft.y = boundingBoxProperties.endY;
 
    
     // Bottom Right
     cueBallProperties.bottomRight.x = boundingBoxProperties.endX;
     cueBallProperties.bottomRight.y = boundingBoxProperties.endY;

    
    if(element.type !== "text"){

    // Top Middle
    cueBallProperties.topMiddle.x = boundingBoxProperties.startX + boundingBoxProperties.width / 2;
    cueBallProperties.topMiddle.y = boundingBoxProperties.startY;

     // Left Middle
     cueBallProperties.leftMiddle.x = boundingBoxProperties.startX;
     cueBallProperties.leftMiddle.y = boundingBoxProperties.startY + boundingBoxProperties.height / 2;
    
      // Right Middle
    cueBallProperties.rightMiddle.x = boundingBoxProperties.endX;
    cueBallProperties.rightMiddle.y = boundingBoxProperties.startY + boundingBoxProperties.height / 2;


     // Bottom Middle
     cueBallProperties.bottomMiddle.x = boundingBoxProperties.startX + boundingBoxProperties.width / 2;
     cueBallProperties.bottomMiddle.y = boundingBoxProperties.endY;

    }

    
}