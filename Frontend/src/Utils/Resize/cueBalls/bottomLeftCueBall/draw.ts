import { attachListeners } from "./listeners";

export function drawBottomLeftCueBall(
  left: number,
  top: number,
  width: string,
  height: string,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  activeElementId: string | ""
) {

  let bottomLeftCueBall = document.querySelector(
    ".bottom-left-cue-ball"
  ) as HTMLDivElement;
  if (!bottomLeftCueBall) {
    bottomLeftCueBall = document.createElement("div");
    bottomLeftCueBall.style.position = "absolute";
    bottomLeftCueBall.style.zIndex = "1001";
    bottomLeftCueBall.style.border = "2px solid #fecdd3";
    bottomLeftCueBall.style.width = width;
    bottomLeftCueBall.style.height = height;
    bottomLeftCueBall.style.borderRadius = "30%";
    bottomLeftCueBall.style.backgroundColor = "white";
    bottomLeftCueBall.style.pointerEvents = "all";
    bottomLeftCueBall.className = "bottom-left-cue-ball resize-handle";
    document.body.appendChild(bottomLeftCueBall);
    attachListeners(bottomLeftCueBall, canvasRef);
  }

  bottomLeftCueBall.style.left = `${left}px`;
  bottomLeftCueBall.style.top = `${top}px`;
  bottomLeftCueBall.style.display = "block";
}
