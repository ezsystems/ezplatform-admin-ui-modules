import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import './css/content.meta.preview.component.css';
import { checkIfBookmarked, addBookmark, removeBookmark } from '../../services/universal.discovery.service';
import { showErrorNotification } from '../../helpers/error.helper';
import { TAB_CREATE } from '../../universal.discovery.module';

export default class ContentMetaPreviewComponent extends Component {
    constructor() {
        super();

        this.state = {
            imageUri: '',
            translations: [],
            selectContentEnabled: false,
            bookmarked: null,
        };

        this.removeBookmark = this.removeBookmark.bind(this);
        this.addBookmark = this.addBookmark.bind(this);
        this.toggleEnabledState = this.toggleEnabledState.bind(this);
        this.setBookmarked = this.setBookmarked.bind(this);
    }

    componentWillReceiveProps(props) {
        const { id } = props.data;
        const translations = this.getTranslations(props.data);
        const imageUri = this.getImageUri(props.data);

        this.setState((state) => ({ ...state, translations, imageUri, bookmarked: null }));

        this.checkIfBookmarked(id);
    }

    /**
     * Checks if content is bookmarked
     *
     * @method checkIfBookmarked
     * @param {String} contentPath
     * @memberof ContentMetaPreviewComponent
     */
    checkIfBookmarked(contentPath) {
        const { restInfo } = this.props;
        const promise = new Promise((resolve) => checkIfBookmarked(restInfo, contentPath, resolve));

        promise.then(this.setBookmarked).catch(showErrorNotification);
    }

    /**
     * Sets bookmarked flag
     *
     * @method setBookmarked
     * @param {boolean} bookmarked
     * @memberof ContentMetaPreviewComponent
     */
    setBookmarked(bookmarked) {
        this.setState((state) => ({
            ...state,
            bookmarked,
        }));
    }

    /**
     * Toggles the enabled state on select content button
     *
     * @method toggleEnabledState
     * @param {Boolean} disabled The disabled state
     * @memberof ContentMetaPreviewComponent
     */
    toggleEnabledState(enabled) {
        if (this.state.selectContentEnabled === enabled) {
            return;
        }

        this.setState((state) => ({ ...state, selectContentEnabled: enabled }));
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

        const { data, canSelectContent, onSelectContent, labels } = this.props;
        const attrs = {
            className: 'c-meta-preview__btn--select',
            onClick: onSelectContent,
        };

        canSelectContent(data, this.toggleEnabledState);

        if (!this.state.selectContentEnabled) {
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

    renderImagePreview() {
        if (!this.props.data.CurrentVersion) {
            return (
                <svg className="c-meta-preview__loading-spinner ez-icon ez-spin ez-icon-x2 ez-icon-spinner">
                    <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#spinner" />
                </svg>
            );
        }

        if (!this.state.imageUri.length) {
            return <Fragment>{this.props.labels.imagePreviewNotAvailable}</Fragment>;
        }

        return <img className="c-meta-preview__image" src={this.state.imageUri} alt="" />;
    }

    /**
     * Removes bookmark
     *
     * @method removeBookmark
     * @memberof ContentMetaPreviewComponent
     */
    removeBookmark() {
        const { onBookmarkRemoved, data, restInfo } = this.props;
        const locationId = data.id;
        const unbookmarked = new Promise((resolve) => removeBookmark(restInfo, locationId, resolve));

        unbookmarked
            .then(() => {
                this.setBookmarked(false);
                onBookmarkRemoved(data);
            })
            .catch(showErrorNotification);
    }

    /**
     * Adds bookmark
     *
     * @method addBookmark
     * @memberof ContentMetaPreviewComponent
     */
    addBookmark() {
        const { onBookmarkAdded, data, restInfo } = this.props;
        const locationId = data.id;
        const bookmarked = new Promise((resolve) => addBookmark(restInfo, locationId, resolve));

        bookmarked
            .then(() => {
                this.setBookmarked(true);
                onBookmarkAdded(data);
            })
            .catch(showErrorNotification);
    }

    /**
     * Renders bookmark icon
     *
     * @method renderBookmarkIcon
     * @memberof ContentMetaPreviewComponent
     */
    renderBookmarkIcon() {
        const { bookmarked } = this.state;
        if (bookmarked === null) {
            return null;
        }

        const bookmarkIconId = bookmarked ? 'bookmark-active' : 'bookmark';
        const action = bookmarked ? 'remove' : 'add';
        const onClick = bookmarked ? this.removeBookmark : this.addBookmark;
        const iconHref = `/bundles/ezplatformadminui/img/ez-icons.svg#${bookmarkIconId}`;

        return (
            <div className={`ez-add-to-bookmarks__icon-wrapper ez-add-to-bookmarks__icon-wrapper--${action}`} onClick={onClick}>
                <svg className="ez-icon ez-icon--medium">
                    <use xlinkHref={iconHref} />
                </svg>
            </div>
        );
    }

    render() {
        const data = this.props.data.ContentInfo.Content;
        const labels = this.props.labels;
        const contentType = this.props.contentTypesMap ? this.props.contentTypesMap[data.ContentType._href] : false;
        const contentTypeName = contentType ? contentType.names.value[0]['#text'] : labels.notAvailable;

        return (
            <div className="c-meta-preview__wrapper">
                <h1 className="c-meta-preview__title">{labels.title}</h1>
                <div className="c-meta-preview" style={{ maxHeight: `${this.props.maxHeight - 64}px` }}>
                    <div className="c-meta-preview__top-wrapper">
                        <div className="c-meta-preview__content-type">
                            {this.renderIcon()} {contentTypeName}
                        </div>
                        <div className="c-meta-preview__content-bookmark">{this.renderBookmarkIcon()}</div>
                    </div>
                    <div className="c-meta-preview__meta-wrapper">
                        <div className="c-meta-preview__image-wrapper">{this.renderImagePreview()}</div>
                        <div className="c-meta-preview__name">{data.Name}</div>
                        {this.renderSelectContentBtn()}
                        <div className="c-meta-preview__content-info">
                            <h3 className="c-meta-preview__subtitle">{labels.lastModified}:</h3>
                            {new Date(data.lastModificationDate).toLocaleString()}
                        </div>
                        <div className="c-meta-preview__content-info">
                            <h3 className="c-meta-preview__subtitle">{labels.creationDate}:</h3>
                            {new Date(data.publishedDate).toLocaleString()}
                        </div>
                        <div className="c-meta-preview__content-info">
                            <h3 className="c-meta-preview__subtitle">{labels.translations}:</h3>
                            {this.state.translations.map(this.renderTranslation)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ContentMetaPreviewComponent.propTypes = {
    data: PropTypes.object.isRequired,
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
};
