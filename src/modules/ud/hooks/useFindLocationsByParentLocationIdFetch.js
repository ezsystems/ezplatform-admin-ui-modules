import { useEffect, useContext, useReducer } from 'react';

import { findLocationsByParentLocationId } from '../services/universal.discovery.service';
import { RestInfoContext } from '../universal.discovery.module';

const fetchInitialState = {
    dataFetched: false,
    data: {},
};

const fetchReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_START':
            return fetchInitialState;
        case 'FETCH_END':
            return { data: action.data, dataFetched: true };
        default:
            throw new Error();
    }
};

export const useFindLocationsByParentLocationIdFetch = (locationData, sortClauses) => {
    const restInfo = useContext(RestInfoContext);
    const [state, dispatch] = useReducer(fetchReducer, fetchInitialState);

    useEffect(() => {
        let effectCleaned = false;

        dispatch({ type: 'FETCH_START' });
        findLocationsByParentLocationId(
            {
                ...restInfo,
                parentLocationId: locationData.parentLocationId,
                sortClauses,
            },
            (response) => {
                if (effectCleaned) {
                    return;
                }

                dispatch({ type: 'FETCH_END', data: response });
            }
        );

        return () => {
            effectCleaned = true;
        };
    }, [restInfo, sortClauses, locationData.parentLocationId, locationData.items.length]);

    return [state.data, !state.dataFetched];
};
