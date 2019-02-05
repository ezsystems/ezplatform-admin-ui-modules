import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SelectContentButtonComponent from '../select-content-button/select.content.button.component';
import Icon from '../../../common/icon/icon';

export default class FinderTreeLeafComponent extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * Handles clicks on a leaf
     *
     * @method handleClick
     * @memberof FinderTreeLeafComponent
     */
    handleClick(event) {
        const { location, isSelectable, onClick } = this.props;

        if (!isSelectable || event.target.closest('.c-finder-tree-leaf__btn--toggle-selection')) {
            return;
        }

        onClick(location);
    }

    getContentTypeIdentifier() {
        const { contentTypesMap, location } = this.props;
        const contentTypeHref = location.ContentInfo.Content.ContentType._href;
        const contentType = contentTypesMap ? contentTypesMap[contentTypeHref] : null;
        const contentTypeIdentifier = contentType ? contentType.identifier : null;

        return contentTypeIdentifier;
    }

    /**
     * Renders an icon of a content type
     *
     * @method renderIcon
     * @returns {JSX.Element|null}
     */
    renderIcon() {
        const contentTypeIdentifier = this.getContentTypeIdentifier();

        if (!contentTypeIdentifier) {
            return null;
        }

        const contentTypeIconUrl = eZ.helpers.contentType.getContentTypeIconUrl(contentTypeIdentifier);
        let extraClasses = 'ez-icon--small';

        if (this.props.selected) {
            extraClasses = `${extraClasses} ez-icon--light`;
        }

        return (
            <div className="c-finder-tree-leaf__icon">
                <Icon customPath={contentTypeIconUrl} extraClasses={extraClasses} />
            </div>
        );
    }

    /**
     * Renders a loading state icon
     *
     * @method renderLoadingIcon
     * @returns {JSX.Element|null}
     * @memberof FinderTreeLeafComponent
     */
    renderLoadingIcon() {
        if (!this.props.selected || !this.props.isLoadingChildren) {
            return null;
        }

        return <Icon name="spinner" extraClasses="ez-spin ez-icon-x2 ez-icon--small ez-icon--light c-finder-tree-leaf__loading-icon" />;
    }

    renderSelectContentBtn() {
        const {
            isSelectable,
            multiple,
            selectedContent,
            location,
            onSelectContent,
            onItemRemove,
            canSelectContent,
            isLoadingChildren,
        } = this.props;

        if (!isSelectable || isLoadingChildren || !multiple) {
            return null;
        }

        return (
            <SelectContentButtonComponent
                multiple={multiple}
                isSelected={!!selectedContent.find((content) => content.id === location.id)}
                location={location}
                onSelectContent={onSelectContent}
                onItemRemove={onItemRemove}
                canSelectContent={canSelectContent}
            />
        );
    }

    render() {
        const { location, selected, isSelectable, isLoadingChildren, allowedLocations } = this.props;
        const isForcedLocation = allowedLocations.length === 1;
        const componentClassName = 'c-finder-tree-leaf';
        const isSelectedClassName = selected ? `${componentClassName}--selected` : '';
        const isNotSelectableClassName = !isSelectable || isForcedLocation ? `${componentClassName}--not-selectable` : '';
        const hasChildrenClassName = location.childCount ? `${componentClassName}--has-children` : '';
        const isLoadingChildrenClassName = isLoadingChildren ? `${componentClassName}--loading` : '';
        const attrs = {
            className: [
                componentClassName,
                isSelectedClassName,
                hasChildrenClassName,
                isLoadingChildrenClassName,
                isNotSelectableClassName,
            ].join(' '),
        };

        if (!isForcedLocation) {
            attrs.onClick = this.handleClick;
        }

        return (
            <div {...attrs}>
                {this.renderIcon()}
                {location.ContentInfo.Content.Name}
                {this.renderLoadingIcon()}
                {this.renderSelectContentBtn()}
            </div>
        );
    }
}

FinderTreeLeafComponent.propTypes = {
    location: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    isLoadingChildren: PropTypes.bool.isRequired,
    isSelectable: PropTypes.bool.isRequired,
    allowedLocations: PropTypes.array.isRequired,
    multiple: PropTypes.bool.isRequired,
    selectedContent: PropTypes.array.isRequired,
    onSelectContent: PropTypes.func.isRequired,
    canSelectContent: PropTypes.func.isRequired,
    onItemRemove: PropTypes.func.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
};
