import React, { Component } from 'react';
import { Box, Collapsible } from 'grommet';
import { DebugMode } from '..';

interface Props {
    showError: boolean;
}

interface State {
    dummy?: boolean;
}

export class HeaderSGErrors extends Component<Props, State> {
    static defaultProps: Props = {
        showError: true,
    };
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
            <DebugMode name="HeaderSGError">
                <Collapsible direction="vertical" open={this.props.showError}>
                    <Box justify="start" direction="row" gap="medium">
                        Errors
                    </Box>
                </Collapsible>
            </DebugMode>
        );
    }
}
