import React, { useContext, useState, useMemo, useEffect, useCallback } from 'react';

import Icon from '../../../common/icon/icon';

import { createCssClassNames } from '../../../common/helpers/css.class.names';
import { LoadedLocationsMapContext } from '../../universal.discovery.module';

const Breadcrumbs = () => {
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const [hiddenListVisible, setHiddenListVisible] = useState(false);
    const { visibleItems, hiddenItems } = useMemo(() => {
        return loadedLocationsMap.reduce(
            (splittedItems, loadedLocation, index) => {
                if (loadedLocationsMap.length - 3 <= index) {
                    splittedItems.visibleItems.push(loadedLocation);
                } else {
                    splittedItems.hiddenItems.push(loadedLocation);
                }

                return splittedItems;
            },
            { visibleItems: [], hiddenItems: [] }
        );
    }, [loadedLocationsMap]);
    const goToLocation = (locationId) => {
        dispatchLoadedLocationsAction({ type: 'CUT_LOCATIONS', locationId });
    };
    const toggleHiddenListVisible = useCallback(() => {
        setHiddenListVisible(!hiddenListVisible);
    }, [setHiddenListVisible, hiddenListVisible]);
    const renderHiddenList = () => {
        if (!hiddenItems.length) {
            return null;
        }

        const hiddenListClassNames = createCssClassNames({
            'c-breadcrumbs__hidden-list': true,
            'c-breadcrumbs__hidden-list--visible': hiddenListVisible,
        });
        const toggletClassNames = createCssClassNames({
            'c-breadcrumbs__hidden-list-toggler': true,
            'c-breadcrumbs__hidden-list-toggler--active': hiddenListVisible,
        });

        return (
            <div className="c-breadcrumbs__hidden-list-wrapper">
                <button className={toggletClassNames} onClick={toggleHiddenListVisible}>
                    <Icon name="options" extraClasses="ez-icon--small-medium" />
                </button>
                <ul className={hiddenListClassNames}>
                    {hiddenItems.map((item) => {
                        const onClickHandler = goToLocation.bind(this, item.location.id);

                        return (
                            <li key={item.location.id} onClick={onClickHandler} className="c-breadcrumbs__hidden-list-item">
                                {item.location.ContentInfo.Content.Name}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };
    const renderSeparator = () => {
        return <span className="c-breadcrumbs__list-item-separator">/</span>;
    };

    useEffect(() => {
        if (hiddenListVisible) {
            window.document.body.addEventListener('click', toggleHiddenListVisible, false);
        } else {
            window.document.body.removeEventListener('click', toggleHiddenListVisible, false);
        }

        return () => window.document.body.removeEventListener('click', toggleHiddenListVisible, false);
    }, [hiddenListVisible, toggleHiddenListVisible]);

    return (
        <div className="c-breadcrumbs">
            {renderHiddenList()}
            <div className="c-breadcrumbs__list-wrapper">
                <ul className="c-breadcrumbs__list">
                    {visibleItems.map((item, index) => {
                        if (!item.location) {
                            return null;
                        }

                        const isLast = index === visibleItems.length - 1;
                        const onClickHandler = goToLocation.bind(this, item.location.id);
                        const className = createCssClassNames({
                            'c-breadcrumbs__list-item': true,
                            'c-breadcrumbs__list-item--last': isLast,
                        });

                        return (
                            <li key={item.location.id} onClick={onClickHandler} className={className}>
                                <span className="c-breadcrumbs__list-item-text">{item.location.ContentInfo.Content.Name}</span>
                                {!isLast && renderSeparator()}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Breadcrumbs;
