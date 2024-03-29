import { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import { ElementStyleControlsPanel } from "../Panel/SidePanel/ElementStyleControlsPanel";
import { useRecoilState } from "recoil";
import {
  DoddleDeskElements,
} from "../../Recoil/Atoms/elements";
import { handleResize } from "../../Utils/canvasEventHandlers";
import { initiateCanvas } from "../../Utils/canvasEventHandlers";
import { ElementsContainer} from "../../Types/Types";
import { currentTool } from "../../Recoil/Atoms/tools";
import { handleCanvasToolActions } from "../../Utils/handleCanvasToolActions";
import { debounce } from "lodash";
import { drawStaticElements } from "../../Utils/Render/StaticElements/drawStaticElements";
import {
  blinkingCursorIntervalId,
  setCanvasElements,
} from "../../Utils/interactionhelpers";
import { setAnimationContext } from "../../Utils/Render/DynamicElements/handleSelectedShapeAnimation";

const Board: React.FC = () => {
  const [selectedTool, setSelectedTool] = useRecoilState<string>(currentTool);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const [appElements, setAppElements] =
    useRecoilState<ElementsContainer>(DoddleDeskElements);
  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!mainCanvasRef.current) return;
    const ctx = mainCanvasRef.current.getContext("2d");
    if (!ctx) return;

    setAnimationContext(ctx, mainCanvasRef);
   
    drawStaticElements(
      mainCanvasRef,
      appElements,
      setIsSidePanelOpen
    );

    const cleanup = handleCanvasToolActions(
      mainCanvasRef,
      selectedTool,
      setSelectedTool,
      setAppElements,
      setIsSidePanelOpen
    );


    return () => {
      cleanup ? cleanup() : null;
      clearInterval(blinkingCursorIntervalId);
    };
  }, [selectedTool, appElements]);



  useEffect(() => {
   
    initiateCanvas(mainCanvasRef);

    try {
      const storedElements = localStorage.getItem("canvasElements");
      if (storedElements) {
        const elementsFromLocalStorage = JSON.parse(storedElements);
        setCanvasElements(elementsFromLocalStorage);
        setAppElements(elementsFromLocalStorage);
      }
    } catch (error) {
      console.error("Failed to parse canvas elements from localStorage:", error);
    }

    const resizeClosure = () => {
      handleResize(mainCanvasRef, setAppElements);
    };
    const debouncedResize = debounce(resizeClosure, 20);

    window.addEventListener("resize", debouncedResize);
    mainCanvasRef.current!.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
    return () => {
      clearInterval(blinkingCursorIntervalId);
      window.removeEventListener("resize", debouncedResize);
      mainCanvasRef.current!.removeEventListener(
        "contextmenu",
        function (event) {
          event.preventDefault();
        }
      );
    };
  }, []);

  return (
    <div className="relative flex flex-col bg-white">
      <Navbar
        isSidePanelOpen={isSidePanelOpen}
        setIsSidePanelOpen={setIsSidePanelOpen}
      />
      <div
        id="canvas-container"
        className="relative w-screen h-screen overflow-auto overflow-x-hidden"
      >
        <canvas
          ref={mainCanvasRef}
          id="main-canvas"
          className="absolute top-0 left-0 z-5"
        ></canvas>
      </div>
      {isSidePanelOpen && <ElementStyleControlsPanel canvasRef={mainCanvasRef} />}
    </div>
  );
};

export default Board;
