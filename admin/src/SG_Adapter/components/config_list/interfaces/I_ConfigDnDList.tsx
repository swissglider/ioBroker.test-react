import { DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { I_ConfigListParams__ } from './I_ConfigList';

export interface I_ConfigDnDListComponent_ extends I_ConfigListParams__ {
    provided: DroppableProvided;
    snapshot: DroppableStateSnapshot;
    onChangeItemName: (newItemText: string, index: number) => void;
    deleteItem: (event: any, index: number) => void;
}

/** ConfigList Element */
export interface I_ConfigListElement {
    id: string;
    name: string;
}

export interface I_ConfigDnDListStyleProps {
    isDraggingOver: boolean;
    backgroundColor: string;
    withBackgroundColor: boolean;
    droppableItemOtherColor: boolean;
}

/** ConfigList Element Array */
export type T_ConfigList = I_ConfigListElement[];
