import { ElementTypes, ElementsContainer} from "../../../Types/Types";


export function handleSelectModeMouseDown(
    e: MouseEvent,
    mainCanvasRef: React.RefObject<HTMLCanvasElement>,
    appElements: ElementsContainer,
    setAppElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
    activeCanvasElement: ElementTypes | null,
    setActiveCanvasElement: React.Dispatch<
      React.SetStateAction<ElementTypes | null>
    >,
    setIsSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    e.stopPropagation();
    if (!mainCanvasRef.current) return;
  
    const mainCanvasRect = mainCanvasRef.current.getBoundingClientRect();
    const mouseDownX = e.clientX - mainCanvasRect.left;
    const mouseDownY = e.clientY - mainCanvasRect.top;
  
    const selectedElement = appElements.find((element) => {
      return (
        element.x < mouseDownX &&
        element.x + element.width > mouseDownX &&
        element.y < mouseDownY &&
        element.y + element.height > mouseDownY
      );
    });
  
    if (selectedElement) {
      setActiveCanvasElement(selectedElement);
      setIsSidePanelOpen(true);
    } else {
      setActiveCanvasElement(null);
      setIsSidePanelOpen(false);
    }
  }