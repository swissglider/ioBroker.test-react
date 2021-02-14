/**
 * Defines the layout with tabs etc and handles tab changes etc
 */

import { Tab, Tabs } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { EnumLayoutDefinitions } from '../configuration/Configuration';
import I18n from '@iobroker/adapter-react/i18n';
import { I_EnumLayoutDefinition } from '../interfaces/Interfaces';
import { CategoryContainer } from './CategoryContainer';
import { I_ioBrokerContextValue } from '../../../framework/interfaces/I_ioBrokerContextValue';
import { IoBContextWrapper } from '../../../framework/components/IoBContextWrapper';
import PageHelper from '../../../framework/utils/PageHelper';
import { RuntimeError } from '../../../framework/components/RuntimeError';

const EnumLayoutTabs = (props: {
    EnumLayoutDefinitions: I_EnumLayoutDefinition[];
    tabValue: number;
    setTabValue: any;
}): JSX.Element => {
    return (
        <Tabs centered value={props.tabValue} onChange={props.setTabValue}>
            {props.EnumLayoutDefinitions.map((_enumLayoutDefinition) => {
                return (
                    <Tab
                        key={_enumLayoutDefinition.categoriePairName}
                        label={I18n.t(_enumLayoutDefinition.categoriePairName)}
                    />
                );
            })}
        </Tabs>
    );
};

const EnumLayoutTab = (props: { EnumLayoutDefinitions: I_EnumLayoutDefinition[]; tabValue: number }): JSX.Element => {
    return (
        <>
            {props.EnumLayoutDefinitions.map((_enumLayoutDefinition, index) => {
                return (
                    <div
                        key={_enumLayoutDefinition.categoriePairName}
                        hidden={index !== props.tabValue}
                        role="tabpanel"
                        // style={{ maxHeight: 'calc(100% - 225px)', overflowY: 'auto', overflowX: 'hidden' }}
                    >
                        <IoBContextWrapper>
                            {(ioBContext: I_ioBrokerContextValue) => (
                                <CategoryContainer
                                    ioBContext={ioBContext}
                                    enumLayoutDefinition={_enumLayoutDefinition}
                                />
                            )}
                        </IoBContextWrapper>
                    </div>
                );
            })}
        </>
    );
};

export interface EnumsProps {
    [key: string]: any;
}

const allNeededProps: string[] = ['categoriePairName', 'enumCategoryID', 'enumChildCategoryID'];

export const Enums_ = (props: EnumsProps): JSX.Element => {
    const [pageProps, setPageProps] = useState<I_EnumLayoutDefinition>();
    const [allNeededPropsAvailable, setAllNeededPropsAvailable] = useState<boolean>(false);

    useEffect(() => {
        const pageProps_ = PageHelper.getPageProps(location.pathname, props);
        const allOk = PageHelper.allNeededPropsAvailable(allNeededProps, pageProps_);
        if (allOk && pageProps_ !== undefined) {
            setPageProps(pageProps_ as I_EnumLayoutDefinition);
            setAllNeededPropsAvailable(allOk);
        } else {
            console.log(location.pathname, props);
        }
    }, [location.pathname]);

    return (
        <>
            {!allNeededPropsAvailable ? (
                <RuntimeError errorMessage="not all the Properties are configured ..." />
            ) : (
                <div
                    role="tabpanel"
                    // style={{ maxHeight: 'calc(100% - 225px)', overflowY: 'auto', overflowX: 'hidden' }}
                >
                    <IoBContextWrapper>
                        {(ioBContext: I_ioBrokerContextValue) =>
                            pageProps !== undefined && (
                                <>
                                    <CategoryContainer ioBContext={ioBContext} enumLayoutDefinition={pageProps} />
                                </>
                            )
                        }
                    </IoBContextWrapper>
                </div>
            )}
        </>
    );
};

const Enums = (props: EnumsProps): JSX.Element => <Enums_ {...props} />;

export default Enums;

export const Enums1 = (): JSX.Element => {
    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event: any, newTabValue: number) => {
        setTabValue(newTabValue);
    };

    return (
        <IoBContextWrapper>
            {() => (
                <>
                    <EnumLayoutTabs
                        EnumLayoutDefinitions={EnumLayoutDefinitions}
                        tabValue={tabValue}
                        setTabValue={handleChange}
                    />
                    <EnumLayoutTab EnumLayoutDefinitions={EnumLayoutDefinitions} tabValue={tabValue} />
                </>
            )}
        </IoBContextWrapper>
    );
};
