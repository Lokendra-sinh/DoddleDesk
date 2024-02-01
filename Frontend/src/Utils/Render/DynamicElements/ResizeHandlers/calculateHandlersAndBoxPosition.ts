import { ElementTypes } from "../../../../Types/Types";
import { boundingBoxProperties, cueBallProperties, MARGIN_GAP, CIRCLE_MARGIN_GAP, BALL_RADIUS } from "../../../interactionhelpers";

let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let width = 0;
let height = 0;

export function calculateHandlersAndBoxPosition(element: ElementTypes | undefined) {
  if (!element) return;
  
  // Determine the current top-left and bottom-right coordinates dynamically
  startX = Math.min(element.startCoordinates!.x, element.endCoordinates!.x) || 0;
  startY = Math.min(element.startCoordinates!.y, element.endCoordinates!.y) || 0;
 endX = Math.max(element.startCoordinates!.x, element.endCoordinates!.x) || 0;
  endY = Math.max(element.startCoordinates!.y, element.endCoordinates!.y) || 0;

 
    // Calculate the width and height of the bounding box
    width = endX - startX;
    height = endY - startY;

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
    startX = centerX - radius - CIRCLE_MARGIN_GAP;
    startY = centerY - radius - CIRCLE_MARGIN_GAP;

    // Calculate the bottom-right corner of the bounding box considering the gap
     endX = centerX + radius + CIRCLE_MARGIN_GAP;
     endY = centerY + radius + CIRCLE_MARGIN_GAP;
  
    // Adjust the width and height to include the gap
     width = radius * 2 + 2 * CIRCLE_MARGIN_GAP;
     height = radius * 2 + 2 * CIRCLE_MARGIN_GAP;
}

function updateBoundingBoxPosition() {
    boundingBoxProperties.startX = startX - MARGIN_GAP;
    boundingBoxProperties.startY = startY - MARGIN_GAP;
    boundingBoxProperties.endX = endX + MARGIN_GAP;
    boundingBoxProperties.endY = endY + MARGIN_GAP;
    boundingBoxProperties.width = endX - startX + MARGIN_GAP * 2;
    boundingBoxProperties.height = endY - startY + MARGIN_GAP * 2;

    console.log("boundingBoxProperties before inversion: ", boundingBoxProperties);
}

function updateCueBallsPosition(element: ElementTypes){

    // Top Left
    cueBallProperties.topLeft.x = boundingBoxProperties.startX - BALL_RADIUS;
    cueBallProperties.topLeft.y = boundingBoxProperties.startY - BALL_RADIUS;

     // Top Right
     cueBallProperties.topRight.x = boundingBoxProperties.endX - BALL_RADIUS;
     cueBallProperties.topRight.y = boundingBoxProperties.startY - BALL_RADIUS;
 
 
 
     // Bottom Left
     cueBallProperties.bottomLeft.x = boundingBoxProperties.startX - BALL_RADIUS;
     cueBallProperties.bottomLeft.y = boundingBoxProperties.endY - BALL_RADIUS;
 
    
     // Bottom Right
     cueBallProperties.bottomRight.x = boundingBoxProperties.endX - BALL_RADIUS;
     cueBallProperties.bottomRight.y = boundingBoxProperties.endY - BALL_RADIUS;

    
    if(element.type !== "text"){

    // Top Middle
    cueBallProperties.topMiddle.x = boundingBoxProperties.startX + boundingBoxProperties.width / 2 - BALL_RADIUS;
    cueBallProperties.topMiddle.y = boundingBoxProperties.startY - BALL_RADIUS;

     // Left Middle
     cueBallProperties.leftMiddle.x = boundingBoxProperties.startX - BALL_RADIUS;
     cueBallProperties.leftMiddle.y = boundingBoxProperties.startY + boundingBoxProperties.height / 2 - BALL_RADIUS;
    
      // Right Middle
    cueBallProperties.rightMiddle.x = boundingBoxProperties.endX - BALL_RADIUS;
    cueBallProperties.rightMiddle.y = boundingBoxProperties.startY + boundingBoxProperties.height / 2 - BALL_RADIUS;


     // Bottom Middle
     cueBallProperties.bottomMiddle.x = boundingBoxProperties.startX + boundingBoxProperties.width / 2 - BALL_RADIUS;
     cueBallProperties.bottomMiddle.y = boundingBoxProperties.endY - BALL_RADIUS;

    }

    
}