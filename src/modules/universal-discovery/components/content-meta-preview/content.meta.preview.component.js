import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/content.meta.preview.component.css';

export default class ContentMetaPreviewComponent extends Component {
    constructor() {
        super();

        this.state = {
            imageUri: null,
            selectContentEnabled: false
        };
    }

    componentDidMount() {
        this.loadContentInfo(this.props.data);
    }

    componentWillReceiveProps(props) {
        if (props.data.id === this.props.data.id) {
            return;
        }

        this.setState(state => Object.assign({}, state, {imageUri: null}));
        this.loadContentInfo(props.data.ContentInfo.Content._id);
    }

    /**
     * Loads content info
     *
     * @method loadContentInfo
     * @param {String} contentId
     * @memberof ContentMetaPreviewComponent
     */
    loadContentInfo(contentId) {
        const promise = new Promise(resolve => this.props.loadContentInfo(this.props.restInfo, contentId, resolve));

        promise
            .then(this.setImageUri.bind(this))
            .catch(error => console.log('load:content:info:error', error));
    }

    /**
     * Sets image URI to image preview
     *
     * @method setImageUri
     * @param {Object} response response from REST endpoint
     * @memberof ContentMetaPreviewComponent
     */
    setImageUri(response) {
        if (!response.View.Result.count) {
            return;
        }

        const imageField = response.View.Result.searchHits.searchHit[0]
            .value.Content.CurrentVersion.Version
            .Fields.field.find(field => field.fieldTypeIdentifier === 'ezimage');

        if (!imageField) {
            return;
        }

        this.setState(state => Object.assign({}, state, {imageUri: imageField.fieldValue.uri}));
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

        this.setState(state => Object.assign({}, state, {selectContentEnabled: enabled}));
    }

    /**
     * Renders a select content button
     *
     * @method renderSelectContentBtn
     * @returns {Element}
     * @memberof ContentMetaPreviewComponent
     */
    renderSelectContentBtn() {
        const {data, canSelectContent, onSelectContent, labels} = this.props;
        const attrs = {
            className: 'c-meta-preview__btn--select',
            onClick: onSelectContent
        };

        canSelectContent(data, this.toggleEnabledState.bind(this));

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
                <use xlinkHref={`/bundles/ezplatformadminui/img/ez-icons.svg#${contentTypeInfo.identifier}`}></use>
            </svg>
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
                    <div className="c-meta-preview__content-type">{this.renderIcon()} {contentTypeName}</div>
                    <div className="c-meta-preview__meta-wrapper">
                        <div className="c-meta-preview__image-wrapper">
                            <img className="c-meta-preview__image" src={this.state.imageUri} alt=""/>
                        </div>
                        <div className="c-meta-preview__name">{data.Name}</div>
                        {this.renderSelectContentBtn()}
                        <div className="c-meta-preview__content-info">
                            <h3 className="c-meta-preview__subtitle">{labels.lastModified}:</h3>
                            {(new Date(data.lastModificationDate)).toLocaleString()}
                        </div>
                        <div className="c-meta-preview__content-info">
                            <h3 className="c-meta-preview__subtitle">{labels.creationDate}:</h3>
                            {(new Date(data.publishedDate)).toLocaleString()}
                        </div>
                        <div className="c-meta-preview__content-info">
                            <h3 className="c-meta-preview__subtitle">{labels.translations}:</h3>
                            {data.mainLanguageCode}
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
    canSelectContent: PropTypes.func.isRequired,
    loadContentInfo: PropTypes.func.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired
    }).isRequired,
    labels: PropTypes.shape({
        title: PropTypes.string.isRequired,
        selectContent: PropTypes.string.isRequired,
        notAvailable: PropTypes.string.isRequired,
        creationDate: PropTypes.string.isRequired,
        lastModified: PropTypes.string.isRequired,
        translations: PropTypes.string.isRequired
    }).isRequired,
    maxHeight: PropTypes.number.isRequired
};
