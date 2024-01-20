import { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import { useRecoilState } from "recoil";
import { elementsAtom } from "../../Recoil/Atoms/elements";
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
import { hideResizeHandlesAndBoundingBox } from "../../Utils/Resize/hideResizeHandlesAndBoundingBox";


export let elementsOnCanvas: ElementsContainer = [];
export let activeElementId: string = "";

export const setActiveElementId = (id: string | "") => {
  activeElementId = id;
  console.log("activeElementId: ", activeElementId);
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
  const [recoilElements, setRecoilElements] = useRecoilState<ElementsContainer>(elementsAtom);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  let animationFrameId: number | null = null;
  const resizeClosure = () => handleResize(canvasRef);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    console.log("inside useEffect due to selectedTool & activeElementId change");
    console.log("currentActiveElementId: ", activeElementId);
    const handleCanvasClick = (e: MouseEvent) => {
      handleClick(e, canvasRef, setActiveElementId, setSelectedTool, setRecoilElements);
    };
    if(selectedTool === "select") canvasRef.current.addEventListener("click", handleCanvasClick);
    if(activeElementId === "") hideResizeHandlesAndBoundingBox();

    function animate() {
      if (!ctx) return;
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (elementsOnCanvas.length > 0) {
        elementsOnCanvas.forEach((element) => {
          drawElement(ctx, element);
          if(element.id === activeElementId){
            drawResizeHandlesAndBoundingBox(element, canvasRef, activeElementId);
          }
        });
      }
    }

    animate();


    const cleanup = handleCanvasToolActions(
      canvasRef,
      selectedTool,
      setSelectedTool,
      setActiveElementId,
      setRecoilElements,
    );
    return () => {
      if(cleanup) cleanup();
      console.log("inside useEffect cleanup");
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("click", handleCanvasClick);
      }
    }
  }, [selectedTool, recoilElements]);

  useEffect(() => {
    console.log("inside useEffect as component mounts");
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
