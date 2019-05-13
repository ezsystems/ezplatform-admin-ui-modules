import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import FinderTreeBranchComponent from './finder.tree.branch.component';
import deepClone from '../../../../../common/helpers/deep.clone.helper';
import { QUERY_LIMIT, findLocationsByParentLocationId } from '../../../../services/universal.discovery.service';
import { restInfo } from '../../../../../common/rest-info/rest.info';

const ROOT_LOCATION_OBJECT = null;

const FinderComponent = (props) => {
    const { startingLocationId, allowedLocations, maxHeight, allowContainersOnly, multiple, selectedContent } = props;
    const { onItemSelect, checkCanSelectContent, onItemDeselect, onItemMarked } = props;
    const [locationsMap, setLocationsMap] = useState({});
    const [activeLocations, setActiveLocations] = useState([]);
    const refBranchesContainer = useRef();
    const setDefaultActiveLocations = () => setActiveLocations([ROOT_LOCATION_OBJECT]);
    const setLocationData = useCallback(
        (locationData) => {
            setLocationsMap((prevLocationsMap) => {
                const { location } = locationData;
                const locationId = location ? location.id : startingLocationId;
                const locationsMap = { ...deepClone(prevLocationsMap), [locationId]: locationData };

                return locationsMap;
            });
        },
        [startingLocationId]
    );
    const updateBranchesContainerScroll = () => {
        const container = refBranchesContainer.current;

        if (container) {
            container.scrollLeft = container.scrollWidth - container.clientWidth;
        }
    };
    const onLoadMore = (parentLocation) => {
        const parentLocationId = parentLocation ? parentLocation.id : startingLocationId;
        const offset = locationsMap[parentLocationId].offset + QUERY_LIMIT;
        const sortClauses = parentLocation ? getLocationSortClauses(parentLocation) : {};

        findLocationsByParentLocationId({ ...restInfo, parentLocationId, QUERY_LIMIT, offset, sortClauses }, appendMoreItems);
    };
    const appendMoreItems = ({ parentLocationId, offset, data }) => {
        setLocationsMap((prevLocationsMap) => {
            const locationsMap = deepClone(prevLocationsMap);
            const locationData = locationsMap[parentLocationId];

            locationData.offset = offset;
            locationData.data = [...locationData.data, ...data.View.Result.searchHits.searchHit];

            return locationsMap;
        });
    };
    const loadBranchLeaves = (parentLocation) => {
        const sortClauses = getLocationSortClauses(parentLocation);
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

        promise.then((response) => updateLocationsData(response, parentLocation));
    };
    const updateLocationsData = useCallback(
        ({ data, offset }, location = null) => {
            setLocationData({
                location,
                data: data.View.Result.searchHits.searchHit,
                count: data.View.Result.count,
                offset,
            });
        },
        [setLocationData]
    );
    const getLocationSortClauses = (location) => {
        const sortField = window.eZ.adminUiConfig.sortFieldMappings[location.sortField];
        const sortOrder = window.eZ.adminUiConfig.sortOrderMappings[location.sortOrder];

        if (!sortField || !sortOrder) {
            return {};
        }

        return { [sortField]: sortOrder };
    };
    const findLocationChildren = (location) => {
        if (allowedLocations.length === 1) {
            return;
        }

        onItemMarked(location);
        updateSelectedBranches(location);

        if (!location.childCount) {
            setLocationData({ location, data: [], count: 0, offset: 0 });

            return;
        }

        const promise = new Promise((resolve) =>
            findLocationsByParentLocationId(
                {
                    ...restInfo,
                    parentLocationId: location.id,
                    sortClauses: getLocationSortClauses(location),
                },
                resolve
            )
        );

        promise.then((response) => updateLocationsData(response, location));
    };
    const updateSelectedBranches = (location) => {
        setActiveLocations((prevActiveLocations) => {
            const locationDepth = parseInt(location.depth, 10);
            const activeLocations = prevActiveLocations.slice(0, locationDepth);

            activeLocations[locationDepth] = location;

            return activeLocations;
        });
    };
    const renderBranch = (locationData, branchActiveLocationId, isBranchActiveLocationLoading) => {
        if (!locationData || !locationData.count) {
            return null;
        }

        const { data: childrenData, count, location } = locationData;
        const locationId = location ? location.id : startingLocationId;

        return (
            <FinderTreeBranchComponent
                key={locationId}
                parentLocation={location}
                items={childrenData}
                total={count}
                activeLocationId={branchActiveLocationId}
                isActiveLocationLoading={isBranchActiveLocationLoading}
                onItemClick={findLocationChildren}
                onBranchClick={loadBranchLeaves}
                onLoadMore={onLoadMore}
                maxHeight={maxHeight}
                allowContainersOnly={allowContainersOnly}
                allowedLocations={allowedLocations}
                multiple={multiple}
                selectedContent={selectedContent}
                onItemMarked={onItemMarked}
                onItemSelect={onItemSelect}
                checkCanSelectContent={checkCanSelectContent}
                onItemDeselect={onItemDeselect}
            />
        );
    };

    useEffect(() => {
        setDefaultActiveLocations();
        findLocationsByParentLocationId({ ...restInfo, parentLocationId: startingLocationId }, updateLocationsData);
    }, [startingLocationId, updateLocationsData]);

    useEffect(() => {
        updateBranchesContainerScroll();
    });

    if (!activeLocations.length) {
        return null;
    }

    return (
        <div className="c-finder">
            <div className="c-finder__branches" style={{ height: `${maxHeight}px` }} ref={refBranchesContainer}>
                {activeLocations.map((location, index) => {
                    const locationId = location ? location.id : startingLocationId;
                    const branchActiveLocation = activeLocations[index + 1];
                    const branchActiveLocationId = branchActiveLocation ? branchActiveLocation.id : null;
                    const isBranchActiveLocationLoading = branchActiveLocationId && !locationsMap[branchActiveLocationId];
                    const locationData = locationsMap[locationId];

                    return renderBranch(locationData, branchActiveLocationId, isBranchActiveLocationLoading);
                })}
            </div>
        </div>
    );
};

FinderComponent.propTypes = {
    multiple: PropTypes.bool.isRequired,
    maxHeight: PropTypes.number.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    startingLocationId: PropTypes.number.isRequired,
    allowContainersOnly: PropTypes.bool,
    allowedLocations: PropTypes.array,
    selectedContent: PropTypes.array.isRequired,
    onItemMarked: PropTypes.func.isRequired,
    checkCanSelectContent: PropTypes.func.isRequired,
    onItemDeselect: PropTypes.func.isRequired,
};

FinderComponent.defaultProps = {
    allowedLocations: [],
    allowContainersOnly: false,
    isVisible: true,
};

export default FinderComponent;
