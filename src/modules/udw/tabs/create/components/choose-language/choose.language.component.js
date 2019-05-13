import React, { Component } from 'react';
import PropTypes from 'prop-types';

const languages = window.eZ.adminUiConfig.languages;
const TEXT_SELECT_LANGUAGE = Translator.trans(
    /*@Desc("Select a language")*/ 'content_on_the_fly.select_language.title',
    {},
    'universal_discovery_widget'
);

class ChooseLanguageComponent extends Component {
    constructor(props) {
        super(props);

        this.updateSelection = this.updateSelection.bind(this);
        this.renderOption = this.renderOption.bind(this);

        let selectedLanguageCode = props.allowedLanguages.length ? props.allowedLanguages[0] : languages.priority[0];

        if (props.preselectedLanguage) {
            selectedLanguageCode = props.preselectedLanguage;
        }

        if (props.allowedLanguages.length === 1) {
            selectedLanguageCode = props.allowedLanguages[0];
        }

        this.state = {
            selectedLanguage: languages.mappings[selectedLanguageCode],
        };
    }

    componentDidMount() {
        this.props.onLanguageSelected(this.state.selectedLanguage);
    }

    updateSelection(event) {
        const languageCode = event.target.value;
        const selectedLanguage = languages.mappings[languageCode];

        this.props.onLanguageSelected(selectedLanguage);

        this.setState((state) => Object.assign({}, state, { selectedLanguage }));
    }

    renderOption(languageCode, index) {
        const language = languages.mappings[languageCode];
        const attrs = {
            key: index,
            value: language.languageCode,
        };

        return <option {...attrs}>{language.name}</option>;
    }

    renderOptions() {
        const { allowedLanguages } = this.props;
        const languagesList = allowedLanguages.length ? allowedLanguages : languages.priority;

        return languagesList.map(this.renderOption);
    }

    render() {
        const selectAttrs = {
            className: 'form-control',
            onChange: this.updateSelection,
            defaultValue: this.state.selectedLanguage.languageCode,
        };

        return (
            <div className="c-choose-language">
                <p className="c-choose-language__title">{TEXT_SELECT_LANGUAGE}</p>
                <div className="c-choose-lagauge__select-wrapper">
                    <select {...selectAttrs}>{this.renderOptions()}</select>
                </div>
            </div>
        );
    }
}

ChooseLanguageComponent.propTypes = {
    maxHeight: PropTypes.number.isRequired,
    languages: PropTypes.object.isRequired,
    onLanguageSelected: PropTypes.func.isRequired,
    allowedLanguages: PropTypes.array.isRequired,
    preselectedLanguage: PropTypes.string,
};

ChooseLanguageComponent.defaultProps = {
    preselectedLanguage: null,
};

export default ChooseLanguageComponent;
