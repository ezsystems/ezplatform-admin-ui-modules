import React, { useContext, createRef } from 'react';

import {
    ContentOnTheFlyDataContext,
    TabsConfigContext,
    ActiveTabContext,
    CreateContentWidgetContext,
    RestInfoContext,
    SelectedLocationsContext,
} from './universal.discovery.module';
import { findLocationsById } from './services/universal.discovery.service';

const generateIframeUrl = ({ locationId, languageCode, contentTypeIdentifier }) => {
    return window.Routing.generate('ezplatform.content_on_the_fly.create', {
        locationId,
        languageCode,
        contentTypeIdentifier,
    });
};

const ContentCreataTabModule = () => {
    const [contentOnTheFlyData, setContentOnTheFlyData] = useContext(ContentOnTheFlyDataContext);
    const tabs = useContext(TabsConfigContext);
    const restInfo = useContext(RestInfoContext);
    const [activeTab, setActiveTab] = useContext(ActiveTabContext);
    const [createContentVisible, setCreateContentVisible] = useContext(CreateContentWidgetContext);
    const [selectedLocations, dispatchSelectedLocationsAction] = useContext(SelectedLocationsContext);
    const iframeUrl = generateIframeUrl(contentOnTheFlyData);
    const iframeRef = createRef();
    const cancelContentCreate = () => {
        setCreateContentVisible(false);
        setContentOnTheFlyData({});
        setActiveTab(tabs[0].id);
    };
    const publishContent = () => {
        const submitButton = iframeRef.current.contentWindow.document.body.querySelector('[data-action="publish"]');

        if (submitButton) {
            submitButton.click();
        }
    };
    const handleIframeLoad = () => {
        const locationId = iframeRef.current.contentWindow.document.querySelector('meta[name="LocationID"]');

        if (locationId) {
            findLocationsById({ ...restInfo, id: parseInt(locationId.content, 10) }, (items) => {
                dispatchSelectedLocationsAction({ type: 'ADD_SELECTED_LOCATION', location: items[0] });
                cancelContentCreate();
            });
        }
    };

    return (
        <div className="m-content-create">
            <iframe src={iframeUrl} className="m-content-create__iframe" ref={iframeRef} onLoad={handleIframeLoad} />
            <div className="m-content-create__actions">
                <button className="m-content-create__cancel-button btn btn-gray" onClick={cancelContentCreate}>
                    Cancel
                </button>
                <button className="m-content-create__confirm-button btn btn-primary" onClick={publishContent}>
                    Confirm
                </button>
            </div>
        </div>
    );
};

eZ.addConfig(
    'adminUiConfig.universalDiscoveryWidget.tabs',
    [
        {
            id: 'content-create',
            component: ContentCreataTabModule,
            label: 'Search',
            icon: '/bundles/ezplatformadminui/img/ez-icons.svg#search',
            isHiddenOnList: true,
        },
    ],
    true
);

export default ContentCreataTabModule;
