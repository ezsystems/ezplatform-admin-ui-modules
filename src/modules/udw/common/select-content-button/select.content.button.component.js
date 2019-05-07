import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';

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
        const { multiple, isSelected } = this.props;
        const iconId = isSelected ? 'checkmark' : 'create';
        const attrs = {
            type: 'button',
            className: 'c-select-content-button',
            onClick: isSelected ? this.handleUnselect : this.handleSelect,
        };

        if (!multiple || (!isSelected && !this.state.selectContentEnabled)) {
            return null;
        }

        if (isSelected) {
            attrs.className = `${attrs.className} ${attrs.className}--selected`;
        }

        return (
            <button {...attrs}>
                <Icon name={iconId} extraClasses="ez-icon--small" />
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
    location: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onSelectContent: PropTypes.func.isRequired,
    canSelectContent: PropTypes.func.isRequired,
    onItemRemove: PropTypes.func.isRequired,
    multiple: PropTypes.bool.isRequired,
};
