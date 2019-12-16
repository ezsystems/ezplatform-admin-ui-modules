import React, { useContext, useState, Fragment } from 'react';

import Icon from '../../../common/icon/icon';
import SelectedLocationsItem from './selected.locations.item';
import { createCssClassNames } from '../../../common/helpers/css.class.names';

import { SelectedLocationsContext, ConfirmContext } from '../../universal.discovery.module';

const SelectedLocations = () => {
    const [selectedLocations, dispatchSelectedLocationsAction] = useContext(SelectedLocationsContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const onConfirm = useContext(ConfirmContext);
    const className = createCssClassNames({
        'c-selected-locations': true,
        'c-selected-locations--expanded': isExpanded,
    });
    const clearSelection = () => {
        dispatchSelectedLocationsAction({ type: 'CLEAR_SELECTED_LOCATIONS' });
    };
    const confirmSelection = () => {
        onConfirm(selectedLocations);
    };
    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };
    const renderSelectionCounter = () => {
        return (
            <div className="c-selected-locations__selection-counter">
                <span className="c-selected-locations__selection-count">{selectedLocations.length}</span>
                <span className="c-selected-locations__selection-count-label">selected</span>
            </div>
        );
    };
    const renderToggleButton = () => {
        const iconName = isExpanded ? 'caret-next' : 'caret-back';

        return (
            <button type="button" className="c-selected-locations__toggle-button" onClick={toggleExpanded}>
                <Icon name={iconName} extraClasses="ez-icon--medium" />
            </button>
        );
    };
    const renderActionButtons = () => {
        return (
            <Fragment>
                <button type="button" className="c-selected-locations__confirm-button" onClick={confirmSelection}>
                    <Icon name="checkmark" extraClasses="ez-icon--medium ez-icon--light" />
                </button>
                <button type="button" className="c-selected-locations__clear-selection-button" onClick={clearSelection}>
                    <Icon name="circle-close" extraClasses="ez-icon--medium ez-icon--light" />
                </button>
            </Fragment>
        );
    };
    const renderLocationsList = () => {
        if (!isExpanded) {
            return null;
        }

        return (
            <div className="c-selected-locations__items-wrapper">
                {selectedLocations.map((selectedLocation) => (
                    <SelectedLocationsItem key={selectedLocation.id} location={selectedLocation} />
                ))}
            </div>
        );
    };

    return (
        <div className={className}>
            <div className="c-selected-locations__header">
                <div className="c-selected-locations__actions-wrapper">
                    {renderToggleButton()}
                    {!isExpanded && renderActionButtons()}
                    {isExpanded && renderSelectionCounter()}
                    {isExpanded && renderActionButtons()}
                </div>
                {!isExpanded && renderSelectionCounter()}
            </div>
            {renderLocationsList()}
        </div>
    );
};

export default SelectedLocations;
