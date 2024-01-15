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
import { AddVisualCueBalls } from "../../Utils/resizeHandlers";
import { hideAllCueBalls } from "../../Utils/resizeHandlers";
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
  console.log("renreding board");
  const [elements, setElements] =
    useRecoilState<elementsContainer>(elementsAtom);
 const [selectedElement, setSelectedElement] = useState<elementTypes | null>(null);
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
    console.log("now drawing");
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
    hideAllCueBalls();
    if (!canvasRef.current) return;
    if(canvasRef.current.style.cursor !== "crosshair") return;
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
    let element: elementTypes | undefined;
    if(mouseWasMoved.current){
      element = {
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
      AddVisualCueBalls(canvasRef, element);
  }


  function handleVisualCueBalls(e: MouseEvent) {
    let clickedElementId: number | null = null;
    if (!canvasRef.current) return;
    const clickedX = e.clientX - (canvasRef.current.offsetLeft ?? 0);
    const clickedY = e.clientY - (canvasRef.current.offsetTop ?? 0);

    elements.forEach((element, index) => {
      if (
        clickedX >= element.startCoordinates.x &&
        clickedX <= element.endCoordinates.x &&
        clickedY >= element.startCoordinates.y &&
        clickedY <= element.endCoordinates.y
      ) {
        clickedElementId = index;
      }
    });

    if (clickedElementId !== null) {
      setSelectedElement(elements[clickedElementId]);
      AddVisualCueBalls(canvasRef, elements[clickedElementId]);
    } else {
      setSelectedElement(null);
      hideAllCueBalls();
    }

  }

  useEffect(() => {
    console.log("inside useEffect due to selectedTools change");
   if(!canvasRef.current) return;
    if(!selectedTools.tools[currentTool as keyof typeof selectedTools.tools]) return;
   canvasRef.current.style.cursor = "crosshair";
  },[selectedTools]);


  useEffect(() => {
    console.log("inside useEffect due to elements change");
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    if(elements.length === 0) return;
    // Initialize and redraw canvas
    initiateCanvas(canvasRef);
    console.log("redrawing elements: ", elements);
    redrawElements(canvasRef, elements);
    // AddVisualCueBalls(canvasRef, elements, elements[elements.length - 1])

    const handleCanvasClick = (e: MouseEvent) => {
      handleVisualCueBalls(e);
    }

    canvasRef.current.addEventListener("click", handleCanvasClick);
    const resizeClosure = () => handleResize(canvasRef, elements);
    window.addEventListener("resize", resizeClosure);

    return () => {
      window.removeEventListener("resize", resizeClosure);
      canvasRef.current?.removeEventListener("click", handleCanvasClick);
    };
  }, [canvasRef, elements]);

  return (
    <div className="w-full h-full bg-gray-100">
      <Navbar />
      <canvas
        width={window.innerWidth}
        height={window.innerHeight}
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
