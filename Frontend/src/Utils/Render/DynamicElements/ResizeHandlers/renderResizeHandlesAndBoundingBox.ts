import { boundingBoxProperties, cueBallProperties, BALL_RADIUS, BOUNDING_BOX_COLOR, CUE_BALL_COLOR } from "../../../interactionhelpers";

let canvasContext: CanvasRenderingContext2D | null = null;



export function renderResizeHandlesAndBoundingBox(ctx: CanvasRenderingContext2D) {
    canvasContext = ctx;
    renderBoundingBox();
    renderResizeHandles();
}



function renderBoundingBox() {
    if(!canvasContext) return;
    canvasContext.beginPath();
    canvasContext.strokeStyle = BOUNDING_BOX_COLOR;
    canvasContext.lineWidth = 1;
    canvasContext.rect(
        boundingBoxProperties.startX,
        boundingBoxProperties.startY,
        boundingBoxProperties.width,
        boundingBoxProperties.height
    );
    canvasContext.stroke();
    canvasContext.closePath();
}

function renderResizeHandles() {
    if (!canvasContext) return;

    canvasContext.beginPath();
    canvasContext.fillStyle = "white";
    canvasContext.strokeStyle = CUE_BALL_COLOR;
    canvasContext.lineWidth = 1;

    const cornerRadius = 2.2; // This will create a rounded square

    Object.values(cueBallProperties).forEach(ball => {
        if (!canvasContext) return;
        const x = ball.x;
        const y = ball.y;
        const width = BALL_RADIUS * 2;
        const height = BALL_RADIUS * 2;

        // Start at the top left corner
        canvasContext.moveTo(x + cornerRadius, y);

        // Top side
        canvasContext.lineTo(x + width - cornerRadius, y);
        canvasContext.arcTo(x + width, y, x + width, y + cornerRadius, cornerRadius);

        // Right side
        canvasContext.lineTo(x + width, y + height - cornerRadius);
        canvasContext.arcTo(x + width, y + height, x + width - cornerRadius, y + height, cornerRadius);

        // Bottom side
        canvasContext.lineTo(x + cornerRadius, y + height);
        canvasContext.arcTo(x, y + height, x, y + height - cornerRadius, cornerRadius);

        // Left side
        canvasContext.lineTo(x, y + cornerRadius);
        canvasContext.arcTo(x, y, x + cornerRadius, y, cornerRadius);

        // Fill and stroke the rounded square
        canvasContext.fill();
        canvasContext.stroke();
    });

    canvasContext.closePath();
}
