import { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import { tools } from "../../Recoil/Atoms/tools";
import { useRecoilState } from "recoil";
import { toolTypes } from "../../Recoil/Atoms/tools";
import { elementTypes } from "../../Recoil/Atoms/elements";
import { elementsContainer } from "../../Recoil/Atoms/elements";
import { elementsAtom } from "../../Recoil/Atoms/elements";
import { drawBiSquare } from '../../Utils/drawingHelpers';
import { redrawElements } from '../../Utils/drawingHelpers';
import { drawSquare } from '../../Utils/drawingHelpers';
import { handleResize } from '../../Utils/canvasEventHandlers'
import { initiateCanvas } from '../../Utils/canvasEventHandlers'
import './Board.css';

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

  let currentSelectedTool: string;
  for (let key in selectedTools.tools) {
    if (selectedTools.tools[key as keyof typeof selectedTools.tools]) {
      currentSelectedTool = key;
    }
  }
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function handleStartDrawing(e: mouseEvent) {
    console.log("inside mousemove");
    if (!isDrawing || !canvasRef.current) return;

    const lastX = e.clientX - (canvasRef.current.offsetLeft ?? 0);
    const lastY = e.clientY - (canvasRef.current.offsetTop ?? 0);
    setLastPosition({ x: lastX, y: lastY });
    selectedTools.tools.square && drawSquare(canvasRef, selectedTools, startPosition, { x: lastX, y: lastY }, elements);
    selectedTools.tools.biSquare && drawBiSquare(canvasRef, startPosition, { x: lastX, y: lastY }, selectedTools, elements, cornerRadius);
  }

  function handleInitiateDrawing(e: mouseEvent) {
    console.log("inside mousedown");
    if (!canvasRef.current) return;
    const newX = e.clientX - (canvasRef.current.offsetLeft ?? 0);
    const newY = e.clientY - (canvasRef.current.offsetTop ?? 0);
    setStartPosition({ x: newX, y: newY });
    setIsDrawing(true);
  }

  function handleStopDrawing(e: mouseEvent) {
    console.log("inside mouseup");
    if (!canvasRef.current) return;
    const newX = e.clientX - (canvasRef.current.offsetLeft ?? 0);
    const newY = e.clientY - (canvasRef.current.offsetTop ?? 0);
    setLastPosition({ x: newX, y: newY });
  const element: elementTypes = {
    type: currentSelectedTool,
    startCoordinates: startPosition,
    endCoordinates: { x: newX, y: newY },
    color: selectedTools.color,
    size: selectedTools.size,
    cornerRadius: currentSelectedTool === "biSquare" ? cornerRadius : undefined,
    cursor: selectedTools.cursor,
  };
  setElements([...elements, element]);
  setIsDrawing(false);
  }

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    initiateCanvas(canvasRef);
    redrawElements(canvasRef, elements);

    const resizeClosure = () => handleResize(canvasRef, elements);

    window.addEventListener("resize", resizeClosure);

    if(elements.length > 0) {
      elements.forEach((element) => {
        console.log(element);
      });
    }

    return () => {
      window.removeEventListener("resize", resizeClosure);
    };
  }, [elements]);

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
