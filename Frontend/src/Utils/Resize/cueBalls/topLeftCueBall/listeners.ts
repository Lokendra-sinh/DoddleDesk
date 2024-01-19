import { elementsOnCanvas, setElementsOnCanvas, activeElementId } from "../../../../Components/Board/Board";
import { topLeft } from "../../../cueBallsEventListeners/topLeft";


export function attachListeners(topLeftCueBall: HTMLDivElement, canvasRef: React.RefObject<HTMLCanvasElement>) {
    if (!canvasRef.current) return;

    let isResizing = false;
    let offsetToCenter = { x: 0, y: 0 };
    let dragStart = { x: 0, y: 0 };
    let dragEnd = { x: 0, y: 0 };

    let overlayForDragging = document.querySelector(".overlay-for-dragging") as HTMLDivElement;
    if(!overlayForDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
        console.log("currently dragging");
        if (!isResizing || !canvasRef.current) return;
        e.stopPropagation();

        // Calculate new position with the offset applied
        dragEnd.x = e.clientX - canvasRef.current.offsetLeft - offsetToCenter.x;
        dragEnd.y = e.clientY - canvasRef.current.offsetTop - offsetToCenter.y;

        // Update the element's position
        const currentActiveElementIndex = elementsOnCanvas.findIndex(element => element.id === activeElementId);
        elementsOnCanvas[currentActiveElementIndex].startCoordinates = {
            x: dragEnd.x,
            y: dragEnd.y,
        };
    };

    const handleMouseUp = () => {
        console.log("stop dragging");
        isResizing = false;
        overlayForDragging.style.display = "none";
        document.body.removeEventListener("mousemove", handleMouseMove);
        document.body.removeEventListener("mouseup", handleMouseUp);
        // Additional logic if needed on mouse up
    };

    const handleMouseDown = (e: MouseEvent) => {
        console.log("initiate dragging");
        if(!canvasRef.current) return;
        isResizing = true;
        e.stopPropagation();
        overlayForDragging.style.display = "block";
        
        const rect = topLeftCueBall.getBoundingClientRect();
        const centerOfCueBall = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };

        // Calculate offset to the center of topLeftCueBall
        offsetToCenter.x = e.clientX - centerOfCueBall.x;
        offsetToCenter.y = e.clientY - centerOfCueBall.y;

        // Set the dragStart position relative to the canvas
        dragStart.x = e.clientX - canvasRef.current.offsetLeft;
        dragStart.y = e.clientY - canvasRef.current.offsetTop;

        // Add global event listeners for mousemove and mouseup
        document.body.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseup", handleMouseUp);
    };

    topLeftCueBall.addEventListener("mouseenter", () => topLeftCueBall.style.cursor = "nwse-resize");
    topLeftCueBall.addEventListener("mouseleave", () => topLeftCueBall.style.cursor = "default");
    topLeftCueBall.addEventListener("mousedown", handleMouseDown);
}

