import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import I18n from '@iobroker/adapter-react/i18n';
import { Card, CardContent, CardHeader, Grid, Box, Avatar, IconButton, Tooltip } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { Tabs } from '@material-ui/core';
import { Tab } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import { EnumLayoutDefinitions } from './enums/configuration/Configuration';
import { MainPageWrapper } from '../../framework/utils/MainPageWrapper';
import { EnumLayout } from './enums/Index';
import { I_EnumItem, I_Enum, I_EnumCategory } from './enums/interfaces/Interfaces';
import { EnumHelper } from '../../framework/utils/EnumHelper';
import { ObjectStateHelper } from '../../framework/utils/ObjectStateHelper';

const EnumCard = styled(Card)({
    background: grey[200],
    margin: '4px',
    borderRadius: 5,
});

const EnumCardHeader = styled(CardHeader)({
    background: (props: { bgcolor }) =>
        'bgcolor' in props && props.bgcolor && props.bgcolor !== undefined
            ? props.bgcolor
            : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 5,
    // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 40,
    padding: '0 15px',
});

const EnumCardContent = styled(CardContent)({
    background: grey[200],
    padding: '0px',
    'align-items': 'stretch',
});

const InnerBox = styled(Box)({
    border: 0,
    borderRadius: 5,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    padding: '7px 7px',
    margin: '7px',
    height: 32,
});

const ItemAvatar = styled(Avatar)({
    width: '25px',
    height: '25px',
});

