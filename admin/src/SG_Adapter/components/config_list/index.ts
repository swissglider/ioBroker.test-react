import * as Comps_ConfigList from './components/ConfigList';
import * as IOBrokerAdapterConfigList from './components/IOBrokerAdapterConfigList';
import * as I_ConfigDnDList from './interfaces/I_ConfigDnDList';
import * as I_ConfigDnDListItem from './interfaces/I_ConfigDnDListItem';
import * as I_ConfigList from './interfaces/I_ConfigList';

/** The JSX Component to show the ConfigList. The props are defined in the I_ConfigListParams */
export const ConfigListComponent = Comps_ConfigList.ConfigList;
export const IOBrokerAdapterConfigListComponent = IOBrokerAdapterConfigList.IOBrokerAdapterConfigList;

/**
 * The I_ConfigListParams interface defines all the parameter that can be set for the ConfigListComponent
 *
 * ## All Parameters
 * ```jsx
    configList: T_ConfigList; // the configList
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
 * ````
 */
export type I_ConfigListProps = I_ConfigList.I_ConfigListParams;

/**
 * The definition of the configList
 * ```jsx
 * { id: string; name: string; }[]
 * ```
 */
export type T_ConfigList = I_ConfigDnDList.T_ConfigList;

/** all the new generated Items will first get this string */
export const newItemString = I_ConfigDnDListItem.newItemString;

/** Prefix that declares an item as Titel item */
export const prefixTitelItem = I_ConfigDnDListItem.prefixTitelItem;

/** Prefix that declares an item as an comment */
export const prefixCommentItem = I_ConfigDnDListItem.prefixCommentItem;

export default ConfigListComponent;
