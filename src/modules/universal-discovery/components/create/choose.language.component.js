import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/choose.language.component.css';

export default class ChooseLanguageComponent extends Component {
    constructor(props) {
        super(props);

        this.updateSelection = this.updateSelection.bind(this);
        this.renderOption = this.renderOption.bind(this);

        let selectedLanguageCode = props.allowedLanguages.length ? props.allowedLanguages[0] : props.languages.priority[0];

        if (props.preselectedLanguage) {
            selectedLanguageCode = props.preselectedLanguage;
        }

        if (props.forcedLanguage) {
            console.warn('[DEPRECATED] cotfForcedLanguage parameter is deprecated');
            console.warn('[DEPRECATED] it will be removed from ezplatform-admin-ui-modules 2.0');
            console.warn('[DEPRECATED] use cotfAllowedLanguages instead');

            selectedLanguageCode = props.forcedLanguage;
        }

        if (props.allowedLanguages.length === 1) {
            selectedLanguageCode = props.allowedLanguages[0];
        }

        this.state = {
            selectedLanguage: props.languages.mappings[selectedLanguageCode],
        };
    }

    componentDidMount() {
        this.props.onLanguageSelected(this.state.selectedLanguage);
    }

    updateSelection(event) {
        const languageCode = event.target.value;
        const selectedLanguage = this.props.languages.mappings[languageCode];

        this.props.onLanguageSelected(selectedLanguage);

        this.setState((state) => Object.assign({}, state, { selectedLanguage }));
    }

    renderOption(languageCode, index) {
        const language = this.props.languages.mappings[languageCode];
        const attrs = {
            key: index,
            value: language.languageCode,
        };

        if (this.state.selectedLanguage.languageCode === languageCode) {
            attrs.selected = true;
        }

        return <option {...attrs}>{language.name}</option>;
    }

    renderOptions() {
        const { allowedLanguages, languages } = this.props;
        const languagesList = allowedLanguages.length ? allowedLanguages : languages.priority;

        return languagesList.map(this.renderOption);
    }

    render() {
        const selectAttrs = {
            className: 'form-control',
            onChange: this.updateSelection,
        };

        if (this.props.forcedLanguage) {
            console.warn('[DEPRECATED] forcedLanguage parameter is deprecated');
            console.warn('[DEPRECATED] it will be removed from ezplatform-admin-ui-modules 2.0');
            console.warn('[DEPRECATED] use allowedLanguages instead');
        }

        // @Deprecated - `forcedLanguage` will be removed in 2.0
        if (this.props.allowedLanguages.length === 1 || this.props.forcedLanguage) {
            selectAttrs.disabled = true;
        }

        return (
            <div className="c-choose-language">
                <p className="c-choose-language__title">{this.props.labels.contentOnTheFly.selectLanguage}</p>
                <div className="c-choose-lagauge__select-wrapper">
                    <select {...selectAttrs}>{this.renderOptions()}</select>
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
    forcedLanguage: PropTypes.string.isRequired,
    allowedLanguages: PropTypes.array.isRequired,
    preselectedLanguage: PropTypes.string,
};
