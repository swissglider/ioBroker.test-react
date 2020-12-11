import React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';

import { StyleRules } from '@material-ui/core/styles';

const styles = (_theme: Theme): StyleRules => ({
    root: {},
});

export interface Props {
    scale: string;
    temperature: string;
    onTemperatureChange: any;
}

interface State {
    dummy?: undefined;
}

const scaleNames = {
    c: 'Celsius',
    f: 'Fahrenheit',
};

class TemperatureInput extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onTemperatureChange(e.target.value);
    }

    render() {
        const temperature = this.props.temperature;
        const scale = this.props.scale;
        return (
            <fieldset>
                <legend>Enter temperature in {scaleNames[scale]}:</legend>
                <input value={temperature} onChange={this.handleChange} />
            </fieldset>
        );
    }
}

export default withStyles(styles)(TemperatureInput);
