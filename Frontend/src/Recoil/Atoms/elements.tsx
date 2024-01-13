import { atom } from 'recoil';

type position = {
    x: number,
    y: number,

}

export type elementTypes = {
        type: string | undefined,
        startCoordinates: position,
        endCoordinates: position,
        color: string,
        size: number,
        cornerRadius? : number,
        cursor: string,
}

export type elementsContainer = elementTypes[];


export const elementsAtom = atom<elementsContainer>({
    key: 'elements',
    default: [],
})