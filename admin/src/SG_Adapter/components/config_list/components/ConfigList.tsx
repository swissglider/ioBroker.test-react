import React from 'react';
import { I_ConfigListParams, fillConfigListWithDefaultValues } from '../interfaces/I_ConfigList';
import { ConfigDnDList } from './ConfigDnDList';
import { ConfigListTitle } from './ConfigListTitle';

export const ConfigList = (props: I_ConfigListParams): JSX.Element => {
    const newProps = fillConfigListWithDefaultValues(props);

    return (
        <>
            <ConfigListTitle {...newProps} />
            {props.childBetweenTitleAndList !== undefined && props.childBetweenTitleAndList}
            <ConfigDnDList {...newProps} />
        </>
    );
};
