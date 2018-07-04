import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FinderTreeBranchComponent from './finder.tree.branch.component';
import { loadPreselectedLocationData, QUERY_LIMIT } from '../../services/universal.discovery.service';
import deepClone from '../../../common/helpers/deep.clone.helper';

import './css/finder.component.css';

export default class FinderComponent extends Component {
    constructor(props) {
        super(props);

        this.appendMoreItems = this.appendMoreItems.bind(this);
        this.updateLocationsData = this.updateLocationsData.bind(this);
        this.findLocationChildren = this.findLocationChildren.bind(this);
        this.updateLoadingState = this.updateLoadingState.bind(this);
        this.loadBranchLeaves = this.loadBranchLeaves.bind(this);
        this.onLoadMore = this.onLoadMore.bind(this);
        this.renderBranch = this.renderBranch.bind(this);
        this.setBranchesContainerRef = this.setBranchesContainerRef.bind(this);

        this.locationsMap = {};
        this.activeLocations = {};
        this.preselectedItem = null;

        this.state = {
            locationsMap: {},
            activeLocations: {},
            limit: QUERY_LIMIT,
            isLoading: false,
        };
    }

    componentDidMount() {
        const isForcedLocation = this.props.allowedLocations.length === 1;
        const allowedIncludesPreselected = this.props.allowedLocations.includes(this.props.preselectedLocation);
        const isPreselectedLocation = this.props.preselectedLocation && (!this.props.allowedLocations.length || allowedIncludesPreselected);

        if (isForcedLocation) {
            this.loadPreselectedData(this.props.allowedLocations[0], true);
        } else if (isPreselectedLocation) {
            this.loadPreselectedData(this.props.preselectedLocation, true);
        } else {
            this.props.findLocationsByParentLocationId(
                { ...this.props.restInfo, parentLocationId: this.props.startingLocationId },
                this.updateLocationsData
            );
        }
    }

    componentDidUpdate() {
        this.updateBranchesContainerScroll();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const isShowingUp = nextProps.isVisible && nextProps.isVisible !== this.props.isVisible;

        if (this.preselectedItem && this.locationsMap && this.activeLocations && isShowingUp) {
            this.setState(
                (state) => ({
                    ...state,
                    locationsMap: this.locationsMap,
                    activeLocations: this.activeLocations,
                }),
                () => nextProps.isVisible && this.props.onItemSelect(this.preselectedItem)
            );
        }
    }

    /**
     * Load data of preselected location.
     *
     * @method loadPreselectedData
     * @param {String} locationId
     * @memberof FinderComponent
     */
    loadPreselectedData(locationId) {
        const promise = new Promise((resolve) =>
            loadPreselectedLocationData({ startingLocationId: this.props.startingLocationId, locationId }, resolve)
        );

        promise.then((response) => {
            this.createPreselectedLocationData(response);
            this.preselectedItem = response.locations[locationId].Location;
            this.setPreselectedLocationData();
        });
    }

    /**
     * Create preselected location data.
     *
     * @method createPreselectedLocationData
     * @param {Object} locations
     * @param {Object} subitems
     * @memberof FinderComponent
     */
    createPreselectedLocationData({ locations, subitems }) {
        const createItem = ({ parent, offset = 0, children, location }) => {
            const createData = (items) => {
                return items.locations.map((value) => {
                    return { value };
                });
            };
            const data = children ? createData(children) : [];
            const count = children ? children.totalCount : location.childCount;

            return { count, data, offset, parent };
        };

        if (subitems[1]) {
            const item = createItem({ parent: 1, children: subitems[1] });

            this.locationsMap[1] = item;
            this.activeLocations[0] = item;
        }

        Object.entries(locations).forEach(([key, value]) => {
            const item = createItem({
                parent: parseInt(key, 10),
                children: subitems[key],
                location: value.Location,
            });

            this.locationsMap[key] = item;
            this.activeLocations[value.Location.depth] = item;
        });
    }

