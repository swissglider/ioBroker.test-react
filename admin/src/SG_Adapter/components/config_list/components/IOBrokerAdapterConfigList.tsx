import React, { useEffect, useState } from 'react';
import ConfigListComponent, { newItemString, T_ConfigList } from '..';
import { IoBContextWrapper } from '../../../framework/components/IoBContextWrapper';
import { I_ioBrokerContextValue } from '../../../framework/interfaces/I_ioBrokerContextValue';
import { I_ConfigListParams } from '../interfaces/I_ConfigList';
import { IOBrokerSearchDialog } from './IOBrokerSearchDialog';

export const IOBrokerAdapterConfigList_ = (props: {
    ioBContext: I_ioBrokerContextValue;
    configListParams: I_ConfigListParams;
    ioBConfigListName: string;
}): JSX.Element => {
    const [itemsState, setItemsState] = useState<T_ConfigList>([]);
    const [showSearchDialog, setShowSearchDialog] = useState<boolean>(false);
    const [indexSearchDialog, setIndexShowSearchDialog] = useState<number>();
    const [valueSearchDialog, setvalueShowSearchDialog] = useState<string>();

    const setSavedItemList = (): void => {
        let listToSet: T_ConfigList = [];
        if (props.ioBContext !== undefined && props.ioBContext.getParameterList !== undefined) {
            const result: { name: string; value: any } | undefined = props.ioBContext
                .getParameterList()
                .find((e) => e.name === props.ioBConfigListName);
            if (result !== undefined && result.value !== undefined && Array.isArray(result.value)) {
                listToSet = result.value.map((item: string, index: number) => ({ id: index.toString(), name: item }));
            }
        }
        setItemsState(listToSet);
    };

    useEffect(() => {
        // console.log('useEffect');
        setSavedItemList();
    }, [props.ioBContext, props.ioBConfigListName]);

    const updateList = (configList: T_ConfigList): void => {
        if (props.ioBContext.saveParameter) {
            props.ioBContext.saveParameter(
                props.ioBConfigListName,
                configList.map((e) => e.name),
            );
        }
    };

    const addItem = () => {
        const result = Array.from(itemsState);
        result.unshift({ name: newItemString, id: (result.length + 1).toString() });
        updateList(result);
    };

    const reloadList = (): void => {
        setSavedItemList();
    };

    const onSearchCancel = () => {
        setShowSearchDialog(false);
    };

    const onSearchOK = (newString: string) => {
        const result = Array.from(itemsState);
        if (indexSearchDialog !== undefined && newString !== undefined) {
            if (result[indexSearchDialog].name !== newString) {
                result[indexSearchDialog].name = newString;
                updateList(result);
            }
        } else if (indexSearchDialog !== undefined && valueSearchDialog !== undefined) {
            if (result[indexSearchDialog].name !== valueSearchDialog) {
                result[indexSearchDialog].name = valueSearchDialog;
                updateList(result);
            }
        }
        onSearchCancel();
    };

    const searchItem = (index: number): void => {
        const result = Array.from(itemsState);
        if (result[index].name === newItemString) {
            result[index].name = 'newItem' + '**';
        }

        setIndexShowSearchDialog(index);
        setvalueShowSearchDialog(result[index].name);
        setShowSearchDialog(true);

        // setShowSearchDialog(false);
        // updateList(result);
    };

    return (
        <>
            <ConfigListComponent
                {...props.configListParams}
                configList={itemsState}
                addItem={addItem}
                reloadList={reloadList}
                updateList={updateList}
                searchItem={searchItem}
            />
            <IOBrokerSearchDialog
                ioBContext={props.ioBContext}
                showDialog={showSearchDialog}
                onOk={onSearchOK}
                onCancel={onSearchCancel}
                defaultValue={valueSearchDialog}
            />
        </>
    );
};
export const IOBrokerAdapterConfigList = (props: {
    configListParams: I_ConfigListParams;
    ioBConfigListName: string;
}): JSX.Element => {
    return (
        <IoBContextWrapper>
            {(context: I_ioBrokerContextValue) => (
                <IOBrokerAdapterConfigList_
                    ioBContext={context}
                    configListParams={props.configListParams}
                    ioBConfigListName={props.ioBConfigListName}
                />
            )}
        </IoBContextWrapper>
    );
};
