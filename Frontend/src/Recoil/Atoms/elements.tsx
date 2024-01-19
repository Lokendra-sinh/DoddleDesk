import { atom } from 'recoil';
import { ElementsContainer } from '../../Types/Types';



export const elementsAtom = atom<ElementsContainer>({
    key: 'elements',
    default: [],
})

export const activeElementIdAtom = atom<string>({
    key: 'activeElementId',
    default: '',
})