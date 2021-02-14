import React, { useEffect, useState } from 'react';
import { IOBrokerContext } from '../context/IOBrokerContext';
import { I_ioBrokerContextValue } from '../interfaces/I_ioBrokerContextValue';
import { RuntimeError } from './RuntimeError';

export const IoBContextWrapper = (props: { children: any; iobNotConnectedChild?: any }): JSX.Element => {
    const [iobNotConnectedChild, setIobNotConnectedChild] = useState(<></>);

    useEffect(() => {
        props.iobNotConnectedChild !== undefined
            ? setIobNotConnectedChild(props.iobNotConnectedChild)
            : setIobNotConnectedChild(<RuntimeError errorMessage="ioBroker is not connected ..." />);
    }, []);

    return (
        <IOBrokerContext.Consumer>
            {(ioBContext: I_ioBrokerContextValue) =>
                Object.keys(ioBContext).length !== 0 ? props.children(ioBContext) : <>{iobNotConnectedChild}</>
            }
        </IOBrokerContext.Consumer>
    );
};
