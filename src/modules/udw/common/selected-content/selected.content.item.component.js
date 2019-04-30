import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';

const SelectedContentItemComponent = ({ data, onRemove }) => {
    const contentTypeInfo = data.ContentInfo.Content.ContentTypeInfo;
    const notAvailableLabel = Translator.trans(/*@Desc("N/A")*/ 'select_content.not_available.label', {}, 'universal_discovery_widget');
    const contentTypeName = contentTypeInfo ? contentTypeInfo.names.value[0]['#text'] : notAvailableLabel;
    let icon = null;

    if (contentTypeInfo) {
        icon = <Icon name={contentTypeInfo.identifier} extraClasses="c-selected-content-item__icon ez-icon--small" />;
    }

    return (
        <div className="c-selected-content-item">
            <div className="c-selected-content-item__wrapper">
                <div className="c-selected-content-item__name">{data.ContentInfo.Content.Name}</div>
                <div className="c-selected-content-item__type">
                    {icon} {contentTypeName}
                </div>
            </div>
            <div className="c-selected-content-item__remove" onClick={() => onRemove(data.id)} tabIndex="-1">
                <Icon name="discard" extraClasses="ez-icon--light ez-icon--small" />
            </div>
        </div>
    );
};

SelectedContentItemComponent.propTypes = {
    data: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default SelectedContentItemComponent;
