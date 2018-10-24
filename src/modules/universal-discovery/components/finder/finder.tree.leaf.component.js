import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SelectContentButtonComponent from '../select-content-button/select.content.button.component';

import './css/finder.tree.leaf.component.css';

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

    /**
     * Renders a loading state icon
     *
     * @method renderLoadingIcon
     * @returns {Element}
     * @memberof FinderTreeLeafComponent
     */
    renderLoadingIcon() {
        if (!this.props.selected || !this.props.isLoadingChildren) {
            return null;
        }

        return (
            <svg className="ez-icon ez-spin ez-icon-x2">
                <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#spinner" />
            </svg>
        );
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
};
