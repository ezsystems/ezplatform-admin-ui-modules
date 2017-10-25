import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/content.meta.preview.component.css';

export default class ContentMetaPreviewComponent extends Component {
    constructor() {
        super();

        this.state = {
            imageUri: null
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
            .Fields.field.find(field => field.fieldDefinitionIdentifier === 'image');

        if (!imageField) {
            return;
        }

        this.setState(state => Object.assign({}, state, {imageUri: imageField.fieldValue.uri}));
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
        const canSelect = canSelectContent(data.ContentInfo.Content);
        const attrs = {
            className: 'c-meta-preview__btn--select',
            onClick: onSelectContent
        };

        if (!canSelect) {
            attrs.disabled = true;
        }

        return (
            <div className="c-meta-preview__btn-wrapper">
                <button {...attrs}>{labels.selectContent}</button>
            </div>
        );
    }

    render() {
        const data = this.props.data.ContentInfo.Content;
        const contentType = this.props.contentTypesMap ? this.props.contentTypesMap[data.ContentType._href] : false;
        const contentTypeName = contentType ? contentType.names.value[0]['#text'] : this.props.labels.notAvailable;

        return (
            <div className="c-meta-preview">
                <h1 className="c-meta-preview__title">{this.props.labels.title}</h1>
                <div className="c-meta-preview__meta-wrapper">
                    <div className="c-meta-preview__content-type">{contentTypeName}</div>
                    <div className="c-meta-preview__image-wrapper">
                        <img className="c-meta-preview__image" src={this.state.imageUri} alt=""/>
                    </div>
                    {this.renderSelectContentBtn()}
                    <div className="c-meta-preview__name">{data.Name}</div>
                    <div className="c-meta-preview__modified">{data.lastModificationDate}</div>
                    <div className="c-meta-preview__published">{data.publishedDate}</div>
                    <div className="c-meta-preview__language-versions">{data.mainLanguageCode}</div>
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
        notAvailable: PropTypes.string.isRequired
    }).isRequired
};
