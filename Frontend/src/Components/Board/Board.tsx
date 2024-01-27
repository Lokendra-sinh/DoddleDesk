import { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import { useRecoilState } from "recoil";
import { elementsAtom } from "../../Recoil/Atoms/elements";
import { handleResize } from "../../Utils/canvasEventHandlers";
import { initiateCanvas } from "../../Utils/canvasEventHandlers";
import { ElementsContainer, ElementTypes } from "../../Types/Types";
import { currentTool } from "../../Recoil/Atoms/tools";
import { handleCanvasToolActions } from "../../Utils/handleCanvasToolActions";
import { debounce } from "lodash";
import { drawStaticElements } from "../../Utils/Render/StaticElements/drawStaticElements";
import { setAnimationContext } from "../../Utils/Render/DynamicElements/handleSelectedShapeAnimation";
import { canvasElements } from "../../Utils/interactionhelpers";

const Board: React.FC = () => {
  console.log("rendering board");
  const [selectedTool, setSelectedTool] = useRecoilState<string>(currentTool);
  const [recoilElements, setRecoilElements] =
    useRecoilState<ElementsContainer>(elementsAtom);
  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);



  useEffect(() => {
    if(!mainCanvasRef.current) return;
    console.log("recoilElements inside useEffect: ", recoilElements);
    const ctx = mainCanvasRef.current.getContext("2d");
    if(!ctx) return;
    setAnimationContext(ctx, mainCanvasRef, setRecoilElements);
    console.log("canvasElements inside useEffect: ", canvasElements);
    drawStaticElements(
      mainCanvasRef,
      recoilElements
    );

    const cleanup = handleCanvasToolActions(
      mainCanvasRef,
      selectedTool,
      setSelectedTool,
      setRecoilElements,
      recoilElements
    );

    return () => {
      cleanup ? cleanup() : null;

    };
  }, [selectedTool, recoilElements]);

  useEffect(() => {
    console.log("inside useEffect as component mounts");

    initiateCanvas(
      mainCanvasRef
    );

    const resizeClosure = () => {
      handleResize(
        mainCanvasRef,
        recoilElements,
        setRecoilElements
      );
    }
    const debouncedResize = debounce(resizeClosure, 20);
  

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);

  return (
      <div className="relative flex flex-col bg-white">
        <Navbar />
        <div id="canvas-container" className="relative w-screen h-[950px] overflow-auto overflow-x-hidden">
          <canvas
            ref={mainCanvasRef}
            id="main-canvas"
            className="absolute top-0 left-0 z-1"
          ></canvas>
        </div>
      </div>
    );
};

export default Board;