    /**
     * Sets preselected location data.
     *
     * @method setPreselectedLocationData
     * @memberof FinderComponent
     */
    setPreselectedLocationData() {
        this.setState(
            (state) => ({
                ...state,
                locationsMap: this.locationsMap,
                activeLocations: this.activeLocations,
            }),
            () => this.props.isVisible && this.props.onItemSelect(this.preselectedItem)
        );
    }

    /**
     * Updates locations based state attributes: activeLocations and locationsMap
     *
     * @method updateLocationsData
     * @param {Object} params params hash containing: parentLocationId, data and offset properties
     * @memberof FinderComponent
     */
    updateLocationsData({ parentLocationId, data, offset }, location = null) {
        this.setState((state) => {
            const activeLocations = deepClone(state.activeLocations);
            const locationBranch = {
                location,
                parent: parentLocationId,
                data: data.View.Result.searchHits.searchHit,
                count: data.View.Result.count,
                offset,
            };
            const locationsMap = {
                ...deepClone(state.locationsMap),
                [parentLocationId]: locationBranch,
            };

            if (!Object.keys(activeLocations).length) {
                activeLocations[0] = locationBranch;
            }

            return { ...state, activeLocations, locationsMap };
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
     * @param {Object} parentLocation
     * @memberof FinderComponent
     */
    onLoadMore(parentLocation) {
        const limit = this.state.limit;
        const offset = Object.values(this.state.activeLocations).find((location) => location.parent === parentLocation.id).offset + limit;

        const sortClauses = this.getLocationSortClauses(parentLocation);
        this.props.findLocationsByParentLocationId(
            {
                ...this.props.restInfo,
                parentLocationId: parentLocation.id,
                limit,
                offset,
                sortClauses,
            },
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
    appendMoreItems({ parentLocationId, offset, data }) {
        this.setState((state) => {
            const activeLocations = deepClone(state.activeLocations);
            const locationsMap = deepClone(state.locationsMap);

            Object.keys(activeLocations).forEach((key) => {
                const location = activeLocations[key];

                if (location.parent === parentLocationId) {
                    const results = [...location.data, ...data.View.Result.searchHits.searchHit];

                    location.offset = offset;
                    location.data = results;
                    locationsMap[parentLocationId] = location;
                }
            });

            return { ...state, activeLocations, locationsMap };
        });
    }

    /**
     * Loads branch children (sub-items)
     *
     * @method loadBranchLeaves
     * @param {Object} parentLocation
     * @memberof FinderComponent
     */
    loadBranchLeaves(parentLocation) {
        const sortClauses = this.getLocationSortClauses(parentLocation);
        const promise = new Promise((resolve) =>
            this.props.findLocationsByParentLocationId(
                { ...this.props.restInfo, parentLocationId: parentLocation.id, sortClauses },
                resolve
            )
        );

        promise.then((response) => {
            this.updateLocationsData(response, parentLocation);
            this.updateBranchActiveLocations(parentLocation.id);
        });
    }

    /**
     * Updates branch active locations
     *
     * @method updateBranchActiveLocations
     * @param {String} parent the parent id
     * @memberof FinderComponent
     */
    updateBranchActiveLocations(parent) {
        const activeLocations = deepClone(this.state.activeLocations);
        const depth = Object.keys(activeLocations).find((locationDepth) => activeLocations[locationDepth].parent === parent);

        activeLocations[depth] = this.state.locationsMap[parent];

        this.setState((state) => ({ ...state, activeLocations }));
    }

    /**
     * Generates sort clause for location
     *
     * @method getLocationSortClauses
     * @param {Object} location
     * @returns {Object} sortClauses for given location
     * @memberof FinderComponent
     */
    getLocationSortClauses(location) {
        const { sortFieldMappings, sortOrderMappings } = this.props;
        const sortField = sortFieldMappings[location.sortField];
        const sortOrder = sortOrderMappings[location.sortOrder];

        if (!sortField || !sortOrder) {
            return {};
        }

        return { [sortField]: sortOrder };
    }

    /**
     * Updates the finder's loading state
     *
     * @method updateLoadingState
     * @param {Object} branchData
     * @param {Function} callback
     */
    updateLoadingState(branchData, callback) {
        this.setState((state) => ({ ...state, isLoading: true }), () => this.findLocationChildren(branchData, callback));
    }

    /**
     * Finds location children (sub-items)
     *
     * @method findLocationChildren
     * @param {Object} params params hash containing: parent and location properties
     * @memberof FinderComponent
     */
    findLocationChildren({ parentLocationId, location }, callback) {
        if (this.props.allowedLocations.length === 1) {
            return;
        }

        if (this.state.locationsMap[parentLocationId]) {
            this.updateSelectedBranches(location);
            this.props.onItemSelect(location);
            callback();

            return;
        }

        const sortClauses = this.getLocationSortClauses(location);
        const promise = new Promise((resolve) =>
            this.props.findLocationsByParentLocationId({ ...this.props.restInfo, parentLocationId, sortClauses }, resolve)
        );

        promise.then((response) => {
            this.updateLocationsData(response, location);
            this.updateSelectedBranches(location);
            this.props.onItemSelect(location);
            callback();
        });
    }

    /**
     * Updates selected branches state
     *
     * @param {Object} location location struct
     * @memberof FinderComponent
     */
    updateSelectedBranches(location) {
        this.setState(this.updateActiveLocations.bind(this, location));
    }

    /**
     * Updates active locations info
     *
     * @method updateActiveLocations
     * @param {Object} location location struct
     * @param {Object} state component state
     * @returns {Object}
     * @memberof FinderComponent
     */
    updateActiveLocations(location, state) {
        const locationDepth = parseInt(location.depth, 10);
        const activeLocations = Object.keys(state.activeLocations)
            .filter((key) => parseInt(key, 10) < locationDepth)
            .reduce((total, index) => {
                index = parseInt(index, 10);

                total[index] = state.activeLocations[index];

                return total;
            }, {});

        activeLocations[locationDepth] = state.locationsMap[location.id];

        return { ...state, activeLocations, isLoading: false };
    }

    /**
     * Renders branch (the sub items container)
     *
     * @method renderBranch
     * @param {Object} params params hash containing: parent, count and data properties
     * @returns {null|Element}
     * @memberof FinderComponent
     */
    renderBranch({ parent, data, count, location }) {
        const { activeLocations, isLoading } = this.state;

        if (!data || !count) {
            return null;
        }

        const selectedLocations = Object.values(activeLocations).map((item) => item.parent);

        return (
            <FinderTreeBranchComponent
                key={parent}
                parentLocation={location}
                items={data}
                total={count}
                selectedLocations={selectedLocations}
                labels={this.props.labels}
                onItemClick={this.updateLoadingState}
                onBranchClick={this.loadBranchLeaves}
                onLoadMore={this.onLoadMore}
                maxHeight={this.props.maxHeight}
                allowContainersOnly={this.props.allowContainersOnly}
                contentTypesMap={this.props.contentTypesMap}
                allowedLocations={this.props.allowedLocations}
                isLoading={isLoading}
            />
        );
    }

    /**
     * Sets a reference to the branches container HTMLElement node
     *
     * @method setBranchesContainerRef
     * @param {HTMLElement} ref
     */
    setBranchesContainerRef(ref) {
        this._refBranchesContainer = ref;
    }

    render() {
        const activeLocations = Object.values(this.state.activeLocations);

        if (!activeLocations.length) {
            return null;
        }

        return (
            <div className="c-finder" style={{ maxHeight: `${this.props.maxHeight}px` }}>
                <div className="c-finder__branches" ref={this.setBranchesContainerRef}>
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
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
    labels: PropTypes.object.isRequired,
    allowContainersOnly: PropTypes.bool,
    contentTypesMap: PropTypes.object,
    preselectedLocation: PropTypes.number,
    allowedLocations: PropTypes.array,
    isVisible: PropTypes.bool,
    sortFieldMappings: PropTypes.object.isRequired,
    sortOrderMappings: PropTypes.object.isRequired,
};

FinderComponent.defaultProps = {
    allowedLocations: [],
};
