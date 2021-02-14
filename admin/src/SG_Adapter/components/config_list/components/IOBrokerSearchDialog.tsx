import React from 'react';
import { I_ioBrokerContextValue } from '../../../framework/interfaces/I_ioBrokerContextValue';
import DialogSelectID from '@iobroker/adapter-react/Dialogs/SelectID';
import I18n from '@iobroker/adapter-react/i18n';

export interface I_IOBrokerSearchDialog {
    ioBContext: I_ioBrokerContextValue;
    showDialog: boolean;
    onOk: (newString: string) => void;
    onCancel: () => void;
    defaultValue: string | undefined;
}

export const IOBrokerSearchDialog = (props: I_IOBrokerSearchDialog): JSX.Element | null => {
    if (props.showDialog === false || props.ioBContext === undefined || props.ioBContext.ioBrokerConfig === undefined)
        return null;

    return (
        <DialogSelectID
            socket={props.ioBContext.ioBrokerConfig.configuration.socket}
            statesOnly={false}
            // selected={props.showDialog}
            onClose={() => {
                // setState({ showSelectId: false });
                props.onCancel();
            }}
            onOk={(selected, name) => {
                name;
                // setState({ showSelectId: false, selectIdValue: selected });
                if (typeof selected === 'string') props.onOk(selected);
            }}
            key="IOBrokerSearchDialog"
            dialogName="dialogName"
            title={I18n.t('please_select_object')}
            multiSelect={false}
            foldersFirst={true}
            showExpertButton={true}
            types={['state', 'instance', 'channel']}
            columns={['name', 'type', 'role', 'room']}
            selected={props.defaultValue}
        />
    );
};
