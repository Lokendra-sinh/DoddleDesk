
import { activeInteractiveElement } from "../interactionhelpers";
import {
  boundingBoxProperties,
  cueBallProperties,
  MARGIN_GAP,
  BALL_RADIUS,
} from "../interactionhelpers";

export function updateHandlersAndBoxPosition(
) {
  const { startCoordinates, endCoordinates } = activeInteractiveElement!;
  if (!startCoordinates || !endCoordinates) return;

  switch (activeInteractiveElement!.type) {
    case "circle":
      boundingBoxForCircle();
      break;
    case "rectangle":
    case "biSquare":
    case "ellipse":
      commonShapesBoundingBox();
      break;
    case "pencil":
      boundingBoxForPencil();
      break;
    default:
      commonShapesBoundingBox();
  }

  updateCueBallPositions();
}


export function commonShapesBoundingBox(
  ) {
    const { startCoordinates, endCoordinates } = activeInteractiveElement!;
    if (!startCoordinates || !endCoordinates) return;
  
    const topLeftX = Math.min(startCoordinates.x, endCoordinates.x) - MARGIN_GAP;
    const topLeftY = Math.min(startCoordinates.y, endCoordinates.y) - MARGIN_GAP;
    const width =
      Math.abs(endCoordinates.x - startCoordinates.x) + 2 * MARGIN_GAP;
    const height =
      Math.abs(endCoordinates.y - startCoordinates.y) + 2 * MARGIN_GAP;
  
   boundingBoxProperties.left = topLeftX;
    boundingBoxProperties.top = topLeftY;
    boundingBoxProperties.width = width;
    boundingBoxProperties.height = height;
  
  }
  
  export function boundingBoxForCircle(
  ) {
    const { startCoordinates, endCoordinates } = activeInteractiveElement!;
    if (!startCoordinates || !endCoordinates) return;
  
    const centerX = (startCoordinates.x + endCoordinates.x) / 2;
    const centerY = (startCoordinates.y + endCoordinates.y) / 2;
    const radius =
      Math.sqrt(
        Math.pow(endCoordinates.x - startCoordinates.x, 2) +
          Math.pow(endCoordinates.y - startCoordinates.y, 2)
      ) / 2;
  
    // Calculate the top-left corner of the bounding box considering the gap
    const topLeftX = centerX - radius - MARGIN_GAP;
    const topLeftY = centerY - radius - MARGIN_GAP;
    const width = radius * 2 + 2 * MARGIN_GAP;
    const height = radius * 2 + 2 * MARGIN_GAP;
  
    boundingBoxProperties.left = topLeftX;
    boundingBoxProperties.top = topLeftY;
    boundingBoxProperties.width = width;
    boundingBoxProperties.height = height;
  
  }
  
  export function boundingBoxForPencil(
  ) {
    const { points } = activeInteractiveElement!;
    if (!points) return;
    let minX = points[0].x;
    let minY = points[0].y;
    let maxX = points[0].x;
    let maxY = points[0].y;
  
    points.forEach((point) => {
      if (point.x < minX) minX = point.x;
      if (point.x > maxX) maxX = point.x;
      if (point.y < minY) minY = point.y;
      if (point.y > maxY) maxY = point.y;
    });
  
    
    boundingBoxProperties.left = minX - MARGIN_GAP;
    boundingBoxProperties.top = minY - MARGIN_GAP;
    boundingBoxProperties.width = maxX - minX + 2 * MARGIN_GAP;
    boundingBoxProperties.height = maxY - minY + 2 * MARGIN_GAP;


  }


export function updateCueBallPositions() {
  const { left:x, top:y, width, height } = boundingBoxProperties;
  const topLeftX = x - BALL_RADIUS;
  const topLeftY = y - BALL_RADIUS;

  const topMiddleX = x + width / 2 - BALL_RADIUS;
  const topMiddleY = y - BALL_RADIUS;

  const topRightX = x + width - BALL_RADIUS;
  const topRightY = y - BALL_RADIUS;

  const leftMiddleX = x - BALL_RADIUS;
  const leftMiddleY = y + height / 2 - BALL_RADIUS;

  const rightMiddleX = x + width - BALL_RADIUS;
  const rightMiddleY = y + height / 2 - BALL_RADIUS;

  const bottomLeftX = x - BALL_RADIUS;
  const bottomLeftY = y + height - BALL_RADIUS;

  const bottomMiddleX = x + width / 2 - BALL_RADIUS;
  const bottomMiddleY = y + height - BALL_RADIUS;

  const bottomRightX = x + width - BALL_RADIUS;
  const bottomRightY = y + height - BALL_RADIUS;

  cueBallProperties.topLeft.x = topLeftX;
  cueBallProperties.topLeft.y = topLeftY;
  cueBallProperties.topMiddle.x = topMiddleX;
  cueBallProperties.topMiddle.y = topMiddleY;
  cueBallProperties.topRight.x = topRightX;
  cueBallProperties.topRight.y = topRightY;
  cueBallProperties.leftMiddle.x = leftMiddleX;
  cueBallProperties.leftMiddle.y = leftMiddleY;
  cueBallProperties.rightMiddle.x = rightMiddleX;
  cueBallProperties.rightMiddle.y = rightMiddleY;
  cueBallProperties.bottomLeft.x = bottomLeftX;
  cueBallProperties.bottomLeft.y = bottomLeftY;
  cueBallProperties.bottomMiddle.x = bottomMiddleX;
  cueBallProperties.bottomMiddle.y = bottomMiddleY;
  cueBallProperties.bottomRight.x = bottomRightX;
  cueBallProperties.bottomRight.y = bottomRightY;


}