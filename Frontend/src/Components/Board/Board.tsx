import { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import { tools } from "../../Recoil/Atoms/tools";
import { useRecoilState } from "recoil";
import { toolTypes } from "../../Recoil/Atoms/tools";
import { elementTypes } from "../../Recoil/Atoms/elements";
import { elementsContainer } from "../../Recoil/Atoms/elements";
import { elementsAtom } from "../../Recoil/Atoms/elements";
import { drawBiSquare } from "../../Utils/drawingHelpers";
import { redrawElements } from "../../Utils/drawingHelpers";
import { drawSquare } from "../../Utils/drawingHelpers";
import { drawCircle } from "../../Utils/drawingHelpers";
import { drawEllipse } from "../../Utils/drawingHelpers";
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
  const cornerRadius = 20;
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [selectedTools, setSelectedTool] = useRecoilState<toolTypes>(tools);
  const [elements, setElements] =
    useRecoilState<elementsContainer>(elementsAtom);

  const [startPosition, setStartPosition] = useState<position>({ x: 0, y: 0 });
  const [lastPosition, setLastPosition] = useState<position>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  let currentTool:string | undefined = Object.keys(selectedTools.tools).find(
    key => selectedTools.tools[key as keyof typeof selectedTools.tools]
  );
  const mouseWasMoved = useRef<boolean>(false);
  const mouseWasClicked = useRef<boolean>(false);

  function handleStartDrawing(e: mouseEvent) {
    console.log("inside mousemove");
    if (!isDrawing || !canvasRef.current) return;
    const lastX = e.clientX - (canvasRef.current.offsetLeft ?? 0);
    const lastY = e.clientY - (canvasRef.current.offsetTop ?? 0);

    const distanceMoved = Math.sqrt(Math.pow(lastX - startPosition.x, 2) + Math.pow(lastY - startPosition.y, 2));
    if(distanceMoved > 5) {
      mouseWasMoved.current = true;
    }
    if(!mouseWasMoved.current) return;
    setLastPosition({ x: lastX, y: lastY });
    selectedTools.tools.square &&
      drawSquare(
        canvasRef,
        selectedTools,
        startPosition,
        { x: lastX, y: lastY },
        elements
      );
    selectedTools.tools.biSquare &&
      drawBiSquare(
        canvasRef,
        startPosition,
        { x: lastX, y: lastY },
        selectedTools,
        elements,
        cornerRadius
      );
    selectedTools.tools.circle &&
      drawCircle(
        canvasRef,
        startPosition,
        { x: lastX, y: lastY },
        selectedTools,
        elements
      );
    selectedTools.tools.ellipse &&
      drawEllipse(
        canvasRef,
        startPosition,
        { x: lastX, y: lastY },
        selectedTools,
        elements
      );
  }

  function handleInitiateDrawing(e: mouseEvent) {
    console.log("inside mousedown");
    if (!canvasRef.current) return;
    const newX = e.clientX - (canvasRef.current.offsetLeft ?? 0);
    const newY = e.clientY - (canvasRef.current.offsetTop ?? 0);
    setStartPosition({ x: newX, y: newY });
    setIsDrawing(true);
    mouseWasMoved.current = false;
    // console.log("inside mousedown: ", mouseWasMoved.current);
  }

  function handleStopDrawing(e: mouseEvent) {
    console.log("inside mouseup: ", mouseWasMoved.current);
    console.log("inside mouseup");
    if (!isDrawing || !canvasRef.current) return;
    setIsDrawing(false);
    if(mouseWasMoved.current){
      const element: elementTypes = {
        type: currentTool,
        startCoordinates: startPosition,
        endCoordinates: lastPosition,
        color: selectedTools.color,
        size: selectedTools.size,
        cornerRadius:
          currentTool === "biSquare" ? cornerRadius : undefined,
        cursor: selectedTools.cursor,
      };
      setElements([...elements, element]);
    }
    canvasRef.current.style.cursor = "default";
    mouseWasMoved.current = false;
  }

  useEffect(() => {
   if(!canvasRef.current) return;
   if(!currentTool) return;
    canvasRef.current.style.cursor = "crosshair";
  },[selectedTools]);


  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Initialize and redraw canvas
    initiateCanvas(canvasRef);
    redrawElements(canvasRef, elements);

    // Resize handling
    const resizeClosure = () => handleResize(canvasRef, elements);
    window.addEventListener("resize", resizeClosure);

    return () => {
      window.removeEventListener("resize", resizeClosure);
    };
  }, [elements, canvasRef]);

  return (
    <div className="w-full h-full bg-gray-100">
      <Navbar />
      <canvas
        onMouseDown={handleInitiateDrawing}
        onMouseMove={handleStartDrawing}
        onMouseUp={handleStopDrawing}
        ref={canvasRef}
        id="canvas"
      ></canvas>
    </div>
  );
};

export default Board;
