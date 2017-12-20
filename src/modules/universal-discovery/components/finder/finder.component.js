import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FinderTreeBranchComponent from './finder.tree.branch.component';

import './css/finder.component.css';

export default class FinderComponent extends Component {
    constructor() {
        super();

        this.state = {
            locationsMap: {},
            activeLocations: {},
            limit: 50
        };

        this.appendMoreItems = this.appendMoreItems.bind(this);
        this.updateLocationsData = this.updateLocationsData.bind(this);
        this.findLocationChildren = this.findLocationChildren.bind(this);
        this.onLoadMore = this.onLoadMore.bind(this);
        this.renderBranch = this.renderBranch.bind(this);
    }

    componentDidMount() {
        this.props.findLocationsByParentLocationId(
            Object.assign({}, this.props.restInfo, { parentLocationId: this.props.startingLocationId}),
            this.updateLocationsData
        );
    }

    componentDidUpdate() {
        this.updateBranchesContainerScroll();
    }

    /**
     * Updates locations based state attributes: activeLocations and locationsMap
     *
     * @method updateLocationsData
     * @param {Object} params params hash containing: parentLocationId and data properties
     * @memberof FinderComponent
     */
    updateLocationsData({parentLocationId, data}) {
        this.setState(state => {
            const activeLocations = Object.assign({}, state.activeLocations);
            const locationsMap = Object.assign({}, state.locationsMap, {[parentLocationId]: data});

            if (!Object.keys(activeLocations).length) {
                activeLocations[0] = {
                    parent: 0,
                    offset: 0,
                    data
                };
            }

            return Object.assign({}, state, {activeLocations, locationsMap});
        });
    }

    /**
     * Updates the left scroll position of branches container
     *
     * @method updateBranchesContainerScroll
     * @memberof FinderComponent
     */
    updateBranchesContainerScroll() {
        const container = this._refBranchesContainer;

        if (container) {
            container.scrollLeft = container.scrollWidth - container.clientWidth;
        }
    }

    /**
     * Handles loading more items for a selected parent location
     *
     * @method onLoadMore
     * @param {Number} parentLocationId
     * @memberof FinderComponent
     */
    onLoadMore(parentLocationId) {
        const limit = this.state.limit;
        const offset = Object.values(this.state.activeLocations).find(location => location.parent === parentLocationId).offset + limit;

        this.props.findLocationsByParentLocationId(
            Object.assign({}, this.props.restInfo, { parentLocationId, limit, offset }),
            this.appendMoreItems
        );
    }

    /**
     * Appends more subitems for a selected location
     *
     * @method appendMoreItems
     * @param {Object} response object containing information about: parentLocationId, offset and data
     * @memberof FinderComponent
     */
    appendMoreItems({parentLocationId, offset, data}) {
        this.setState(state => {
            const activeLocations = Object.assign({}, state.activeLocations);
            const locationsMap = Object.assign({}, state.locationsMap);

            Object.keys(activeLocations).forEach(key => {
                const location = activeLocations[key];

                if (location.parent === parentLocationId) {
                    const results = [...location.data.View.Result.searchHits.searchHit, ...data.View.Result.searchHits.searchHit];

                    location.offset = offset;
                    location.data.View.Result.searchHits.searchHit = results;
                    locationsMap[parentLocationId] = location.data;
                }
            });

            return Object.assign({}, state, { activeLocations, locationsMap });
        });
    }

    /**
     * Finds location children (sub-items)
     *
     * @method findLocationChildren
     * @param {Object} params params hash containing: parent and location properties
     * @memberof FinderComponent
     */
    findLocationChildren({parent, location}) {
        const promise = new Promise(resolve => this.props.findLocationsByParentLocationId(
            Object.assign({}, this.props.restInfo, {parentLocationId: parent}), resolve));

        promise
            .then((response) => {
                this.updateLocationsData(response);
                this.updateSelectedBranches(parent, location);
                this.props.onItemSelect(location);
            });
    }

    /**
     * Updates selected branches state
     *
     * @param {String} parent parent location id
     * @param {Object} location location struct
     * @memberof FinderComponent
     */
    updateSelectedBranches(parent, location) {
        this.setState(this.updateActiveLocations.bind(this, parent, location));
    }

    /**
     * Updates active locations info
     *
     * @method updateActiveLocations
     * @param {String} parent
     * @param {Object} location location struct
     * @param {Object} state component state
     * @returns {Object}
     * @memberof FinderComponent
     */
    updateActiveLocations(parent, location, state) {
        const data = state.locationsMap[location.id] || {};
        const locationDepth = parseInt(location.depth, 10);
        const activeLocations = Object
            .keys(state.activeLocations)
            .filter(key => parseInt(key, 10) < locationDepth)
            .reduce((total, depth) => {
                depth = parseInt(depth, 10);

                total[depth] = state.activeLocations[depth];

                return total;
            }, {});

        activeLocations[locationDepth] = {
            offset: 0,
            parent,
            data,
        };

        return Object.assign({}, state, {activeLocations});
    }

    /**
     * Renders branch (the sub items container)
     *
     * @method renderBranch
     * @param {Object} params params hash containing: parent and data properties
     * @returns {null|Element}
     * @memberof FinderComponent
     */
    renderBranch({parent, data}) {
        if (!data.View || !data.View.Result.count) {
            return null;
        }

        const items = data.View.Result.searchHits.searchHit;
        const total = data.View.Result.count;
        const activeLocations = Object.values(this.state.activeLocations);
        const selectedLocations = activeLocations.map(item => item.parent);

        return <FinderTreeBranchComponent
            key={parent}
            parent={parent}
            items={items}
            total={total}
            selectedLocations={selectedLocations}
            labels={this.props.labels}
            onItemClick={this.findLocationChildren}
            onLoadMore={this.onLoadMore} />
    }

    render() {
        const activeLocations = Object.values(this.state.activeLocations);

        if (!activeLocations.length) {
            return null;
        }

        return (
            <div className="c-finder" style={{maxHeight:`${this.props.maxHeight}px`}}>
                <div className="c-finder__branches" ref={(ref) => this._refBranchesContainer = ref}>
                    {activeLocations.map(this.renderBranch)}
                </div>
            </div>
        );
    }
}

FinderComponent.propTypes = {
    multiple: PropTypes.bool.isRequired,
    maxHeight: PropTypes.number.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    startingLocationId: PropTypes.number.isRequired,
    findLocationsByParentLocationId: PropTypes.func.isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired
    }).isRequired,
    labels: PropTypes.object.isRequired
};
