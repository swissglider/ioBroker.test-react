import React from 'react';
import { Grommet } from 'grommet';

export interface Props {
    dummy?: undefined;
}

interface State {
    valueTextInput: string;
    valueTextArea: string;
    valueSelect: string;
}

class NameForm extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            valueTextInput: '',
            valueTextArea: 'Please write an essay about your favorite DOM element.',
            valueSelect: 'coconut',
        };

        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTextInputChange(event) {
        this.setState({ valueTextInput: event.target.value });
    }

    handleTextAreaChange(event) {
        this.setState({ valueTextArea: event.target.value });
    }

    handleSelectChange(event) {
        this.setState({ valueSelect: event.target.value });
    }

    handleSubmit(event) {
        console.log('A name was submitted: ' + this.state.valueTextInput);
        console.log('An essay was submitted: ' + this.state.valueTextArea);
        console.log('Your favorite flavor is: ' + this.state.valueSelect);
        event.preventDefault();
    }

    render() {
        return (
            <fieldset>
                <legend>Test Form:</legend>
                <form onSubmit={this.handleSubmit}>
                    <fieldset>
                        <legend>Name:</legend>
                        <label>
                            <input
                                type="text"
                                value={this.state.valueTextInput}
                                onChange={this.handleTextInputChange}
                            />
                        </label>
                    </fieldset>
                    <fieldset>
                        <legend>Essay:</legend>
                        <label>
                            <textarea value={this.state.valueTextArea} onChange={this.handleTextAreaChange} />
                        </label>
                    </fieldset>
                    <fieldset>
                        <legend>Pick your favorite flavor:</legend>
                        <label>
                            <select value={this.state.valueSelect} onChange={this.handleSelectChange}>
                                <option value="grapefruit">Grapefruit</option>
                                <option value="lime">Lime</option>
                                <option value="coconut">Coconut</option>
                                <option value="mango">Mango</option>
                            </select>
                        </label>
                    </fieldset>
                    <fieldset>
                        <input type="submit" value="Submit" />
                    </fieldset>
                </form>
            </fieldset>
        );
    }
}

export default NameForm;
