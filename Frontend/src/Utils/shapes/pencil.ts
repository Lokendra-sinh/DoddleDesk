
import { ElementTypes } from "../../Types/Types";


export function drawPencil(ctx: CanvasRenderingContext2D, element: ElementTypes) {
  if (!ctx || !element.points || element.points.length < 4) return;

  ctx.beginPath();
  ctx.strokeStyle = element.strokeColor;
  ctx.lineWidth = element.strokeWidth || 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.imageSmoothingEnabled = true;

  // Use the sampled points for drawing
  const sampledPoints = samplePoints(element.points, 10);
  
  // Move to the first point of the sampled points
  ctx.moveTo(sampledPoints[0].x, sampledPoints[0].y);

  // Loop through the sampled points to draw the stroke
  for (let i = 1; i < sampledPoints.length - 2; i++) {
    const currentPoint = sampledPoints[i];
    const nextMidPoint = {
      x: (currentPoint.x + sampledPoints[i + 1].x) / 2,
      y: (currentPoint.y + sampledPoints[i + 1].y) / 2,
    };

    ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, nextMidPoint.x, nextMidPoint.y);
  }

  // For the last two points of the sampled points
  const secondLast = sampledPoints[sampledPoints.length - 2];
  const last = sampledPoints[sampledPoints.length - 1];
  ctx.quadraticCurveTo(secondLast.x, secondLast.y, last.x, last.y);

  ctx.stroke();
  ctx.imageSmoothingEnabled = false;
}

// Point sampling function
function samplePoints(points: { x: number; y: number }[], distance: number) {
  const sampledPoints = [points[0]];
  let prevPoint = points[0];

  for (let i = 1; i < points.length; i++) {
    const currentPoint = points[i];
    const dx = currentPoint.x - prevPoint.x;
    const dy = currentPoint.y - prevPoint.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist >= distance) {
      sampledPoints.push(currentPoint);
      prevPoint = currentPoint;
    }
  }

  // Add the last point to ensure the stroke ends at the correct position
  if (sampledPoints[sampledPoints.length - 1] !== points[points.length - 1]) {
    sampledPoints.push(points[points.length - 1]);
  }

  return sampledPoints;
}


 