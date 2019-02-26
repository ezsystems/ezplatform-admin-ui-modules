import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../common/icon/icon';

class ListItem extends Component {
    constructor(props) {
        super(props);

        this.toggleExpandedState = this.toggleExpandedState.bind(this);
        this.cancelLoadingState = this.cancelLoadingState.bind(this);
        this.loadMoreSubitems = this.loadMoreSubitems.bind(this);
        this.handleAfterExpandedStateChange = this.handleAfterExpandedStateChange.bind(this);

        this.state = {
            isExpanded: false,
            isLoading: false,
        };
    }

    cancelLoadingState() {
        this.setState(() => ({ isLoading: false }));
    }

    toggleExpandedState() {
        this.setState((state, props) => {
            const isLoading = !state.isExpanded && props.totalSubitemsCount > props.subitems.length;

            return { isExpanded: !state.isExpanded, isLoading };
        }, this.handleAfterExpandedStateChange);
    }

    handleAfterExpandedStateChange() {
        if (this.props.totalSubitemsCount === this.props.subitems.length) {
            return;
        }

        if (!this.state.isLoading) {
            console.log('TODO: Think about killing a request with AbortController');

            return;
        }

        this.loadMoreSubitems();
    }

    loadMoreSubitems() {
        const { subitems, path, locationId, loadMoreSubitems } = this.props;

        this.setState(
            () => ({ isLoading: true }),
            () =>
                loadMoreSubitems(
                    {
                        path,
                        parentLocationId: locationId,
                        offset: subitems.length,
                        limit: 10,
                    },
                    this.cancelLoadingState
                )
        );
    }

    checkCanLoadMore() {
        const { subitems, totalSubitemsCount } = this.props;

        return subitems.length < totalSubitemsCount;
    }

    /**
     * Renders an icon of a content type
     *
     * @method renderIcon
     * @returns {JSX.Element}
     */
    renderIcon() {
        const { contentTypeIdentifier, selected } = this.props;
        const iconAttrs = {
            extraClasses: `ez-icon--small ez-icon--${selected ? 'light' : 'dark'}`,
        };

        if (!this.state.isLoading) {
            iconAttrs.customPath =
                eZ.helpers.contentType.getContentTypeIconUrl(contentTypeIdentifier) || eZ.helpers.contentType.getContentTypeIconUrl('file');
        } else {
            iconAttrs.name = 'spinner';
            iconAttrs.extraClasses = `${iconAttrs.extraClasses} ez-spin`;
        }

        return (
            <span className="c-list-item__icon">
                <Icon {...iconAttrs} />
            </span>
        );
    }

    renderLoadMoreBtn() {
        let loadingSpinner = null;

        if (!this.state.isExpanded || !this.checkCanLoadMore()) {
            return null;
        }

        if (this.state.isLoading) {
            loadingSpinner = <Icon name="spinner" extraClasses="ez-spin ez-icon--small ez-icon--dark c-list-item__load-more-btn-spinner" />;
        }

        const loadMore = Translator.trans(/*@Desc("Load More")*/ 'content_tree_list.item.load_more', {}, 'universal_discovery_widget');

        return (
            <button type="button" className="c-list-item__load-more-btn btn ez-btn" onClick={this.loadMoreSubitems}>
                {loadingSpinner} {loadMore}
            </button>
        );
    }

    render() {
        const { totalSubitemsCount, children, isInvisible, selected, href, name } = this.props;
        const itemClassName = 'c-list-item';
        const togglerClassName = 'c-list-item__toggler';
        const itemAttrs = { className: itemClassName };
        const togglerAttrs = {
            className: togglerClassName,
            onClick: this.toggleExpandedState,
            hidden: !totalSubitemsCount,
            tabIndex: -1,
        };

        if (totalSubitemsCount) {
            itemAttrs.className = `${itemAttrs.className} ${itemClassName}--has-sub-items`;
        }

        if (this.checkCanLoadMore()) {
            itemAttrs.className = `${itemAttrs.className} ${itemClassName}--can-load-more`;
        }

        if (this.state.isExpanded) {
            itemAttrs.className = `${itemAttrs.className} ${itemClassName}--is-expanded`;
        }

        if (isInvisible) {
            itemAttrs.className = `${itemAttrs.className} ${itemClassName}--is-hidden`;
        }

        if (selected) {
            itemAttrs.className = `${itemAttrs.className} ${itemClassName}--is-selected`;
            togglerAttrs.className = `${togglerAttrs.className} ${togglerClassName}--light`;
        }

        return (
            <li {...itemAttrs}>
                <div className="c-list-item__label">
                    <span {...togglerAttrs} />
                    <a className="c-list-item__link" href={href}>
                        {this.renderIcon()} {name}
                    </a>
                </div>
                {children}
                {this.renderLoadMoreBtn()}
            </li>
        );
    }
}

ListItem.propTypes = {
    path: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    contentTypeIdentifier: PropTypes.string.isRequired,
    totalSubitemsCount: PropTypes.number.isRequired,
    subitems: PropTypes.array.isRequired,
    children: PropTypes.element,
    hidden: PropTypes.bool.isRequired,
    isContainer: PropTypes.bool.isRequired,
    selected: PropTypes.bool.isRequired,
    locationId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    isInvisible: PropTypes.bool.isRequired,
    loadMoreSubitems: PropTypes.func.isRequired,
};

ListItem.defaultProps = {
    hidden: false,
};

export default ListItem;
