import React from 'react';
import PropTypes from 'prop-types';

import TabContentPanelComponent from './tab.content.panel.component';
import FinderComponent from '../finder/finder.component';
import CreateComponent from '../create/create.component';

import './css/create.panel.component.css';

const CreatePanelComponent = (props) => {
    const wrapperAttrs = { className: 'c-create-panel' };
    const maxHeight = props.maxHeight - 24;
    const componentProps = { ...props, maxHeight, allowContainersOnly: true };
    const finderProps = { ...componentProps, multiple: false };
    const chooseLanguageAndContentTypeTitle = Translator.trans(
        /*@Desc("Choose Language and Content Type")*/ 'content_on_the_fly.choose_language_and_content_type.title',
        {},
        'universal_discovery_widget'
    );
    const selectLocationTitle = Translator.trans(
        /*@Desc("Select Location")*/ 'content_on_the_fly.select_location.title',
        {},
        'universal_discovery_widget'
    );

    if (!props.isVisible) {
        wrapperAttrs.hidden = true;
    }

    return (
        <div {...wrapperAttrs}>
            <TabContentPanelComponent {...props}>
                <div className="c-create-panel__first-step">
                    <div className="c-create-panel__step-title">1) {chooseLanguageAndContentTypeTitle}</div>
                    <CreateComponent {...componentProps} />
                </div>
                <div className="c-create-panel__second-step">
                    <div className="c-create-panel__step-title">2) {selectLocationTitle}</div>
                    <FinderComponent {...finderProps} />
                </div>
            </TabContentPanelComponent>
        </div>
    );
};

CreatePanelComponent.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    multiple: PropTypes.bool.isRequired,
    startingLocationId: PropTypes.number.isRequired,
    findLocationsByParentLocationId: PropTypes.func.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
    languages: PropTypes.object.isRequired,
    contentTypes: PropTypes.object.isRequired,
    onLanguageSelected: PropTypes.func.isRequired,
    onContentTypeSelected: PropTypes.func.isRequired,
    forcedLanguage: PropTypes.string.isRequired,
    preselectedLocation: PropTypes.number,
    allowedContentTypes: PropTypes.array.isRequired,
    allowedLocations: PropTypes.array.isRequired,
    allowedLanguages: PropTypes.array.isRequired,
    sortFieldMappings: PropTypes.object.isRequired,
    sortOrderMappings: PropTypes.object.isRequired,
};

export default CreatePanelComponent;
