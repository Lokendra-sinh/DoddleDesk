import { attachListeners } from "./listeners";

export function drawTopRightCueBall(left: number, top: number, width: string, height: string, canvasRef: React.RefObject<HTMLCanvasElement>) {
  let topRightCueBall = document.querySelector('.top-right-cue-ball') as HTMLDivElement;
  if(!topRightCueBall) {
  topRightCueBall = document.createElement("div");
  topRightCueBall.style.position = "absolute";
  topRightCueBall.style.zIndex = "1001"
  topRightCueBall.style.border = "2px solid #fecdd3";
  topRightCueBall.style.width = width;
  topRightCueBall.style.height = height;
  topRightCueBall.style.borderRadius = "30%";
  topRightCueBall.style.backgroundColor = "white";
  topRightCueBall.style.pointerEvents = "all";
  topRightCueBall.className = "top-right-cue-ball";
  document.body.appendChild(topRightCueBall);

  attachListeners(topRightCueBall, canvasRef);
  }

  topRightCueBall.style.left = `${left}px`;
  topRightCueBall.style.top = `${top}px`;
  topRightCueBall.style.display = "block";

}