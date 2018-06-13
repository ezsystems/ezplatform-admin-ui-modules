import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TabContentPanelComponent from './tab.content.panel.component';
import BookmarksComponent from '../bookmarks/bookmarks.component';

import './css/bookmarks.panel.component.css';

export default class BookmarksPanelComponent extends Component {
    constructor(props) {
        super(props);

        this._refBookmarksComponent = null;

        this.setBookmarksComponentRef = this.setBookmarksComponentRef.bind(this);
    }

    onBookmarkRemoved(item) {
        if (this._refBookmarksComponent) {
            this._refBookmarksComponent.onBookmarkRemoved(item);
        }
    }

    onBookmarkAdded(item) {
        if (this._refBookmarksComponent) {
            this._refBookmarksComponent.onBookmarkAdded(item);
        }
    }

    setBookmarksComponentRef(bookmarksComponent) {
        this._refBookmarksComponent = bookmarksComponent;
    }

    getBookmarksAttrs() {
        const {
            multiple,
            findContentBySearchQuery,
            onItemSelect,
            maxHeight,
            contentTypesMap,
            bookmarksPerPage,
            labels,
            restInfo,
        } = this.props;

        return {
            multiple,
            findContentBySearchQuery,
            onItemSelect,
            maxHeight,
            contentTypesMap,
            bookmarksPerPage,
            labels,
            restInfo,
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
                    <BookmarksComponent ref={this.setBookmarksComponentRef} {...bookmarksAttrs} />
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
    labels: PropTypes.object.isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
};
