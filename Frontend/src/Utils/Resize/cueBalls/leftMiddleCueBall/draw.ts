import { attachListeners } from "../leftMiddleCueBall/listeners";

export function drawLeftMiddleCueBall(
  left: number,
  top: number,
  width: string,
  height: string,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  activeElementId: string | ""
) {
  let leftMiddleCueBall = document.querySelector(
    ".left-middle-cue-ball"
  ) as HTMLDivElement;
  if (!leftMiddleCueBall) {
    leftMiddleCueBall = document.createElement("div");
    leftMiddleCueBall.style.position = "absolute";
    leftMiddleCueBall.style.zIndex = "1001";
    leftMiddleCueBall.style.border = "2px solid #fecdd3";
    leftMiddleCueBall.style.width = width;
    leftMiddleCueBall.style.height = height;
    leftMiddleCueBall.style.borderRadius = "30%";
    leftMiddleCueBall.style.backgroundColor = "white";
    leftMiddleCueBall.style.pointerEvents = "all";
    leftMiddleCueBall.className = "left-middle-cue-ball resize-handle";
    document.body.appendChild(leftMiddleCueBall);
    attachListeners(leftMiddleCueBall, canvasRef);
  }

  leftMiddleCueBall.style.left = `${left}px`;
  leftMiddleCueBall.style.top = `${top}px`;
  leftMiddleCueBall.style.display = "block";

  
}
