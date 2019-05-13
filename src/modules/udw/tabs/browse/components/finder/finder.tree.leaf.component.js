import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import SelectContentButtonComponent from '../../../../common/select-content-button/select.content.button.component';
import LoadingSpinnerComponent from '../../../../../common/loading-spinner/loading.spinner.component';
import Icon from '../../../../../common/icon/icon';
import { ContentTypesContext } from '../../../../udw.module';
import { createCssClassNames } from '../../../../../common/css-class-names/css.class.names';

const FinderTreeLeafComponent = (props) => {
    const { location, isSelectable, onClick, isMarked, isLoadingChildren } = props;
    const { multiple, isSelected, onItemSelect, onItemDeselect, checkCanSelectContent, allowedLocations } = props;
    const contentTypesMap = useContext(ContentTypesContext);
    const handleClick = useCallback(
        (event) => {
            if (!isSelectable || event.target.closest('.c-finder-tree-leaf__btn--toggle-selection')) {
                return;
            }

            onClick(location);
        },
        [isSelectable, location, onClick]
    );
    const getContentTypeIdentifier = () => {
        const contentTypeHref = location.ContentInfo.Content.ContentType._href;
        const contentType = contentTypesMap ? contentTypesMap[contentTypeHref] : null;
        const contentTypeIdentifier = contentType ? contentType.identifier : null;

        return contentTypeIdentifier;
    };
    const renderIcon = () => {
        const contentTypeIdentifier = getContentTypeIdentifier();

        if (!contentTypeIdentifier) {
            return null;
        }

        const contentTypeIconUrl = window.eZ.helpers.contentType.getContentTypeIconUrl(contentTypeIdentifier);
        const extraClasses = createCssClassNames({
            'ez-icon--small': true,
            'ez-icon--light': isMarked,
        });

        return (
            <div className="c-finder-tree-leaf__icon">
                <Icon customPath={contentTypeIconUrl} extraClasses={extraClasses} />
            </div>
        );
    };
    const renderLoadingIcon = () => {
        if (!isMarked || !isLoadingChildren) {
            return null;
        }

        return <LoadingSpinnerComponent extraClasses="ez-icon--small ez-icon--light c-finder-tree-leaf__loading-icon" />;
    };
    const renderSelectContentBtn = () => {
        if (!isSelectable || isLoadingChildren || !multiple) {
            return null;
        }

        return (
            <SelectContentButtonComponent
                isSelected={isSelected}
                location={location}
                onSelect={onItemSelect}
                onDeselect={onItemDeselect}
                checkCanSelectContent={checkCanSelectContent}
            />
        );
    };

    const isForcedLocation = allowedLocations.length === 1;
    const wrapperAttrs = {
        className: createCssClassNames({
            'c-finder-tree-leaf': true,
            'c-finder-tree-leaf--selected': isMarked,
            'c-finder-tree-leaf--not-selectable': !isSelectable || isForcedLocation,
            'c-finder-tree-leaf--has-children': location.childCount,
            'c-finder-tree-leaf--loading': isLoadingChildren,
        }),
        onClick: !isForcedLocation ? handleClick : undefined,
    };

    return (
        <div {...wrapperAttrs}>
            {renderIcon()}
            <span className="c-finder-tree-leaf__content-name">{location.ContentInfo.Content.Name}</span>
            {renderLoadingIcon()}
            {renderSelectContentBtn()}
        </div>
    );
};

FinderTreeLeafComponent.propTypes = {
    location: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    isMarked: PropTypes.bool.isRequired,
    isLoadingChildren: PropTypes.bool.isRequired,
    isSelectable: PropTypes.bool.isRequired,
    allowedLocations: PropTypes.array.isRequired,
    multiple: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    checkCanSelectContent: PropTypes.func.isRequired,
    onItemDeselect: PropTypes.func.isRequired,
};

export default FinderTreeLeafComponent;
