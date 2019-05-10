import React from 'react';
import PropTypes from 'prop-types';
import ContentImagePreviewComponent from './content.image.preview.component';
import BookmarkIconComponent from './bookmark.icon.component';
import ContentTypeIconComponent from './content.type.icon.component';

const TEXT_LAST_MODIFIED = Translator.trans(
    /*@Desc("Last modified")*/ 'content_meta_preview.last_modified.label',
    {},
    'universal_discovery_widget'
);
const TEXT_CREATION_DATE = Translator.trans(
    /*@Desc("Creation date")*/ 'content_meta_preview.creation_date.label',
    {},
    'universal_discovery_widget'
);
const TEXT_TRANSLATIONS = Translator.trans(
    /*@Desc("Translations")*/ 'content_meta_preview.translations.label',
    {},
    'universal_discovery_widget'
);
const TEXT_CONTAINER_TITLE = Translator.trans(
    /*@Desc("Content Meta Preview")*/ 'content_meta_preview.title',
    {},
    'universal_discovery_widget'
);
const getTranslations = (location) => {
    if (!location || !location.CurrentVersion) {
        return [];
    }

    const languages = window.eZ.adminUiConfig.languages;
    const version = location.CurrentVersion.Version;
    const versionLanguages = version.VersionInfo.VersionTranslationInfo.Language;

    return versionLanguages.map((language) => languages.mappings[language.languageCode].name);
};

const ContentMetaPreviewComponent = ({ location, maxHeight, isVisible }) => {
    if (!isVisible) {
        return null;
    }

    const renderTranslation = (translation, index) => {
        return (
            <span key={index} className="c-meta-preview__translation">
                {translation}
            </span>
        );
    };
    const content = location.ContentInfo.Content;
    let contentTypeIdentifier = null;
    let contentTypeName = '';

    if (content.ContentTypeInfo) {
        contentTypeIdentifier = content.ContentTypeInfo.identifier;
        contentTypeName = window.eZ.adminUiConfig.contentTypeNames[contentTypeIdentifier];
    }

    const { formatShortDateTime } = window.eZ.helpers.timezone;
    const translations = getTranslations(location);
    const version = location.CurrentVersion ? location.CurrentVersion.Version : null;

    return (
        <div className="c-meta-preview__wrapper" style={{ maxHeight: `${maxHeight}px` }}>
            <h3 className="c-meta-preview__title">{TEXT_CONTAINER_TITLE}</h3>
            <div className="c-meta-preview">
                <div className="c-meta-preview__top-wrapper">
                    <div className="c-meta-preview__content-type">
                        <ContentTypeIconComponent identifier={contentTypeIdentifier} /> {contentTypeName}
                    </div>
                    <BookmarkIconComponent locationId={location.id} />
                </div>
                <div className="c-meta-preview__meta-wrapper">
                    <div className="c-meta-preview__image-wrapper">
                        <ContentImagePreviewComponent version={version} />
                    </div>
                    <div className="c-meta-preview__name">{content.Name}</div>
                    <div className="c-meta-preview__content-info">
                        <h3 className="c-meta-preview__subtitle">{TEXT_LAST_MODIFIED}:</h3>
                        {formatShortDateTime(new Date(content.lastModificationDate))}
                    </div>
                    <div className="c-meta-preview__content-info">
                        <h3 className="c-meta-preview__subtitle">{TEXT_CREATION_DATE}:</h3>
                        {formatShortDateTime(new Date(content.publishedDate))}
                    </div>
                    <div className="c-meta-preview__content-info">
                        <h3 className="c-meta-preview__subtitle">{TEXT_TRANSLATIONS}:</h3>
                        {translations.map(renderTranslation)}
                    </div>
                </div>
            </div>
        </div>
    );
};

ContentMetaPreviewComponent.propTypes = {
    location: PropTypes.object.isRequired,
    maxHeight: PropTypes.number.isRequired,
    isVisible: PropTypes.bool,
};

ContentMetaPreviewComponent.defaultProps = {
    isVisible: false,
};

export default ContentMetaPreviewComponent;
