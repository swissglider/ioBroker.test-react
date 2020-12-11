import React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';

import { StyleRules } from '@material-ui/core/styles';

const styles = (_theme: Theme): StyleRules => ({
    root: {},
});

export interface Props {
    celsius: number;
}

interface State {
    temperature?: string;
}

class BoilingVerdict extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if (this.props.celsius >= 100) {
            return <p>The water would boil.</p>;
        }
        return <p>The water would not boil.</p>;
    }
}

export default withStyles(styles)(BoilingVerdict);
