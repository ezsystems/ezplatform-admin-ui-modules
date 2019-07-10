import React, { useContext, useEffect } from 'react';

import GridViewItem from './grid.view.item';

import { useFindLocationsByParentLocationIdFetch } from '../../hooks/useFindLocationsByParentLocationIdFetch';
import { SORTING_OPTIONS, LoadedLocationsMapContext, SortingContext } from '../../universal.discovery.module';

const GridView = () => {
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const [sorting, setSorting] = useContext(SortingContext);
    const sortClauses = SORTING_OPTIONS.find((option) => option.id === sorting).sortClauses;
    const locationData = loadedLocationsMap[loadedLocationsMap.length - 1];
    const [loadedLocations, isLoading] = useFindLocationsByParentLocationIdFetch(locationData, sortClauses);
    const goUp = () => {
        const locationId = loadedLocationsMap[loadedLocationsMap.length - 2].parentLocationId;

        dispatchLoadedLocationsAction({ type: 'CUT_LOCATIONS', locationId });
    };
    const renderGoUp = () => {
        if (loadedLocationsMap.length === 1) {
            return null;
        }

        return (
            <div className="c-grid__go-up" onDoubleClick={goUp}>
                GO UP
            </div>
        );
    };

    useEffect(() => {
        if (isLoading) {
            return;
        }

        dispatchLoadedLocationsAction({ type: 'UPDATE_LOCATIONS', data: loadedLocations });
    }, [loadedLocations, dispatchLoadedLocationsAction, isLoading]);

    return (
        <div className="c-grid">
            {renderGoUp()}
            {locationData.items.map((loadedLocation) => (
                <GridViewItem key={loadedLocation.id} location={loadedLocation} />
            ))}
        </div>
    );
};

export default GridView;
