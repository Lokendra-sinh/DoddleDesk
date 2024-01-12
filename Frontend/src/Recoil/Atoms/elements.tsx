import { atom } from 'recoil';

export type elementTypes = {
        type: string,
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        color: string,
        size: number,
}

export type elementsContainer = elementTypes[];


export const elementsAtom = atom<elementsContainer>({
    key: 'elements',
    default: [],
})