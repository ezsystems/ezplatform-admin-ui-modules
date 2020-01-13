import React, { useContext, createRef } from 'react';

import {
    ContentOnTheFlyDataContext,
    TabsContext,
    ContentOnTheFlyConfigContext,
    ActiveTabContext,
    CreateContentWidgetContext,
    RestInfoContext,
    SelectedLocationsContext,
    ConfirmContext,
    LoadedLocationsMapContext,
} from './universal.discovery.module';
import { findLocationsById } from './services/universal.discovery.service';
import deepClone from '../common/helpers/deep.clone.helper';

const generateIframeUrl = ({ locationId, languageCode, contentTypeIdentifier }) => {
    return window.Routing.generate('ezplatform.content_on_the_fly.create', {
        locationId,
        languageCode,
        contentTypeIdentifier,
    });
};

const ContentCreataTabModule = () => {
    const [contentOnTheFlyData, setContentOnTheFlyData] = useContext(ContentOnTheFlyDataContext);
    const tabs = useContext(TabsContext);
    const contentOnTheFlyConfig = useContext(ContentOnTheFlyConfigContext);
    const onConfirm = useContext(ConfirmContext);
    const restInfo = useContext(RestInfoContext);
    const [activeTab, setActiveTab] = useContext(ActiveTabContext);
    const [createContentVisible, setCreateContentVisible] = useContext(CreateContentWidgetContext);
    const [selectedLocations, dispatchSelectedLocationsAction] = useContext(SelectedLocationsContext);
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
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
                if (contentOnTheFlyConfig.autoConfirmAfterPublish) {
                    onConfirm(items);

                    return;
                }

                const clonedLoadedLocations = deepClone(loadedLocationsMap);

                clonedLoadedLocations[clonedLoadedLocations.length - 1].subitems = [];

                dispatchLoadedLocationsAction({ type: 'SET_LOCATIONS', data: clonedLoadedLocations });
                dispatchSelectedLocationsAction({ type: 'ADD_SELECTED_LOCATION', location: items[0] });
                cancelContentCreate();
            });
        }
    };
    const cancelLabel = Translator.trans(/*@Desc("Cancel")*/ 'content_create.cancel.label', {}, 'universal_discovery_widget');
    const confirmLabel = Translator.trans(/*@Desc("Confirm")*/ 'content_create.confirm.label', {}, 'universal_discovery_widget');

    return (
        <div className="m-content-create">
            <iframe src={iframeUrl} className="m-content-create__iframe" ref={iframeRef} onLoad={handleIframeLoad} />
            <div className="m-content-create__actions">
                <button className="m-content-create__cancel-button btn btn-gray" onClick={cancelContentCreate}>
                    {cancelLabel}
                </button>
                <button className="m-content-create__confirm-button btn btn-primary" onClick={publishContent}>
                    {confirmLabel}
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
            label: Translator.trans(/*@Desc("Content create")*/ 'content_create.label', {}, 'universal_discovery_widget'),
            icon: '/bundles/ezplatformadminui/img/ez-icons.svg#search',
            isHiddenOnList: true,
        },
    ],
    true
);

export default ContentCreataTabModule;
