import { elementsOnCanvas, setElementsOnCanvas, activeElementId } from "../../../../Components/Board/Board";

export function attachListeners(bottomRightCueBall: HTMLDivElement, canvasRef: React.RefObject<HTMLCanvasElement>) {
    if (!canvasRef.current) return;

    let isResizing = false;
    let offsetToCenter = { x: 0, y: 0 };
    let dragStart = { x: 0, y: 0 }; // Not used for resizing, but kept for consistency
    let currentActiveElementIndex: number;

    let overlayForDragging = document.querySelector(".overlay-for-dragging") as HTMLDivElement;
    if (!overlayForDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
        console.log("currently dragging");
        if (!isResizing || !canvasRef.current) return;

        const newX = e.clientX - canvasRef.current.offsetLeft - offsetToCenter.x;
        const newY = e.clientY - canvasRef.current.offsetTop - offsetToCenter.y;

        // Only update the x-coordinate of endCoordinates and y-coordinate of endCoordinates
        const currentElement = elementsOnCanvas[currentActiveElementIndex];
        currentElement.endCoordinates.x = newX; // Update right edge
        currentElement.endCoordinates.y = newY; // Update bottom edge
    };

    const handleMouseUp = () => {
        console.log("stop dragging");
        isResizing = false;
        overlayForDragging.style.display = "none";
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        const currentElement = elementsOnCanvas[currentActiveElementIndex];
        const { startCoordinates, endCoordinates } = currentElement;
        const { x: startX, y: startY } = startCoordinates;
        const { x: endX, y: endY } = endCoordinates;

       if(startX > endX){
        currentElement.startCoordinates.x = endX;
        currentElement.endCoordinates.x = startX;
       }

       if(startY > endY){
        currentElement.startCoordinates.y = endY;
        currentElement.endCoordinates.y = startY;
       }

        //bottom-right inversion when startX > endx and starty < endy
        if(startX > endX && startY > endY) {
            elementsOnCanvas[currentActiveElementIndex].startCoordinates = {
                x: endX,
                y: endY,
            };
            elementsOnCanvas[currentActiveElementIndex].endCoordinates = {
                x: startX,
                y: startY,
            };
        }

};

    const handleMouseDown = (e: MouseEvent) => {
        console.log("initiate dragging");
        if (!canvasRef.current) return;
        isResizing = true;
        currentActiveElementIndex = elementsOnCanvas.findIndex(element => element.id === activeElementId);
        overlayForDragging.style.display = "block";
        overlayForDragging.style.cursor = "se-resize";
        const rect = bottomRightCueBall.getBoundingClientRect();
        const centerOfCueBall = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };

        // Calculate offset to the center of bottomRightCueBall
        offsetToCenter.x = e.clientX - centerOfCueBall.x;
        offsetToCenter.y = e.clientY - centerOfCueBall.y;

        // Add global event listeners for mousemove and mouseup
        document.body.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseup", handleMouseUp);
    };

    bottomRightCueBall.addEventListener("mouseenter", () => bottomRightCueBall.style.cursor = "se-resize");
    bottomRightCueBall.addEventListener("mouseleave", () => bottomRightCueBall.style.cursor = "default");
    bottomRightCueBall.addEventListener("mousedown", handleMouseDown);
}

