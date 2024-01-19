import { attachListeners } from "../bottomMiddleCueBall/listeners";

export function drawBottomMiddleCueBall(left: number, top: number, width: string, height: string, canvasRef: React.RefObject<HTMLCanvasElement>) {
  let bottomMiddleCueBall = document.querySelector('.bottom-middle-cue-ball') as HTMLDivElement;
  if(!bottomMiddleCueBall) {
  bottomMiddleCueBall = document.createElement("div");
  bottomMiddleCueBall.style.position = "absolute";
  bottomMiddleCueBall.style.zIndex = "1001"
  bottomMiddleCueBall.style.border = "2px solid #fecdd3";
  bottomMiddleCueBall.style.width = width;
  bottomMiddleCueBall.style.height = height;
  bottomMiddleCueBall.style.borderRadius = "30%";
  bottomMiddleCueBall.style.backgroundColor = "white";
  bottomMiddleCueBall.style.pointerEvents = "all";
  bottomMiddleCueBall.className = "bottom-middle-cue-ball";
  document.body.appendChild(bottomMiddleCueBall);

  attachListeners(bottomMiddleCueBall, canvasRef);
  }

  bottomMiddleCueBall.style.left = `${left}px`;
  bottomMiddleCueBall.style.top = `${top}px`;
  bottomMiddleCueBall.style.display = "block";

}