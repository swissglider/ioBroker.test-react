import React, { Component } from 'react';
import { DebugMode } from '../../context/DebugModeContext';

interface Props {
    dummy?: string;
}

interface State {
    dummy?: boolean;
}

export class NotificationList extends Component<Props, State> {
    static defaultProps: Props = {};
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
            <DebugMode name="NotificationList">
                <div />
            </DebugMode>
        );
    }
}
