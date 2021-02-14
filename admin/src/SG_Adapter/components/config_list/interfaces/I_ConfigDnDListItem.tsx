import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { I_ConfigListParams__ } from './I_ConfigList';

export interface I_ConfigDnDListItemTextStyleProps {
    name: string;
    isDragging: boolean;
    draggibleItemOtherColor: boolean;
}

export interface I_ConfigDnDListItem extends I_ConfigListParams__ {
    name: string;
    index: number;
    provided: DraggableProvided;
    snapshot: DraggableStateSnapshot;
    onChangeItemName: (newItemText: string, index: number) => void;
    deleteItem: (event: any, index: number) => void;
}

/** all the new generated Items will first get this string */
export const newItemString = '<new item>';

/** Prefix that declares an item as Titel item */
export const prefixTitelItem = '// *';

/** Prefix that declares an item as an comment */
export const prefixCommentItem = '//';
