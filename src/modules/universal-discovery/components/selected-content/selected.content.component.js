import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SelectedContentItemComponent from './selected.content.item.component';
import SelectedContentPopupComponent from './selected.content.popup.component';

import './css/selected.content.component.css';

export default class SelectedContentComponent extends Component {
    constructor() {
        super();

        this.state = {
            items: [],
            isPopupVisible: false
        };
    }

    componentWillReceiveProps(props) {
        this.setState(state => Object.assign({}, state, {items: props.items}));
    }

    /**
     * Toggles popup visible state
     *
     * @method togglePopup
     * @memberof SelectedContentComponent
     */
    togglePopup() {
        this.setState(state => Object.assign({}, state, {isPopupVisible: !state.isPopupVisible}));
    }

    /**
     * Hides popup
     *
     * @method hidePopup
     * @memberof SelectedContentComponent
     */
    hidePopup() {
        this.setState(state => Object.assign({}, state, {isPopupVisible: false}));
    }

    /**
     * Renders a selected content item
     *
     * @method renderSelectedItem
     * @param {Object} item
     * @returns {Element}
     * @memberof SelectedContentComponent
     */
    renderSelectedItem(item) {
        return <SelectedContentItemComponent
            key={item.remoteId}
            data={item}
            onRemove={this.props.onItemRemove}
            contentTypesMap={this.props.contentTypesMap}
            labels={this.props.labels.selectedContentItem} />;
    }

    /**
     * Renders a limit information label
     *
     * @method renderLimitLabel
     * @returns {Element}
     * @memberof SelectedContentComponent
     */
    renderLimitLabel() {
        let limitLabel = '';

        if (this.props.itemsLimit) {
            const limit = this.props.labels.selectedContent.limit.replace('{items}', this.props.itemsLimit);

            limitLabel = <small className="c-selected-content__label--limit">{limit}</small>;
        }

        return limitLabel;
    }

    /**
     * Renders selected items info
     *
     * @method renderSelectedItems
     * @returns {Element}
     * @memberof SelectedContentComponent
     */
    renderSelectedItems() {
        if (!this.props.items.length) {
            return null;
        }

        return (
            <SelectedContentPopupComponent
                title={this.props.labels.selectedContent.confirmedItems}
                visible={this.state.isPopupVisible}
                onClose={this.hidePopup.bind(this)}>
                {this.props.items.map(this.renderSelectedItem.bind(this))}
            </SelectedContentPopupComponent>
        );
    }

    render() {
        const titles = this.props.items.map(item => item.ContentInfo.Content.Name).join(', ');

        return (
            <div className="c-selected-content">
                {this.renderSelectedItems()}
                <strong className="c-selected-content__title">
                    {this.props.labels.selectedContent.confirmedItems}&nbsp;
                    {!!this.props.items.length && `(${this.props.items.length})`}
                </strong>
                {this.renderLimitLabel()}
                <div className="c-selected-content__content-names" onClick={this.togglePopup.bind(this)}>
                    {titles.length ? titles : this.props.labels.selectedContent.noConfirmedContent}
                </div>
            </div>
        );
    }
}

SelectedContentComponent.propTypes = {
    items: PropTypes.array.isRequired,
    multiple: PropTypes.bool.isRequired,
    itemsLimit: PropTypes.number.isRequired,
    onItemRemove: PropTypes.func.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    labels: PropTypes.shape({
        selectedContentItem: PropTypes.object.isRequired,
        selectedContent: PropTypes.shape({
            confirmedItems: PropTypes.string.isRequired,
            limit: PropTypes.string.isRequired,
            noConfirmedContent: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};
