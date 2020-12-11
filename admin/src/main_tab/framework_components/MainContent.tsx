import React, { Component } from 'react';
import { Box, Collapsible, Layer, Button, ResponsiveContext } from 'grommet';
import { FormClose } from 'grommet-icons';

import { PageSG, NotificationList } from './mainContent/Index';
import { DebugMode, NotificationContext } from './';

export class MainContent extends Component<any, any> {
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
            <DebugMode name="MainContent">
                <ResponsiveContext.Consumer>
                    {(size) => (
                        <Box
                            justify="center"
                            fill="horizontal"
                            direction="row"
                            overflow={{ horizontal: 'hidden' }}
                            flex
                        >
                            <Box
                                flex
                                align="center"
                                justify="center"
                                alignContent="between"
                                background="light-1"
                                elevation="medium"
                            >
                                <Box justify="center" fill>
                                    <PageSG {...this.props} />
                                </Box>
                            </Box>
                            <NotificationContext.Consumer>
                                {(context) =>
                                    !context.notificationListOpen || size !== 'small' ? (
                                        <Collapsible direction="horizontal" open={context.notificationListOpen}>
                                            <Box
                                                flex
                                                width="medium"
                                                background="light-2"
                                                elevation="small"
                                                align="center"
                                                justify="center"
                                            >
                                                <Box justify="center" fill>
                                                    <NotificationList />
                                                </Box>
                                            </Box>
                                        </Collapsible>
                                    ) : (
                                        <Layer>
                                            <Box
                                                background="light-2"
                                                tag="header"
                                                justify="end"
                                                align="center"
                                                direction="row"
                                            >
                                                <Button
                                                    icon={<FormClose />}
                                                    onClick={() => context.closeNotificationList(false)}
                                                />
                                            </Box>
                                            <Box fill background="light-2" align="center" justify="center">
                                                <Box justify="start" fill>
                                                    <NotificationList />
                                                </Box>
                                            </Box>
                                        </Layer>
                                    )
                                }
                            </NotificationContext.Consumer>
                        </Box>
                    )}
                </ResponsiveContext.Consumer>
            </DebugMode>
        );
    }
}
