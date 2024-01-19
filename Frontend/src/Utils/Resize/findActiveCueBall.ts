import React from "react";
import { BoundingBoxAndCueBalls } from "../../Types/Types";


export function findActiveCueBall(
    mouseX: number,
    mouseY: number,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    activeBoxAndCueBalls: React.MutableRefObject<BoundingBoxAndCueBalls>
){

    const cueBalls = activeBoxAndCueBalls.current.cueBalls;
    if (
      isMouseWithinCueBall(mouseX, mouseY, cueBalls.topLeft.x, cueBalls.topLeft.y)
    ) {
      return "topLeft";
    }
  
      if (
          isMouseWithinCueBall(
          mouseX,
          mouseY,
          cueBalls.topRight.x,
          cueBalls.topRight.y
          )
      ) {
          return "topRight";
      }
  
      if (
          isMouseWithinCueBall(
          mouseX,
          mouseY,
          cueBalls.bottomLeft.x,
          cueBalls.bottomLeft.y
          )
      ) {
          return "bottomLeft";
      }
  
      if (
          isMouseWithinCueBall(
          mouseX,
          mouseY,
          cueBalls.bottomRight.x,
          cueBalls.bottomRight.y
          )
      ) {
          return "bottomRight";
      }
  
      if (
          isMouseWithinCueBall(
          mouseX,
          mouseY,
          cueBalls.topMiddle.x,
          cueBalls.topMiddle.y
          )
      ) {
          return "topMiddle";
      }
  
      if (
          isMouseWithinCueBall(
          mouseX,
          mouseY,
          cueBalls.bottomMiddle.x,
          cueBalls.bottomMiddle.y
          )
      ) {
          return "bottomMiddle";
      }
  
      if (
          isMouseWithinCueBall(
          mouseX,
          mouseY,
          cueBalls.leftMiddle.x,
          cueBalls.leftMiddle.y
          )
      ) {
          return "leftMiddle";
      }
  
      if (
          isMouseWithinCueBall(
          mouseX,
          mouseY,
          cueBalls.rightMiddle.x,
          cueBalls.rightMiddle.y
          )
      ) {
          return "rightMiddle";
      }
    
    return null;

}



const isMouseWithinCueBall = (
    mouseX: number,
    mouseY: number,
    cueBallX: number,
    cueBallY: number
  ) => {
    const distance = Math.sqrt(
      Math.pow(mouseX - cueBallX, 2) + Math.pow(mouseY - cueBallY, 2)
    );
    return distance <= 5;
  };