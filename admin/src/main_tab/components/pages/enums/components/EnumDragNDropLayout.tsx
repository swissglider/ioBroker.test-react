/**
 * Creates the Enum drag and drop layout and functionality
 */

import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, Grid } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { I_EnumItem, I_Enum, I_EnumCategory } from '../interfaces/Interfaces';
import { EnumDnDItem } from './EnumDnDItem';
import { EnumCardHeader } from './EnumCardHeader';

const EnumCard = styled(Card)({
    background: grey[200],
    margin: '4px',
    borderRadius: 5,
});

const EnumCardContent = styled(CardContent)({
    background: grey[200],
    padding: '0px',
    'align-items': 'stretch',
});

export const EnumDragNDropLayout = (props: {
    enumCategory: I_EnumCategory;
    changeEnumChildCategory: (
        fromEnumChildCategory: string,
        toEnumChildCategory: string,
        EnumItemID: string,
        enumCategory: I_EnumCategory,
    ) => void;
}): JSX.Element => {
    const enumCategory = props.enumCategory;
    const enumCategories = enumCategory.enumCategories;
    const enumChildCategory = enumCategory.enumChildCategory;
    if (
        enumCategories === null ||
        enumCategories === undefined ||
        enumChildCategory === null ||
        enumChildCategory === undefined
    ) {
        return <div />;
    }

    const onDragEnd = (result) => {
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
        for (const [, enumCategory_] of Object.entries(enumCategories)) {
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

    const handleEdit = (e: I_EnumItem) => {
        console.log(e);
    };

    const handleRemove = (e: I_EnumItem) => {
        console.log(e);
    };

    const handleAddChildCategory = (childCategory: I_Enum) => {
        console.log(childCategory);
    };

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Grid container>
                <Grid item xs={6}>
                    <Droppable droppableId={enumCategory.enumCategoryID}>
                        {(provided, snapshot) => (
                            <EnumCard variant="outlined" ref={provided.innerRef} {...provided} {...snapshot}>
                                <EnumCardHeader
                                    enumChildCCategory={enumChildCategory}
                                    handleAddChildCategory={handleAddChildCategory}
                                />
                                <EnumCardContent>
                                    {enumChildCategory.members.filter(enumCategoriesFilter).map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided, snapshot) => (
                                                <EnumDnDItem
                                                    provided={provided}
                                                    snapshot={snapshot}
                                                    item={item}
                                                    handleEdit={handleEdit}
                                                    handleRemove={handleRemove}
                                                />
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </EnumCardContent>
                            </EnumCard>
                        )}
                    </Droppable>
                </Grid>
                <Grid item xs={6}>
                    {Object.values(enumCategories).map((enumCategory_) => {
                        const enumCategory = enumCategory_ as I_Enum;
                        return (
                            <Droppable key={enumCategory.enumID} droppableId={enumCategory.enumID}>
                                {(provided, snapshot) => (
                                    <EnumCard variant="outlined" ref={provided.innerRef} {...provided} {...snapshot}>
                                        <EnumCardHeader
                                            enumChildCCategory={enumCategory}
                                            handleAddChildCategory={undefined}
                                        />
                                        <EnumCardContent>
                                            {enumCategory.members.filter(enumChildCategoryFilter).map((item, index) => (
                                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <EnumDnDItem
                                                            provided={provided}
                                                            snapshot={snapshot}
                                                            item={item}
                                                            handleEdit={handleEdit}
                                                            handleRemove={handleRemove}
                                                        />
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </EnumCardContent>
                                    </EnumCard>
                                )}
                            </Droppable>
                        );
                    })}
                </Grid>
            </Grid>
        </DragDropContext>
    );
};
