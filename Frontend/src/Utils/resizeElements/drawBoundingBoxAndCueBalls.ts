import { ElementTypes, BoundingBoxAndCueBalls } from "../../Types/Types";

export function drawBoundingBoxAndCueBalls(
  ctx: CanvasRenderingContext2D,
  element: ElementTypes,
  activeBoxAndCueBalls: React.MutableRefObject<BoundingBoxAndCueBalls>,
) {
  if (!ctx) return;
  const gap = 10;
  const { startCoordinates, endCoordinates } = element;
  let topLeftX: number, topLeftY: number, width: number, height: number;

  if (element.type == "circle") {
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
  drawBoundingBox(ctx, topLeftX, topLeftY, width, height);
  drawCueBalls(ctx, topLeftX, topLeftY, width, height, activeBoxAndCueBalls);
}

function drawBoundingBox(
  ctx: CanvasRenderingContext2D,
  topLeftX: number,
  topLeftY: number,
  width: number,
  height: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#94a3b8";
  ctx.rect(topLeftX, topLeftY, width, height);
  ctx.stroke();
  ctx.restore();
}

function drawCueBalls(
  ctx: CanvasRenderingContext2D,
  topLeftX: number,
  topLeftY: number,
  width: number,
  height: number,
  activeBoxAndCueBalls: React.MutableRefObject<BoundingBoxAndCueBalls>
) {
  const radius = 5;
  const gap = 10;
  const topLeft = {
    x: topLeftX,
    y: topLeftY,
  };
  const topRight = {
    x: topLeftX + width,
    y: topLeftY,
  };
  const bottomRight = {
    x: topLeftX + width,
    y: topLeftY + height,
  };
  const bottomLeft = {
    x: topLeftX,
    y: topLeftY + height,
  };

  const topMiddle = {
    x: topLeftX + width / 2,
    y: topLeftY,
  };
  const rightMiddle = {
    x: topLeftX + width,
    y: topLeftY + height / 2,
  };

  const bottomMiddle = {
    x: topLeftX + width / 2,
    y: topLeftY + height,
  };
  const leftMiddle = {
    x: topLeftX,
    y: topLeftY + height / 2,
  };

  drawCueBall(ctx, topLeft.x, topLeft.y, radius);
  drawCueBall(ctx, topRight.x, topRight.y, radius);
  drawCueBall(ctx, bottomRight.x, bottomRight.y, radius);
  drawCueBall(ctx, bottomLeft.x, bottomLeft.y, radius);
  drawCueBall(ctx, topMiddle.x, topMiddle.y, radius);
  drawCueBall(ctx, rightMiddle.x, rightMiddle.y, radius);
  drawCueBall(ctx, bottomMiddle.x, bottomMiddle.y, radius);
  drawCueBall(ctx, leftMiddle.x, leftMiddle.y, radius);

    activeBoxAndCueBalls.current.cueBalls = {
        topLeft: topLeft,
        topRight: topRight,
        bottomRight: bottomRight,
        bottomLeft: bottomLeft,
        topMiddle: topMiddle,
        rightMiddle: rightMiddle,
        bottomMiddle: bottomMiddle,
        leftMiddle: leftMiddle,
    };
}

function drawCueBall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#94a3b8";
  ctx.stroke();
  ctx.restore();
}
