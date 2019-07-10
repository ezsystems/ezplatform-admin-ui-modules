import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import FinderLeaf from './finder.leaf';

import { useFindLocationsByParentLocationIdFetch } from '../../hooks/useFindLocationsByParentLocationIdFetch';
import { LoadedLocationsMapContext, SortingContext, SORTING_OPTIONS } from '../../universal.discovery.module';

const FinderBranch = ({ locationData }) => {
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const [sorting, setSorting] = useContext(SortingContext);
    const sortClauses = SORTING_OPTIONS.find((option) => option.id === sorting).sortClauses;
    const [loadedLocations, isLoading] = useFindLocationsByParentLocationIdFetch(locationData, sortClauses);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        dispatchLoadedLocationsAction({ type: 'UPDATE_LOCATIONS', data: loadedLocations });
    }, [loadedLocations, dispatchLoadedLocationsAction, isLoading]);

    if (!locationData.items.length) {
        return null;
    }

    return (
        <div className="c-finder-branch">
            {locationData.items.map((item) => (
                <FinderLeaf key={item.id} location={item} />
            ))}
        </div>
    );
};

FinderBranch.propTypes = {
    locationData: PropTypes.shape({
        parentLocationId: PropTypes.number.isRequired,
        offset: PropTypes.number.isRequired,
        items: PropTypes.array.isRequired,
    }).isRequired,
};

export default FinderBranch;
