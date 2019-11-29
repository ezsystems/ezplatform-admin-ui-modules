import React, { useContext, useMemo } from 'react';

import Icon from '../common/icon/icon';

import { addBookmark, removeBookmark } from './services/universal.discovery.service';
import { MarkedLocationContext, LoadedLocationsMapContext, ContentTypesMapContext, RestInfoContext } from './universal.discovery.module';

const ContentMetaPreview = () => {
    const [markedLocation, setMarkedLocation] = useContext(MarkedLocationContext);
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const contentTypesMap = useContext(ContentTypesMapContext);
    const restInfo = useContext(RestInfoContext);
    const { formatShortDateTime } = window.eZ.helpers.timezone;
    const locationData = useMemo(() => {
        return loadedLocationsMap.find((loadedLocation) => loadedLocation.parentLocationId === markedLocation);
    }, [markedLocation, loadedLocationsMap]);

    if (!locationData || !locationData.location) {
        return null;
    }

    const { bookmarked, location, version } = locationData;
    const bookmarkIconName = bookmarked ? 'bookmark-active' : 'bookmark';
    const toggleBookmarked = () => {
        const toggleBookmark = bookmarked ? removeBookmark : addBookmark;

        toggleBookmark({ ...restInfo, locationId: location.id }, (response) => {
            dispatchLoadedLocationsAction({ type: 'UPDATE_LOCATIONS', data: { ...locationData, bookmarked: !bookmarked } });
        });
    };
    const renderPreview = () => {
        if (!version.Thumbnail) {
            return (
                <Icon
                    extraClasses="ez-icon--extra-large"
                    customPath={contentTypesMap[location.ContentInfo.Content.ContentType._href].thumbnail}
                />
            );
        }

        return <img src={version.Thumbnail} />;
    };

    return (
        <div className="c-content-meta-preview">
            <div className="c-content-meta-preview__preview">{renderPreview()}</div>
            <div className="c-content-meta-preview__header">
                <span className="c-content-meta-preview__content-name">{location.ContentInfo.Content.Name}</span>
                <button className="c-content-meta-preview__toggle-bookmark-button" onClick={toggleBookmarked}>
                    <Icon name={bookmarkIconName} extraClasses="ez-icon--small ez-icon--secondary" />
                </button>
            </div>
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
                        <div className="c-content-meta-preview__translations-wrapper">
                            {version.VersionInfo.languageCodes.split(',').map((languageCode) => {
                                return (
                                    <span key={languageCode} className="c-content-meta-preview__translation">
                                        {window.eZ.adminUiConfig.languages.mappings[languageCode].name}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

eZ.addConfig('adminUiConfig.universalDiscoveryWidget.contentMetaPreview', ContentMetaPreview);

export default ContentMetaPreview;
