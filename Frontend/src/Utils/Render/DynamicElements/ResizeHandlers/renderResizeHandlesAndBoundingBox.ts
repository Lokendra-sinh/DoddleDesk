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
     
    //draw eight circles around the bounding box to indicate resize handles

    Object.keys(cueBallProperties).forEach((key) => {
        if(!canvasContext) return;
        const ball = cueBallProperties[key as keyof typeof cueBallProperties];
        canvasContext.beginPath();
        canvasContext.lineWidth = 3;
        canvasContext.fillStyle = "white";
        canvasContext.strokeStyle = CUE_BALL_COLOR;
        canvasContext.arc(ball.x, ball.y, BALL_RADIUS, 0, 2 * Math.PI);
        canvasContext.stroke();
        canvasContext.fill();
        canvasContext.closePath();
    })

}
