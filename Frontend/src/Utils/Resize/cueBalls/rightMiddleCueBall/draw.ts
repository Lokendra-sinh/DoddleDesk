import { attachListeners } from "../rightMiddleCueBall/listeners";

export function drawRightMiddleCueBall(
  left: number,
  top: number,
  width: string,
  height: string,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  activeElementId: string | ""
) {
  let rightMiddleCueBall = document.querySelector(
    ".right-middle-cue-ball"
  ) as HTMLDivElement;
  if (!rightMiddleCueBall) {
    rightMiddleCueBall = document.createElement("div");
    rightMiddleCueBall.style.position = "absolute";
    rightMiddleCueBall.style.zIndex = "1001";
    rightMiddleCueBall.style.border = "2px solid #fecdd3";
    rightMiddleCueBall.style.width = width;
    rightMiddleCueBall.style.height = height;
    rightMiddleCueBall.style.borderRadius = "30%";
    rightMiddleCueBall.style.backgroundColor = "white";
    rightMiddleCueBall.style.pointerEvents = "all";
    rightMiddleCueBall.className = "right-middle-cue-ball resize-handle";
    document.body.appendChild(rightMiddleCueBall);
    attachListeners(rightMiddleCueBall, canvasRef);
  }

  rightMiddleCueBall.style.left = `${left}px`;
  rightMiddleCueBall.style.top = `${top}px`;
  rightMiddleCueBall.style.display = "block";

  
}
