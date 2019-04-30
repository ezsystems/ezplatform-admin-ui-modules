import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SelectedContentItemComponent from './selected.content.item.component';
import PopupComponent from '../../../common/tooltip-popup/tooltip.popup.component';
import { classnames } from '../../../common/classnames/classnames';

const SelectedContentComponent = ({ items, itemsLimit, onItemRemove }) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const togglePopup = () => setIsPopupVisible(!isPopupVisible && !!items.length);
    const hidePopup = () => setIsPopupVisible(false);
    const getTitle = () => {
        let title = Translator.trans(/*@Desc("Confirmed items")*/ 'select_content.confirmed_items.title', {}, 'universal_discovery_widget');
        const total = items.length;

        if (total) {
            title = `${title} (${total})`;
        }

        return title;
    };
    const renderSelectedItem = (item) => {
        return <SelectedContentItemComponent key={item.remoteId} data={item} onRemove={onItemRemove} />;
    };
    const renderLimitLabel = () => {
        let limitLabel = '';

        if (!!itemsLimit) {
            const limitLabelText = Translator.trans(
                /*@Desc("Limit %items% max")*/ 'select_content.limit.label',
                {
                    items: itemsLimit,
                },
                'universal_discovery_widget'
            );

            limitLabel = <small className="c-selected-content__label--limit">{limitLabelText}</small>;
        }

        return limitLabel;
    };
    const renderSelectedItems = () => {
        if (!items.length) {
            return null;
        }

        return (
            <div className="c-selected-content-popup">
                <PopupComponent title={getTitle()} visible={isPopupVisible} onClose={hidePopup}>
                    {items.map(renderSelectedItem)}
                </PopupComponent>
            </div>
        );
    };
    const titles = items.map((item) => item.ContentInfo.Content.Name).join(', ');
    const btnClassNames = classnames({
        'c-selected-content__info': true,
        'c-selected-content__info--any-item-selected': !!items.length,
    });
    const noConfirmedContentTitle = Translator.trans(
        /*@Desc("No confirmed content yet")*/ 'select_content.no_confirmed_content.title',
        {},
        'universal_discovery_widget'
    );

    return (
        <div className="c-selected-content">
            {renderSelectedItems()}
            <button type="button" className={btnClassNames} onClick={togglePopup}>
                <strong className="c-selected-content__title">{getTitle()}</strong>
                {renderLimitLabel()}
                <span className="c-selected-content__content-names">{titles.length ? titles : noConfirmedContentTitle}</span>
            </button>
        </div>
    );
};

SelectedContentComponent.propTypes = {
    items: PropTypes.array.isRequired,
    itemsLimit: PropTypes.number.isRequired,
    onItemRemove: PropTypes.func.isRequired,
};

export default SelectedContentComponent;
