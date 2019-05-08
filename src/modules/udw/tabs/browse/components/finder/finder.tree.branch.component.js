import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FinderTreeLeafComponent from './finder.tree.leaf.component';

export default class FinderTreeBranchComponent extends Component {
    constructor(props) {
        super(props);

        this.expandBranch = this.expandBranch.bind(this);
        this.onLoadMore = this.onLoadMore.bind(this);
        this.renderLeaf = this.renderLeaf.bind(this);
    }

    expandBranch() {
        this.props.onBranchClick(this.props.parentLocation);
    }

    /**
     * Renders leaf (the single content item)
     *
     * @method renderLeaf
     * @param {Object} data location response
     * @returns {JSX.Element}
     * @memberof FinderTreeBranchComponent
     */
    renderLeaf(data) {
        const { activeLocationId, isActiveLocationLoading, onItemClick } = this.props;
        const location = data.value.Location;
        const contentTypesMap = this.props.contentTypesMap;
        const contentTypeHref = location.ContentInfo.Content.ContentType._href;
        const isContainer = contentTypesMap && contentTypesMap[contentTypeHref] && contentTypesMap[contentTypeHref].isContainer;
        const isSelectable = !(this.props.allowContainersOnly && !isContainer);
        const active = location.id === activeLocationId;
        const isLoadingChildren = active && isActiveLocationLoading;

        return (
            <FinderTreeLeafComponent
                key={location.remoteId}
                location={location}
                onClick={onItemClick}
                selected={active}
                isLoadingChildren={isLoadingChildren}
                isSelectable={isSelectable}
                allowedLocations={this.props.allowedLocations}
                multiple={this.props.multiple}
                selectedContent={this.props.selectedContent}
                onItemSelect={this.props.onItemSelect}
                checkCanSelectContent={this.props.checkCanSelectContent}
                onItemDeselect={this.props.onItemDeselect}
                contentTypesMap={this.props.contentTypesMap}
            />
        );
    }

    onLoadMore() {
        this.props.onLoadMore(this.props.parentLocation);
    }

    /**
     * Render load more button
     *
     * @method renderLoadMore
     * @returns {JSX.Element}
     * @memberof FinderTreeBranchComponent
     */
    renderLoadMore() {
        const { items, total } = this.props;

        if (!items.length || items.length === total) {
            return null;
        }

        const loadMoreLabel = Translator.trans(/*@Desc("Load more")*/ 'finder.branch.load_more.label', {}, 'universal_discovery_widget');

        return (
            <button type="button" className="c-finder-tree-branch__load-more" onClick={this.onLoadMore}>
                {loadMoreLabel}
            </button>
        );
    }

    render() {
        const items = this.props.items;
        const attrs = {
            className: 'c-finder-tree-branch',
        };

        if (!items.length) {
            attrs.className = `${attrs.className} c-finder-tree-branch--collapsed`;
            attrs.onClick = this.expandBranch;
        }

        return (
            <div {...attrs}>
                <div className="c-finder-tree-branch__list-wrapper">
                    {this.props.items.map(this.renderLeaf)}
                    {this.renderLoadMore()}
                </div>
            </div>
        );
    }
}

FinderTreeBranchComponent.propTypes = {
    items: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    parentLocation: PropTypes.object,
    onItemClick: PropTypes.func.isRequired,
    onBranchClick: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    allowContainersOnly: PropTypes.bool,
    contentTypesMap: PropTypes.object,
    allowedLocations: PropTypes.array.isRequired,
    multiple: PropTypes.bool.isRequired,
    selectedContent: PropTypes.array.isRequired,
    onSelectContent: PropTypes.func.isRequired,
    checkCanSelectContent: PropTypes.func.isRequired,
    onItemRemove: PropTypes.func.isRequired,
    activeLocationId: PropTypes.string,
    isActiveLocationLoading: PropTypes.bool,
    onItemSelect: PropTypes.func.isRequired,
    onItemDeselect: PropTypes.func.isRequired,
};
