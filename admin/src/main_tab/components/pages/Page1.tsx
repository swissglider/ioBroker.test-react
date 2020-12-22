import { Box, Button } from 'grommet';
import React, { Component } from 'react';
import { DebugModeContext } from '../../framework/context/DebugModeContext';
import { MainPageWrapper } from '../../framework/utils/MainPageWrapper';

interface Props {
    dummy?: string;
}

interface State {
    dummy?: boolean;
}

export class Page1 extends Component<Props, State> {
    constructor(props: Props) {
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
            <MainPageWrapper pageName="page1">
                <DebugModeContext.Consumer>
                    {(context) => (
                        <Box pad="xlarge">
                            <Button onClick={() => context.switchDebugMode()}>
                                Switch Debug Mode: {context.debugMode.toString()}
                            </Button>
                        </Box>
                    )}
                </DebugModeContext.Consumer>
            </MainPageWrapper>
        );
    }
}
