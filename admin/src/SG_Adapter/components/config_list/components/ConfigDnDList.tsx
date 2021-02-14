import React from 'react';
import { RootRef, List } from '@material-ui/core';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { I_ConfigDnDListComponent_, T_ConfigList } from '../interfaces/I_ConfigDnDList';
import { I_ConfigListParams__ } from '../interfaces/I_ConfigList';
import { ConfigDnDListStyle } from '../styles/ConfigDnDListStyle';
import { ConfigDnDListItem } from './ConfigDnDListItem';

const reorder = (list: T_ConfigList, startIndex: number, endIndex: number): { id: string; name: string }[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const ConfigDnDList_ = (props: I_ConfigDnDListComponent_): JSX.Element => {
    const classes = ConfigDnDListStyle({
        isDraggingOver: props.snapshot.isDraggingOver,
        withBackgroundColor: props.withBackgroundColor,
        backgroundColor: props.backgroundColor,
        droppableItemOtherColor: props.droppableItemOtherColor,
    });

    return (
        <List className={classes.list} dense={true}>
            {props.configList.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={!props.listSortable}>
                    {(provided, snapshot) => (
                        <ConfigDnDListItem
                            name={item.name}
                            index={index}
                            {...props}
                            provided={provided}
                            snapshot={snapshot}
                        />
                    )}
                </Draggable>
            ))}
            {props.provided.placeholder}
        </List>
    );
};

export const ConfigDnDList = (props: I_ConfigListParams__): JSX.Element => {
    const onDragEnd = (result: DropResult) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const items = reorder(props.configList, result.source.index, result.destination.index);

        props.updateList(items);
    };

    const deleteItem = (event: any, index: number) => {
        const result: T_ConfigList = Array.from(props.configList);
        result.splice(index, 1);
        props.updateList(result);
    };

    const onChangeItemName = (newItemText: string, index: number) => {
        const result: T_ConfigList = Array.from(props.configList);
        result[index] = { name: newItemText, id: result[index].id };
        props.updateList(result);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="id">
                {(provided, snapshot) => (
                    <RootRef rootRef={provided.innerRef}>
                        <ConfigDnDList_
                            provided={provided}
                            snapshot={snapshot}
                            onChangeItemName={onChangeItemName}
                            deleteItem={deleteItem}
                            {...props}
                        />
                    </RootRef>
                )}
            </Droppable>
        </DragDropContext>
    );
};
