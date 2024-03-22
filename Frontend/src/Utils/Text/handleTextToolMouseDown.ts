// This function is used to handle the mouse down event for the text tool
import { overlayForDrag } from "../interactionhelpers";

export const handleTextToolMouseDown = (
    e: MouseEvent,
    mainCanvasRef: React.RefObject<HTMLCanvasElement>
  ) => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
  
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    const textInput = document.createElement("div");
    textInput.contentEditable = "true";
    textInput.spellcheck = false;
    textInput.style.position = "absolute";
    textInput.style.left = `${x}px`;
    textInput.style.top = `${y}px`;
    textInput.style.padding = "5px";
    textInput.style.backgroundColor = "transparent";
    textInput.style.border = "none";
    textInput.style.color = "black";
    textInput.style.fontFamily = "Inter UI, sans-serif";
    textInput.style.fontSize = "16px";
    textInput.style.outline = "1px solid black";
    textInput.style.zIndex = "200";
    textInput.style.minWidth = "100px";
    textInput.style.minHeight = "30px";
    textInput.style.overflow = "hidden";
  
    // Create and append a text node as initial content
    const textNode = document.createTextNode('\u00A0'); // Unicode for non-breaking space
    textInput.appendChild(textNode);
  
    canvas.parentNode?.appendChild(textInput);
  
    // Set focus on the text input element
    textInput.focus();
  
    // Optionally, introduce a slight delay before setting the selection
    setTimeout(() => {
      // Place the cursor at the beginning of the text input
      const range = document.createRange();
      range.selectNodeContents(textInput);
      range.collapse(true); // Collapse the range to the start, placing the cursor at the beginning
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }, 0); // In this case, even a 0ms timeout can help queue the operation after any pending UI updates

    textInput.addEventListener('mouseover', () => {
        textInput.style.cursor = "move"; // Change cursor on hover
      });
    
      let isDragging = false;
      let offsetX: number, offsetY: number;
    
      // Drag start
      textInput.addEventListener('mousedown', (downEvent) => {
        isDragging = true;
        offsetX = downEvent.clientX - textInput.getBoundingClientRect().left;
        offsetY = downEvent.clientY - textInput.getBoundingClientRect().top;
        textInput.style.cursor = "move"; // Maintain move cursor during drag
    
        // Drag operation
        const handleMouseMove = (moveEvent: MouseEvent) => {
          if (isDragging) {
            textInput.style.left = `${moveEvent.clientX - offsetX - rect.left}px`;
            textInput.style.top = `${moveEvent.clientY - offsetY - rect.top}px`;
          }
        };
    
        // Drag end
        const handleMouseUp = () => {
          isDragging = false;
          overlayForDrag.removeEventListener('mousemove', handleMouseMove);
          overlayForDrag.removeEventListener('mouseup', handleMouseUp);
          overlayForDrag.style.display = "none";
          overlayForDrag.style.cursor = "default";
          textInput.style.cursor = "move"; // Optionally change cursor back if needed
        };
        
        overlayForDrag.style.display = "block";
        overlayForDrag.style.cursor = "move";
        overlayForDrag.addEventListener('mousemove', handleMouseMove);
        overlayForDrag.addEventListener('mouseup', handleMouseUp);
      });
  };
  