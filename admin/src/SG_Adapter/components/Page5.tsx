import React, { useState } from 'react';
import {
    Box,
    Container,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    makeStyles,
    Theme,
    createStyles,
    Toolbar,
    Button,
} from '@material-ui/core';
import { I_ConfigListProps, IOBrokerAdapterConfigListComponent } from './config_list';
import { HuePicker } from 'react-color';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        button: {
            margin: theme.spacing(1),
        },
    }),
);

export const Page5 = (): JSX.Element => {
    const classes = useStyles();
    const [withAddButton, setWithAddButton] = useState<boolean>(true);
    const [withReloadButton, setWithReloadButton] = useState<boolean>(true);
    const [itemTextEditable, setItemTextEditable] = useState<boolean>(true);
    const [itemDeletable, setItemDeletable] = useState<boolean>(true);
    const [searchable, setSearchable] = useState<boolean>(true);
    const [listSortable, setListSortable] = useState<boolean>(true);
    const [listEditable, setListEditable] = useState<boolean>(true);
    const [draggibleItemOtherColor, setDraggibleItemOtherColor] = useState<boolean>(true);
    const [droppableItemOtherColor, setDroppableItemOtherColor] = React.useState<boolean>(false);
    const [withBackground, setWithBackground] = useState<boolean>(true);
    const [itemType, setItemType] = React.useState<any>(Paper);
    const [itemTypeSelectNumber, setItemTypeSelectNumber] = React.useState<number>(10);
    const [backgroundColor, setBackgroundColor] = React.useState<string | undefined>(undefined);
    const [configurationOpen, setConfigurationOpen] = React.useState<boolean>(false);

    const handleItemType = (event: React.ChangeEvent<{ value: unknown }>) => {
        setItemTypeSelectNumber(event.target.value as number);
        if ((event.target.value as number) === 10) setItemType(Paper);
        if ((event.target.value as number) === 20) setItemType(Box);
        if ((event.target.value as number) === 30) setItemType(Container);
        if ((event.target.value as number) === 40) setItemType(Toolbar);
    };

    const childBettweenTitleAndList = (
        <>
            <Button
                variant="outlined"
                className={classes.button}
                size="small"
                startIcon={configurationOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                onClick={() => setConfigurationOpen(!configurationOpen)}
            >
                {configurationOpen ? <>Close Configuration</> : <>Open Configuration</>}
            </Button>
            <div hidden={!configurationOpen}>
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={withAddButton}
                                onChange={(event) => setWithAddButton(event.target.checked)}
                            />
                        }
                        label="With Add Button"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={withReloadButton}
                                onChange={(event) => setWithReloadButton(event.target.checked)}
                            />
                        }
                        label="With Reload Button"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={itemTextEditable}
                                onChange={(event) => setItemTextEditable(event.target.checked)}
                            />
                        }
                        label="Item text editable"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={itemDeletable}
                                onChange={(event) => setItemDeletable(event.target.checked)}
                            />
                        }
                        label="Item deletable"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox checked={searchable} onChange={(event) => setSearchable(event.target.checked)} />
                        }
                        label="Item searchable"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={listSortable}
                                onChange={(event) => setListSortable(event.target.checked)}
                            />
                        }
                        label="List sortable"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={listEditable}
                                onChange={(event) => setListEditable(event.target.checked)}
                            />
                        }
                        label="List editable"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={draggibleItemOtherColor}
                                onChange={(event) => setDraggibleItemOtherColor(event.target.checked)}
                            />
                        }
                        label="Set Color on dragg"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={droppableItemOtherColor}
                                onChange={(event) => setDroppableItemOtherColor(event.target.checked)}
                            />
                        }
                        label="Set Color on Drop"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={withBackground}
                                onChange={(event) => setWithBackground(event.target.checked)}
                            />
                        }
                        label="With Background"
                    />
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-filled-label">Item Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={itemTypeSelectNumber}
                            onChange={handleItemType}
                        >
                            <MenuItem value={10}>Paper</MenuItem>
                            <MenuItem value={20}>Box</MenuItem>
                            <MenuItem value={30}>Container</MenuItem>
                            <MenuItem value={40}>Toolbar</MenuItem>
                        </Select>
                    </FormControl>
                    <HuePicker
                        color={backgroundColor}
                        onChange={(color) => {
                            setBackgroundColor(color.hex);
                        }}
                    />
                </FormGroup>
            </div>
        </>
    );

    const params_org: I_ConfigListProps = {
        childBetweenTitleAndList: childBettweenTitleAndList,
        // configList: itemsState,
        withAddButton: withAddButton,
        withReloadButton: withReloadButton,
        listTitle: 'Super Liste ;-)',
        itemTextEditable: itemTextEditable,
        itemDeletable: itemDeletable,
        searchable: searchable,
        listSortable: listSortable,
        listEditable: listEditable,
        draggibleItemOtherColor: draggibleItemOtherColor,
        droppableItemOtherColor: droppableItemOtherColor,
        backgroundColor: backgroundColor,
        listItemType: itemType,
        withBackgroundColor: withBackground,
    };

    return (
        <IOBrokerAdapterConfigListComponent
            configListParams={params_org}
            ioBConfigListName="default_not_overwritte_excludeCollection"
        />
    );
};
