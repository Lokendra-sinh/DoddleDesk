import { ElementTypes } from "../../Types/Types";
import { drawTopLeftCueBall } from "./cueBalls/topLeftCueBall/draw";
import { drawTopRightCueBall } from "./cueBalls/topRightCueBall/draw";
import { drawBottomRightCueBall } from "./cueBalls/bottomRightCueBall/draw";
import { drawBottomLeftCueBall } from "./cueBalls/bottomLeftCueBall/draw";
import { drawTopMiddleCueBall } from "./cueBalls/topMiddleCueBall/draw";
import { drawBottomMiddleCueBall } from "./cueBalls/bottomMiddleCueBall/draw";

const ballWidth = '10px';
const ballHeight = '10px';
const ballRadius = 5;

export function drawCueBalls(
    x: number,
    y: number,
    width: number,
    height: number,
    canvasRef: React.RefObject<HTMLCanvasElement>,
) {
  
  const topLeftX = x - ballRadius;
  const topLeftY = y - ballRadius;

  const topMiddleX = x + width / 2 - ballRadius;
  const topMiddleY = y - ballRadius;

  const topRightX = x + width - ballRadius;
  const topRightY = y - ballRadius;

  const leftMiddleX = x - ballRadius;
  const leftMiddleY = y + height / 2 - ballRadius;

  const rightMiddleX = x + width - ballRadius;
  const rightMiddleY = y + height / 2 - ballRadius;

  const bottomLeftX = x - ballRadius;
  const bottomLeftY = y + height - ballRadius;

  const bottomMiddleX = x + width / 2 - ballRadius;
  const bottomMiddleY = y + height - ballRadius;

  const bottomRightX = x + width - ballRadius;
  const bottomRightY = y + height - ballRadius;

  drawTopLeftCueBall(topLeftX, topLeftY, ballWidth, ballHeight, canvasRef);
  drawTopMiddleCueBall(topMiddleX, topMiddleY, ballWidth, ballHeight, canvasRef);
  drawTopRightCueBall(topRightX, topRightY, ballWidth, ballHeight , canvasRef);
  // drawLeftMiddleCueBall(leftMiddleX, leftMiddleY, ballWidth, ballHeight , canvasRef);
  // drawRightMiddleCueBall(rightMiddleX, rightMiddleY, ballWidth, ballHeight , canvasRef);
  drawBottomLeftCueBall(bottomLeftX, bottomLeftY, ballWidth, ballHeight , canvasRef);
  drawBottomMiddleCueBall(bottomMiddleX, bottomMiddleY, ballWidth, ballHeight , canvasRef);
  drawBottomRightCueBall(bottomRightX, bottomRightY, ballWidth, ballHeight , canvasRef);



  
  

}