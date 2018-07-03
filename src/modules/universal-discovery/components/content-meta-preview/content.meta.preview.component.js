import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import './css/content.meta.preview.component.css';
import { addBookmark, removeBookmark } from '../../services/bookmark.service';
import { showErrorNotification } from '../../../common/services/notification.service';
import { TAB_CREATE } from '../../universal.discovery.module';

export default class ContentMetaPreviewComponent extends Component {
    constructor(props) {
        super(props);

        this.state = { imageUri: '', translations: [], selectContentEnabled: false };

        this.toggleBookmark = this.toggleBookmark.bind(this);
        this.toggleEnabledState = this.toggleEnabledState.bind(this);
        this.checkCanSelectContent = this.checkCanSelectContent.bind(this);
    }

    componentDidMount() {
        this.checkCanSelectContent();
    }

    componentDidUpdate() {
        this.checkCanSelectContent();
    }

    checkCanSelectContent() {
        const { data, canSelectContent } = this.props;

        canSelectContent(data, this.toggleEnabledState);
    }

    /**
     * Toggles the enabled state on select content button
     *
     * @method toggleEnabledState
     * @param {Boolean} disabled The disabled state
     * @memberof ContentMetaPreviewComponent
     */
    toggleEnabledState(selectContentEnabled) {
        if (this.state.selectContentEnabled === selectContentEnabled) {
            return;
        }

        this.setState((state) => ({ ...state, selectContentEnabled }));
    }

    /**
     * Renders a select content button
     *
     * @method renderSelectContentBtn
     * @returns {Element}
     * @memberof ContentMetaPreviewComponent
     */
    renderSelectContentBtn() {
        if (this.props.activeTab === TAB_CREATE) {
            return null;
        }

        const { onSelectContent, labels, ready } = this.props;
        const attrs = { className: 'c-meta-preview__btn--select', onClick: onSelectContent };

        if (!this.state.selectContentEnabled || !ready) {
            attrs.disabled = true;
        }

        return (
            <div className="c-meta-preview__btn-wrapper">
                <button {...attrs}>{labels.selectContent}</button>
            </div>
        );
    }

    /**
     * Renders an icon related to a content type
     *
     * @method renderIcon
     * @returns {Element}
     * @memberof ContentMetaPreviewComponent
     */
    renderIcon() {
        const contentTypeInfo = this.props.data.ContentInfo.Content.ContentTypeInfo;

        if (!contentTypeInfo) {
            return null;
        }

        return (
            <svg className="ez-icon c-meta-preview__icon">
                <use xlinkHref={`/bundles/ezplatformadminui/img/ez-icons.svg#${contentTypeInfo.identifier}`} />
            </svg>
        );
    }

    /**
     * Gets image URI to image preview from content meta
     *
     * @method getImageUri
     * @returns {String}
     * @memberof ContentMetaPreviewComponent
     */
    getImageUri(data) {
        if (!data || !data.CurrentVersion) {
            return '';
        }

        const version = data.CurrentVersion.Version;
        const imageField = version.Fields.field.find((field) => field.fieldTypeIdentifier === 'ezimage');

        return imageField && imageField.fieldValue ? imageField.fieldValue.uri : '';
    }

    /**
     * Gets list of translations from content meta
     *
     * @method getTranslations
     * @returns {Array}
     * @memberof ContentMetaPreviewComponent
     */
    getTranslations(data) {
        if (!data || !data.CurrentVersion) {
            return [];
        }

        const version = data.CurrentVersion.Version;
        const versionLanguages = version.VersionInfo.VersionTranslationInfo.Language;

        return versionLanguages.map((langauge) => this.props.languages.mappings[langauge.languageCode].name);
    }

    /**
     * Renders a translation item
     *
     * @method renderTranslation
     * @returns {Element}
     * @memberof ContentMetaPreviewComponent
     */
    renderTranslation(translation, index) {
        return (
            <span key={index} className="c-meta-preview__translation">
                {translation}
            </span>
        );
    }

    /**
     * Renders image preview
     *
     * @method renderImagePreview
     * @returns {Element}
     * @memberof ContentMetaPreviewComponent
     */
    renderImagePreview() {
        const { data, labels } = this.props;

        if (!data.CurrentVersion) {
            return (
                <svg className="c-meta-preview__loading-spinner ez-icon ez-spin ez-icon-x2 ez-icon-spinner">
                    <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#spinner" />
                </svg>
            );
        }

        const imageUri = this.getImageUri(data);

        if (!imageUri.length) {
            return <Fragment>{labels.imagePreviewNotAvailable}</Fragment>;
        }

        return <img className="c-meta-preview__image" src={imageUri} alt="" />;
    }

