import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { loadLocation } from '../../services/universal.discovery.service';

import './css/content.creator.component.css';

export default class ContentCreatorComponent extends Component {
    constructor(props) {
        super(props);

        this.handleIframeLoad = this.handleIframeLoad.bind(this);
        this.handlePublish = this.handlePublish.bind(this);

        this.state = {
            iframeLoading: true,
        };
    }

    handlePublish() {
        this.iframe.contentWindow.onbeforeunload = () => {};
        this.iframe.contentWindow.document.body.querySelector('#ezrepoforms_content_edit_publish').click();
    }

    handleIframeLoad() {
        const locationId = this.iframe.contentWindow.document.querySelector('meta[name="LocationID"]');
        const iframeUrl = this.generateIframeUrl();

        if (this.iframe.contentWindow.location.pathname !== iframeUrl && !locationId) {
            this.iframe.setAttribute('src', iframeUrl);

            return;
        }

        if (locationId) {
            this.loadLocationInfo(locationId.content);
        } else {
            this.setState((state) => Object.assign({}, state, { iframeLoading: false }));

            this.iframe.contentWindow.onbeforeunload = () => {
                return '';
            };
            this.iframe.contentWindow.onunload = () => {
                this.setState((state) => Object.assign({}, state, { iframeLoading: true }));
            };
        }
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

        return (
            <svg className="ez-icon ez-spin ez-icon-x2 ez-icon-spinner">
                <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#spinner" />
            </svg>
        );
    }

    render() {
        const { labels, selectedContentType, selectedLanguage, maxHeight, onCancel } = this.props;
        const title = labels.contentOnTheFly.creatingContent
            .replace('{contentType}', selectedContentType.name)
            .replace('{language}', selectedLanguage.name);
        const iframeUrl = this.generateIframeUrl();
        const contentClass = this.state.iframeLoading ? 'm-ud__content is-loading' : 'm-ud__content';

        return (
            <div className="m-ud__wrapper">
                <div className="m-ud c-content-creator">
                    <h1 className="m-ud__title">{title}</h1>
                    <div className="m-ud__content-wrapper">
                        <div className={contentClass} ref={(ref) => (this._refContentContainer = ref)}>
                            {this.renderLoadingSpinner()}
                            <iframe
                                src={iframeUrl}
                                ref={(ref) => (this.iframe = ref)}
                                className="c-content-creator__iframe"
                                onLoad={this.handleIframeLoad}
                                style={{ height: `${maxHeight + 32}px` }}
                            />
                        </div>
                        <div className="m-ud__actions">
                            <div className="m-ud__btns">
                                <button className="m-ud__action--cancel" onClick={onCancel}>
                                    {labels.udw.cancel}
                                </button>
                                <button className="m-ud__action--publish" onClick={this.handlePublish}>
                                    {labels.contentOnTheFly.publish}
                                </button>
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
    labels: PropTypes.object.isRequired,
    selectedLanguage: PropTypes.object.isRequired,
    selectedContentType: PropTypes.object.isRequired,
    selectedLocationId: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    handlePublish: PropTypes.func.isRequired,
    loadLocation: PropTypes.func,
    restInfo: PropTypes.object.isRequired,
};

ContentCreatorComponent.defaultProps = {
    loadLocation,
};
