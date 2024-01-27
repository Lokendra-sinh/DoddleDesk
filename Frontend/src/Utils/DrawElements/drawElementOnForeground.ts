import { ElementsContainer, ElementTypes } from "../../Types/Types";
import { animateForegroundElement } from "./animateForegroundElement";
import { activeForegroundElement, setActiveForegroundElement } from "../../Components/Board/Board";
import { v4 as uuidv4 } from "uuid";


interface AnimateForegroundElement {
  startAnimation: () => void;
  stopAnimation: () => void;
}

type Nothing = void | null | undefined;

export function drawElementOnForeground(
  e: MouseEvent,
  foregroundCanvasRef: React.RefObject<HTMLCanvasElement>,
  selectedTool: string,
  setSelectedTool: React.Dispatch<React.SetStateAction<string>>,
  setRecoilElements: React.Dispatch<React.SetStateAction<ElementsContainer>>
) {
  if (!foregroundCanvasRef.current) return;
  const foregroundContext = foregroundCanvasRef.current.getContext("2d");
  if (!foregroundContext) return;

  const canvasRect = foregroundCanvasRef.current.getBoundingClientRect();
  const mouseX = e.clientX - canvasRect.left;
  const mouseY = e.clientY - canvasRect.top;
  let isDragging = false;
  let animationStarted = false;
  let minDistance = 10;

  let currentActiveElement: ElementTypes = {
    id: uuidv4(),
    type: selectedTool,
    startCoordinates:
      selectedTool !== "pencil"
        ? {
            x: mouseX,
            y: mouseY,
          }
        : undefined,
    endCoordinates:
      selectedTool !== "pencil"
        ? {
            x: mouseX,
            y: mouseY,
          }
        : undefined,
    points:
      selectedTool === "pencil"
        ? [
            {
              x: mouseX,
              y: mouseY,
            },
          ]
        : undefined,
    color: "#374151",
    lineWidth: 1,
    isErased: false,
    isDragged: false,
    isResized: false,
    isRotated: false,
    isDeleted: false,
    isDrawn: false,
    isActive: false,
    zIndex: 0,
  };

  setActiveForegroundElement(currentActiveElement);
  const animationFunctions: AnimateForegroundElement | Nothing =
    animateForegroundElement(foregroundContext);
  if (!animationFunctions) return;
  const { startAnimation, stopAnimation } = animationFunctions;

  function onMouseMove(e: MouseEvent) {
    if (!foregroundCanvasRef.current) return;
    const canvasRect = foregroundCanvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;
    isDragging = crossedThresholdDistance(
      mouseX,
      mouseY,
      currentActiveElement.startCoordinates!.x,
      currentActiveElement.startCoordinates!.y,
      minDistance
    );

    if (isDragging) {
      if (!animationStarted) {
        startAnimation();
        animationStarted = true;
      }
      // const updatedElement = { ...currentActiveElement };
      if (selectedTool !== "pencil") {
        currentActiveElement.endCoordinates = {
          x: mouseX,
          y: mouseY,
        };
      } else {
        currentActiveElement.points!.push({
          x: mouseX,
          y: mouseY,
        });
      }
      setActiveForegroundElement(currentActiveElement);
    }
  }

  function onMouseUp(e: MouseEvent) {
    if (!foregroundCanvasRef.current) return;
    const foregroundContext = foregroundCanvasRef.current.getContext("2d");
    const canvasRect = foregroundCanvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;
    // const updatedElement = { ...currentActiveElement};
    currentActiveElement.isActive = true;
    if (selectedTool !== "pencil") {
      currentActiveElement.endCoordinates = {
        x: mouseX,
        y: mouseY,
      };
    } else {
      currentActiveElement.points!.push({
        x: mouseX,
        y: mouseY,
      });
    }
    setActiveForegroundElement(currentActiveElement);
    stopAnimation();
    foregroundContext!.clearRect(0, 0, foregroundContext!.canvas.width, foregroundContext!.canvas.height);
    foregroundCanvasRef.current.removeEventListener("mousemove", onMouseMove);
    foregroundCanvasRef.current.removeEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "default";
    isDragging = false;
    animationStarted = false;
    setRecoilElements(prevElements => [...prevElements, activeForegroundElement!]);
    setSelectedTool("select");
  }

  foregroundCanvasRef.current.addEventListener("mousemove", onMouseMove);
  foregroundCanvasRef.current.addEventListener("mouseup", onMouseUp);
}

function crossedThresholdDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  minDistance: number
) {
  const distanceMoved = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  return distanceMoved >= minDistance;
}
