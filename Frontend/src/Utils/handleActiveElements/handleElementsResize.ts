import React from "react";
import { ElementTypes, BoundingBoxAndCueBalls } from "../../Types/Types";

let activeCueBall: string | null = null;

export function handleElementsResize(
  e: MouseEvent,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  currentElement: React.MutableRefObject<ElementTypes | null>,
  ActiveBoxAndCueBalls: React.MutableRefObject<BoundingBoxAndCueBalls>
) {
  if (!canvasRef.current) return;
  const cueBallRadius = 5; // Assuming a radius for the cue balls
  let activeCueBall: string | null = null;
  const mouseX = e.clientX - canvasRef.current.offsetLeft;
  const mouseY = e.clientY - canvasRef.current.offsetTop;

  showResizeCursors(mouseX, mouseY, ActiveBoxAndCueBalls.current, canvasRef);

  const handleMouseDown = (e: MouseEvent) => {
    onMouseDown(e, ActiveBoxAndCueBalls, canvasRef);
  };

  canvasRef.current.addEventListener("mousedown", handleMouseDown);
}


const onMouseDown = (
  e: MouseEvent,
  ActiveBoxAndCueBalls: React.MutableRefObject<BoundingBoxAndCueBalls>,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  if (!canvasRef.current) return;
  const mouseX = e.clientX - canvasRef.current.offsetLeft;
  const mouseY = e.clientY - canvasRef.current.offsetTop;
  activeCueBall = findActiveCueBall(
    mouseX,
    mouseY,
    ActiveBoxAndCueBalls.current
  );

  if (activeCueBall) {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }
};

const handleMouseMove = (e: MouseEvent) => {
  // Handle dragging logic here
  // Update the element's size/position based on activeCueBall and mouse position
};

const handleMouseUp = () => {
  // Clean up: remove event listeners and reset activeCueBall
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
  activeCueBall = null;
};

const findActiveCueBall = (mouseX: number, mouseY: number, activeBoxAndCueBalls: BoundingBoxAndCueBalls,) => {
    const cueBalls = activeBoxAndCueBalls.cueBalls;
  if (
    isMouseWithinCueBall(mouseX, mouseY, cueBalls.topLeft.x, cueBalls.topLeft.y)
  ) {
    return "topLeft";
  }

    if (
        isMouseWithinCueBall(
        mouseX,
        mouseY,
        cueBalls.topRight.x,
        cueBalls.topRight.y
        )
    ) {
        return "topRight";
    }

    if (
        isMouseWithinCueBall(
        mouseX,
        mouseY,
        cueBalls.bottomLeft.x,
        cueBalls.bottomLeft.y
        )
    ) {
        return "bottomLeft";
    }

    if (
        isMouseWithinCueBall(
        mouseX,
        mouseY,
        cueBalls.bottomRight.x,
        cueBalls.bottomRight.y
        )
    ) {
        return "bottomRight";
    }

    if (
        isMouseWithinCueBall(
        mouseX,
        mouseY,
        cueBalls.topMiddle.x,
        cueBalls.topMiddle.y
        )
    ) {
        return "topMiddle";
    }

    if (
        isMouseWithinCueBall(
        mouseX,
        mouseY,
        cueBalls.bottomMiddle.x,
        cueBalls.bottomMiddle.y
        )
    ) {
        return "bottomMiddle";
    }

    if (
        isMouseWithinCueBall(
        mouseX,
        mouseY,
        cueBalls.leftMiddle.x,
        cueBalls.leftMiddle.y
        )
    ) {
        return "leftMiddle";
    }

    if (
        isMouseWithinCueBall(
        mouseX,
        mouseY,
        cueBalls.rightMiddle.x,
        cueBalls.rightMiddle.y
        )
    ) {
        return "rightMiddle";
    }
  
  return null;
};


const isMouseWithinCueBall = (
    mouseX: number,
    mouseY: number,
    cueBallX: number,
    cueBallY: number
  ) => {
    const distance = Math.sqrt(
      Math.pow(mouseX - cueBallX, 2) + Math.pow(mouseY - cueBallY, 2)
    );
    return distance <= 5;
  };

function showResizeCursors(
  mouseX: number,
  mouseY: number,
  activeBoxAndCueBalls: BoundingBoxAndCueBalls,
    canvasRef: React.RefObject<HTMLCanvasElement>
) {
    if(!canvasRef.current) return;
    const cueBalls = activeBoxAndCueBalls.cueBalls;

  if (
    isMouseWithinCueBall(mouseX, mouseY, cueBalls.topLeft.x, cueBalls.topLeft.y)
  ) {
    console.log("Mouse is within top-left cue ball");
    canvasRef.current.style.cursor = "nwse-resize";
  } else if (
    isMouseWithinCueBall(
      mouseX,
      mouseY,
      cueBalls.topRight.x,
      cueBalls.topRight.y
    )
  ) {
    console.log("Mouse is within top-right cue ball");
    canvasRef.current.style.cursor = "nesw-resize";
  } else if (
    isMouseWithinCueBall(
      mouseX,
      mouseY,
      cueBalls.bottomLeft.x,
      cueBalls.bottomLeft.y
    )
  ) {
    console.log("Mouse is within bottom-left cue ball");
    canvasRef.current.style.cursor = "nesw-resize";
  } else if (
    isMouseWithinCueBall(
      mouseX,
      mouseY,
      cueBalls.bottomRight.x,
      cueBalls.bottomRight.y
    )
  ) {
    console.log("Mouse is within bottom-right cue ball");
    canvasRef.current.style.cursor = "nwse-resize";
  } else if (
    isMouseWithinCueBall(
      mouseX,
      mouseY,
      cueBalls.topMiddle.x,
      cueBalls.topMiddle.y
    )
  ) {
    console.log("Mouse is within top-middle cue ball");
    canvasRef.current.style.cursor = "ns-resize";
  } else if (
    isMouseWithinCueBall(
      mouseX,
      mouseY,
      cueBalls.bottomMiddle.x,
      cueBalls.bottomMiddle.y
    )
  ) {
    console.log("Mouse is within bottom-middle cue ball");
    canvasRef.current.style.cursor = "ns-resize";
  } else if (
    isMouseWithinCueBall(
      mouseX,
      mouseY,
      cueBalls.leftMiddle.x,
      cueBalls.leftMiddle.y
    )
  ) {
    console.log("Mouse is within left-middle cue ball");
    canvasRef.current.style.cursor = "ew-resize";
  } else if (
    isMouseWithinCueBall(
      mouseX,
      mouseY,
      cueBalls.rightMiddle.x,
      cueBalls.rightMiddle.y
    )
  ) {
    console.log("Mouse is within right-middle cue ball");
    canvasRef.current.style.cursor = "ew-resize";
  } else {
    canvasRef.current.style.cursor = "default";
  }
}
