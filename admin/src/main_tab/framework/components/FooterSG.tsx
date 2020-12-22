import React, { Component } from 'react';
import { DebugMode } from '../context/DebugModeContext';

interface Props {
    title: string;
}

interface State {
    dummy?: boolean;
}

export class FooterSG extends Component<Props, State> {
    static defaultProps: Props = {
        title: 'Tabbed Version ;-)',
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
            <DebugMode name="FooterSG">
                <div />
            </DebugMode>
        );
    }
}
