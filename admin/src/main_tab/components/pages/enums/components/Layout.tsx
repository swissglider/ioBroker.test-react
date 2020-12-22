/**
 * Defines the layout with tabs etc and handles tab changes etc
 */

import { Tab, Tabs, Tooltip } from '@material-ui/core';
import React, { useState } from 'react';
import { CategoryContainer } from './Index';
import { EnumLayoutDefinitions } from '../configuration/Configuration';
import AddIcon from '@material-ui/icons/Add';
import I18n from '@iobroker/adapter-react/i18n';
import { IOBrokerContext, I_IOBrokerConsumerType } from '../../../../framework/context/IOBrokerContext';
import { I_EnumLayoutDefinitions, I_EnumLayoutDefinition } from '../interfaces/Interfaces';

const EnumLayoutTabs = (props: {
    EnumLayoutDefinitions: I_EnumLayoutDefinitions;
    addHome: any;
    tabValue: number;
    setTabValue: any;
}): JSX.Element => {
    const tabValue = props.tabValue;
    const [stateEnumLayoutDefinitions] = useState(props.EnumLayoutDefinitions);
    return (
        <Tabs centered value={tabValue} onChange={props.setTabValue}>
            <Tooltip title={I18n.t('newHome' as AdminWord)}>
                <Tab
                    key="newHome"
                    icon={<AddIcon />}
                    disableFocusRipple={true}
                    disableRipple={true}
                    onClick={() => props.addHome()}
                />
            </Tooltip>
            {Object.entries(stateEnumLayoutDefinitions).map((_enumLayoutDefinition) => {
                const enumLayoutDefinition = _enumLayoutDefinition[1] as I_EnumLayoutDefinition;
                return (
                    <Tab
                        key={enumLayoutDefinition.categoriePairName}
                        label={I18n.t(enumLayoutDefinition.categoriePairName as AdminWord)}
                    />
                );
            })}
        </Tabs>
    );
};

const EnumLayoutTab = (props: { EnumLayoutDefinitions: I_EnumLayoutDefinitions; tabValue: number }): JSX.Element => {
    const tabValue = props.tabValue;
    const [stateEnumLayoutDefinitions] = useState(props.EnumLayoutDefinitions);
    return (
        <>
            {Object.entries(stateEnumLayoutDefinitions).map((_enumLayoutDefinition, index) => {
                const enumLayoutDefinition = _enumLayoutDefinition[1] as I_EnumLayoutDefinition;
                return (
                    <div key={enumLayoutDefinition.categoriePairName} hidden={index + 1 !== tabValue} role="tabpanel">
                        <IOBrokerContext.Consumer>
                            {(ioBContext) => (
                                <CategoryContainer
                                    ioBContext={ioBContext as I_IOBrokerConsumerType}
                                    toBeRendered={index + 1 === tabValue}
                                    enumLayoutDefinition={enumLayoutDefinition}
                                />
                            )}
                        </IOBrokerContext.Consumer>
                    </div>
                );
            })}
        </>
    );
};

export const EnumLayout = (): JSX.Element => {
    const allEnumLayoutDefinitions: I_EnumLayoutDefinitions = EnumLayoutDefinitions;

    const [state] = useState(allEnumLayoutDefinitions);
    const [tabValue, setTabValue] = useState(1);

    const addHome = () => {
        console.log('addHome');
    };

    const handleChange = (event: any, newTabValue: number) => {
        console.log(newTabValue);
        if (newTabValue !== 0) setTabValue(newTabValue);
    };

    return (
        <>
            <EnumLayoutTabs
                addHome={addHome}
                EnumLayoutDefinitions={state}
                tabValue={tabValue}
                setTabValue={handleChange}
            />
            <EnumLayoutTab EnumLayoutDefinitions={state} tabValue={tabValue} />
        </>
    );
};
