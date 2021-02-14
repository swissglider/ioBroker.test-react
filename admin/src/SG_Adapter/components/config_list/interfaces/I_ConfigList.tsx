import { T_ConfigList } from './I_ConfigDnDList';

export interface I_ConfigListParams {
    configList?: T_ConfigList; // the configList
    listTitle?: string; // itle of the List Component - default no title

    // update list
    listEditable?: boolean; // true if the the list is editable, if false it can not be updated
    updateList?: (configList: T_ConfigList) => void; // will be called on each change, so you can store the list or so (gives the current updated list) -> musst be set if listEditable

    // search button
    searchable?: boolean; // if true the search icon will be showned after each item
    searchItem?: (index: number) => void; // will be called if the search icon is clicked. It gives the index of the current list

    // add button
    withAddButton?: boolean; // if true a add button will be displayed
    addItem?: () => void; // is called after the add button is pressed, so you can add a new Item to the list and update the list wiht updateList or just updae the list state

    // sortable
    listSortable?: boolean; // if true, the list can be sorted. After each change of the order, the updateList function will be called

    itemDeletable?: boolean; // if true, the each Item will get a delete button and can be deleted. The updateList function will be called after the item is deleted

    withReloadButton?: boolean; // shows the Reload Button and the realoadList function will be called
    reloadList?: () => void; // reload button to reaload the list - so you can i.e. update the list with the init items..

    itemTextEditable?: boolean; // the text of each item can be edited. After changing the text the updateList function will be called
    draggibleItemOtherColor?: boolean;
    childBetweenTitleAndList?: JSX.Element;
    withBackgroundColor?: boolean;
    backgroundColor?: string;
    listItemType?: any; // Box or Paper
    droppableItemOtherColor?: boolean;
}

export interface I_ConfigListParams__ {
    configList: T_ConfigList;
    listTitle: string;
    listEditable: boolean;
    updateList: (configList: T_ConfigList) => void;
    searchable: boolean;
    searchItem: (index: number) => void;
    addItem: () => void;
    withAddButton: boolean;
    listSortable: boolean;
    itemDeletable: boolean;
    reloadList: () => void;
    withReloadButton: boolean;
    itemTextEditable: boolean;
    draggibleItemOtherColor: boolean;
    [key: string]: any;
}

const defaultValues: { [key: string]: any } = {
    configList: [],
    listTitle: '',
    listEditable: false,
    updateList: (): void => {
        return;
    },
    searchable: false,
    searchItem: (): void => {
        return;
    },
    addItem: (): void => {
        return;
    },
    withAddButton: false,
    listSortable: false,
    itemDeletable: false,
    reloadList: (): void => {
        return;
    },
    withReloadButton: false,
    itemTextEditable: false,
    draggibleItemOtherColor: false,
};

export const fillConfigListWithDefaultValues = (cl: I_ConfigListParams): I_ConfigListParams__ => {
    const tmpO: { [key: string]: any } = {};
    if (cl.configList === undefined) tmpO.configList = defaultValues.configList;
    for (const [key, value] of Object.entries(cl)) {
        tmpO[key] = value !== null && value !== undefined ? value : key in defaultValues ? defaultValues[key] : value;
    }

    const returnCL = tmpO as I_ConfigListParams__;

    if (returnCL.listEditable === false) {
        returnCL.withAddButton = false;
        returnCL.searchable = false;
        returnCL.listSortable = false;
        returnCL.itemDeletable = false;
        returnCL.withReloadButton = false;
        returnCL.itemTextEditable = false;
    }
    return returnCL;
};
