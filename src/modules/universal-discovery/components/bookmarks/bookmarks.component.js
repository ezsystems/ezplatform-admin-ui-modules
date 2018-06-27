import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContentTableComponent from '../content-table/content.table.component';

import './css/bookmarks.component.css';

export default class BookmarksComponent extends Component {
    renderTable() {
        const { userBookmarksCount, userBookmarksItems } = this.props;

        if (userBookmarksCount === null) {
            return null;
        }

        const { onItemSelect, bookmarksPerPage, contentTypesMap, labels, requireBookmarksCount } = this.props;

        return (
            <ContentTableComponent
                items={userBookmarksItems}
                count={userBookmarksCount}
                requireItemsCount={requireBookmarksCount}
                onItemSelect={onItemSelect}
                onItemClick={onItemSelect}
                perPage={bookmarksPerPage}
                contentTypesMap={contentTypesMap}
                title={labels.bookmarks.tableTitle}
                noItemsMessage={labels.bookmarks.noBookmarks}
                labels={labels}
            />
        );
    }

    renderSpinner() {
        const { userBookmarksCount } = this.props;

        if (userBookmarksCount === null) {
            return (
                <svg className="c-bookmarks__loading-spinner ez-icon ez-spin ez-icon-x2 ez-icon-spinner">
                    <use xlinkHref="/bundles/ezplatformadminui/img/ez-icons.svg#spinner" />
                </svg>
            );
        }
    }

    renderNoBookmarksInfo() {
        const { userBookmarksCount, labels } = this.props;

        if (!userBookmarksCount) {
            return <div className="c-bookmarks__no-bookmarks-info">{labels.bookmarks.noBookmarks}</div>;
        }
    }

    render() {
        const { maxHeight } = this.props;

        return (
            <div className="c-bookmarks" style={{ maxHeight: `${maxHeight - 32}px` }}>
                {this.renderSpinner()}
                {this.renderNoBookmarksInfo()}
                {this.renderTable()}
            </div>
        );
    }
}

BookmarksComponent.propTypes = {
    findContentBySearchQuery: PropTypes.func.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    contentTypesMap: PropTypes.object.isRequired,
    bookmarksPerPage: PropTypes.number.isRequired,
    userBookmarksCount: PropTypes.number,
    userBookmarksItems: PropTypes.array,
    requireBookmarksCount: PropTypes.func.isRequired,
    labels: PropTypes.shape({
        bookmarks: PropTypes.shape({
            noBookmarks: PropTypes.string.isRequired,
            tableTitle: PropTypes.string.isRequired,
        }).isRequired,
        contentTablePagination: PropTypes.object.isRequired,
        contentTableHeader: PropTypes.object.isRequired,
        contentTableItem: PropTypes.object.isRequired,
    }).isRequired,
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
};
