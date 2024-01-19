import { elementsOnCanvas, setElementsOnCanvas, activeElementId } from "../../../../Components/Board/Board";

export function attachListeners(bottomMiddleCueBall: HTMLDivElement, canvasRef: React.RefObject<HTMLCanvasElement>) {
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

        const newY = e.clientY - canvasRef.current.offsetTop - offsetToCenter.y;

        const currentElement = elementsOnCanvas[currentActiveElementIndex];
        currentElement.endCoordinates.y = newY;
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

        if(endY < startY){
            elementsOnCanvas[currentActiveElementIndex].startCoordinates = {
                x: startX,
                y: endY,
            };
            elementsOnCanvas[currentActiveElementIndex].endCoordinates = {
                x: endX,
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
        overlayForDragging.style.cursor = "n-resize";
        const rect = bottomMiddleCueBall.getBoundingClientRect();
        const centerOfCueBall = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };

        // Calculate offset to the center of bottomMiddleCueBall
        offsetToCenter.x = e.clientX - centerOfCueBall.x;
        offsetToCenter.y = e.clientY - centerOfCueBall.y;

        // Add global event listeners for mousemove and mouseup
        document.body.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseup", handleMouseUp);
    };

    bottomMiddleCueBall.addEventListener("mouseenter", () => bottomMiddleCueBall.style.cursor = "n-resize");
    bottomMiddleCueBall.addEventListener("mouseleave", () => bottomMiddleCueBall.style.cursor = "default");
    bottomMiddleCueBall.addEventListener("mousedown", handleMouseDown);
}

