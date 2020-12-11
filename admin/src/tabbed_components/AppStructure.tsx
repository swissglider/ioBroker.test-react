import React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';

import { StyleRules } from '@material-ui/core/styles';
import { Box, Button, Tabs, Collapsible, Heading, Layer, ResponsiveContext } from 'grommet';
import { FormClose, Notification } from 'grommet-icons';

import AppBar from './AppBar';
import Header from './Header';

const styles = (_theme: Theme): StyleRules => ({
    root: {},
});

export interface Props {
    dummy?: number;
}

interface State {
    showSidebar: boolean;
}

class AppStructure extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.setShowSidebar = this.setShowSidebar.bind(this);
        this.state = {
            showSidebar: false,
        };
    }

    setShowSidebar(newState: boolean): void {
        this.setState({ showSidebar: newState });
    }

    render() {
        const showSideBar = this.state.showSidebar;
        return (
            <ResponsiveContext.Consumer>
                {(size) => (
                    <Box fill>
                        <AppBar>
                            <Heading level="3" margin="none">
                                <Header />
                            </Heading>
                            <Button icon={<Notification />} onClick={() => this.setShowSidebar(!showSideBar)} />
                        </AppBar>
                        <Box direction="row" overflow={{ horizontal: 'hidden' }} flex>
                            <Box
                                flex
                                align="center"
                                justify="stretch"
                                alignContent="between"
                                background="light-1"
                                round
                                margin={{
                                    top: 'small',
                                    bottom: 'small',
                                }}
                                pad="small"
                                elevation="medium"
                            >
                                {this.props.children}
                            </Box>
                            {!showSideBar || size !== 'small' ? (
                                <Collapsible direction="horizontal" open={showSideBar}>
                                    <Box
                                        flex
                                        width="medium"
                                        background="light-2"
                                        elevation="small"
                                        align="center"
                                        justify="center"
                                    >
                                        sidebar
                                    </Box>
                                </Collapsible>
                            ) : (
                                <Layer>
                                    <Box background="light-2" tag="header" justify="end" align="center" direction="row">
                                        <Button icon={<FormClose />} onClick={() => this.setShowSidebar(false)} />
                                    </Box>
                                    <Box fill background="light-2" align="center" justify="center">
                                        sidebar
                                    </Box>
                                </Layer>
                            )}
                        </Box>
                    </Box>
                )}
            </ResponsiveContext.Consumer>
        );
    }
}

export default withStyles(styles)(AppStructure);
