import { elementsOnCanvas, setElementsOnCanvas, activeElementId } from "../../../../Components/Board/Board";

export function attachListeners(topMiddleCueBall: HTMLDivElement, canvasRef: React.RefObject<HTMLCanvasElement>) {
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
        currentElement.startCoordinates.y = newY;
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

        if(startY > endY){
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
        overlayForDragging.style.cursor = "s-resize";
        const rect = topMiddleCueBall.getBoundingClientRect();
        const centerOfCueBall = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };

        // Calculate offset to the center of topMiddleCueBall
        offsetToCenter.x = e.clientX - centerOfCueBall.x;
        offsetToCenter.y = e.clientY - centerOfCueBall.y;

        // Add global event listeners for mousemove and mouseup
        document.body.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseup", handleMouseUp);
    };

    topMiddleCueBall.addEventListener("mouseenter", () => topMiddleCueBall.style.cursor = "s-resize");
    topMiddleCueBall.addEventListener("mouseleave", () => topMiddleCueBall.style.cursor = "default");
    topMiddleCueBall.addEventListener("mousedown", handleMouseDown);
}

