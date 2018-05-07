import React from 'react';
import PropTypes from 'prop-types';

import TabContentPanelComponent from './tab.content.panel.component';
import FinderComponent from '../finder/finder.component';
import CreateComponent from '../create/create.component';

import './css/create.panel.component.css';

const CreatePanelComponent = (props) => {
    const wrapperAttrs = {className: 'c-create-panel'};
    const maxHeight = props.maxHeight - 24;
    const componentProps = Object.assign({}, props, { maxHeight, allowContainersOnly: true });

    if (!props.isVisible) {
        wrapperAttrs.hidden = true;
    }

    return (
        <div {...wrapperAttrs}>
            <TabContentPanelComponent {...props}>
                <div className="c-create-panel__first-step">
                    <div className="c-create-panel__step-title">1) {props.labels.contentOnTheFly.chooseLangaugeAndContentType}</div>
                    <CreateComponent {...componentProps} />
                </div>
                <div className="c-create-panel__second-step">
                    <div className="c-create-panel__step-title">2) {props.labels.contentOnTheFly.selectLocation}</div>
                    <FinderComponent {...componentProps} />
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
        siteaccess: PropTypes.string.isRequired
    }).isRequired,
    labels: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
    contentTypes: PropTypes.object.isRequired,
    onLanguageSelected: PropTypes.func.isRequired,
    onContentTypeSelected: PropTypes.func.isRequired,
    forcedLanguage: PropTypes.string.isRequired,
    preselectedLocation: PropTypes.number.isRequired,
    allowedLocations: PropTypes.array.isRequired,
    allowedLanguages: PropsTypes.array.isRequired
};

export default CreatePanelComponent;
