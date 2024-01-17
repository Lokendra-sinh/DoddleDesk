import { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import { tools } from "../../Recoil/Atoms/tools";
import { useRecoilState } from "recoil";
import { toolTypes } from "../../Recoil/Atoms/tools";
import { drawableElements } from "../../Recoil/Atoms/tools";
import { elementTypes } from "../../Recoil/Atoms/elements";
import { elementsContainer } from "../../Recoil/Atoms/elements";
import { elementsAtom } from "../../Recoil/Atoms/elements";
import { handleCanvasDrawing } from "../../Utils/handleCanvasDrawing";
import { drawElements } from "../../Utils/drawElements";
import { drawBoundingBoxAndCueBalls } from "../../Utils/resizeElements/drawBoundingBoxAndCueBalls";
import { handleResize } from "../../Utils/canvasEventHandlers";
import { initiateCanvas } from "../../Utils/canvasEventHandlers";
import "./Board.css";

type mouseEvent = React.MouseEvent<HTMLCanvasElement, MouseEvent>;
type position = {
  x: number;
  y: number;
};

  const Board: React.FC = () => {
    console.log("inside board");
    const [selectedTool, setSelectedTool] = useRecoilState<toolTypes>(tools);
    console.log("renreding board");
    const [elements, setElements] =
      useRecoilState<elementsContainer>(elementsAtom);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const currentTool: string | undefined = Object.keys(selectedTool.tools).find(
      (key) => selectedTool.tools[key as keyof drawableElements] === true
    );
    console.log("currentTool: ", currentTool);

    let canvasElement = useRef<elementTypes>({
      type: "",
      startCoordinates: { x: 0, y: 0 },
      endCoordinates: { x: 0, y: 0 },
      color: "",
      size: 0,
      cursor: "",
      id: "",
      active: false,
    });

    let animationFrameId: number | null = null;
    // let selectedElementId = useRef<string | null>("");


    const resizeClosure = () => handleResize(canvasRef, elements);

    useEffect(() => {
      console.log(elements); // Check if elements are updated correctly
    }, [elements]);
    

    useEffect(() => {
      console.log("currentTool in useEfect: ", currentTool);
      if (!canvasRef.current) return;
      if(!currentTool) return;
      // selectedElementId.current = "";
      if (currentTool === "eraser") {
        canvasRef.current.style.cursor = "none";
      } else {
        canvasRef.current.style.cursor = "crosshair";
        handleCanvasDrawing(
          canvasRef,
          setElements,
          currentTool,
          canvasElement,
          // selectedElementId
        );
      }
    }, [currentTool]);


    useEffect(() => {
      console.log("inside useEffect due to elements change");
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        initiateCanvas(canvasRef);
        window.addEventListener("resize", resizeClosure);

        console.log("elements are: ", canvasElement);

        function animate() {
          if (!ctx) return;
          animationFrameId = requestAnimationFrame(animate);
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

          if(elements.length > 0){
            elements.forEach((element) => {
              drawElements(ctx, element);
              if(element.active){
                drawBoundingBoxAndCueBalls(ctx, element);
              }
            });
          }

          if(canvasElement.current){
            drawElements(ctx, canvasElement.current);
          }
        }

        animate();
      }

      return () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (canvasRef.current) {
          window.removeEventListener("resize", resizeClosure);
        }
      };
    }, [canvasRef, elements]);

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
