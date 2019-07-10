import React, { useContext } from 'react';

import FinderBranch from './finder.branch';

import { LoadedLocationsMapContext } from '../../universal.discovery.module';

const Finder = () => {
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);

    return (
        <div className="c-finder">
            {loadedLocationsMap.map((loadedLocation) => (
                <FinderBranch key={loadedLocation.parentLocationId} locationData={loadedLocation} />
            ))}
        </div>
    );
};

export default Finder;
