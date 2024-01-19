import { attachListeners } from "./listeners";



export function drawTopLeftCueBall(left: number, top: number, width: string, height: string, canvasRef: React.RefObject<HTMLCanvasElement>) {
  let topLeftCueBall = document.querySelector('.top-left-cue-ball') as HTMLDivElement;
  if(!topLeftCueBall) {
  topLeftCueBall = document.createElement("div");
  topLeftCueBall.style.position = "absolute";
  topLeftCueBall.style.zIndex = "1001"
  topLeftCueBall.style.border = "2px solid #fecdd3";
  topLeftCueBall.style.width = width;
  topLeftCueBall.style.height = height;
  topLeftCueBall.style.borderRadius = "30%";
  topLeftCueBall.style.backgroundColor = "white";
  topLeftCueBall.style.pointerEvents = "all";
  topLeftCueBall.className = "top-left-cue-ball";
  document.body.appendChild(topLeftCueBall);

  attachListeners(topLeftCueBall, canvasRef);
  }

  topLeftCueBall.style.left = `${left}px`;
  topLeftCueBall.style.top = `${top}px`;
  topLeftCueBall.style.display = "block";

}