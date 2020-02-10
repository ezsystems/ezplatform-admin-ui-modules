import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import FinderBranch from './finder.branch';

import { LoadedLocationsMapContext } from '../../universal.discovery.module';

const Finder = ({ itemsPerPage }) => {
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);

    return (
        <div className="c-finder">
            {loadedLocationsMap.map((loadedLocation) => (
                <FinderBranch key={loadedLocation.parentLocationId} itemsPerPage={itemsPerPage} locationData={loadedLocation} />
            ))}
        </div>
    );
};

Finder.propTypes = {
    itemsPerPage: PropTypes.number,
};

Finder.defaultProps = {
    itemsPerPage: 50,
};

export default Finder;
