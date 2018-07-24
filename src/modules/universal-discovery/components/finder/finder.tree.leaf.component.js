import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SelectContentButtonComponent from '../select-content-button/select.content.button.component';

import './css/finder.tree.leaf.component.css';

export default class FinderTreeLeafComponent extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            selected: props.selected,
            isLoadingChildren: props.isLoadingChildren,
        };
    }

    componentWillReceiveProps({ selected, isLoadingChildren }) {
        this.setState((state) =>
            Object.assign({}, state, {
                selected,
                isLoadingChildren,
            })
        );
    }

    /**
     * Handles clicks on a leaf
     *
     * @method handleClick
     * @memberof FinderTreeLeafComponent
     */
    handleClick(event) {
        const { location } = this.props;

        if (!this.props.isSelectable || event.target.closest('.c-finder-tree-leaf__btn--toggle-selection')) {
            return;
        }

        this.setState(
            (state) =>
                Object.assign({}, state, {
                    selected: true,
                    isLoadingChildren: !!location.childCount,
                }),
            () => this.props.onClick(location)
        );
    }

    /**
     * Renders a loading state icon
     *
     * @method renderLoadingIcon
     * @returns {Element}
     * @memberof FinderTreeLeafComponent
     */
    renderLoadingIcon() {
        if (!this.state.selected || !this.state.isLoadingChildren) {
            return null;
        }

        return (
            <svg className="ez-icon ez-spin ez-icon-x2 ez-icon-spinner">
                <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#spinner" />
            </svg>
        );
    }

    renderSelectContentBtn() {
        const { isSelectable, multiple, selectedContent, location, onSelectContent, onItemRemove, canSelectContent } = this.props;

        if (!isSelectable || this.state.isLoadingChildren || !multiple) {
            return null;
        }

        return (
            <SelectContentButtonComponent
                multiple={multiple}
                selectedContent={selectedContent}
                location={location}
                onSelectContent={onSelectContent}
                onItemRemove={onItemRemove}
                canSelectContent={canSelectContent}
            />
        );
    }

    render() {
        const location = this.props.location;
        const isForcedLocation = this.props.allowedLocations.length === 1;
        const componentClassName = 'c-finder-tree-leaf';
        const isSelected = this.state.selected ? `${componentClassName}--selected` : '';
        const isNotSelectable = !this.props.isSelectable || isForcedLocation ? `${componentClassName}--not-selectable` : '';
        const hasChildren = location.childCount ? `${componentClassName}--has-children` : '';
        const isLoadingChildren = this.state.isLoadingChildren ? `${componentClassName}--loading` : '';
        const finalClassName = `${componentClassName} ${isSelected} ${hasChildren} ${isLoadingChildren} ${isNotSelectable}`;
        const attrs = {
            className: finalClassName,
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
