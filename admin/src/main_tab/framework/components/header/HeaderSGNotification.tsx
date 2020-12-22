import React, { Component } from 'react';
import { Button } from 'grommet';
import * as Icons from 'grommet-icons';
import { DebugMode } from '../../context/DebugModeContext';
import { NotificationContext } from '../../context/NotificationContext';

export class HeaderSGNotification extends Component {
    constructor(props: any) {
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
            <DebugMode name="HeaderSGNotification">
                <NotificationContext.Consumer>
                    {(context) => (
                        <Button
                            icon={<Icons.Notification />}
                            onClick={() => {
                                context.toggleNotificationList();
                            }}
                        />
                    )}
                </NotificationContext.Consumer>
            </DebugMode>
        );
    }
}
