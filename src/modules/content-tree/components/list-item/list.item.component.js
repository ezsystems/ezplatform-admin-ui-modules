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
            const isLoading = !state.isExpanded && props.childrenCount > props.subitems.length;
            const newState = { isExpanded: !state.isExpanded, isLoading };

            return newState;
        }, this.handleAfterExpandedStateChange);
    }

    handleAfterExpandedStateChange() {
        if (this.props.childrenCount === this.props.subitems.length) {
            return;
        }

        if (!this.state.isLoading) {
            console.log('TODO: Think about killing a request with AbortController');

            return;
        }

        this.loadMoreSubitems();
    }

    loadMoreSubitems() {
        this.props.loadMoreSubitems(
            {
                path: this.props.path,
                parentLocationId: this.props.locationId,
                offset: this.props.subitems.length,
                limit: 10,
            },
            this.cancelLoadingState
        );
    }

    checkCanLoadMore() {
        const { subitems, childrenCount } = this.props;

        return subitems.length < childrenCount;
    }

    /**
     * Renders an icon of a content type
     *
     * @method renderIcon
     * @returns {JSX.Element}
     */
    renderIcon() {
        const { contentType, selected } = this.props;
        const iconAttrs = {
            extraClasses: `ez-icon--small ez-icon--${selected ? 'light' : 'dark'}`,
        };

        if (!this.state.isLoading) {
            iconAttrs.customPath =
                eZ.helpers.contentType.getContentTypeIconUrl(contentType.identifier) ||
                eZ.helpers.contentType.getContentTypeIconUrl('file');
        } else {
            iconAttrs.customPath = '/bundles/ezplatformadminui/img/ez-icons.svg#spinner';
            iconAttrs.extraClasses = `${iconAttrs.extraClasses} ez-spin`;
        }

        return (
            <span className="c-list-item__icon">
                <Icon {...iconAttrs} />
            </span>
        );
    }

    renderLoadMoreBtn() {
        console.log(!this.state.isExpanded, !this.checkCanLoadMore());
        if (!this.state.isExpanded || !this.checkCanLoadMore()) {
            return null;
        }

        return (
            <button type="button" className="c-list-item__load-more-btn" onClick={this.loadMoreSubitems}>
                Load more
            </button>
        );
    }

    render() {
        const { childrenCount, children, hidden, selected, href, content } = this.props;
        const itemClassName = 'c-list-item';
        const togglerClassName = 'c-list-item__toggler';
        const itemAttrs = { className: itemClassName };
        const togglerAttrs = {
            className: togglerClassName,
            onClick: this.toggleExpandedState,
            tabIndex: -1,
        };

        if (childrenCount) {
            itemAttrs.className = `${itemAttrs.className} ${itemClassName}--has-sub-items`;
        }

        if (this.checkCanLoadMore()) {
            itemAttrs.className = `${itemAttrs.className} ${itemClassName}--can-load-more`;
        }

        if (this.state.isExpanded) {
            itemAttrs.className = `${itemAttrs.className} ${itemClassName}--is-expanded`;
        }

        if (hidden) {
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
                        {this.renderIcon()} {content.name}
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
    childrenCount: PropTypes.number.isRequired,
    subitems: PropTypes.array.isRequired,
    children: PropTypes.element,
    hidden: PropTypes.bool.isRequired,
    selected: PropTypes.bool.isRequired,
    content: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
    }).isRequired,
    contentType: PropTypes.shape({
        identifier: PropTypes.string.isRequired,
        container: PropTypes.bool.isRequired,
    }).isRequired,
    locationId: PropTypes.number.isRequired,
    loadMoreSubitems: PropTypes.func.isRequired,
};

ListItem.defaultProps = {
    hidden: false,
};

export default ListItem;
