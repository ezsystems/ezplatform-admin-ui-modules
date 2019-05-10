import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SelectedContentItemComponent from './selected.content.item.component';
import PopupComponent from '../../../common/tooltip-popup/tooltip.popup.component';
import { createCssClassNames } from '../../../common/css-class-names/css.class.names';

const noConfirmedContentTitle = Translator.trans(
    /*@Desc("No confirmed content yet")*/ 'select_content.no_confirmed_content.title',
    {},
    'universal_discovery_widget'
);
const getTitle = (total) => {
    let title = Translator.trans(/*@Desc("Confirmed items")*/ 'select_content.confirmed_items.title', {}, 'universal_discovery_widget');

    if (total) {
        title = `${title} (${total})`;
    }

    return title;
};
const renderLimitLabel = (itemsLimit) => {
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

const SelectedContentComponent = ({ items, itemsLimit, onItemRemove }) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const itemsCount = items.length;
    const togglePopup = () => setIsPopupVisible(!isPopupVisible && !!itemsCount);
    const hidePopup = () => setIsPopupVisible(false);
    const renderSelectedItem = (item) => {
        const contentTypeInfo = item.ContentInfo.Content.ContentTypeInfo;
        const attrs = {
            key: item.remoteId,
            contentName: item.ContentInfo.Content.Name,
            locationId: item.id,
            contentTypeIdentifie: contentTypeInfo && contentTypeInfo.identifier,
            contentTypeName: contentTypeInfo && contentTypeInfo.names.value[0]['#text'],
            onRemove: onItemRemove,
        };
        return <SelectedContentItemComponent {...attrs} />;
    };
    const renderSelectedItems = () => {
        if (!itemsCount) {
            return null;
        }

        return (
            <div className="c-selected-content-popup">
                <PopupComponent title={getTitle(itemsCount)} visible={isPopupVisible} onClose={hidePopup}>
                    {items.map(renderSelectedItem)}
                </PopupComponent>
            </div>
        );
    };
    const titles = items.map((item) => item.ContentInfo.Content.Name).join(', ');
    const btnClassNames = createCssClassNames({
        'c-selected-content__info': true,
        'c-selected-content__info--any-item-selected': !!itemsCount,
    });

    return (
        <div className="c-selected-content">
            {renderSelectedItems()}
            <button type="button" className={btnClassNames} onClick={togglePopup}>
                <strong className="c-selected-content__title">{getTitle(itemsCount)}</strong>
                {renderLimitLabel(itemsLimit)}
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
