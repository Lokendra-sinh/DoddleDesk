import { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import { useRecoilState } from "recoil";
import { elementsAtom, activeElementIdAtom } from "../../Recoil/Atoms/elements";
import {
  handleActiveElementDrawing,
  handleClick,
} from "../../Utils/handleCanvasDrawing";
import { drawElement } from "../../Utils/drawElements";
import { drawBoundingBoxAndCueBalls } from "../../Utils/resizeElements/drawBoundingBoxAndCueBalls";
import { setActiveBoxAndCueBalls } from "../../Utils/handleActiveElements/setActiveBoxAndCueBalls";
import { handleResize } from "../../Utils/canvasEventHandlers";
import { initiateCanvas } from "../../Utils/canvasEventHandlers";
import {
  BoundingBoxAndCueBalls,
  ElementsContainer,
  ElementTypes,
  ToolFlags,
  ToolProperties,
} from "../../Types/Types";
import { currentTool } from "../../Recoil/Atoms/tools";
import { handleCanvasToolActions } from "../../Utils/handleCanvasToolActions";
import { drawResizeHandlesAndBoundingBox } from "../../Utils/Resize/drawResizeHandlesAndBoundingBox";


export let elementsOnCanvas: ElementsContainer = [];
export let activeElementId: string = "";

export const setActiveElementId = (id: string) => {
  activeElementId = id;
};

export const getActiveElementId = () => {
  return activeElementId;
};

export const setElementsOnCanvas = (elements: ElementsContainer) => {
  elementsOnCanvas = elements;
};

export const getElementsOnCanvas = () => {
  return elementsOnCanvas;  
};

const overlayForDrag = document.createElement("div");
overlayForDrag.style.position = "fixed";
overlayForDrag.style.top = "0";
overlayForDrag.style.left = "0";
overlayForDrag.style.width = "100vw";
overlayForDrag.style.height = "100vh";
overlayForDrag.style.cursor = "nwse-resize";
overlayForDrag.style.zIndex = "9999";
overlayForDrag.style.display = "none";
overlayForDrag.className = "overlay-for-dragging";

document.body.appendChild(overlayForDrag);

const Board: React.FC = () => {
  console.log("inside board");
  const [selectedTool, setSelectedTool] = useRecoilState<string>(currentTool);
  // const [activeElementId, setActiveElementId] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  console.log("selectedTool: ", selectedTool);

  // let elementsOnCanvas = useRef<ElementsContainer>([]);

  let activeBoxAndCueBalls = useRef<BoundingBoxAndCueBalls>({
    boundingBox: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    cueBalls: {
      topLeft: {
        x: 0,
        y: 0,
      },
      topRight: {
        x: 0,
        y: 0,
      },
      bottomLeft: {
        x: 0,
        y: 0,
      },
      bottomRight: {
        x: 0,
        y: 0,
      },
      topMiddle: {
        x: 0,
        y: 0,
      },
      bottomMiddle: {
        x: 0,
        y: 0,
      },
      leftMiddle: {
        x: 0,
        y: 0,
      },
      rightMiddle: {
        x: 0,
        y: 0,
      },
    },
  });

  let animationFrameId: number | null = null;
  const resizeClosure = () => handleResize(canvasRef);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    console.log("inside useEffect due to selectedTool change");
    
    const handleCanvasClick = (e: MouseEvent) => {
      handleClick(e, canvasRef);
    };
    if(selectedTool === "select") canvasRef.current.addEventListener("click", handleCanvasClick);

    function animate() {
      if (!ctx) return;
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (elementsOnCanvas.length > 0) {
        elementsOnCanvas.forEach((element) => {
          drawElement(ctx, element);
          if (element.id === activeElementId) {
            // drawBoundingBoxAndCueBalls(ctx, element, activeBoxAndCueBalls);
            drawResizeHandlesAndBoundingBox(element, canvasRef);
          }
        });
      }
    }

    animate();


    const cleanup = handleCanvasToolActions(
      canvasRef,
      selectedTool,
      setSelectedTool,
      activeBoxAndCueBalls,
    );
    return () => {
      if(cleanup) cleanup();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("click", handleCanvasClick);
      }
    }
  }, [selectedTool]);

  useEffect(() => {
    console.log("inside useEffect due to elements change");
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    initiateCanvas(canvasRef);
    window.addEventListener("resize", resizeClosure);

    return () => {
      window.removeEventListener("resize", resizeClosure);
    }
  }, []);

  return (
    <div className="w-full h-full bg-gray-100">
      <Navbar />
      <canvas
        width={window.innerWidth}
        height={window.innerHeight}
        ref={canvasRef}
        id="canvas"
      ></canvas>
    </div>
  );
};

export default Board;
