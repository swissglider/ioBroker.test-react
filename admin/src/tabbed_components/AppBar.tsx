import React from 'react';
import { Box, Button, Layer } from 'grommet';
import { Theme, withStyles } from '@material-ui/core/styles';
import { FormClose } from 'grommet-icons';

import { StyleRules } from '@material-ui/core/styles';
import Test from './service/Test';

const styles = (_theme: Theme): StyleRules => ({
    root: {},
});

export interface Props {
    dummy?: number;
}

interface State {
    showToast: boolean;
}

class AppBar extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            showToast: false,
        };
        this.setShowToast = this.setShowToast.bind(this);
    }

    setShowToast(newState: boolean): void {
        this.setState({ showToast: newState });
    }

    render() {
        const showToast = this.state.showToast;
        const position = 'top';
        const full = false;
        const modal = true;
        const name = new Test().getName();
        return (
            <Box
                tag="header"
                direction="row"
                align="center"
                justify="between"
                background="brand"
                alignContent="between"
                round
                elevation="medium"
                pad={{ left: 'medium', right: 'small', vertical: 'small' }}
                style={{ zIndex: '1' }}
                {...this.props}
            >
                {this.props.children}
                {showToast && (
                    <Layer
                        position={position || 'top'}
                        full={full}
                        modal={modal}
                        margin="none"
                        responsive
                        plain={modal ? false : true}
                        // {...rest}
                    >
                        <Box background="light-2" tag="header" justify="end" align="center" direction="row">
                            <Button icon={<FormClose />} onClick={() => this.setShowToast(false)} />
                        </Box>
                        {name}
                    </Layer>
                )}
            </Box>
        );
    }
}

export default withStyles(styles)(AppBar);
