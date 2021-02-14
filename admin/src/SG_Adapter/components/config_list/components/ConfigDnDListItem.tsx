import React, { useRef } from 'react';
import { ListItemText, Paper, IconButton, InputBase, Divider } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import SearchIcon from '@material-ui/icons/Search';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { I_ConfigDnDListItem } from '../interfaces/I_ConfigDnDListItem';
import { ListItem } from '@material-ui/core';
import { ConfigDnDListItemStyle, ConfigDnDListItemTextStyle } from '../styles/ConfigDnDListItemStyle';
import { useState } from 'react';
import { useEffect } from 'react';

const ConfigDnDListItemText = (props: I_ConfigDnDListItem): JSX.Element => {
    const classes = ConfigDnDListItemTextStyle({
        name: props.name,
        isDragging: props.snapshot.isDragging,
        draggibleItemOtherColor: props.draggibleItemOtherColor,
    });
    const [text, setText] = useState<string>('');
    const [loaded, setLoaded] = useState<boolean>(false);
    const isInitialRun = useRef(false);

    const comp1 = props.listItemType ? props.listItemType : Paper;

    useEffect(() => {
        if (loaded) {
            if (isInitialRun.current) {
                props.onChangeItemName(text, props.index);
            } else {
                isInitialRun.current = true;
            }
        }
        setLoaded(true);
    }, [text]);

    useEffect(() => {
        setText(props.name);
    }, [props.name]);

    const onBlur = (value: string): void => {
        props.onBlur(value, props.index);
    };

    const getItemInput = (): JSX.Element => {
        return (
            <>
                {props.listSortable && (
                    <IconButton className={classes.iconButton} aria-label="menu">
                        <DragIndicatorIcon />
                    </IconButton>
                )}
                <InputBase
                    fullWidth
                    className={classes.input}
                    value={text}
                    readOnly={!props.itemTextEditable}
                    onChange={(event) => setText(event.target.value)}
                    onBlur={(event) => onBlur(event.target.value)}
                />
                {props.searchable && (
                    <IconButton
                        className={classes.iconButton}
                        onClick={() => props.searchItem(props.index)}
                        aria-label="search"
                    >
                        <SearchIcon />
                    </IconButton>
                )}
                {props.itemDeletable && props.searchable && (
                    <Divider className={classes.divider} orientation="vertical" />
                )}
                {props.itemDeletable && (
                    <IconButton
                        className={classes.iconButton}
                        aria-label="delete"
                        onClick={(event) => props.deleteItem(event, props.index)}
                    >
                        <DeleteForever />
                    </IconButton>
                )}
            </>
        );
    };

    return (
        <ListItemText
            className={classes.listItemText}
            primary={React.createElement(comp1, { component: 'form', className: classes.paper }, getItemInput())}
        />
    );
};

export const ConfigDnDListItem = (props: I_ConfigDnDListItem): JSX.Element => {
    const classes = ConfigDnDListItemStyle();
    const [text, setText] = useState<string>('');

    useEffect(() => {
        setText(props.name);
    }, [props.name]);

    const onBlur = (value: string) => {
        if (value !== props.name) props.onChangeItemName(value, props.index);
    };

    const onChangeItemName = (value: string) => {
        setText(value);
    };

    return (
        <ListItem
            className={classes.listItem}
            alignItems="flex-start"
            ref={props.provided.innerRef}
            {...props.provided.draggableProps}
            {...props.provided.dragHandleProps}
        >
            <ConfigDnDListItemText {...props} onChangeItemName={onChangeItemName} onBlur={onBlur} name={text} />
        </ListItem>
    );
};