const DnD = (props: { enumCategory; changeEnumChildCategory }) => {
    const [dropZoneState, setDropZoneState] = useState(props.enumCategory);

    const onDragEnd = (result) => {
        props.changeEnumChildCategory(
            result.source.droppableId,
            result.destination.droppableId,
            result.draggableId,
            dropZoneState,
        );
    };

    /**
     * filter if enumCategories already on a enumChildCategory
     */
    const enumCategoriesFilter = (item: I_EnumItem): boolean => {
        for (const [, enumCategory_] of Object.entries(dropZoneState.enumCategories)) {
            const enumCategory = enumCategory_ as I_Enum;
            if (enumCategory.members.map((item) => item.id).includes(item.id)) return false;
        }
        return true;
    };

    /**
     * filter if enumChildCategory on the enumChildCategoryID
     */
    const enumChildCategoryFilter = (item: I_EnumItem): boolean => {
        return item.id.includes(dropZoneState.enumChildCategoryID);
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
                    <Droppable droppableId={dropZoneState.enumCategoryID}>
                        {(provided, snapshot) => (
                            <EnumCard variant="outlined" ref={provided.innerRef}>
                                <EnumCardHeader
                                    title={dropZoneState.enumChildCategory.enumName}
                                    bgcolor={dropZoneState.enumChildCategory.color}
                                    avatar={
                                        <ItemAvatar
                                            {...('icon' in dropZoneState.enumChildCategory &&
                                            dropZoneState.enumChildCategory.icon &&
                                            dropZoneState.enumChildCategory.icon !== undefined
                                                ? { src: dropZoneState.enumChildCategory.icon }
                                                : {
                                                      src:
                                                          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAFYklEQVRoge2Zb4gUZRzHP7/Z29PU3dm92T1NUOpFYkSWoPmiIPFFhmhFZUGRBmlgUpFIFpmCSX+EM1AJJHuh70QLMsoSOzIwSJEIEjIjo8w/t3N7z8yemOvu/HoxK9jd7t3uzZwR3PfNPMz8fs/v89159plnnoExjWlMQ0kaXSj4/mIJeAV0HjDxBjLVUz/IMRXdmrftz+sF1DXiGm8z8Maooo1QqryVz9obhg0s+P5i13jqGu+Ka/xXC4VLU28A39BMhUtTXWPWhUye9njeomGTXON3h0bMuhvA2JJqZtQ13uGB16zB4ToXQJPJPaOP1pqCtrbdteY9A6/VMcIkgPzEiedHE2ok6pw06UKtmRp4rS3uYudLpXx7JXg6EB4QdBZIDqgAZ1EOW1rd0tHR8UfcdQfNWq7xFCCXsRtOzfWkquJ6pbWCbmSI6VrBtYRnOtLpr0XkaqvAjfjqDa0RqeiVdgq6BRiP8KmgT0jCuiMoX0kF5SspReeAfCyQU+Vgr1f6rdeYpXHVj2VouX3eMkVXAr4ITzq2/WWdsBPnzp1b1j5h0i+gD4LOVmRvrzGWk8nsjYPj31Dh9KYt5pxyjacFY1Y2n2Ner9W6cFp1XFS+yEPL9f2ZwAygJ2fbHzWb59j2uwgngckdvj8/Kkf0/0iVeQAC3SISNJsmIqrwFYCqzo6KEdmIgAMQCOdGkPs7ACqRl0GRjagESQBRLreaK0F8s2YMd8Ryw6PkWs1VkSk1ip6oHNF/EdGzYUOnjSD39vCgp6NiRDaSFDkBoDCnlTxVtVDuA6BaPRqVI7KRVCplgBLQaYy5tdm8gjF3AQ7KecdxzkbliOM5shRIIZysVNrLLaYXEG7u6eu7OypHZCNWwGQAArpzuQl/NZvXmc3+AHIEICFyW2SOqB0EBD8CqMj9xWJxerN550ulfG1jg6rqr1E5IhvJZTJHgGOCzgqsxE+qOuzy/4zq+GQ1uAhME/Tb8O5EU/TniEiQ0GAh4VM65ZZKww6TlO/fSfgu9HMCHonKADG9j2SzWSPIIQCq+tSwCQEPAahwMJPJ9MXBENsSQSz2AIjwck9//5RGcRdKpU6EVQCWyP646sdmpCOdPorwGZCxKtXuRnFt1eAA4IB0O+n0d3HVj80IgFQqq8OW3jJE2EyAKsHzcdaO1Ui5vf3vsCVDzVxlgCCR8OOsHauR9nJ5HIBCf+MoLQMkryTa46wdqxESyYUAAoXGQXIJQJNXI7/eXq9YjJxRHd/reRsU/SA8o9sbxSqyC0BUP3SNWaeqsdyZSBt0xWJxemC1rVJ0hUAu7FC7nExmbaMcVbV6jb8N4YVa/YvALqlWdjqO8+dwNRvxjciI63lzUX0N5GEgUTt9XND1TiZzaDiYsI5ZIEiXwrWVbwX0ACLv5Wz72KgaKfj+DCvQ9xWufZ8oo+zDYnvOtr9vxsBAFX3/Xg10tcJjQHsN6ovAkjX5dPpU7EZ6jVmqsBvkJqAEsiNos7Zdt0MeSRf7+ycnKsFLoC8CKdDLAsudTGZfM3yDVG8nr1D0l7jGq9Q+AH3i+37LGw3Nyvd9xzX+/hpHtVD0lwzHV1eu8XzXeBq+L4AxJusaryfswH+7mWV6VKmquMbbXIPuMcZkIVyn1c55A3PqTL9yHKCtqssBrmKtAPKgRxw7tV5EWtoXHolERB07vQHkGyB/Feu5GtOztZDjA3MG7car6FZRFgj6jmtMAvRRAIEdrWyJRpWIBL3G7FBkvqCPu8YkQTcBWELXoPh6nRT6vE0ivDnasCORKpvyWXvjwPMNx3uP5y2ylDWEHx4HfbO7wSoBxyyhq8O2D/7HLGMa0/9S/wDcyY0gQYDZcAAAAABJRU5ErkJggg==',
                                                  })}
                                        />
                                    }
                                    action={
                                        <IconButton aria-label="settings">
                                            <Tooltip title={`Add new ${dropZoneState.enumChildCategory.enumName}`}>
                                                <AddIcon
                                                    onClick={() =>
                                                        handleAddChildCategory(dropZoneState.enumChildCategory)
                                                    }
                                                />
                                            </Tooltip>
                                        </IconButton>
                                    }
                                />
                                <EnumCardContent>
                                    {dropZoneState.enumChildCategory.members
                                        .filter(enumCategoriesFilter)
                                        .map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <InnerBox
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        {...('color' in item && item.color && item.color !== undefined
                                                            ? { bgcolor: item.color, color: 'white' }
                                                            : { bgcolor: '#ffbf81', color: 'white' })}
                                                        display="flex"
                                                        alignItems="center"
                                                        p={1}
                                                        m={1}
                                                    >
                                                        <Box p={1}>
                                                            <ItemAvatar
                                                                {...('icon' in item &&
                                                                item.icon &&
                                                                item.icon !== undefined
                                                                    ? { src: item.icon }
                                                                    : {
                                                                          src:
                                                                              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAFYklEQVRoge2Zb4gUZRzHP7/Z29PU3dm92T1NUOpFYkSWoPmiIPFFhmhFZUGRBmlgUpFIFpmCSX+EM1AJJHuh70QLMsoSOzIwSJEIEjIjo8w/t3N7z8yemOvu/HoxK9jd7t3uzZwR3PfNPMz8fs/v89159plnnoExjWlMQ0kaXSj4/mIJeAV0HjDxBjLVUz/IMRXdmrftz+sF1DXiGm8z8Maooo1QqryVz9obhg0s+P5i13jqGu+Ka/xXC4VLU28A39BMhUtTXWPWhUye9njeomGTXON3h0bMuhvA2JJqZtQ13uGB16zB4ToXQJPJPaOP1pqCtrbdteY9A6/VMcIkgPzEiedHE2ok6pw06UKtmRp4rS3uYudLpXx7JXg6EB4QdBZIDqgAZ1EOW1rd0tHR8UfcdQfNWq7xFCCXsRtOzfWkquJ6pbWCbmSI6VrBtYRnOtLpr0XkaqvAjfjqDa0RqeiVdgq6BRiP8KmgT0jCuiMoX0kF5SspReeAfCyQU+Vgr1f6rdeYpXHVj2VouX3eMkVXAr4ITzq2/WWdsBPnzp1b1j5h0i+gD4LOVmRvrzGWk8nsjYPj31Dh9KYt5pxyjacFY1Y2n2Ner9W6cFp1XFS+yEPL9f2ZwAygJ2fbHzWb59j2uwgngckdvj8/Kkf0/0iVeQAC3SISNJsmIqrwFYCqzo6KEdmIgAMQCOdGkPs7ACqRl0GRjagESQBRLreaK0F8s2YMd8Ryw6PkWs1VkSk1ip6oHNF/EdGzYUOnjSD39vCgp6NiRDaSFDkBoDCnlTxVtVDuA6BaPRqVI7KRVCplgBLQaYy5tdm8gjF3AQ7KecdxzkbliOM5shRIIZysVNrLLaYXEG7u6eu7OypHZCNWwGQAArpzuQl/NZvXmc3+AHIEICFyW2SOqB0EBD8CqMj9xWJxerN550ulfG1jg6rqr1E5IhvJZTJHgGOCzgqsxE+qOuzy/4zq+GQ1uAhME/Tb8O5EU/TniEiQ0GAh4VM65ZZKww6TlO/fSfgu9HMCHonKADG9j2SzWSPIIQCq+tSwCQEPAahwMJPJ9MXBENsSQSz2AIjwck9//5RGcRdKpU6EVQCWyP646sdmpCOdPorwGZCxKtXuRnFt1eAA4IB0O+n0d3HVj80IgFQqq8OW3jJE2EyAKsHzcdaO1Ui5vf3vsCVDzVxlgCCR8OOsHauR9nJ5HIBCf+MoLQMkryTa46wdqxESyYUAAoXGQXIJQJNXI7/eXq9YjJxRHd/reRsU/SA8o9sbxSqyC0BUP3SNWaeqsdyZSBt0xWJxemC1rVJ0hUAu7FC7nExmbaMcVbV6jb8N4YVa/YvALqlWdjqO8+dwNRvxjciI63lzUX0N5GEgUTt9XND1TiZzaDiYsI5ZIEiXwrWVbwX0ACLv5Wz72KgaKfj+DCvQ9xWufZ8oo+zDYnvOtr9vxsBAFX3/Xg10tcJjQHsN6ovAkjX5dPpU7EZ6jVmqsBvkJqAEsiNos7Zdt0MeSRf7+ycnKsFLoC8CKdDLAsudTGZfM3yDVG8nr1D0l7jGq9Q+AH3i+37LGw3Nyvd9xzX+/hpHtVD0lwzHV1eu8XzXeBq+L4AxJusaryfswH+7mWV6VKmquMbbXIPuMcZkIVyn1c55A3PqTL9yHKCtqssBrmKtAPKgRxw7tV5EWtoXHolERB07vQHkGyB/Feu5GtOztZDjA3MG7car6FZRFgj6jmtMAvRRAIEdrWyJRpWIBL3G7FBkvqCPu8YkQTcBWELXoPh6nRT6vE0ivDnasCORKpvyWXvjwPMNx3uP5y2ylDWEHx4HfbO7wSoBxyyhq8O2D/7HLGMa0/9S/wDcyY0gQYDZcAAAAABJRU5ErkJggg==',
                                                                      })}
                                                            />
                                                        </Box>
                                                        <Box p={1} flexGrow={1}>
                                                            {item.name}
                                                        </Box>
                                                        <Box p={1}>
                                                            <IconButton onClick={() => handleEdit(item)}>
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton onClick={() => handleRemove(item)}>
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </InnerBox>
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
                    {Object.values(dropZoneState.enumCategories).map((enumCategory_) => {
                        const enumCategory = enumCategory_ as I_Enum;
                        return (
                            <Droppable key={enumCategory.enumID} droppableId={enumCategory.enumID}>
                                {(provided, snapshot) => (
                                    <EnumCard variant="outlined" ref={provided.innerRef}>
                                        <EnumCardHeader
                                            title={enumCategory.enumName}
                                            bgcolor={enumCategory.color}
                                            avatar={
                                                <ItemAvatar
                                                    {...('icon' in enumCategory &&
                                                    enumCategory.icon &&
                                                    enumCategory.icon !== undefined
                                                        ? { src: enumCategory.icon }
                                                        : {
                                                              src:
                                                                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAFYklEQVRoge2Zb4gUZRzHP7/Z29PU3dm92T1NUOpFYkSWoPmiIPFFhmhFZUGRBmlgUpFIFpmCSX+EM1AJJHuh70QLMsoSOzIwSJEIEjIjo8w/t3N7z8yemOvu/HoxK9jd7t3uzZwR3PfNPMz8fs/v89159plnnoExjWlMQ0kaXSj4/mIJeAV0HjDxBjLVUz/IMRXdmrftz+sF1DXiGm8z8Maooo1QqryVz9obhg0s+P5i13jqGu+Ka/xXC4VLU28A39BMhUtTXWPWhUye9njeomGTXON3h0bMuhvA2JJqZtQ13uGB16zB4ToXQJPJPaOP1pqCtrbdteY9A6/VMcIkgPzEiedHE2ok6pw06UKtmRp4rS3uYudLpXx7JXg6EB4QdBZIDqgAZ1EOW1rd0tHR8UfcdQfNWq7xFCCXsRtOzfWkquJ6pbWCbmSI6VrBtYRnOtLpr0XkaqvAjfjqDa0RqeiVdgq6BRiP8KmgT0jCuiMoX0kF5SspReeAfCyQU+Vgr1f6rdeYpXHVj2VouX3eMkVXAr4ITzq2/WWdsBPnzp1b1j5h0i+gD4LOVmRvrzGWk8nsjYPj31Dh9KYt5pxyjacFY1Y2n2Ner9W6cFp1XFS+yEPL9f2ZwAygJ2fbHzWb59j2uwgngckdvj8/Kkf0/0iVeQAC3SISNJsmIqrwFYCqzo6KEdmIgAMQCOdGkPs7ACqRl0GRjagESQBRLreaK0F8s2YMd8Ryw6PkWs1VkSk1ip6oHNF/EdGzYUOnjSD39vCgp6NiRDaSFDkBoDCnlTxVtVDuA6BaPRqVI7KRVCplgBLQaYy5tdm8gjF3AQ7KecdxzkbliOM5shRIIZysVNrLLaYXEG7u6eu7OypHZCNWwGQAArpzuQl/NZvXmc3+AHIEICFyW2SOqB0EBD8CqMj9xWJxerN550ulfG1jg6rqr1E5IhvJZTJHgGOCzgqsxE+qOuzy/4zq+GQ1uAhME/Tb8O5EU/TniEiQ0GAh4VM65ZZKww6TlO/fSfgu9HMCHonKADG9j2SzWSPIIQCq+tSwCQEPAahwMJPJ9MXBENsSQSz2AIjwck9//5RGcRdKpU6EVQCWyP646sdmpCOdPorwGZCxKtXuRnFt1eAA4IB0O+n0d3HVj80IgFQqq8OW3jJE2EyAKsHzcdaO1Ui5vf3vsCVDzVxlgCCR8OOsHauR9nJ5HIBCf+MoLQMkryTa46wdqxESyYUAAoXGQXIJQJNXI7/eXq9YjJxRHd/reRsU/SA8o9sbxSqyC0BUP3SNWaeqsdyZSBt0xWJxemC1rVJ0hUAu7FC7nExmbaMcVbV6jb8N4YVa/YvALqlWdjqO8+dwNRvxjciI63lzUX0N5GEgUTt9XND1TiZzaDiYsI5ZIEiXwrWVbwX0ACLv5Wz72KgaKfj+DCvQ9xWufZ8oo+zDYnvOtr9vxsBAFX3/Xg10tcJjQHsN6ovAkjX5dPpU7EZ6jVmqsBvkJqAEsiNos7Zdt0MeSRf7+ycnKsFLoC8CKdDLAsudTGZfM3yDVG8nr1D0l7jGq9Q+AH3i+37LGw3Nyvd9xzX+/hpHtVD0lwzHV1eu8XzXeBq+L4AxJusaryfswH+7mWV6VKmquMbbXIPuMcZkIVyn1c55A3PqTL9yHKCtqssBrmKtAPKgRxw7tV5EWtoXHolERB07vQHkGyB/Feu5GtOztZDjA3MG7car6FZRFgj6jmtMAvRRAIEdrWyJRpWIBL3G7FBkvqCPu8YkQTcBWELXoPh6nRT6vE0ivDnasCORKpvyWXvjwPMNx3uP5y2ylDWEHx4HfbO7wSoBxyyhq8O2D/7HLGMa0/9S/wDcyY0gQYDZcAAAAABJRU5ErkJggg==',
                                                          })}
                                                />
                                            }
                                        />
                                        <EnumCardContent>
                                            {enumCategory.members.filter(enumChildCategoryFilter).map((item, index) => (
                                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <InnerBox
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            // {...('color' in item
                                                            //     ? { bgcolor: 'red' }
                                                            //     : { background: '#ffbf81' })}
                                                            {...('color' in item &&
                                                            item.color &&
                                                            item.color !== undefined
                                                                ? { bgcolor: item.color, color: 'white' }
                                                                : { bgcolor: '#ffbf81', color: 'white' })}
                                                            display="flex"
                                                            alignItems="center"
                                                            p={1}
                                                            m={1}
                                                        >
                                                            <Box p={1}>
                                                                <ItemAvatar
                                                                    {...('icon' in item &&
                                                                    item.icon &&
                                                                    item.icon !== undefined
                                                                        ? { src: item.icon }
                                                                        : {
                                                                              src:
                                                                                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAFYklEQVRoge2Zb4gUZRzHP7/Z29PU3dm92T1NUOpFYkSWoPmiIPFFhmhFZUGRBmlgUpFIFpmCSX+EM1AJJHuh70QLMsoSOzIwSJEIEjIjo8w/t3N7z8yemOvu/HoxK9jd7t3uzZwR3PfNPMz8fs/v89159plnnoExjWlMQ0kaXSj4/mIJeAV0HjDxBjLVUz/IMRXdmrftz+sF1DXiGm8z8Maooo1QqryVz9obhg0s+P5i13jqGu+Ka/xXC4VLU28A39BMhUtTXWPWhUye9njeomGTXON3h0bMuhvA2JJqZtQ13uGB16zB4ToXQJPJPaOP1pqCtrbdteY9A6/VMcIkgPzEiedHE2ok6pw06UKtmRp4rS3uYudLpXx7JXg6EB4QdBZIDqgAZ1EOW1rd0tHR8UfcdQfNWq7xFCCXsRtOzfWkquJ6pbWCbmSI6VrBtYRnOtLpr0XkaqvAjfjqDa0RqeiVdgq6BRiP8KmgT0jCuiMoX0kF5SspReeAfCyQU+Vgr1f6rdeYpXHVj2VouX3eMkVXAr4ITzq2/WWdsBPnzp1b1j5h0i+gD4LOVmRvrzGWk8nsjYPj31Dh9KYt5pxyjacFY1Y2n2Ner9W6cFp1XFS+yEPL9f2ZwAygJ2fbHzWb59j2uwgngckdvj8/Kkf0/0iVeQAC3SISNJsmIqrwFYCqzo6KEdmIgAMQCOdGkPs7ACqRl0GRjagESQBRLreaK0F8s2YMd8Ryw6PkWs1VkSk1ip6oHNF/EdGzYUOnjSD39vCgp6NiRDaSFDkBoDCnlTxVtVDuA6BaPRqVI7KRVCplgBLQaYy5tdm8gjF3AQ7KecdxzkbliOM5shRIIZysVNrLLaYXEG7u6eu7OypHZCNWwGQAArpzuQl/NZvXmc3+AHIEICFyW2SOqB0EBD8CqMj9xWJxerN550ulfG1jg6rqr1E5IhvJZTJHgGOCzgqsxE+qOuzy/4zq+GQ1uAhME/Tb8O5EU/TniEiQ0GAh4VM65ZZKww6TlO/fSfgu9HMCHonKADG9j2SzWSPIIQCq+tSwCQEPAahwMJPJ9MXBENsSQSz2AIjwck9//5RGcRdKpU6EVQCWyP646sdmpCOdPorwGZCxKtXuRnFt1eAA4IB0O+n0d3HVj80IgFQqq8OW3jJE2EyAKsHzcdaO1Ui5vf3vsCVDzVxlgCCR8OOsHauR9nJ5HIBCf+MoLQMkryTa46wdqxESyYUAAoXGQXIJQJNXI7/eXq9YjJxRHd/reRsU/SA8o9sbxSqyC0BUP3SNWaeqsdyZSBt0xWJxemC1rVJ0hUAu7FC7nExmbaMcVbV6jb8N4YVa/YvALqlWdjqO8+dwNRvxjciI63lzUX0N5GEgUTt9XND1TiZzaDiYsI5ZIEiXwrWVbwX0ACLv5Wz72KgaKfj+DCvQ9xWufZ8oo+zDYnvOtr9vxsBAFX3/Xg10tcJjQHsN6ovAkjX5dPpU7EZ6jVmqsBvkJqAEsiNos7Zdt0MeSRf7+ycnKsFLoC8CKdDLAsudTGZfM3yDVG8nr1D0l7jGq9Q+AH3i+37LGw3Nyvd9xzX+/hpHtVD0lwzHV1eu8XzXeBq+L4AxJusaryfswH+7mWV6VKmquMbbXIPuMcZkIVyn1c55A3PqTL9yHKCtqssBrmKtAPKgRxw7tV5EWtoXHolERB07vQHkGyB/Feu5GtOztZDjA3MG7car6FZRFgj6jmtMAvRRAIEdrWyJRpWIBL3G7FBkvqCPu8YkQTcBWELXoPh6nRT6vE0ivDnasCORKpvyWXvjwPMNx3uP5y2ylDWEHx4HfbO7wSoBxyyhq8O2D/7HLGMa0/9S/wDcyY0gQYDZcAAAAABJRU5ErkJggg==',
                                                                          })}
                                                                />
                                                            </Box>
                                                            <Box p={1} flexGrow={1}>
                                                                {item.name}
                                                            </Box>
                                                            <Box p={1}>
                                                                <IconButton onClick={() => handleEdit(item)}>
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                                <IconButton onClick={() => handleRemove(item)}>
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        </InnerBox>
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

const Page5_ = (props: { ioBContext }): JSX.Element => {
    const categorieStates: { [key: string]: { state: any; setState: any } } = {};

    const [tabValue, setTabValue] = useState(1);
    const [loaded, setLoaded] = useState(false);

    for (const [categoryName, category] of Object.entries(EnumLayoutDefinitions)) {
        const [state, setState] = useState(category);
        categorieStates[categoryName] = { state: state, setState: setState };
    }

    const createEnumItemFromMembers = async (ioBContext: any, members: string[]): Promise<I_EnumItem[]> => {
        const newMembers: I_EnumItem[] = [];
        for (const id of members) {
            const obj = await ObjectStateHelper.getObjectByID(ioBContext, id);
            if (obj && obj !== undefined) {
                const newItem: I_EnumItem = {
                    id: id,
                    name: EnumHelper.getEnumNameByObjectByLanguage(ioBContext, obj),
                };
                if ('color' in obj.common && obj.common.color !== undefined && obj.common.color !== '') {
                    newItem.color = obj.common.color;
                }
                if ('icon' in obj.common && obj.common.icon !== undefined && obj.common.icon !== '') {
                    newItem.icon = obj.common.icon;
                }
                newMembers.push(newItem);
            } else {
                newMembers.push({ id: id, name: id });
            }
        }
        return newMembers;
    };

    const createEnumItemFromSub = async (ioBContext: any, parentID: string): Promise<I_EnumItem[]> => {
        const newMembers: I_EnumItem[] = [];
        const enumChilds = await EnumHelper.getAllSubEnums(ioBContext, parentID);
        if (enumChilds === null || enumChilds === undefined) return newMembers;

        for (const [childID, childValue] of Object.entries(enumChilds)) {
            if (childValue && childValue !== undefined) {
                const newItem: I_EnumItem = {
                    id: childID,
                    name: EnumHelper.getEnumNameByObjectByLanguage(ioBContext, childValue),
                };
                if (
                    'color' in childValue.common &&
                    childValue.common.color !== undefined &&
                    childValue.common.color !== ''
                ) {
                    newItem.color = childValue.common.color;
                }
                if (
                    'icon' in childValue.common &&
                    childValue.common.icon !== undefined &&
                    childValue.common.icon !== ''
                ) {
                    newItem.icon = childValue.common.icon;
                }
                newMembers.push(newItem);
            } else {
                newMembers.push({ id: childID, name: childID });
            }
        }
        return newMembers;
    };

    const createEnumCategoryWithObject = async (
        ioBContext: any,
        enumCategoryObject,
        childOrSubEnums = 'sub',
    ): Promise<I_Enum> => {
        const eCs: I_Enum = {
            enumID: enumCategoryObject._id,
            enumName: EnumHelper.getEnumNameByObjectByLanguage(ioBContext, enumCategoryObject),
            members:
                childOrSubEnums === 'sub'
                    ? enumCategoryObject.common.members && enumCategoryObject.common.members !== undefined
                        ? await createEnumItemFromMembers(ioBContext, enumCategoryObject.common.members)
                        : []
                    : await createEnumItemFromSub(ioBContext, enumCategoryObject._id),
        };
        if (
            'color' in enumCategoryObject.common &&
            enumCategoryObject.common.color !== undefined &&
            enumCategoryObject.common.color !== ''
        ) {
            eCs.color = enumCategoryObject.common.color;
        }
        if (
            'icon' in enumCategoryObject.common &&
            enumCategoryObject.common.icon !== undefined &&
            enumCategoryObject.common.icon !== ''
        ) {
            eCs.icon = enumCategoryObject.common.icon;
        }
        return eCs;
    };

    const createEnumChildCategoryWithId = async (ioBContext: any, id: string): Promise<I_Enum> => {
        const obj = await ObjectStateHelper.getObjectByID(ioBContext, id);
        if (!(obj && obj !== undefined)) throw Error('Wrong enum id');
        return createEnumCategoryWithObject(ioBContext, obj, 'child');
    };

    const createEnumCategories = async (
        ioBContext: any,
        enumPlainCategories: Record<string, ioBroker.Object>,
    ): Promise<{ [key: string]: I_Enum }> => {
        const enumCategories: { [key: string]: I_Enum } = {};
        for (const [enumCategoryID, enumCategoryObject] of Object.entries(enumPlainCategories)) {
            enumCategories[enumCategoryID] = await createEnumCategoryWithObject(ioBContext, enumCategoryObject);
        }
        return enumCategories;
    };

    const changeEnumChildCategory = (
        fromEnumChildCategory: string,
        toEnumChildCategory: string,
        EnumItemID: string,
        enumCategory: I_EnumCategory,
    ) => {
        // dropped outside the list
        if (!toEnumChildCategory) return;

        // it is not sortable
        if (fromEnumChildCategory === toEnumChildCategory) return;

        // no longer any EnumChildCategory
        if (toEnumChildCategory === enumCategory.enumCategoryID) {
            if (!enumCategory.enumCategories) return;
            enumCategory.enumCategories[fromEnumChildCategory].members = enumCategory.enumCategories[
                fromEnumChildCategory
            ].members.filter((item) => item.id != EnumItemID);

            categorieStates[enumCategory.categoriePairName].setState(enumCategory);
            EnumHelper.getEnumByID(props.ioBContext, fromEnumChildCategory).then((_enum) => {
                if (_enum && _enum !== undefined && enumCategory.enumCategories) {
                    _enum.common.members = enumCategory.enumCategories[fromEnumChildCategory].members.map(
                        (item): string => item.id,
                    );
                    EnumHelper.saveEnumChangesByObject(props.ioBContext, fromEnumChildCategory, _enum);
                }
            });
        }
        // if new set to a EnumChildCategory
        else if (fromEnumChildCategory === enumCategory.enumCategoryID) {
            if (!enumCategory.enumCategories || !enumCategory.enumChildCategory) return;
            const item = enumCategory.enumChildCategory.members.find((item) => item.id === EnumItemID);
            if (!(item && item !== undefined)) return;
            enumCategory.enumCategories[toEnumChildCategory].members.push(item);

            categorieStates[enumCategory.categoriePairName].setState(enumCategory);
            EnumHelper.getEnumByID(props.ioBContext, toEnumChildCategory).then((_enum) => {
                if (_enum && _enum !== undefined && enumCategory.enumCategories) {
                    _enum.common.members = enumCategory.enumCategories[toEnumChildCategory].members.map(
                        (item): string => item.id,
                    );
                    EnumHelper.saveEnumChangesByObject(props.ioBContext, toEnumChildCategory, _enum);
                }
            });
        }
        // from one EnumChildCategory to another
        else {
            if (!enumCategory.enumCategories || !enumCategory.enumChildCategory) return;
            const item = enumCategory.enumChildCategory.members.find((item) => item.id === EnumItemID);
            if (!(item && item !== undefined)) return;
            enumCategory.enumCategories[toEnumChildCategory].members.push(item);
            enumCategory.enumCategories[fromEnumChildCategory].members = enumCategory.enumCategories[
                fromEnumChildCategory
            ].members.filter((item) => item.id != EnumItemID);

            categorieStates[enumCategory.categoriePairName].setState(enumCategory);
            EnumHelper.getEnumByID(props.ioBContext, fromEnumChildCategory).then((_enum) => {
                if (_enum && _enum !== undefined && enumCategory.enumCategories) {
                    _enum.common.members = enumCategory.enumCategories[fromEnumChildCategory].members.map(
                        (item): string => item.id,
                    );
                    EnumHelper.saveEnumChangesByObject(props.ioBContext, fromEnumChildCategory, _enum);
                }
            });
            EnumHelper.getEnumByID(props.ioBContext, toEnumChildCategory).then((_enum) => {
                if (_enum && _enum !== undefined && enumCategory.enumCategories) {
                    _enum.common.members = enumCategory.enumCategories[toEnumChildCategory].members.map(
                        (item): string => item.id,
                    );
                    EnumHelper.saveEnumChangesByObject(props.ioBContext, toEnumChildCategory, _enum);
                }
            });
        }
    };

    useEffect(() => {
        let mounted = true;
        // console.log(props.ioBContext);

        const calculateEnums = async () => {
            for (const [, categorieState] of Object.entries(categorieStates)) {
                const state = categorieState.state;
                const setState = categorieState.setState;

                // calculate enumCategoryName
                state.enumCategoryName = await EnumHelper.getEnumNameByIDByLanguage(
                    props.ioBContext,
                    state.enumCategoryID,
                );

                // calculate enumCategories
                const enumPlainCategories = await EnumHelper.getAllSubEnums(props.ioBContext, state.enumCategoryID);
                state.enumCategories = await createEnumCategories(props.ioBContext, enumPlainCategories);

                // calculate enumChildCategory
                // TODO members are not yet correct
                state.enumChildCategory = await createEnumChildCategoryWithId(
                    props.ioBContext,
                    state.enumChildCategoryID,
                );

                if (mounted) setState(state);
            }
            console.log(categorieStates);
            if (mounted) setLoaded(true);
        };
        calculateEnums();
        // console.log(categorieStates);

        return () => {
            mounted = false;
        };
    }, []);

    // eslint-disable-next-line @typescript-eslint/ban-types
    const handleChange = (event: React.ChangeEvent<{}>, newTabValue: number) => {
        if (newTabValue !== 0) setTabValue(newTabValue);
    };

    const addHome = () => {
        console.log('addHome');
    };

    return (
        <>
            {!loaded ? (
                <Box alignSelf="center" alignItems="center" justifyContent="center">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Tabs centered value={tabValue} onChange={handleChange}>
                        <Tooltip title={I18n.t('newHome' as AdminWord)}>
                            <Tab
                                key="newHome"
                                icon={<AddIcon />}
                                disableFocusRipple={true}
                                disableRipple={true}
                                onClick={() => addHome()}
                            />
                        </Tooltip>
                        {Object.entries(categorieStates).map((categorieState) => (
                            <Tab key={categorieState[0]} label={I18n.t(categorieState[1].state.categoriePairName)} />
                        ))}
                    </Tabs>
                    {Object.entries(categorieStates).map((categorieState, index) => (
                        <div key={categorieState[0]} hidden={index + 1 !== tabValue} role="tabpanel">
                            <DnD
                                enumCategory={categorieState[1].state}
                                changeEnumChildCategory={changeEnumChildCategory}
                            />
                        </div>
                    ))}
                </>
            )}
        </>
    );
};

export const Page5 = (): JSX.Element => {
    return (
        <MainPageWrapper pageName="page5">
            {/* <IOBrokerContext.Consumer>{(ioBContext) => <Page5_ ioBContext={ioBContext} />}</IOBrokerContext.Consumer> */}
            <EnumLayout />
        </MainPageWrapper>
    );
};
