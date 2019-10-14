import React, { useContext, useState, useEffect } from 'react';

import GridViewItem from './grid.view.item';

import { useFindLocationsByParentLocationIdFetch } from '../../hooks/useFindLocationsByParentLocationIdFetch';
import { SORTING_OPTIONS, LoadedLocationsMapContext, SortingContext } from '../../universal.discovery.module';

// @TODO
const HARDCODED_LIMIT = 50;

const SCROLL_OFFSET = 200;

const GridView = () => {
    const [offset, setOffset] = useState(0);
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const [sorting, setSorting] = useContext(SortingContext);
    const sortingOptions = SORTING_OPTIONS.find((option) => option.id === sorting);
    const locationData = loadedLocationsMap.length ? loadedLocationsMap[loadedLocationsMap.length - 1] : { subitems: [] };
    const [loadedLocations, isLoading] = useFindLocationsByParentLocationIdFetch(
        locationData,
        sortingOptions,
        HARDCODED_LIMIT,
        offset,
        true
    );
    const loadMore = ({ target }) => {
        const areAllItemsLoaded = loadedLocations.location && locationData.subitems.length >= loadedLocations.location.childCount;
        const isOffsetReached = target.scrollHeight - target.clientHeight - target.scrollTop < SCROLL_OFFSET;

        if (areAllItemsLoaded || !isOffsetReached || isLoading) {
            return;
        }

        setOffset(offset + HARDCODED_LIMIT);
    };
    const goUp = () => {
        const locationId = loadedLocationsMap[loadedLocationsMap.length - 2].parentLocationId;

        dispatchLoadedLocationsAction({ type: 'CUT_LOCATIONS', locationId });
    };
    const renderGoUp = () => {
        if (loadedLocationsMap.length <= 1) {
            return null;
        }

        return (
            <div className="c-grid__go-up" onDoubleClick={goUp}>
                GO UP
            </div>
        );
    };
    const renderItem = (itemData) => {
        if (!itemData.version) {
            return null;
        }

        return <GridViewItem key={itemData.location.id} location={itemData.location} version={itemData.version} />;
    };

    useEffect(() => {
        if (isLoading || !loadedLocations.subitems) {
            return;
        }

        const data = { ...locationData, ...loadedLocations, subitems: [...locationData.subitems, ...loadedLocations.subitems] };

        dispatchLoadedLocationsAction({ type: 'UPDATE_LOCATIONS', data });
    }, [loadedLocations, dispatchLoadedLocationsAction, isLoading]);

    return (
        <div className="c-grid" onScroll={loadMore}>
            {renderGoUp()}
            {locationData.subitems.map(renderItem)}
        </div>
    );
};

export default GridView;
