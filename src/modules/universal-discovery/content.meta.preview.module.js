import React, { useContext, useMemo, useState, useEffect } from 'react';

import Icon from '../common/icon/icon';
import Thumbnail from '../common/thumbnail/thumbnail';

import { addBookmark, removeBookmark, createDraft } from './services/universal.discovery.service';
import {
    MarkedLocationContext,
    LoadedLocationsMapContext,
    ContentTypesMapContext,
    RestInfoContext,
    AllowContentEditContext,
} from './universal.discovery.module';

const ContentMetaPreview = () => {
    const [markedLocation, setMarkedLocation] = useContext(MarkedLocationContext);
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const contentTypesMap = useContext(ContentTypesMapContext);
    const restInfo = useContext(RestInfoContext);
    const allowContentEdit = useContext(AllowContentEditContext);
    const { formatShortDateTime } = window.eZ.helpers.timezone;
    const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
    const locationData = useMemo(() => {
        return (
            loadedLocationsMap.find((loadedLocation) => loadedLocation.parentLocationId === markedLocation) ||
            (loadedLocationsMap.length &&
                loadedLocationsMap[loadedLocationsMap.length - 1].subitems.find((subitem) => subitem.location.id === markedLocation))
        );
    }, [markedLocation, loadedLocationsMap]);

    useEffect(() => {
        setIsLanguageSelectorOpen(false);
    }, [markedLocation]);

    if (!locationData || !locationData.location || !locationData.version || markedLocation === 1) {
        return null;
    }

    const { bookmarked, location, version } = locationData;
    const bookmarkIconName = bookmarked ? 'bookmark-active' : 'bookmark';
    const toggleBookmarked = () => {
        const toggleBookmark = bookmarked ? removeBookmark : addBookmark;

        toggleBookmark({ ...restInfo, locationId: location.id }, () => {
            dispatchLoadedLocationsAction({ type: 'UPDATE_LOCATIONS', data: { ...locationData, bookmarked: !bookmarked } });
        });
    };
    const redirectToContentEdit = (contentId, versionNo, language, locationId) => {
        window.location.href = window.Routing.generate(
            'ezplatform.content.draft.edit',
            {
                contentId,
                versionNo,
                language,
                locationId,
            },
            true
        );
    };
    const editContent = (languageCode) => {
        const contentId = location.ContentInfo.Content._id;

        createDraft(
            {
                ...restInfo,
                contentId,
            },
            (response) => redirectToContentEdit(contentId, response.Version.VersionInfo.versionNo, languageCode, location.id)
        );
    };
    const previewContent = () => {
        window.location.href = window.Routing.generate('_ezpublishLocation', { locationId: location.id }, true);
    };
    const selectLanguage = () => {
        const languageCodes = version.VersionInfo.languageCodes.split(',');

        if (languageCodes.length === 1) {
            editContent(languageCodes[0]);
        } else {
            setIsLanguageSelectorOpen(true);
        }
    };
    const hideLanguageSelector = () => {
        setIsLanguageSelectorOpen(false);
    };
    const renderLanguageSelector = () => {
        if (!isLanguageSelectorOpen) {
            return null;
        }

        const languageCodes = version.VersionInfo.languageCodes.split(',');
        const editTranslationLabel = Translator.trans(
            /*@Desc("Edit translation")*/ 'meta_preview.edit_translation',
            {},
            'universal_discovery_widget'
        );

        return (
            <div className="c-content-meta-preview__language-selector">
                <div className="c-content-meta-preview__language-selector-header">
                    <button className="c-content-meta-preview__close-button btn" onClick={hideLanguageSelector}>
                        <Icon name="discard" extraClasses="ez-icon--small" />
                    </button>
                    <span className="c-content-meta-preview__title">{`${editTranslationLabel} (${languageCodes.length})`}</span>
                </div>
                <div className="c-content-meta-preview__languages-wrapper">
                    {languageCodes.map((languageCode) => (
                        <div key={languageCode} className="c-content-meta-preview__language" onClick={editContent.bind(this, languageCode)}>
                            {window.eZ.adminUiConfig.languages.mappings[languageCode].name}
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    const renderActions = () => {
        if (!allowContentEdit) {
            return null;
        }

        return (
            <div className="c-content-meta-preview__actions">
                <button className="c-content-meta-preview__edit-button btn btn-primary" onClick={selectLanguage}>
                    <Icon name="edit" extraClasses="ez-icon--light ez-icon--small-medium" />
                </button>
                <button className="c-content-meta-preview__preview-button btn" onClick={previewContent}>
                    <Icon name="view" extraClasses="ez-icon--secondary" />
                </button>
            </div>
        );
    };
    const lastModifiedLabel = Translator.trans(/*@Desc("Last Modified")*/ 'meta_preview.last_modified', {}, 'universal_discovery_widget');
    const creationDateLabel = Translator.trans(/*@Desc("Creation Date")*/ 'meta_preview.creation_date', {}, 'universal_discovery_widget');
    const translationsLabel = Translator.trans(/*@Desc("Translations")*/ 'meta_preview.translations', {}, 'universal_discovery_widget');

    return (
        <div className="c-content-meta-preview">
            {renderLanguageSelector()}
            <div className="c-content-meta-preview__preview">
                <Thumbnail thumbnailData={version.Thumbnail} iconExtraClasses="ez-icon--extra-large" />
            </div>
            <div className="c-content-meta-preview__header">
                <span className="c-content-meta-preview__content-name">{location.ContentInfo.Content.Name}</span>
                <button className="c-content-meta-preview__toggle-bookmark-button" onClick={toggleBookmarked}>
                    <Icon name={bookmarkIconName} extraClasses="ez-icon--small ez-icon--secondary" />
                </button>
            </div>
            {renderActions()}
            <div className="c-content-meta-preview__info">
                <div className="c-content-meta-preview__content-type-name">
                    {contentTypesMap[location.ContentInfo.Content.ContentType._href].name}
                </div>
                <div className="c-content-meta-preview__details">
                    <div className="c-content-meta-preview__details-item">
                        <span>{lastModifiedLabel}</span>
                        <span>{formatShortDateTime(new Date(location.ContentInfo.Content.lastModificationDate))}</span>
                    </div>
                    <div className="c-content-meta-preview__details-item">
                        <span>{creationDateLabel}</span>
                        <span>{formatShortDateTime(new Date(location.ContentInfo.Content.publishedDate))}</span>
                    </div>
                    <div className="c-content-meta-preview__details-item">
                        <span>{translationsLabel}</span>
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
