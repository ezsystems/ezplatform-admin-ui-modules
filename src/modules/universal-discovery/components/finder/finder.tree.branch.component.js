import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FinderTreeLeafComponent from './finder.tree.leaf.component';

import './css/finder.tree.branch.component.css';

export default class FinderTreeBranchComponent extends Component {
    constructor(props) {
        super(props);

        this.expandBranch = this.expandBranch.bind(this);
        this.renderLeaf = this.renderLeaf.bind(this);
        this.updateSelectedLocations = this.updateSelectedLocations.bind(this);
        this.handleLoadMoreClick = this.handleLoadMoreClick.bind(this);
        this.removeLoadingState = this.removeLoadingState.bind(this);

        this.state = {
            selectedLocationId: null,
            currentlyLoadingLocationId: null,
        };
    }

    /**
     * Removes the loading state from the container
     *
     * @method removeLoadingState
     */
    removeLoadingState() {
        this.setState((state) => ({ ...state, currentlyLoadingLocationId: null }));
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
            (state) => {
                return {
                    ...state,
                    selectedLocationId: location.id,
                    currentlyLoadingLocationId: location.id,
                };
            },
            () => {
                this.props.onItemClick(
                    {
                        parentLocationId: location.id,
                        location,
                    },
                    this.removeLoadingState
                );
            }
        );
    }

    /**
     * Expands the branch
     *
     * @method expandBranch
     */
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
        const contentTypesMap = this.props.contentTypesMap;
        const contentTypeHref = location.ContentInfo.Content.ContentType._href;
        const isContainer = contentTypesMap && contentTypesMap[contentTypeHref] && contentTypesMap[contentTypeHref].isContainer;
        const isSelectable = !(this.props.allowContainersOnly && !isContainer);

        return (
            <FinderTreeLeafComponent
                key={location.remoteId}
                location={location}
                onClick={this.updateSelectedLocations}
                selected={location.id === this.state.selectedLocationId}
                isLoadingChildren={location.id === this.state.currentlyLoadingLocationId}
                isSelectable={isSelectable}
                allowedLocations={this.props.allowedLocations}
            />
        );
    }

    /**
     * Handles a click event on the Load More button
     *
     * @method handleLoadMoreClick
     */
    handleLoadMoreClick() {
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
        const { items, total, labels } = this.props;

        if (!items.length || items.length === total) {
            return null;
        }

        return (
            <button className="c-finder-tree-branch__load-more" onClick={this.handleLoadMoreClick}>
                {labels.finderBranch.loadMore}
            </button>
        );
    }

    render() {
        const { items, isLoading } = this.props;
        const branchClassName = 'c-finder-tree-branch';
        const attrs = { className: branchClassName, style: { height: `${this.props.maxHeight}px` } };

        if (!items.length) {
            attrs.className = `${attrs.className} ${branchClassName}--collapsed`;
            attrs.onClick = this.expandBranch;
        }

        if (isLoading) {
            attrs.className = `${attrs.className} ${branchClassName}--loading`;
            attrs.onClick = undefined;
        }

        return (
            <div {...attrs}>
                <div className="c-finder-tree-branch__list-wrapper">
                    {items.map(this.renderLeaf)}
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
    labels: PropTypes.shape({
        finderBranch: PropTypes.shape({
            loadMore: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    maxHeight: PropTypes.number.isRequired,
    allowContainersOnly: PropTypes.bool,
    contentTypesMap: PropTypes.object,
    allowedLocations: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
};
