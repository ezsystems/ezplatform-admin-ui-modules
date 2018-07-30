import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import SelectedContentItemComponent from './selected.content.item.component';
import SelectedContentPopupComponent from './selected.content.popup.component';

import './css/selected.content.component.css';

export default class SelectedContentComponent extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isPopupVisible: false,
        };

        this.hidePopup = this.hidePopup.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.renderSelectedItem = this.renderSelectedItem.bind(this);
    }

    /**
     * Toggles popup visible state
     *
     * @method togglePopup
     * @memberof SelectedContentComponent
     */
    togglePopup() {
        this.setState((state) => ({ isPopupVisible: !state.isPopupVisible && !!state.items.length }));
    }

    /**
     * Hides popup
     *
     * @method hidePopup
     * @memberof SelectedContentComponent
     */
    hidePopup() {
        this.setState(() => ({ isPopupVisible: false }));
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
        return (
            <SelectedContentItemComponent
                key={item.remoteId}
                data={item}
                onRemove={this.props.onItemRemove}
                contentTypesMap={this.props.contentTypesMap}
            />
        );
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

        if (this.props.itemsLimit && this.props.multiple) {
            const limitLabel = Translator.trans(
                /*@Desc("Limit %items% max")*/ 'select_content.limit.label',
                {
                    items: this.props.itemsLimit,
                },
                'universal_discovery_widget'
            );

            limitLabel = <small className="c-selected-content__label--limit">{limitLabel}</small>;
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
            <SelectedContentPopupComponent title={this.getTitle()} visible={this.state.isPopupVisible} onClose={this.hidePopup}>
                {this.props.items.map(this.renderSelectedItem)}
            </SelectedContentPopupComponent>
        );
    }

    /**
     * Gets component title
     *
     * @method getTitle
     * @returns {String}
     * @memberof SelectedContentComponent
     */
    getTitle() {
        let title = Translator.trans(/*@Desc("Confirmed items")*/ 'select_content.confirmed_items.title', {}, 'universal_discovery_widget');
        const total = this.props.items.length;

        if (total) {
            title = `${title} (${total})`;
        }

        return title;
    }

    render() {
        const { items } = this.props;
        const titles = items.map((item) => item.ContentInfo.Content.Name).join(', ');
        const anyItemSelected = !!items.length;
        const cssClassOnAnyItemSelected = anyItemSelected ? 'c-selected-content__info--any-item-selected' : '';
        const infoCssClasses = `c-selected-content__info ${cssClassOnAnyItemSelected}`;
        const noConfirmedContentTitle = Translator.trans(
            /*@Desc("No confirmed content yet")*/ 'select_content.no_confirmed_content.title',
            {},
            'universal_discovery_widget'
        );

        return (
            <div className="c-selected-content">
                {this.renderSelectedItems()}
                <div className={infoCssClasses} onClick={this.togglePopup}>
                    <strong className="c-selected-content__title">{this.getTitle()}</strong>
                    {this.renderLimitLabel()}
                    <div className="c-selected-content__content-names">{titles.length ? titles : noConfirmedContentTitle}</div>
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
};

SelectedContentComponent.defaultProps = {
    items: [],
};
