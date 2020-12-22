import React from 'react';
import { Box } from 'grommet';

import { HeaderSG, FooterSG, MainContent } from '.';
import { Page1, Page2, Page3, Page4, Page5 } from '../../components/pages';

const routerConfig = [
    { id: 0, name: 'home', path: '/page1', component: <Page1 /> },
    { id: 1, name: 'page1', path: '/page1', component: <Page1 /> },
    { id: 2, name: 'page2', path: '/page2', component: <Page2 /> },
    {
        id: 3,
        name: 'page3',
        path: '/page3',
        component: <Page3 />,
    },
    { id: 4, name: 'page4', path: '/page4', component: <Page4 /> },
    { id: 5, name: 'page5', path: '/page5', component: <Page5 /> },
];

const startURL = '/adapter/test-react/tab_m.html';
const defaultURL = '/page1';

const routerParams = {
    routerConfig: routerConfig,
    startURL: startURL,
    defaultURL: defaultURL,
};

export function RouterSG(): JSX.Element {
    return (
        <Box justify="start" fill="horizontal" direction="column">
            <Box justify="start">
                <HeaderSG routerParams={routerParams} />
            </Box>
            <Box justify="center">
                <MainContent routerParams={routerParams}></MainContent>
            </Box>
            <Box justify="end">
                <FooterSG />
            </Box>
        </Box>
    );
}
