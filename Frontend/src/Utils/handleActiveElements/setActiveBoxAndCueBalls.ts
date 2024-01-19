import React from "react";
import {
  ElementTypes,
  ElementsContainer,
  BoundingBoxAndCueBalls,
} from "../../Types/Types";

export function setActiveBoxAndCueBalls(
  activeBoxAndCueBalls: React.MutableRefObject<BoundingBoxAndCueBalls>,
  elements: ElementsContainer,
) {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].active) {
      fillUpCoordinates(activeBoxAndCueBalls, elements[i]);
      break;
    }
  }
}

function fillUpCoordinates(
  activeBoxAndCueBalls: React.MutableRefObject<BoundingBoxAndCueBalls>,
  element: ElementTypes,
) {

    const gap = 10;
    const { startCoordinates, endCoordinates } = element;
    let topLeftX: number, topLeftY: number, width: number, height: number;

    if(element.type == "circle"){
        const centerX = (startCoordinates.x + endCoordinates.x) / 2;
        const centerY = (startCoordinates.y + endCoordinates.y) / 2;
        const radius =
          Math.sqrt(
            Math.pow(endCoordinates.x - startCoordinates.x, 2) +
              Math.pow(endCoordinates.y - startCoordinates.y, 2)
          ) / 2;
      
        // Calculate the top-left corner of the bounding box considering the gap
        topLeftX = centerX - radius - gap;
        topLeftY = centerY - radius - gap;
      
        // Adjust the width and height to include the gap
        width = radius * 2 + 2 * gap;
        height = radius * 2 + 2 * gap;
    } else {
     topLeftX = Math.min(startCoordinates.x, endCoordinates.x) - gap;
     topLeftY = Math.min(startCoordinates.y, endCoordinates.y) - gap;
     width = Math.abs(startCoordinates.x - endCoordinates.x) + gap * 2;
     height = Math.abs(startCoordinates.y - endCoordinates.y) + gap * 2;
    }

    activeBoxAndCueBalls.current.boundingBox = {
        x: topLeftX,
        y: topLeftY,
        width: width,
        height: height,
    };

    activeBoxAndCueBalls.current.cueBalls = {
        topLeft: {
            x: topLeftX,
            y: topLeftY,
        },
        topRight: {
            x: topLeftX + width,
            y: topLeftY,
        },
        bottomRight: {
            x: topLeftX + width,
            y: topLeftY + height,
        },
        bottomLeft: {
            x: topLeftX,
            y: topLeftY + height,
        },
        topMiddle: {
            x: topLeftX + width / 2,
            y: topLeftY,
        },
        bottomMiddle: {
            x: topLeftX + width / 2,
            y: topLeftY + height,
        },
        leftMiddle: {
            x: topLeftX,
            y: topLeftY + height / 2,
        },
        rightMiddle: {
            x: topLeftX + width,
            y: topLeftY + height / 2,
        },
    };
}
