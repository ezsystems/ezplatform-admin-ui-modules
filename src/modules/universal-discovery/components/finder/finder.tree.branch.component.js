import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FinderTreeLeafComponent from './finder.tree.leaf.component';

export default class FinderTreeBranchComponent extends Component {
    constructor(props) {
        super(props);

        this.expandBranch = this.expandBranch.bind(this);
        this.onLoadMore = this.onLoadMore.bind(this);
        this.removeLoadingStateFromItem = this.removeLoadingStateFromItem.bind(this);
        this.updateSelectedLocations = this.updateSelectedLocations.bind(this);
        this.renderLeaf = this.renderLeaf.bind(this);

        this.state = {
            currentlyLoadingLocationId: false,
            selectedLocationId: null,
        };
    }

    /**
     * Updates selected locations state
     *
     * @method updateSelectedLocations
     * @param {Object} location location struct
     * @memberof FinderTreeBranchComponent
     */
    updateSelectedLocations(location) {
        this.setState(
            () => ({ currentlyLoadingLocationId: location.id, selectedLocationId: location.id }),
            () =>
                this.props.onItemClick({
                    parent: location.id,
                    location,
                    onDataLoaded: this.removeLoadingStateFromItem,
                })
        );
    }

    removeLoadingStateFromItem() {
        this.setState(() => ({ currentlyLoadingLocationId: false }));
    }

    expandBranch() {
        this.props.onBranchClick(this.props.parentLocation);
    }

    /**
     * Renders leaf (the single content item)
     *
     * @method renderLeaf
     * @param {Object} data location response
     * @returns {Element}
     * @memberof FinderTreeBranchComponent
     */
    renderLeaf(data) {
        const location = data.value.Location;
        const isLoadingChildren = location.id === this.state.currentlyLoadingLocationId;
        const contentTypesMap = this.props.contentTypesMap;
        const contentTypeHref = location.ContentInfo.Content.ContentType._href;
        const isContainer = contentTypesMap && contentTypesMap[contentTypeHref] && contentTypesMap[contentTypeHref].isContainer;
        const isSelectable = !(this.props.allowContainersOnly && !isContainer);
        const selected = location.id === this.state.selectedLocationId;

        return (
            <FinderTreeLeafComponent
                key={location.remoteId}
                location={location}
                onClick={this.updateSelectedLocations}
                selected={selected}
                isLoadingChildren={isLoadingChildren}
                isSelectable={isSelectable}
                allowedLocations={this.props.allowedLocations}
                multiple={this.props.multiple}
                selectedContent={this.props.selectedContent}
                onSelectContent={this.props.onSelectContent}
                canSelectContent={this.props.canSelectContent}
                onItemRemove={this.props.onItemRemove}
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
     * @returns {Element}
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
            style: { height: `${this.props.maxHeight}px` },
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
    selectedLocations: PropTypes.array.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    allowContainersOnly: PropTypes.bool,
    contentTypesMap: PropTypes.object,
    allowedLocations: PropTypes.array.isRequired,
    multiple: PropTypes.bool.isRequired,
    selectedContent: PropTypes.array.isRequired,
    onSelectContent: PropTypes.func.isRequired,
    canSelectContent: PropTypes.func.isRequired,
    onItemRemove: PropTypes.func.isRequired,
};
