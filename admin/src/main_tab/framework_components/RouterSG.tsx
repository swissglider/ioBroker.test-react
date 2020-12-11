import React from 'react';
import { Box } from 'grommet';

import { HeaderSG, MainContent, FooterSG } from './';
import { Page1, Page2, Page3 } from '../components/pages';

interface Props {
    dummy?: string;
}

interface State {
    dummy?: string;
}

const routerConfig = [
    { id: 1, name: 'Home', path: '/page1', component: <Page1 /> },
    { id: 2, name: 'Page 1', path: '/page1', component: <Page1 /> },
    { id: 3, name: 'Page 2', path: '/page2', component: <Page2 /> },
    { id: 4, name: 'Page 3', path: '/page3', component: <Page3 /> },
];

const startURL = '/adapter/test-react/tab_m.html';
const defaultURL = '/page1';

const routerParams = {
    routerConfig: routerConfig,
    startURL: startURL,
    defaultURL: defaultURL,
};

export class RouterSG extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }
    // export function RouterSG(props: Props, states: State): JSX.Element {
    //     return render();

    componentDidMount(): void {
        return;
    }

    componentWillUnmount(): void {
        return;
    }

    render(): JSX.Element {
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
}
