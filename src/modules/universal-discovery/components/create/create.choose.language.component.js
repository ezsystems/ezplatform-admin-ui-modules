import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/create.choose.language.component.css';

export default class ChooseLanguageComponent extends Component {
    constructor(props) {
        super(props);

        this.updateSelection = this.updateSelection.bind(this);
        this.renderOption = this.renderOption.bind(this);

        this.state = {
            selectedLanguage: props.languages.mappings[props.languages.priority[0]]
        };
    }

    updateSelection(event) {
        const languageCode = event.target.value;
        const selectedLanguage = this.props.languages.mappings[languageCode];

        this.props.onLanguageSelected(selectedLanguage);

        this.setState(state => Object.assign({}, state, { selectedLanguage }));
    }

    renderOption(languageCode, index) {
        const language = this.props.languages.mappings[languageCode];
        const attrs = {
            key: index,
            value: language.languageCode
        };

        if (languageCode === this.props.forcedLanguage) {
            attrs.selected = true;
        }

        return (
            <option {...attrs}>{language.name}</option>
        );
    }

    render() {
        const selectAttrs = {
            className: 'form-control',
            onChange: this.updateSelection
        };

        if (this.props.forcedLanguage) {
            selectAttrs.disabled = true;
        }

        return (
            <div className="c-choose-language">
                <p className="c-choose-language__title">{this.props.labels.contentOnTheFly.selectLanguage}</p>
                <div className="c-choose-lagauge__select-wrapper">
                    <select {...selectAttrs}>
                        {this.props.languages.priority.map(this.renderOption)}
                    </select>
                </div>
            </div>
        );
    }
}

ChooseLanguageComponent.propTypes = {
    maxHeight: PropTypes.number.isRequired,
    labels: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
    onLanguageSelected: PropTypes.func.isRequired,
    forcedLanguage: PropTypes.string.isRequired
};
