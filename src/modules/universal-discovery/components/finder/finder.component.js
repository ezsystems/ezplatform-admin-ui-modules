import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FinderTreeBranchComponent from './finder.tree.branch.component';
import { loadPreselectedLocationData, QUERY_LIMIT } from '../../services/universal.discovery.service';
import deepClone from '../../../common/helpers/deep.clone.helper';

const ROOT_LOCATION_OBJECT = null;
const ROOT_LOCATION_ID = 1

export default class FinderComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            locationsMap: {},
            activeLocations: [],
            limit: QUERY_LIMIT,
        };

        this.appendMoreItems = this.appendMoreItems.bind(this);
        this.updateLocationsData = this.updateLocationsData.bind(this);
        this.findLocationChildren = this.findLocationChildren.bind(this);
        this.loadBranchLeaves = this.loadBranchLeaves.bind(this);
        this.onLoadMore = this.onLoadMore.bind(this);
        this.renderBranch = this.renderBranch.bind(this);
        this.setBranchContainerRef = this.setBranchContainerRef.bind(this);
        this.setPreselectedState = this.getPreselectedState.bind(this);

        this.locationsMap = {};
        this.activeLocations = [];
        this.preselectedItem = null;
        this.startingLocation = {
            id: ROOT_LOCATION_ID
        };
    }

    componentDidMount() {
        const isForcedLocation = this.props.allowedLocations.length === 1;
        const allowedIncludesPreselected = this.props.allowedLocations.includes(this.props.preselectedLocation);
        const isPreselectedLocation = this.props.preselectedLocation && (!this.props.allowedLocations.length || allowedIncludesPreselected);

        if (isForcedLocation) {
            this.loadPreselectedData(this.props.allowedLocations[0]);
        } else if (isPreselectedLocation) {
            this.loadPreselectedData(this.props.preselectedLocation);
        } else {
            this.handleStartingLocation();
        }
    }

    componentDidUpdate() {
        this.updateBranchesContainerScroll();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const isShowingUp = nextProps.isVisible && nextProps.isVisible !== this.props.isVisible;

        if (this.preselectedItem && this.locationsMap && this.activeLocations && isShowingUp) {
            this.setState(this.getPreselectedState, () => nextProps.isVisible && this.props.onItemSelect(this.preselectedItem));
        }
    }

    getPreselectedState() {
        return { locationsMap: this.locationsMap, activeLocations: this.activeLocations };
    }

    /**
     * Loads starting location data (if there is a need) and loads root locations
     *
     * @method handleStartingLocation
     * @memberof FinderComponent
     */
    handleStartingLocation() {
        this.setDefaultActiveLocations();

        // Starting location is already loaded or it is a root location
        if (this.startingLocation.id === this.props.startingLocationId) {
            this.loadChildren();
            return;
        }

        this.props.loadLocation(
            {...this.props.restInfo, locationId: this.props.startingLocationId},
            (response) => {
                if (response.View.Result.searchHits.searchHit.length) {
                    this.startingLocation = response.View.Result.searchHits.searchHit[0].value.Location;
                }

                this.loadChildren();
            }
        );
    }

    /**
     * Loads root locations
     *
     * @method loadChildren
     * @memberof FinderComponent
     */
    loadChildren() {
        const sortClauses = this.getLocationSortClauses(this.startingLocation);

        this.props.findLocationsByParentLocationId(
            { ...this.props.restInfo, parentLocationId: this.props.startingLocationId, sortClauses },
            this.updateLocationsData
        );
    };

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
     * @param {Object} params
     * @param {Array} params.locations
     * @param {Array} params.subitems
     * @memberof FinderComponent
     */
    createPreselectedLocationData({ locations, subitems }) {
        const createItem = ({ offset = 0, children, location }) => {
            const createData = (items) => {
                return items.locations.map((value) => {
                    return { value };
                });
            };
            const data = children ? createData(children) : [];
            const count = children ? children.totalCount : location.childCount;

            return { count, data, offset, location };
        };

        if (subitems[1]) {
            const item = createItem({ children: subitems[1], location: ROOT_LOCATION_OBJECT });

            this.locationsMap[this.props.startingLocationId] = item;
            this.activeLocations[0] = ROOT_LOCATION_OBJECT;
        }

        Object.entries(locations).forEach(([key, value]) => {
            const item = createItem({
                children: subitems[key],
                location: value.Location,
            });

            this.locationsMap[key] = item;
            this.activeLocations[value.Location.depth] = item.location;
        });
    }

    /**
     * Sets preselected location data.
     *
     * @method setPreselectedLocationData
     * @memberof FinderComponent
     */
    setPreselectedLocationData() {
        this.setState(this.getPreselectedState, () => this.props.isVisible && this.props.onItemSelect(this.preselectedItem));
    }

    /**
     * Updates locations based state attributes: activeLocations and locationsMap
     *
     * @method updateLocationsData
     * @param {Object} params params hash containing: parentLocationId, data and offset properties
     * @memberof FinderComponent
     */
    updateLocationsData({ data, offset }, location = null) {
        this.setLocationData({
            location,
            data: data.View.Result.searchHits.searchHit,
            count: data.View.Result.count,
            offset,
        });
    }

    setDefaultActiveLocations() {
        this.setState(() => ({ activeLocations: [ROOT_LOCATION_OBJECT] }));
    }

    setLocationData(locationData) {
        this.setState((state, props) => {
            const { location } = locationData;
            const locationId = location ? location.id : props.startingLocationId;
            const locationsMap = { ...deepClone(state.locationsMap), [locationId]: locationData };

            return { locationsMap };
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
        if (parentLocation === null) {
            parentLocation = this.startingLocation;
        }
        const limit = this.state.limit;
        const parentLocationId = parentLocation.id;
        const offset = this.state.locationsMap[parentLocation.id].offset + limit;
        const sortClauses = this.getLocationSortClauses(parentLocation);

        this.props.findLocationsByParentLocationId(
            { ...this.props.restInfo, parentLocationId, limit, offset, sortClauses },
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
            const locationsMap = deepClone(state.locationsMap);
            const locationData = locationsMap[parentLocationId];

            locationData.offset = offset;
            locationData.data = [...locationData.data, ...data.View.Result.searchHits.searchHit];

            return { locationsMap };
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
        const { findLocationsByParentLocationId, startingLocationId, restInfo } = this.props;
        const sortClauses = this.getLocationSortClauses(parentLocation);
        const promise = new Promise((resolve) =>
            findLocationsByParentLocationId(
                {
                    ...restInfo,
                    parentLocationId: parentLocation ? parentLocation.id : startingLocationId,
                    sortClauses,
                },
                resolve
            )
        );

        promise.then((response) => {
            this.updateLocationsData(response, parentLocation);
        });
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
     * Finds location children (sub-items)
     *
     * @method findLocationChildren
     * @param {Object} location
     * @memberof FinderComponent
     */
    findLocationChildren(location) {
        if (this.props.allowedLocations.length === 1) {
            return;
        }

        this.props.onItemSelect(location);
        this.updateSelectedBranches(location);

        if (!location.childCount) {
            this.setLocationData({ location, data: [], count: 0, offset: 0 });

            return;
        }

        const sortClauses = this.getLocationSortClauses(location);
        const promise = new Promise((resolve) =>
            this.props.findLocationsByParentLocationId(
                {
                    ...this.props.restInfo,
                    parentLocationId: location.id,
                    sortClauses,
                },
                resolve
            )
        );

        promise.then((response) => {
            this.updateLocationsData(response, location);
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
        const activeLocations = state.activeLocations.slice(0, locationDepth);

        activeLocations[locationDepth] = location;

        return { activeLocations };
    }

    /**
     * Renders branch (the sub items container)
     *
     * @method renderBranch
     * @param {Object} locationData params hash containing: parent, count and data properties
     * @returns {JSX.Element|null}
     * @memberof FinderComponent
     */
    renderBranch(locationData, branchActiveLocationId, isBranchActiveLocationLoading) {
        if (!locationData || !locationData.count) {
            return null;
        }

        const { data: childrenData, count, location } = locationData;
        const locationId = location ? location.id : this.props.startingLocationId;

        return (
            <FinderTreeBranchComponent
                key={locationId}
                parentLocation={location}
                items={childrenData}
                total={count}
                activeLocationId={branchActiveLocationId}
                isActiveLocationLoading={isBranchActiveLocationLoading}
                onItemClick={this.findLocationChildren}
                onBranchClick={this.loadBranchLeaves}
                onLoadMore={this.onLoadMore}
                maxHeight={this.props.maxHeight}
                allowContainersOnly={this.props.allowContainersOnly}
                contentTypesMap={this.props.contentTypesMap}
                allowedLocations={this.props.allowedLocations}
                multiple={this.props.multiple}
                selectedContent={this.props.selectedContent}
                onSelectContent={this.props.onSelectContent}
                canSelectContent={this.props.canSelectContent}
                onItemRemove={this.props.onItemRemove}
            />
        );
    }

    setBranchContainerRef(ref) {
        this._refBranchesContainer = ref;
    }

    render() {
        const { activeLocations } = this.state;

        if (!activeLocations.length) {
            return null;
        }

        const { locationsMap } = this.state;

        return (
            <div className="c-finder">
                <div className="c-finder__branches" style={{ height: `${this.props.maxHeight}px` }} ref={this.setBranchContainerRef}>
                    {activeLocations.map((location, index) => {
                        const locationId = location ? location.id : this.props.startingLocationId;
                        const branchActiveLocation = activeLocations[index + 1];
                        const branchActiveLocationId = branchActiveLocation ? branchActiveLocation.id : null;
                        const isBranchActiveLocationLoading = branchActiveLocationId && !locationsMap[branchActiveLocationId];
                        const locationData = locationsMap[locationId];

                        return this.renderBranch(locationData, branchActiveLocationId, isBranchActiveLocationLoading);
                    })}
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
    loadLocation: PropTypes.func.isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
    allowContainersOnly: PropTypes.bool,
    contentTypesMap: PropTypes.object,
    preselectedLocation: PropTypes.number,
    allowedLocations: PropTypes.array,
    isVisible: PropTypes.bool,
    sortFieldMappings: PropTypes.object.isRequired,
    sortOrderMappings: PropTypes.object.isRequired,
    selectedContent: PropTypes.array.isRequired,
    onSelectContent: PropTypes.func.isRequired,
    canSelectContent: PropTypes.func.isRequired,
    onItemRemove: PropTypes.func.isRequired,
};

FinderComponent.defaultProps = {
    allowedLocations: [],
};
