import { ElementTypes } from "../../Types/Types";





export function drawEraserTrail(canvasContext: CanvasRenderingContext2D, element: ElementTypes) {
    if (!canvasContext || !element.points || element.points.length < 2) return;

    // Define the step size for interpolation (smaller values = smoother)

    canvasContext.beginPath();
    canvasContext.moveTo(element.points[0].x, element.points[0].y);

    // Loop through each pair of points in the array
    for (let i = 1; i < element.points.length - 1; i++) {
        // const start = element.points[i];
        // const end = element.points[i + 1];

        // // Linearly interpolate between start and end points
        // for (let t = 0; t <= 1; t += stepSize) {
        //     const interpolatedX = start.x + (end.x - start.x) * t;
        //     const interpolatedY = start.y + (end.y - start.y) * t;
        //     canvasContext.lineTo(interpolatedX, interpolatedY);
        //     canvasContext.moveTo(interpolatedX, interpolatedY);
        // }

        canvasContext.lineTo(element.points[i].x, element.points[i].y);
        canvasContext.moveTo(element.points[i].x, element.points[i].y);

    }

    // // Ensure the path goes through the last point
    // const lastPoint = element.points[element.points.length - 1];
    // canvasContext.lineTo(lastPoint.x, lastPoint.y);

    // Style the eraser trail (optional, customize as needed)
    canvasContext.strokeStyle = '#000'; // Example: black stroke color
    canvasContext.lineWidth = 2; // Example: 2 pixels wide
    canvasContext.stroke(); // Render the path
}
