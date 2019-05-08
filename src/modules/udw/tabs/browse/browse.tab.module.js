import React from 'react';
import PropTypes from 'prop-types';
import TabContentPanelComponent from '../../common/tab-content-panel/tab.content.panel.component';
import FinderComponent from './components/finder/finder.component';
import ContentMetaPreviewComponent from '../../common/content-meta-preview/content.meta.preview.component';
import SelectedContentComponent from '../../common/selected-content/selected.content.component';
import { classnames } from '../../../common/classnames/classnames';
import BaseTabComponent from '../base.tab.component';

const UDWBrowseTab = ({ selectedItemsLimit, onCancel, onConfirm, ...props }) => {
    const renderTab = (parentProps) => {
        const {
            showContentMetaPreview,
            contentMeta,
            selectedContent,
            markContentAsSelected,
            unmarkContentAsSelected,
            onItemSelect,
        } = parentProps;
        const confirmSelection = () => onConfirm(selectedContent);
        const previewAttrs = {
            isVisible: showContentMetaPreview && !!contentMeta,
            location: contentMeta,
        };
        const finderAttrs = {
            onItemSelect,
            selectedContent,
            onSelectContent: markContentAsSelected,
            onItemDeselect: unmarkContentAsSelected,
            ...props,
        };
        const selectedContentAttrs = {
            items: selectedContent,
            selectedItemsLimit,
            onItemRemove: unmarkContentAsSelected,
        };
        const tabAttrs = {
            className: classnames({
                'ez-browse-tab': true,
                'ez-browse-tab--with-preview': !!contentMeta,
            }),
        };
        const confirmBtnAttrs = {
            className: 'ez-browse-tab__action',
            disabled: !selectedContent.length,
            onClick: confirmSelection,
            type: 'button',
        };
        const cancelBtnAttrs = {
            className: 'ez-browse-tab__action',
            type: 'button',
            onClick: onCancel,
        };

        return (
            <div {...tabAttrs}>
                <div className="ez-browse-tab__finder">
                    <TabContentPanelComponent id="browse" isVisible={true}>
                        <FinderComponent {...finderAttrs} />
                    </TabContentPanelComponent>
                </div>
                <div className="ez-browse-tab__preview">
                    <ContentMetaPreviewComponent {...previewAttrs} />
                </div>
                <div className="ez-browse-tab__selected-items">
                    <SelectedContentComponent {...selectedContentAttrs} />
                </div>
                <div className="ez-browse-tab__actions">
                    <button {...cancelBtnAttrs}>Cancel</button>
                    <button {...confirmBtnAttrs}>Confirm</button>
                </div>
            </div>
        );
    };

    return <BaseTabComponent>{renderTab}</BaseTabComponent>;
};

UDWBrowseTab.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    multiple: PropTypes.bool,
    selectedItemsLimit: PropTypes.number,
    startingLocationId: PropTypes.number,
    allowContainersOnly: PropTypes.bool,
    checkCanSelectContent: PropTypes.func,
};

UDWBrowseTab.defaultProps = {
    multiple: false,
    startingLocationId: 1,
    selectedItemsLimit: 0,
    allowContainersOnly: false,
    checkCanSelectContent: (item, callback) => callback(true),
};

eZ.addConfig('udwTabs.Browse', UDWBrowseTab);

export default UDWBrowseTab;
