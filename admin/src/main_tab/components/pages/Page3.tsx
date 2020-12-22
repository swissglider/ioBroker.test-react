import React, { useState } from 'react';

import DialogSelectID from '@iobroker/adapter-react/Dialogs/SelectID';
import I18n from '@iobroker/adapter-react/i18n';
import { Box, Button } from 'grommet';
import { IOBrokerContext } from '../../framework/context/IOBrokerContext';
import { MainPageWrapper } from '../../framework/utils/MainPageWrapper';

interface PropsD {
    context: any;
    showDialog: any;
    showDialogFN: any;
    setSelectedFN: any;
    [key: string]: any;
}

const Dialog = (props: PropsD): JSX.Element | null => {
    // const defaultState: State = { showSelectId: props.showDialog };
    // const [state, setState] = useState(defaultState);

    // console.log(props);

    const renderSelectIdDialog = (): JSX.Element | null => {
        if (props.showDialog) {
            return (
                <DialogSelectID
                    socket={props.context.ioBrokerConfig.configuration.socket}
                    statesOnly={false}
                    // selected={props.showDialog}
                    onClose={() => {
                        // setState({ showSelectId: false });
                        props.showDialogFN(false);
                    }}
                    onOk={(selected, name) => {
                        // setState({ showSelectId: false, selectIdValue: selected });
                        props.setSelectedFN(selected);
                        props.showDialogFN(false);
                    }}
                />
            );
        } else {
            return null;
        }
    };

    return renderSelectIdDialog();
};

export const Page3 = (): JSX.Element => {
    const [showDialog, setState] = useState(false);
    const [showSelectedState, setSelected] = useState('none');
    const [context, setContext] = useState({});
    const [stateObject, setStateObject] = useState({});
    const [ioState, setIOState] = useState({ val: 'n/a' });
    const [objectName, setObjectName] = useState('');

    const setSelected1 = (selection: string): void => {
        setSelected(selection);
        context['ioBrokerConfig']['configuration'].socket.getObject(selection).then((obj) => {
            setStateObject(obj);
            if (
                'native' in obj &&
                'swissglider' in obj.native &&
                'general' in obj.native.swissglider &&
                'displayName' in obj.native.swissglider.general
            ) {
                setObjectName(obj.native.swissglider.general.displayName);
            } else {
                setObjectName(obj.common.name);
            }
        });
        context['ioBrokerConfig']['configuration'].socket.getState(selection).then((state) => {
            setIOState(state);
        });
    };

    return (
        <MainPageWrapper pageName="page3">
            <IOBrokerContext.Consumer>
                {(context) => (
                    <>
                        {setContext(context)}
                        <Box pad="xlarge">
                            <Button onClick={() => setState(true)}>{I18n.t('DialogSelectIDStatus')}</Button>
                        </Box>
                        <Dialog
                            context={context}
                            showDialog={showDialog}
                            showDialogFN={setState}
                            setSelectedFN={setSelected1}
                        />
                        {showSelectedState && showSelectedState !== 'none' && (
                            <>
                                <div>{showSelectedState}</div>
                                <div>
                                    {objectName} : {ioState.val}
                                </div>
                            </>
                        )}
                    </>
                )}
            </IOBrokerContext.Consumer>
        </MainPageWrapper>
    );
};
