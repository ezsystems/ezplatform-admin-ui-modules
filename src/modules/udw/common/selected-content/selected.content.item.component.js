import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';

const notAvailableLabel = Translator.trans(/*@Desc("N/A")*/ 'select_content.not_available.label', {}, 'universal_discovery_widget');
const SelectedContentItemComponent = ({ contentName, locationId, contentTypeIdentifier, contentTypeName, onRemove }) => {
    let icon = null;

    if (contentTypeIdentifier) {
        icon = <Icon name={contentTypeIdentifier} extraClasses="c-selected-content-item__icon ez-icon--small" />;
    }

    return (
        <div className="c-selected-content-item">
            <div className="c-selected-content-item__wrapper">
                <div className="c-selected-content-item__name">{contentName}</div>
                <div className="c-selected-content-item__type">
                    {icon} {contentTypeName}
                </div>
            </div>
            <button type="button" className="c-selected-content-item__remove" onClick={() => onRemove(locationId)}>
                <Icon name="discard" extraClasses="ez-icon--light ez-icon--small" />
            </button>
        </div>
    );
};

SelectedContentItemComponent.propTypes = {
    contentName: PropTypes.string.isRequired,
    locationId: PropTypes.string.isRequired,
    onRemove: PropTypes.func.isRequired,
    contentTypeName: PropTypes.string,
    contentTypeIdentifier: PropTypes.string,
};

SelectedContentItemComponent.defaultProps = {
    contentTypeIdentifier: null,
    contentTypeName: notAvailableLabel,
};

export default SelectedContentItemComponent;
