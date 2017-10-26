import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FinderTreeBranchComponent from './finder.tree.branch.component';

import './css/finder.component.css';

export default class FinderComponent extends Component {
    constructor() {
        super();

        this.state = {
            locationsMap: {},
            activeLocations: {}
        };
    }

    componentDidMount() {
        this.props.findLocationsByParentLocationId(
            this.props.restInfo,
            this.props.startingLocationId,
            this.updateLocationsData.bind(this)
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
                activeLocations[0] = {parent: 0, data};
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
     * Finds location children (sub-items)
     *
     * @method findLocationChildren
     * @param {Object} params params hash containing: parent and location properties
     * @memberof FinderComponent
     */
    findLocationChildren({parent, location}) {
        const promise = new Promise(resolve => this.props.findLocationsByParentLocationId(this.props.restInfo, parent, resolve));

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

        activeLocations[locationDepth] = {parent, data};

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
        const activeLocations = Object.values(this.state.activeLocations);
        const selectedLocations = activeLocations.map(item => item.parent);

        return <FinderTreeBranchComponent
            key={parent}
            parent={parent}
            items={items}
            selectedLocations={selectedLocations}
            onItemClick={this.findLocationChildren.bind(this)} />
    }

    render() {
        const activeLocations = Object.values(this.state.activeLocations);

        if (!activeLocations.length) {
            return null;
        }

        return (
            <div className="c-finder" style={{maxHeight:`${this.props.maxHeight}px`}}>
                <div className="c-finder__branches" ref={(ref) => this._refBranchesContainer = ref}>
                    {activeLocations.map(this.renderBranch.bind(this))}
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
    }).isRequired
};
