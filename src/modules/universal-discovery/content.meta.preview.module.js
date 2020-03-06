import React, { useContext, useMemo, useState, useEffect } from 'react';

import Icon from '../common/icon/icon';
import Thumbnail from '../common/thumbnail/thumbnail';
import TranslationSelector from './components/translation-selector/translation.selector';

import { addBookmark, removeBookmark, createDraft } from './services/universal.discovery.service';
import {
    MarkedLocationIdContext,
    LoadedLocationsMapContext,
    ContentTypesMapContext,
    RestInfoContext,
    AllowRedirectsContext,
    EditOnTheFlyDataContext,
    ActiveTabContext,
} from './universal.discovery.module';

const ContentMetaPreview = () => {
    const [markedLocationId, setMarkedLocationId] = useContext(MarkedLocationIdContext);
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const contentTypesMap = useContext(ContentTypesMapContext);
    const restInfo = useContext(RestInfoContext);
    const allowRedirects = useContext(AllowRedirectsContext);
    const [editOnTheFlyData, setEditOnTheFlyData] = useContext(EditOnTheFlyDataContext);
    const [activeTab, setActiveTab] = useContext(ActiveTabContext);
    const { formatShortDateTime } = window.eZ.helpers.timezone;
    const [isTranslationSelectorOpen, setIsTranslationSelectorOpen] = useState(false);
    const locationData = useMemo(() => {
        return (
            loadedLocationsMap.find((loadedLocation) => loadedLocation.parentLocationId === markedLocationId) ||
            (loadedLocationsMap.length &&
                loadedLocationsMap[loadedLocationsMap.length - 1].subitems.find((subitem) => subitem.location.id === markedLocationId))
        );
    }, [markedLocationId, loadedLocationsMap]);

    useEffect(() => {
        setIsTranslationSelectorOpen(false);
    }, [markedLocationId]);

    if (!locationData || !locationData.location || !locationData.version || markedLocationId === 1) {
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
        if (allowRedirects) {
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

            return;
        }

        setEditOnTheFlyData({
            contentId,
            versionNo,
            languageCode: language,
            locationId,
        });
        setActiveTab('content-edit');
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
        window.location.href = window.Routing.generate(
            '_ez_content_view',
            { contentId: location.ContentInfo.Content._id, locationId: location.id },
            true
        );
    };
    const selectLanguage = () => {
        const languageCodes = version.VersionInfo.languageCodes.split(',');

        if (languageCodes.length === 1) {
            editContent(languageCodes[0]);
        } else {
            setIsTranslationSelectorOpen(true);
        }
    };
    const hideTranslationSelector = () => {
        setIsTranslationSelectorOpen(false);
    };
    const renderTranslationSelector = () => {
        return (
            <TranslationSelector
                hideTranslationSelector={hideTranslationSelector}
                selectTranslation={editContent}
                version={version}
                isOpen={isTranslationSelectorOpen}
            />
        );
    };
    const renderActions = () => {
        const previewButton = allowRedirects ? (
            <button className="c-content-meta-preview__preview-button btn" onClick={previewContent}>
                <Icon name="view" extraClasses="ez-icon--secondary" />
            </button>
        ) : null;

        return (
            <div className="c-content-meta-preview__actions">
                <button className="c-content-meta-preview__edit-button btn btn-primary" onClick={selectLanguage}>
                    <Icon name="edit" extraClasses="ez-icon--light ez-icon--small-medium" />
                </button>
                {previewButton}
            </div>
        );
    };
    const lastModifiedLabel = Translator.trans(/*@Desc("Last Modified")*/ 'meta_preview.last_modified', {}, 'universal_discovery_widget');
    const creationDateLabel = Translator.trans(/*@Desc("Creation Date")*/ 'meta_preview.creation_date', {}, 'universal_discovery_widget');
    const translationsLabel = Translator.trans(/*@Desc("Translations")*/ 'meta_preview.translations', {}, 'universal_discovery_widget');

    return (
        <div className="c-content-meta-preview">
            {renderTranslationSelector()}
            <div className="c-content-meta-preview__preview">
                <Thumbnail thumbnailData={version.Thumbnail} iconExtraClasses="ez-icon--extra-large" />
            </div>
            <div className="c-content-meta-preview__header">
                <span className="c-content-meta-preview__content-name">{location.ContentInfo.Content.TranslatedName}</span>
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
