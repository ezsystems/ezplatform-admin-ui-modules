import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/select.content.button.component.css';

export default class SelectContentButtonComponent extends Component {
    constructor(props) {
        super(props);

        this.toggleEnabledState = this.toggleEnabledState.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleUnselect = this.handleUnselect.bind(this);

        this.state = {
            selectContentEnabled: true,
        };
    }

    componentDidMount() {
        this.checkCanSelectContent();
    }

    componentDidUpdate() {
        this.checkCanSelectContent();
    }

    checkCanSelectContent() {
        const { location, canSelectContent } = this.props;

        canSelectContent(location, this.toggleEnabledState);
    }

    toggleEnabledState(selectContentEnabled) {
        if (this.state.selectContentEnabled === selectContentEnabled) {
            return;
        }

        this.setState((state) => ({ ...state, selectContentEnabled }));
    }

    handleSelect(event) {
        event.stopPropagation();

        this.props.onSelectContent(this.props.location);
    }

    handleUnselect(event) {
        event.stopPropagation();

        this.props.onItemRemove(this.props.location.id);
    }

    render() {
        const { multiple, selectedContent, location } = this.props;
        const isSelectedContent = selectedContent.find((content) => content.id === location.id);
        const iconId = isSelectedContent ? 'checkmark' : 'create';
        const attrs = {
            className: 'c-select-content-button',
            onClick: isSelectedContent ? this.handleUnselect : this.handleSelect,
        };

        if (!multiple || (!isSelectedContent && !this.state.selectContentEnabled)) {
            return null;
        }

        if (isSelectedContent) {
            attrs.className = `${attrs.className} c-select-content-button--selected`;
        }

        return (
            <button {...attrs}>
                <svg className="ez-icon ez-icon--small ez-icon--light">
                    <use xlinkHref={`/bundles/ezplatformadminui/img/ez-icons.svg#${iconId}`} />
                </svg>
            </button>
        );
    }
}

SelectContentButtonComponent.propTypes = {
    data: PropTypes.object.isRequired,
    onPreview: PropTypes.func.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    onItemClick: PropTypes.func,
    labels: PropTypes.shape({
        contentTableItem: PropTypes.shape({
            notAvailable: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    selectedContent: PropTypes.array.isRequired,
    onSelectContent: PropTypes.func.isRequired,
    canSelectContent: PropTypes.func.isRequired,
    onItemRemove: PropTypes.func.isRequired,
    multiple: PropTypes.bool.isRequired,
};
