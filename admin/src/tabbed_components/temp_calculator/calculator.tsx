import React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';
import BoilingVerdict from './boilingVerdict';
import TemperatureInput from './TemperatureInput';

import { StyleRules } from '@material-ui/core/styles';

const styles = (_theme: Theme): StyleRules => ({
    root: {},
});

export interface Props {
    dummy?: undefined;
}

interface State {
    temperature: string;
    scale: string;
}

class Calculator extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
        this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
        this.state = { temperature: '', scale: 'c' };
    }

    handleCelsiusChange(temperature) {
        this.setState({ scale: 'c', temperature });
    }

    handleFahrenheitChange(temperature) {
        this.setState({ scale: 'f', temperature });
    }

    render() {
        const scale = this.state.scale;
        const temperature = this.state.temperature;
        const celsius = scale === 'f' ? this.tryConvert(temperature, this.toCelsius) : temperature;
        const fahrenheit = scale === 'c' ? this.tryConvert(temperature, this.toFahrenheit) : temperature;
        return (
            <div>
                <fieldset>
                    <legend>Boiler calculator:</legend>
                    <TemperatureInput scale="c" temperature={celsius} onTemperatureChange={this.handleCelsiusChange} />
                    <TemperatureInput
                        scale="f"
                        temperature={fahrenheit}
                        onTemperatureChange={this.handleFahrenheitChange}
                    />
                    <BoilingVerdict celsius={parseFloat(celsius)} />
                </fieldset>
            </div>
        );
    }

    toCelsius(fahrenheit) {
        return ((fahrenheit - 32) * 5) / 9;
    }

    toFahrenheit(celsius) {
        return (celsius * 9) / 5 + 32;
    }

    tryConvert(temperature: string, convert) {
        const input = parseFloat(temperature);
        if (Number.isNaN(input)) {
            return '';
        }
        const output = convert(input);
        const rounded = Math.round(output * 1000) / 1000;
        return rounded.toString();
    }
}

export default withStyles(styles)(Calculator);
