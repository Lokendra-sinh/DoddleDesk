import { atom } from 'recoil';
import { ElementTypes, ElementsContainer } from '../../Types/Types';



export const currentActiveElementOnCanvas = atom<ElementTypes | null>({
    key: "currentActiveElementOnCanvas",
    default: null,
    });

export const DoddleDeskElements = atom<ElementsContainer>({
    key: "DoddleDeskElements",
    default: [],
});

export const doddleDeskUndoStack = atom<ElementsContainer[]>({
    key: "doddleDeskUndoStack",
    default: [],
});

export const doddleDeskRedoStack = atom<ElementsContainer[]>({
    key: "doddleDeskRedoStack",
    default: [],
});