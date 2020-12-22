import React, { Component } from 'react';
import { Header, Box } from 'grommet';

import { HeaderSGErrors, HeaderSGTabs, HeaderSGMain, HeaderSGNotification } from './header';
import { DebugMode } from '../context/DebugModeContext';

interface State {
    dummy?: boolean;
}

export class HeaderSG extends Component<any, State> {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount(): void {
        return;
    }

    componentWillUnmount(): void {
        return;
    }

    render(): JSX.Element {
        return (
            <DebugMode name="HeaderSG">
                <Header background="dark-2" pad="small">
                    <Box justify="center" fill flex>
                        <Box justify="start">
                            <Box justify="center" fill>
                                <HeaderSGErrors />
                            </Box>
                        </Box>

                        <Box justify="center" direction="row">
                            <Box justify="center" fill>
                                <HeaderSGMain />
                            </Box>
                            <HeaderSGNotification />
                        </Box>

                        <Box justify="end">
                            <Box justify="center" fill>
                                <HeaderSGTabs {...this.props} />
                            </Box>
                        </Box>
                    </Box>
                </Header>
            </DebugMode>
        );
    }
}
