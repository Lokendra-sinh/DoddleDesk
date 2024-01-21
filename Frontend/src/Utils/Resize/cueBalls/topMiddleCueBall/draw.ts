import { attachListeners } from "../topMiddleCueBall/listeners";

export function drawTopMiddleCueBall(
  left: number,
  top: number,
  width: string,
  height: string,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  activeElementId: string | ""
) {
  let topMiddleCueBall = document.querySelector(
    ".top-middle-cue-ball"
  ) as HTMLDivElement;
  if (!topMiddleCueBall) {
    topMiddleCueBall = document.createElement("div");
    topMiddleCueBall.style.position = "absolute";
    topMiddleCueBall.style.zIndex = "1001";
    topMiddleCueBall.style.border = "2px solid #fecdd3";
    topMiddleCueBall.style.width = width;
    topMiddleCueBall.style.height = height;
    topMiddleCueBall.style.borderRadius = "30%";
    topMiddleCueBall.style.backgroundColor = "white";
    topMiddleCueBall.style.pointerEvents = "all";
    topMiddleCueBall.className = "top-middle-cue-ball resize-handle";
    document.body.appendChild(topMiddleCueBall);
    attachListeners(topMiddleCueBall, canvasRef);
  }

  topMiddleCueBall.style.left = `${left}px`;
  topMiddleCueBall.style.top = `${top}px`;
  topMiddleCueBall.style.display = "block";

}
