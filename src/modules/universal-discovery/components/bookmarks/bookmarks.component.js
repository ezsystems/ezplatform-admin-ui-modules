import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';

import ContentTableComponent from '../content-table/content.table.component';

export default class BookmarksComponent extends Component {
    renderTable() {
        const { userBookmarksCount, userBookmarksItems } = this.props;

        if (userBookmarksCount === null) {
            return null;
        }

        const {
            onItemSelect,
            bookmarksPerPage,
            contentTypesMap,
            requireBookmarksCount,
            selectedContent,
            onSelectContent,
            canSelectContent,
            onItemRemove,
            multiple,
        } = this.props;
        const tableTitle = Translator.trans(/*@Desc("Bookmarks")*/ 'bookmarks_table.title', {}, 'universal_discovery_widget');

        return (
            <ContentTableComponent
                items={userBookmarksItems}
                count={userBookmarksCount}
                requireItemsCount={requireBookmarksCount}
                onItemSelect={onItemSelect}
                onItemClick={onItemSelect}
                perPage={bookmarksPerPage}
                contentTypesMap={contentTypesMap}
                title={tableTitle}
                selectedContent={selectedContent}
                onSelectContent={onSelectContent}
                canSelectContent={canSelectContent}
                onItemRemove={onItemRemove}
                multiple={multiple}
            />
        );
    }

    renderSpinner() {
        const { userBookmarksCount } = this.props;

        if (userBookmarksCount === null) {
            return <Icon name="spinner" extraClasses="c-bookmarks__loading-spinner ez-spin ez-icon-x2 ez-icon-spinner" />;
        }
    }

    renderNoBookmarksInfo() {
        const { userBookmarksCount } = this.props;
        const noBookmarksMessage = Translator.trans(
            /*@Desc("No content items. Content items you bookmark will appear here.")*/ 'bookmarks_table.no_bookmarks.message',
            {},
            'universal_discovery_widget'
        );

        if (!userBookmarksCount) {
            return <div className="c-bookmarks__no-bookmarks-info">{noBookmarksMessage}</div>;
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
    restInfo: PropTypes.shape({
        token: PropTypes.string.isRequired,
        siteaccess: PropTypes.string.isRequired,
    }).isRequired,
    selectedContent: PropTypes.array.isRequired,
    onSelectContent: PropTypes.func.isRequired,
    canSelectContent: PropTypes.func.isRequired,
    onItemRemove: PropTypes.func.isRequired,
    multiple: PropTypes.bool.isRequired,
};
