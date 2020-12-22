import { Box, Heading } from 'grommet';
import React from 'react';
import I18n from '@iobroker/adapter-react/i18n';
import { DebugMode } from '../context/DebugModeContext';

export const MainPageWrapper = (props: { pageName: any; children: any; [key: string]: any }): JSX.Element => {
    return (
        <DebugMode name={I18n.t(props.pageName)}>
            <Heading level="3" size="small" fill textAlign="center">
                {I18n.t(props.pageName)}
            </Heading>
            <Box pad="small">{props.children}</Box>
        </DebugMode>
    );
};
