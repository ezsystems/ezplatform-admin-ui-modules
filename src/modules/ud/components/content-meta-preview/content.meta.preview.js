import React, { useContext, useMemo } from 'react';

import { MarkedLocationContext, LoadedLocationsMapContext, ContentTypesMapContext } from '../../universal.discovery.module';

const ContentMetaPreview = () => {
    const [markedLocation, setMarkedLocation] = useContext(MarkedLocationContext);
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const contentTypesMap = useContext(ContentTypesMapContext);
    const { formatShortDateTime } = window.eZ.helpers.timezone;
    const location = useMemo(() => {
        return loadedLocationsMap.reduce((item, loadedLocation) => {
            return item || loadedLocation.items.find((childrenLocation) => childrenLocation.id === markedLocation);
        }, null);
    }, [markedLocation, loadedLocationsMap]);

    if (!location) {
        return null;
    }

    return (
        <div className="c-content-meta-preview">
            <div className="c-content-meta-preview__preview"></div>
            <div className="c-content-meta-preview__header">{location.ContentInfo.Content.Name}</div>
            <div className="c-content-meta-preview__info">
                <div className="c-content-meta-preview__content-type-name">
                    {contentTypesMap[location.ContentInfo.Content.ContentType._href].name}
                </div>
                <div className="c-content-meta-preview__details">
                    <div className="c-content-meta-preview__details-item">
                        <span>Last Modified</span>
                        <span>{formatShortDateTime(new Date(location.ContentInfo.Content.lastModificationDate))}</span>
                    </div>
                    <div className="c-content-meta-preview__details-item">
                        <span>Creation Date</span>
                        <span>{formatShortDateTime(new Date(location.ContentInfo.Content.publishedDate))}</span>
                    </div>
                    <div className="c-content-meta-preview__details-item">
                        <span>Translations</span>
                        <span>{location.ContentInfo.Content.mainLanguageCode}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentMetaPreview;
