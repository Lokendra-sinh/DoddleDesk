import { ElementsContainer, ElementTypes } from "../../../Types/Types";
import { handleSelectModeMouseDown } from "./handleSelectModeMouseDown";
import { handleSelectModeMouseMove } from "./handleSelectModeMouseMove";

export function handleSelectModeInteractions(
  mainCanvasRef: React.RefObject<HTMLCanvasElement>,
  appElements: ElementsContainer,
  setAppElements: React.Dispatch<React.SetStateAction<ElementsContainer>>,
  activeCanvasElement: ElementTypes | null,
  setActiveCanvasElement: React.Dispatch<
    React.SetStateAction<ElementTypes | null>
  >,
  setIsSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (!mainCanvasRef.current) return;

  //functions to handle select mode interactions
  const onMouseDown = (e: MouseEvent) => {
    const mouseDownCleanup = handleSelectModeMouseDown(
      e,
      mainCanvasRef,
      appElements,
      setAppElements,
      activeCanvasElement,
      setActiveCanvasElement,
      setIsSidePanelOpen
    );

    return mouseDownCleanup;
  };

  const onMouseMove = (e: MouseEvent) => {
    handleSelectModeMouseMove(
      e,
      mainCanvasRef,
      appElements,
      setAppElements,
      activeCanvasElement,
      setActiveCanvasElement,
      setIsSidePanelOpen
    );
  };
  mainCanvasRef.current.addEventListener("mousedown", onMouseDown);
  mainCanvasRef.current.addEventListener("mousemove", onMouseMove);

  return () => {
    mainCanvasRef.current!.removeEventListener("mousedown", onMouseDown);
    mainCanvasRef.current!.removeEventListener("mousemove", onMouseMove);
    onMouseDown;
  };
}


