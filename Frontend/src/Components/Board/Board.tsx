import { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import { tools } from "../../Recoil/Atoms/tools";
import { useRecoilState } from "recoil";
import { toolTypes } from "../../Recoil/Atoms/tools";
import { elementTypes } from "../../Recoil/Atoms/elements";
import { elementsContainer } from "../../Recoil/Atoms/elements";
import { elementsAtom } from "../../Recoil/Atoms/elements";

type mouseEvent = React.MouseEvent<HTMLCanvasElement, MouseEvent>;

const Board: React.FC = () => {
  console.log("inside board");

  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [selectedTools, setSelectedTool] = useRecoilState<toolTypes>(tools);
  const [elements, setElements] =
    useRecoilState<elementsContainer>(elementsAtom);

  let currentSelectedTool: string;
  for (let key in selectedTools.tools) {
    if (selectedTools.tools[key as keyof typeof selectedTools.tools]) {
      currentSelectedTool = key;
    }
  }
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function setInitialCoordinates(e: mouseEvent) {
    console.log("inside mousedown");
    const x = e.clientX - (canvasRef.current?.offsetLeft ?? 0);
    const y = e.clientY - (canvasRef.current?.offsetTop ?? 0);
    setStartPosition({ x, y });
    setIsDrawing(true);
  }

  function setFinalCoordinates(e: mouseEvent) {
    console.log("inside mouseup");
    const x = e.clientX - (canvasRef.current?.offsetLeft ?? 0);
    const y = e.clientY - (canvasRef.current?.offsetTop ?? 0);
    setLastPosition({ x, y });
    setIsDrawing(false);
    const element: elementTypes = {
      type: currentSelectedTool,
      startX: startPosition.x,
      startY: startPosition.y,
      endX: x,
      endY: y,
      color: selectedTools.color,
      size: selectedTools.size,
    };
    setElements([...elements, element]);
  }

  function initiateDrawing(e: mouseEvent) {
    console.log("inside mousemove");
    if (!isDrawing || !canvasRef.current) return;

    const currentX = e.clientX - (canvasRef.current.offsetLeft ?? 0);
    const currentY = e.clientY - (canvasRef.current.offsetTop ?? 0);

    // Clear the canvas and redraw existing elements here if necessary
    // elements.forEach(element => drawElementFromState(element));

    drawSquare(currentX, currentY);
  }

  function drawSquare(currentX: number, currentY: number) {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    redrawElements();
    ctx.strokeStyle = selectedTools.color;
    ctx.lineWidth = selectedTools.size;
    ctx.strokeRect(
      startPosition.x,
      startPosition.y,
      currentX - startPosition.x,
      currentY - startPosition.y
    );
    // ctx.strokeRect(startPosition.x, startPosition.y, currentX - startPosition.x, currentY - startPosition.y);
  }

  const drawElement = (currentX: number, currentY: number) => {
    if (!canvasRef.current) return;
    selectedTools.tools.square && drawSquare(currentX, currentY);
  };

  function redrawElements() {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    elements.forEach((element) => {
      ctx.strokeStyle = element.color;
        ctx.lineWidth = element.size;
      ctx.strokeRect(
        element.startX,
        element.startY,
        element.endX - element.startX,
        element.endY - element.startY
      );
    });
  }

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    initiateCanvas(canvasRef.current);
    redrawElements();

    const handleResize = () => {
        if(!canvasRef.current) return;
        const dpi = window.devicePixelRatio;
        canvasRef.current.width = window.innerWidth * dpi;
        canvasRef.current.height = window.innerHeight * dpi;
        ctx.scale(dpi, dpi);
        redrawElements();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [elements]);

  return (
    <div className="w-full h-full bg-gray-100">
      <Navbar />
      <canvas
        onMouseDown={setInitialCoordinates}
        onMouseUp={setFinalCoordinates}
        onMouseMove={initiateDrawing}
        ref={canvasRef}
        id="canvas"
        className="bg-gray-100"
      ></canvas>
    </div>
  );
};

export default Board;

function initiateCanvas(canvas: HTMLCanvasElement | null) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpi = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpi;
    canvas.height = window.innerHeight * dpi;
    ctx.scale(dpi, dpi);
    ctx.fillStyle = "#f9fafb";
    ctx.fillRect(0, 0, canvas.width / dpi, canvas.height / dpi);
  }