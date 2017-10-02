import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './content.meta.preview.component.css';

export default class ContentMetaPreviewComponent extends Component {
    constructor() {
        super();

        this.state = {
            selectContentBtnVisible: true
        };
    }

    renderSelectContentBtn() {
        const attrs = {
            className: 'content-meta-preview-component__btn--select',
            onClick: this.props.onSelectContent
        };

        const canSelect = typeof this.props.canSelectContent === 'function' ?
            this.props.canSelectContent(this.props.data.ContentInfo.Content) :
            true;

        console.log('canSelect', canSelect, this.props.canSelectContent(this.props.data.ContentInfo.Content));

        if (!this.state.selectContentBtnVisible || !canSelect) {
            attrs.disabled = true;
        }

        return (
            <div className="content-meta-preview-component__btn-wrapper">
                <button {...attrs}>Select content</button>
            </div>
        );
    }

    render() {
        const data = this.props.data.ContentInfo.Content;

        return (
            <div className="content-meta-preview-component">
                <h1 className="content-meta-preview-component__title">Selected content</h1>
                <div className="content-meta-preview-component__meta-wrapper">
                    <div className="content-meta-preview-component__content-type">{data.ContentType._href}</div>
                    <div className="content-meta-preview-component__image-wrapper">
                        <img className="content-meta-preview-component__image" src="./img/test.jpg" alt={data.Name + ' - content image'} />
                    </div>
                    {this.renderSelectContentBtn()}
                    <div className="content-meta-preview-component__name">{data.Name}</div>
                    <div className="content-meta-preview-component__modified">{data.lastModificationDate}</div>
                    <div className="content-meta-preview-component__published">{data.publishedDate}</div>
                    <div className="content-meta-preview-component__language-versions">{data.mainLanguageCode}</div>
                </div>
            </div>
        );
    }
}

ContentMetaPreviewComponent.propTypes = {
    data: PropTypes.object.isRequired,
    selectContentBtnVisible: PropTypes.bool,
    onSelectContent: PropTypes.func,
    canSelectContent: PropTypes.func
};
