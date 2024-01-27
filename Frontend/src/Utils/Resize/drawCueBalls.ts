import { ElementTypes } from "../../Types/Types";
import { drawTopLeftCueBall } from "./cueBalls/topLeftCueBall/draw";
import { drawTopRightCueBall } from "./cueBalls/topRightCueBall/draw";
import { drawBottomRightCueBall } from "./cueBalls/bottomRightCueBall/draw";
import { drawBottomLeftCueBall } from "./cueBalls/bottomLeftCueBall/draw";
import { drawTopMiddleCueBall } from "./cueBalls/topMiddleCueBall/draw";
import { drawBottomMiddleCueBall } from "./cueBalls/bottomMiddleCueBall/draw";
import { drawLeftMiddleCueBall } from "./cueBalls/leftMiddleCueBall/draw";
import { drawRightMiddleCueBall } from "./cueBalls/rightMiddleCueBall/draw";

const ballWidth = '10px';
const ballHeight = '10px';
const ballRadius = 5;

export function drawCueBalls(
    x: number,
    y: number,
    width: number,
    height: number,
    foregroundContext: CanvasRenderingContext2D,
    setRecoilElements: React.Dispatch<React.SetStateAction<ElementTypes[]>>,
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

  drawTopLeftCueBall(topLeftX, topLeftY, ballWidth, ballHeight, foregroundContext, setRecoilElements);
  drawTopMiddleCueBall(topMiddleX, topMiddleY, ballWidth, ballHeight, foregroundContext, setRecoilElements);
  drawTopRightCueBall(topRightX, topRightY, ballWidth, ballHeight , foregroundContext, setRecoilElements);
  drawLeftMiddleCueBall(leftMiddleX, leftMiddleY, ballWidth, ballHeight , foregroundContext, setRecoilElements);
  drawRightMiddleCueBall(rightMiddleX, rightMiddleY, ballWidth, ballHeight , foregroundContext, setRecoilElements);
  drawBottomLeftCueBall(bottomLeftX, bottomLeftY, ballWidth, ballHeight , foregroundContext, setRecoilElements);
  drawBottomMiddleCueBall(bottomMiddleX, bottomMiddleY, ballWidth, ballHeight , foregroundContext, setRecoilElements);
  drawBottomRightCueBall(bottomRightX, bottomRightY, ballWidth, ballHeight , foregroundContext, setRecoilElements);

}