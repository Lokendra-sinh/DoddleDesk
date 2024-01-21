import { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import { useRecoilState } from "recoil";
import { elementsAtom } from "../../Recoil/Atoms/elements";
import { handleMouseClick } from "../../Utils/UserInteractions/handleMouseClick";
import { handleMouseMovement } from "../../Utils/UserInteractions/handleMouseMovement";
import { handleMouseDown } from "../../Utils/UserInteractions/handleMouseDown";
import { drawElement } from "../../Utils/drawElements";
import { handleResize } from "../../Utils/canvasEventHandlers";
import { initiateCanvas } from "../../Utils/canvasEventHandlers";
import {
  ElementsContainer,
  ElementTypes,
} from "../../Types/Types";
import { currentTool } from "../../Recoil/Atoms/tools";
import { handleCanvasToolActions } from "../../Utils/handleCanvasToolActions";
import { drawResizeHandlesAndBoundingBox } from "../../Utils/Resize/drawResizeHandlesAndBoundingBox";
import { hideResizeHandlesAndBoundingBox } from "../../Utils/Resize/hideResizeHandlesAndBoundingBox";



export let elementsOnCanvas: ElementsContainer = [];
export let activeElementId: string = "";
export let activeElementIndex: number = -1;

export const setActiveElementId = (id: string | "") => {
  activeElementId = id;
  console.log("activeElementId: ", activeElementId);
};

export const setActiveElementIndex = (index: number) => {
  activeElementIndex = index;
  console.log("activeElementIndex: ", activeElementIndex);
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

export const overlayForDrag = document.createElement("div");
overlayForDrag.style.position = "fixed";
overlayForDrag.style.top = "0";
overlayForDrag.style.left = "0";
overlayForDrag.style.width = "100vw";
overlayForDrag.style.height = "100vh";
overlayForDrag.style.cursor = "nwse-resize";
overlayForDrag.style.zIndex = "9999";
overlayForDrag.style.display = "none";
overlayForDrag.style.pointerEvents = "all";
overlayForDrag.className = "overlay-for-dragging";

document.body.appendChild(overlayForDrag);

const Board: React.FC = () => {
  console.log("inside board");
  const [selectedTool, setSelectedTool] = useRecoilState<string>(currentTool);
  const [recoilElements, setRecoilElements] = useRecoilState<ElementsContainer>(elementsAtom);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let currentActiveElement: ElementTypes | undefined = undefined;

  let animationFrameId: number | null = null;
  if(activeElementId !== ""){
    currentActiveElement = elementsOnCanvas.find((element) => element.id === activeElementId);
  }
  const resizeClosure = () => handleResize(canvasRef);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    console.log("currentActiveElementId: ", activeElementId);

    const handleUserClick = (e: MouseEvent) => {
      handleMouseClick(e, canvasRef, setActiveElementId, setSelectedTool, setRecoilElements);
    };
  
    const handleUserMouseMovement = (e: MouseEvent) => {
      handleMouseMovement(e, canvasRef, setRecoilElements, currentActiveElement)
    };

    const handleUserMouseDown = (e: MouseEvent) => {
      handleMouseDown(e, canvasRef, setRecoilElements);
    };

    if(selectedTool === "select"){
      document.addEventListener("click", handleUserClick);
      document.addEventListener("mousemove", handleUserMouseMovement);
      document.addEventListener("mousedown", handleUserMouseDown);
    }
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
        cleanup ? cleanup() : null;
        animationFrameId ? cancelAnimationFrame(animationFrameId) : null;
        document.removeEventListener("click", handleUserClick);
        document.removeEventListener("mousemove", handleUserMouseMovement);
        document.removeEventListener("mousedown", handleUserMouseDown);
  
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