    /**
     * Removes or adds bookmark depending on if it exists or not
     *
     * @method toggleBookmark
     * @memberof ContentMetaPreviewComponent
     */
    toggleBookmark() {
        const { onBookmarkRemoved, onBookmarkAdded, data, restInfo, bookmarked } = this.props;
        const toggleBookmark = bookmarked ? removeBookmark : addBookmark;
        const onBookmarkToggled = bookmarked ? onBookmarkRemoved : onBookmarkAdded;
        const locationId = data.id;
        const bookmarkToggled = new Promise((resolve) => toggleBookmark(restInfo, locationId, resolve));

        bookmarkToggled.then(() => onBookmarkToggled(data)).catch(showErrorNotification);
    }

    /**
     * Renders bookmark icon
     *
     * @method renderBookmarkIcon
     * @memberof ContentMetaPreviewComponent
     */
    renderBookmarkIcon() {
        const { bookmarked } = this.props;

        if (bookmarked === null) {
            return null;
        }

        const bookmarkIconId = bookmarked ? 'bookmark-active' : 'bookmark';
        const action = bookmarked ? 'remove' : 'add';
        const iconHref = `/bundles/ezplatformadminui/img/ez-icons.svg#${bookmarkIconId}`;
        const wrapperClassName = `ez-add-to-bookmarks__icon-wrapper ez-add-to-bookmarks__icon-wrapper--${action}`;

        return (
            <div className={wrapperClassName} onClick={this.toggleBookmark}>
                <svg className="ez-icon ez-icon--medium">
                    <use xlinkHref={iconHref} />
                </svg>
            </div>
        );
    }

    render() {
        const { labels, data, maxHeight } = this.props;
        const content = data.ContentInfo.Content;
        const contentTypeIdentifier = content.ContentTypeInfo.identifier;
        const contentTypeName = window.eZ.adminUiConfig.contentTypeNames[contentTypeIdentifier];
        const translations = this.getTranslations(data);

        return (
            <div className="c-meta-preview__wrapper">
                <h1 className="c-meta-preview__title">{labels.title}</h1>
                <div className="c-meta-preview" style={{ maxHeight: `${maxHeight - 64}px` }}>
                    <div className="c-meta-preview__top-wrapper">
                        <div className="c-meta-preview__content-type">
                            {this.renderIcon()} {contentTypeName}
                        </div>
                        <div className="c-meta-preview__content-bookmark">{this.renderBookmarkIcon()}</div>
                    </div>
                    <div className="c-meta-preview__meta-wrapper">
                        <div className="c-meta-preview__image-wrapper">{this.renderImagePreview()}</div>
                        <div className="c-meta-preview__name">{content.Name}</div>
                        {this.renderSelectContentBtn()}
                        <div className="c-meta-preview__content-info">
                            <h3 className="c-meta-preview__subtitle">{labels.lastModified}:</h3>
                            {new Date(content.lastModificationDate).toLocaleString()}
                        </div>
                        <div className="c-meta-preview__content-info">
                            <h3 className="c-meta-preview__subtitle">{labels.creationDate}:</h3>
                            {new Date(content.publishedDate).toLocaleString()}
                        </div>
                        <div className="c-meta-preview__content-info">
                            <h3 className="c-meta-preview__subtitle">{labels.translations}:</h3>
                            {translations.map(this.renderTranslation)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ContentMetaPreviewComponent.propTypes = {
    data: PropTypes.object.isRequired,
    bookmarked: PropTypes.bool,
    onSelectContent: PropTypes.func.isRequired,
    onBookmarkRemoved: PropTypes.func.isRequired,
    onBookmarkAdded: PropTypes.func.isRequired,
    canSelectContent: PropTypes.func.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
    labels: PropTypes.shape({
        title: PropTypes.string.isRequired,
        selectContent: PropTypes.string.isRequired,
        notAvailable: PropTypes.string.isRequired,
        creationDate: PropTypes.string.isRequired,
        lastModified: PropTypes.string.isRequired,
        translations: PropTypes.string.isRequired,
        imagePreviewNotAvailable: PropTypes.string.isRequired,
    }).isRequired,
    maxHeight: PropTypes.number.isRequired,
    activeTab: PropTypes.string.isRequired,
    languages: PropTypes.object.isRequired,
    ready: PropTypes.bool.isRequired,
};

ContentMetaPreviewComponent.defaultProps = {
    bookmarked: null,
};
