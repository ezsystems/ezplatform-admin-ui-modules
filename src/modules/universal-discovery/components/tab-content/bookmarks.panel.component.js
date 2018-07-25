import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TabContentPanelComponent from './tab.content.panel.component';
import BookmarksComponent from '../bookmarks/bookmarks.component';

import './css/bookmarks.panel.component.css';

export default class BookmarksPanelComponent extends Component {
    getBookmarksAttrs() {
        const {
            multiple,
            findContentBySearchQuery,
            onItemSelect,
            maxHeight,
            contentTypesMap,
            bookmarksPerPage,
            restInfo,
            userBookmarksItems,
            userBookmarksCount,
            requireBookmarksCount,
            selectedContent,
            onSelectContent,
            canSelectContent,
            onItemRemove,
        } = this.props;

        return {
            multiple,
            findContentBySearchQuery,
            onItemSelect,
            maxHeight,
            contentTypesMap,
            bookmarksPerPage,
            restInfo,
            userBookmarksItems,
            userBookmarksCount,
            requireBookmarksCount,
            selectedContent,
            onSelectContent,
            canSelectContent,
            onItemRemove,
        };
    }

    getWrapperAttrs() {
        const { isVisible } = this.props;

        return {
            hidden: !isVisible,
        };
    }

    render() {
        const wrapperAttrs = this.getWrapperAttrs();
        const bookmarksAttrs = this.getBookmarksAttrs();

        return (
            <div className="c-bookmarks-panel" {...wrapperAttrs}>
                <TabContentPanelComponent {...this.props}>
                    <BookmarksComponent {...bookmarksAttrs} />
                </TabContentPanelComponent>
            </div>
        );
    }
}

BookmarksPanelComponent.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    multiple: PropTypes.bool.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    findContentBySearchQuery: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    bookmarksPerPage: PropTypes.number.isRequired,
    userBookmarksItems: PropTypes.array,
    userBookmarksCount: PropTypes.number,
    requireBookmarksCount: PropTypes.func.isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
    selectedContent: PropTypes.array.isRequired,
    onSelectContent: PropTypes.func.isRequired,
    canSelectContent: PropTypes.func.isRequired,
    onItemRemove: PropTypes.func.isRequired,
};
