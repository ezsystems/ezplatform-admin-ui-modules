import React from 'react';
import PropTypes from 'prop-types';
import TabContentPanelComponent from '../../common/tab-content-panel/tab.content.panel.component';
import ChooseLanguageComponent from './components/choose-language/choose.language.component';
import ChooseContentTypeComponent from './components/choose-content-type/choose.content.type.component';
import FinderComponent from '../browse/components/finder/finder.component';
import BaseTabComponent from '../base.tab.component';

const TEXT_CHOOSE_LANG_AND_CONTENT_TYPE = Translator.trans(
    /*@Desc("Choose Language and Content Type")*/ 'content_on_the_fly.choose_language_and_content_type.title',
    {},
    'universal_discovery_widget'
);
const TEXT_SELECT_LOCATION = Translator.trans(
    /*@Desc("Select Location")*/ 'content_on_the_fly.select_location.title',
    {},
    'universal_discovery_widget'
);

const UDWCreateTab = ({ onConfirm, onCancel, ...props }) => {
    const renderTab = (parentProps) => {
        const { selectedContent, markContentAsSelected, unmarkContentAsSelected, onItemMarked } = parentProps;
        const confirmSelection = () => onConfirm(selectedContent);
        const wrapperAttrs = { className: 'ez-create-tab' };
        const maxHeight = props.maxHeight - 24;
        const componentProps = { ...props, maxHeight, allowContainersOnly: true };
        const finderProps = {
            ...componentProps,
            multiple: false,
            selectedContent,
            onItemMarked,
            onItemSelect: markContentAsSelected,
            onItemDeselect: unmarkContentAsSelected,
        };
        const onLanguageSelected = () => {
            console.log('onLanguageSelected');
        };
        const onContentTypeSelected = () => {
            console.log('onContentTypeSelected');
        };
        const confirmBtnAttrs = {
            className: 'ez-create-tab__action',
            disabled: !selectedContent.length,
            onClick: confirmSelection,
            type: 'button',
        };
        const cancelBtnAttrs = {
            className: 'ez-create-tab__action',
            type: 'button',
            onClick: onCancel,
        };

        console.log({ props, parentProps });

        return (
            <div {...wrapperAttrs}>
                <TabContentPanelComponent id="create" isVisible={true}>
                    <div className="ez-create-tab__first-step">
                        <div className="ez-create-tab__step-title">1) {TEXT_CHOOSE_LANG_AND_CONTENT_TYPE}</div>
                        <div className="c-create" style={{ maxHeight: `${props.maxHeight}px` }}>
                            <ChooseLanguageComponent {...componentProps} onLanguageSelected={onLanguageSelected} />
                            <ChooseContentTypeComponent {...componentProps} onContentTypeSelected={onContentTypeSelected} />
                        </div>
                    </div>
                    <div className="ez-create-tab__second-step">
                        <div className="ez-create-tab__step-title">2) {TEXT_SELECT_LOCATION}</div>
                        <FinderComponent {...finderProps} />
                    </div>
                </TabContentPanelComponent>
                <div className="ez-create-tab__actions">
                    <button {...cancelBtnAttrs}>Cancel</button>
                    <button {...confirmBtnAttrs}>Confirm</button>
                </div>
            </div>
        );
    };

    return <BaseTabComponent>{renderTab}</BaseTabComponent>;
};

UDWCreateTab.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    forcedLanguage: PropTypes.string.isRequired,
    preselectedLocation: PropTypes.number,
    allowedLocations: PropTypes.array,
    allowedLanguages: PropTypes.array,
    allowedContentTypes: PropTypes.array,
    startingLocationId: PropTypes.number,
};

UDWCreateTab.defaultProps = {
    preselectedLocation: null,
    preselectedLanguage: null,
    preselectedContentType: null,
    forcedLanguage: '',
    allowedLanguages: [],
    allowedContentTypes: [],
    allowedLocations: [],
    startingLocationId: 1,
};

eZ.addConfig('udwTabs.Create', UDWCreateTab);

export default UDWCreateTab;
