import React, { Component } from 'react';
import { Heading, Avatar, Anchor, Box, ResponsiveContext, Menu } from 'grommet';
import * as Icons from 'grommet-icons';
import { DebugMode, DebugModeContext } from '..';

export class HeaderSGMain extends Component {
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
            <DebugMode name="HeaderSGMain">
                <Box justify="center" fill align="center" direction="row" gap="medium" flex>
                    <Avatar background="neutral-4">
                        <Icons.UserFemale color="accent-4" />
                    </Avatar>
                    <Box justify="start" direction="row" gap="medium" flex>
                        <Heading fill={true} level={3} color="accent-4" margin="small">
                            <DebugModeContext.Consumer>
                                {(context) => <span>{context.title}</span>}
                            </DebugModeContext.Consumer>
                        </Heading>
                    </Box>
                    <ResponsiveContext.Consumer>
                        {(size) =>
                            size === 'small' ? (
                                <Box justify="end">
                                    <Menu
                                        a11yTitle="Navigation Menu"
                                        dropProps={{ align: { top: 'bottom', right: 'right' } }}
                                        icon={<Icons.Menu color="accent-4" />}
                                        items={[
                                            {
                                                label: (
                                                    <Box color="accent-4" pad="small">
                                                        Grommet.io
                                                    </Box>
                                                ),
                                                href: 'https://v2.grommet.io/',
                                            },
                                            {
                                                label: (
                                                    <Box color="accent-4" pad="small">
                                                        Feedback
                                                    </Box>
                                                ),
                                                href: 'https://github.com/grommet/grommet/issues',
                                            },
                                        ]}
                                    />
                                </Box>
                            ) : (
                                <Box color="neutral-4" justify="end" direction="row" gap="medium" flex>
                                    <Anchor color="accent-4" href="https://v2.grommet.io/" label="Grommet.io" />
                                    <Anchor
                                        color="accent-4"
                                        href="https://github.com/grommet/grommet/issues"
                                        label="Feedback"
                                    />
                                </Box>
                            )
                        }
                    </ResponsiveContext.Consumer>
                </Box>
            </DebugMode>
        );
    }
}
