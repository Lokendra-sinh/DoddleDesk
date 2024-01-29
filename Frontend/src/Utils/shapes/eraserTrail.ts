import { set } from "lodash";
import { trailPointLifeSpan } from "../interactionhelpers";
import { setEraserFadeTrailPoints, eraserFadeTrailPoints } from "../interactionhelpers";




export function drawEraserTrail(
    canvasRef: React.RefObject<HTMLCanvasElement>,
    canvasContext: CanvasRenderingContext2D,
){
    const currentTime = Date.now();
    if (eraserFadeTrailPoints.length < 2) return;
    canvasContext.lineJoin = "round"
    canvasContext.lineCap = "round"
    canvasContext.strokeStyle = "#e5e7eb";
    // Assume the first point has no previous point, so start from the second point
    for (let i = 1; i < eraserFadeTrailPoints.length; i++) {
        const prevPoint = eraserFadeTrailPoints[i - 1];
        const point = eraserFadeTrailPoints[i];
        
        
        // I am using a dynamic lineWidth to simulate excaliDraw's eraser trail
        const dynamicWidth = Math.max(1,  4 + (8 * i) / eraserFadeTrailPoints.length);
        
        canvasContext.beginPath();
        canvasContext.moveTo(prevPoint.x, prevPoint.y);
        
        // If it's not the last point, draw using quadraticBezier or lineTo based on your design
        if (i < eraserFadeTrailPoints.length - 1) {
            const nextPoint = eraserFadeTrailPoints[i + 1];
            // Optionally, calculate control eraserFadeTrailPoints for a smoother curve if using bezierCurveTo
            const cp = calculateControlPoints(prevPoint, point, nextPoint); // A function to determine control points
            canvasContext.quadraticCurveTo(cp.cp1.x, cp.cp1.y, point.x, point.y);
        } else {
            canvasContext.lineTo(point.x, point.y);
        }
        
        // Apply the dynamic stroke style and lineWidth
        canvasContext.lineWidth = dynamicWidth;
        canvasContext.stroke(); // Apply the stroke to this segment
    }

    const updatedPoints = eraserFadeTrailPoints.filter(point => (currentTime - point.drawnTime) < trailPointLifeSpan);
    setEraserFadeTrailPoints([...updatedPoints]);
   
}

function calculateControlPoints(prevPoint: {x: number, y: number}, point: {x: number, y: number}, nextPoint: {x: number, y: number}) {
    // Simplified example: midpoints can serve as control points for Bezier curves
    const cp1 = { x: (prevPoint.x + point.x) / 2, y: (prevPoint.y + point.y) / 2 };
    const cp2 = { x: (point.x + nextPoint.x) / 2, y: (point.y + nextPoint.y) / 2 };
    return { cp1, cp2 };
}