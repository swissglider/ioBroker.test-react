import React, { Component } from 'react';
import ConfirmDialog from '@iobroker/adapter-react/Dialogs/Confirm';
import { Button, Heading } from 'grommet';

export interface Props {
    title?: string;
}

interface State {
    confirmDialog: boolean;
}

export default class Header extends Component<Props, State> {
    static defaultProps: Props = {
        title: 'Tabbed Version ;-)',
    };
    constructor(props: Props) {
        super(props);

        this.state = {
            confirmDialog: false,
        };
    }

    renderConfirmDialog() {
        if (!this.state.confirmDialog) {
            return null;
        }
        return (
            <ConfirmDialog
                title="Scene will be overwritten."
                text="All data will be lost. Confirm?"
                ok="Yes"
                cancel="Cancel"
                onClose={(isYes) => {
                    this.setState({ confirmDialog: false });
                }}
            />
        );
    }

    componentDidMount(): void {
        return;
    }

    componentWillUnmount(): void {
        return;
    }

    render(): JSX.Element {
        return (
            <Heading level="3" margin="none">
                <h2>{this.props.title}</h2>
                <Button onClick={() => this.setState({ confirmDialog: true })}>Click</Button>
                {this.renderConfirmDialog()}
            </Heading>
        );
    }
}
