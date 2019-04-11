import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';

import { loadLocation } from '../../services/universal.discovery.service';

export default class ContentCreatorComponent extends Component {
    constructor(props) {
        super(props);

        this.handleIframeLoad = this.handleIframeLoad.bind(this);
        this.handlePublish = this.handlePublish.bind(this);
        this.enablePublishBtn = this.enablePublishBtn.bind(this);
        this.disablePublishBtn = this.disablePublishBtn.bind(this);
        this.renderPublishBtn = this.renderPublishBtn.bind(this);

        this._refIframe = null;

        this.state = {
            iframeLoading: true,
            publishBtnDisabled: false,
        };
    }

    handlePublish() {
        this._refIframe.contentWindow.onbeforeunload = () => {};
        this.submitForm();
    }

    submitForm() {
        const selectors = ['#ezrepoforms_content_edit_publish', '#ezrepoforms_user_create_create'];

        for(let selector of selectors) {
            let submit = this._refIframe.contentWindow.document.body.querySelector(selector);
            if(submit) {
                submit.click();

                return;
            }
        }
    }

    handleIframeLoad() {
        const iframeWindow = this._refIframe.contentWindow;
        const iframeDoc = iframeWindow.document;
        const locationId = iframeDoc.querySelector('meta[name="LocationID"]');
        const iframeUrl = this.generateIframeUrl();

        if (iframeWindow.location.pathname !== iframeUrl && !locationId) {
            this._refIframe.setAttribute('src', iframeUrl);

            return;
        }

        if (locationId) {
            this.loadLocationInfo(locationId.content);
        } else {
            this.setState((state) => Object.assign({}, state, { iframeLoading: false }));

            iframeWindow.onbeforeunload = () => {
                return '';
            };
            iframeWindow.onunload = () => {
                this.setState((state) => Object.assign({}, state, { iframeLoading: true }));
            };
        }

        iframeDoc.body.addEventListener('fbFormBuilderLoaded', this.disablePublishBtn, false);
        iframeDoc.body.addEventListener('fbFormBuilderUnloaded', this.enablePublishBtn, false);
    }

    enablePublishBtn() {
        this.setState(() => ({ publishBtnDisabled: false }));
    }

    disablePublishBtn() {
        this.setState(() => ({ publishBtnDisabled: true }));
    }

    loadLocationInfo(locationId) {
        const { loadLocation, handlePublish, restInfo } = this.props;
        const promise = new Promise((resolve) => loadLocation(Object.assign({}, restInfo, { locationId }), resolve));

        promise.then((response) => {
            handlePublish(response.View.Result.searchHits.searchHit[0].value.Location);
        });
    }

    generateIframeUrl() {
        const { selectedLocationId, selectedLanguage, selectedContentType } = this.props;

        return window.Routing.generate('ezplatform.content_on_the_fly.create', {
            locationId: selectedLocationId,
            languageCode: selectedLanguage.languageCode,
            contentTypeIdentifier: selectedContentType.identifier,
        });
    }

    /**
     * Renders a loading state spinner
     *
     * @method renderLoadingSpinner
     * @returns {Element}
     * @memberof FinderTreeLeafComponent
     */
    renderLoadingSpinner() {
        if (!this.state.iframeLoading) {
            return null;
        }

        return <Icon name="spinner" extraClasses="ez-spin ez-icon-x2 ez-icon-spinner" />;
    }

    renderPublishBtn() {
        const publishLabel = Translator.trans(/*@Desc("Publish")*/ 'content_on_the_fly.publish.label', {}, 'universal_discovery_widget');
        const attrs = {
            className: 'm-ud__action m-ud__action--publish',
            onClick: this.handlePublish,
            type: 'button',
        };

        if (this.state.publishBtnDisabled) {
            attrs.disabled = true;
        }

        return <button {...attrs}>{publishLabel}</button>;
    }

    render() {
        const { selectedContentType, selectedLanguage, maxHeight, onCancel } = this.props;
        const title = Translator.trans(
            /*@Desc("Creating - %contentType% in %language%")*/ 'content_on_the_fly.creating_content.title',
            {
                contentType: selectedContentType.name,
                language: selectedLanguage.name,
            },
            'universal_discovery_widget'
        );
        const cancelLabel = Translator.trans(/*@Desc("Cancel")*/ 'cancel.label', {}, 'universal_discovery_widget');
        const iframeUrl = this.generateIframeUrl();
        const contentClass = this.state.iframeLoading ? 'm-ud__content is-loading' : 'm-ud__content';

        return (
            <div className="m-ud__wrapper">
                <div className="m-ud c-content-creator" ref={this.props.setMainContainerRef}>
                    <h1 className="m-ud__title">{title}</h1>
                    <div className="m-ud__content-wrapper">
                        <div className={contentClass}>
                            {this.renderLoadingSpinner()}
                            <iframe
                                src={iframeUrl}
                                ref={(ref) => (this._refIframe = ref)}
                                className="c-content-creator__iframe"
                                onLoad={this.handleIframeLoad}
                                style={{ height: `${maxHeight + 32}px` }}
                            />
                        </div>
                        <div className="m-ud__actions">
                            <div className="m-ud__btns">
                                <button type="button" className="m-ud__action m-ud__action--cancel" onClick={onCancel}>
                                    {cancelLabel}
                                </button>
                                {this.renderPublishBtn()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ContentCreatorComponent.propTypes = {
    maxHeight: PropTypes.number.isRequired,
    selectedLanguage: PropTypes.object.isRequired,
    selectedContentType: PropTypes.object.isRequired,
    selectedLocationId: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    handlePublish: PropTypes.func.isRequired,
    loadLocation: PropTypes.func,
    restInfo: PropTypes.object.isRequired,
    setMainContainerRef: PropTypes.func.isRequired,
};

ContentCreatorComponent.defaultProps = {
    loadLocation,
};
