import { elementsOnCanvas, setElementsOnCanvas, activeElementId } from "../../../../Components/Board/Board";

export function attachListeners(leftMiddleCueBall: HTMLDivElement, canvasRef: React.RefObject<HTMLCanvasElement>) {
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

        const currentElement = elementsOnCanvas[currentActiveElementIndex];
        currentElement.startCoordinates.x = newX;
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
            elementsOnCanvas[currentActiveElementIndex].startCoordinates = {
                x: endX,
                y: startY,
            };
            elementsOnCanvas[currentActiveElementIndex].endCoordinates = {
                x: startX,
                y: endY,
            };
        }
    };

    const handleMouseDown = (e: MouseEvent) => {
        console.log("initiate dragging");
        if (!canvasRef.current) return;
        isResizing = true;
        currentActiveElementIndex = elementsOnCanvas.findIndex(element => element.id === activeElementId);
        overlayForDragging.style.display = "block";
        overlayForDragging.style.cursor = "e-resize";
        const rect = leftMiddleCueBall.getBoundingClientRect();
        const centerOfCueBall = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };

        // Calculate offset to the center of leftMiddleCueBall
        offsetToCenter.x = e.clientX - centerOfCueBall.x;
        offsetToCenter.y = e.clientY - centerOfCueBall.y;

        // Add global event listeners for mousemove and mouseup
        document.body.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseup", handleMouseUp);
    };

    leftMiddleCueBall.addEventListener("mouseenter", () => leftMiddleCueBall.style.cursor = "e-resize");
    leftMiddleCueBall.addEventListener("mouseleave", () => leftMiddleCueBall.style.cursor = "default");
    leftMiddleCueBall.addEventListener("mousedown", handleMouseDown);
}

