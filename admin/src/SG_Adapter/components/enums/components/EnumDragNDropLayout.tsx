/**
 * Creates the Enum drag and drop layout and functionality
 */

import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, Grid } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { grey, blue } from '@material-ui/core/colors';
import { I_EnumItem, I_Enum, I_EnumCategory } from '../interfaces/Interfaces';
import { EnumDnDItem } from './EnumDnDItem';
import { EnumCardHeader } from './EnumCardHeader';
import { RootRef } from '@material-ui/core';

const EnumCard = styled(Card)({
    margin: '4px',
    borderRadius: 5,
});

const EnumCardContent = styled(CardContent)({
    padding: '0px',
    'align-items': 'stretch',
});

export interface EnumDragNDropLayoutProps {
    enumCategory: I_EnumCategory;
    changeEnumChildCategory: (
        fromEnumChildCategory: string,
        toEnumChildCategory: string,
        EnumItemID: string,
        enumCategory: I_EnumCategory,
    ) => void;
    handleEdit: (item: I_EnumItem) => void;
    handleRemove: (item: I_EnumItem) => void;
    handleAddChildCategory: ((item: I_Enum) => void) | null | undefined;
}

export const EnumDragNDropLayout = (props: EnumDragNDropLayoutProps): JSX.Element => {
    const [enumCategory, setEnumCategory] = useState<I_EnumCategory>(props.enumCategory);
    const [mainDroppableId, setMainDroppableId] = useState<string>('');
    if (
        enumCategory.enumCategories === null ||
        enumCategory.enumChildCategory === null ||
        enumCategory.enumChildCategory === undefined
    ) {
        return <div />;
    }

    const getListStyle = (isDraggingOver: boolean) => ({
        background: isDraggingOver ? blue[100] : grey[100],
    });

    useEffect(() => {
        setEnumCategory(props.enumCategory);
        if (props.enumCategory.enumCategoryID !== undefined) {
            setMainDroppableId(props.enumCategory.enumCategoryID);
        } else {
            setMainDroppableId('tempID');
        }
    }, [props.enumCategory]);

    const onDragEnd = (result: DropResult) => {
        if ('destination' in result && result.destination !== undefined && result.destination !== null)
            props.changeEnumChildCategory(
                result.source.droppableId,
                result.destination.droppableId,
                result.draggableId,
                enumCategory,
            );
    };

    /**
     * filter if enumCategories already on a enumChildCategory
     */
    const enumCategoriesFilter = (item: I_EnumItem): boolean => {
        for (const [, enumCategory_] of Object.entries(
            enumCategory.enumCategories !== undefined ? enumCategory.enumCategories : [],
        )) {
            const enumCategory = enumCategory_ as I_Enum;
            if (enumCategory.members.map((item) => item.id).includes(item.id)) return false;
        }
        return true;
    };

    /**
     * filter if enumChildCategory on the enumChildCategoryID
     */
    const enumChildCategoryFilter = (item: I_EnumItem): boolean => {
        return item.id.includes(enumCategory.enumChildCategoryID);
    };

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    return (
        <>
            {mainDroppableId === '' ? (
                <div>hallo</div>
            ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Droppable droppableId={mainDroppableId}>
                                {(provided, snapshot) => (
                                    <RootRef rootRef={provided.innerRef}>
                                        <EnumCard variant="outlined" style={getListStyle(snapshot.isDraggingOver)}>
                                            <EnumCardHeader
                                                enumChildCCategory={enumCategory.enumChildCategory as I_Enum}
                                                handleAddChildCategory={props.handleAddChildCategory}
                                            />
                                            <EnumCardContent style={getListStyle(snapshot.isDraggingOver)}>
                                                {(enumCategory.enumChildCategory as I_Enum).members
                                                    .filter(enumCategoriesFilter)
                                                    .map((item, index) => (
                                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <EnumDnDItem
                                                                    provided={provided}
                                                                    snapshot={snapshot}
                                                                    item={item}
                                                                    handleEdit={props.handleEdit}
                                                                    handleRemove={props.handleRemove}
                                                                />
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                {provided.placeholder}
                                            </EnumCardContent>
                                        </EnumCard>
                                    </RootRef>
                                )}
                            </Droppable>
                        </Grid>
                        <Grid item xs={6}>
                            {Object.values(
                                enumCategory.enumCategories !== undefined ? enumCategory.enumCategories : [],
                            ).map((enumCategory_) => {
                                const enumCategory = enumCategory_ as I_Enum;
                                return (
                                    <Droppable key={enumCategory.enumID} droppableId={enumCategory.enumID}>
                                        {(provided, snapshot) => {
                                            return (
                                                <RootRef rootRef={provided.innerRef}>
                                                    <EnumCard
                                                        variant="outlined"
                                                        style={getListStyle(snapshot.isDraggingOver)}
                                                    >
                                                        <EnumCardHeader
                                                            enumChildCCategory={enumCategory}
                                                            handleAddChildCategory={undefined}
                                                        />
                                                        <EnumCardContent style={getListStyle(snapshot.isDraggingOver)}>
                                                            {enumCategory.members
                                                                .filter(enumChildCategoryFilter)
                                                                .map((item, index) => (
                                                                    <Draggable
                                                                        key={item.id}
                                                                        draggableId={item.id}
                                                                        index={index}
                                                                    >
                                                                        {(provided, snapshot) => (
                                                                            <EnumDnDItem
                                                                                provided={provided}
                                                                                snapshot={snapshot}
                                                                                item={item}
                                                                                handleEdit={props.handleEdit}
                                                                                handleRemove={props.handleRemove}
                                                                            />
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                            {provided.placeholder}
                                                        </EnumCardContent>
                                                    </EnumCard>
                                                </RootRef>
                                            );
                                        }}
                                    </Droppable>
                                );
                            })}
                        </Grid>
                    </Grid>
                </DragDropContext>
            )}
        </>
    );
};
