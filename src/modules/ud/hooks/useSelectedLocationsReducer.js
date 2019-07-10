import { useReducer } from 'react';

const initialState = [];

const selectedLocationsReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_SELECTED_LOCATION':
            return [...state, action.location];
        case 'REMOVE_SELECTED_LOCATION':
            return state.filter((location) => location.id !== action.id);
        case 'CLEAR_SELECTED_LOCATIONS':
            return [];
        default:
            throw new Error();
    }
};

export const useSelectedLocationsReducer = (state = initialState) => {
    const [selectedLocations, dispatchSelectedLocationsAction] = useReducer(selectedLocationsReducer, state);

    return [selectedLocations, dispatchSelectedLocationsAction];
};
