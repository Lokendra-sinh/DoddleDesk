


export function hideResizeHandlesAndBoundingBox() {
  let resizeHandles = document.querySelectorAll(".resize-handle") as NodeListOf<HTMLDivElement>;
  let boundingBox = document.querySelector(".bounding-box") as HTMLDivElement;

  if (resizeHandles) {
    resizeHandles.forEach((resizeHandle) => {
      resizeHandle.style.display = "none";
    });
  }

  if (boundingBox) {
    boundingBox.style.display = "none";
  }
}